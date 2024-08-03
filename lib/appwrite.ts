import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.ddc.aora",
  projectId: "66acaf21001b850db660",
  databaseId: "66ad4203000d3cc818c0",
  userCollectionId: "66ad42140037467ece8e",
  videoCollectionId: "66ad422a00268e059ffb",
  storageId: "66ad433000004c0ed009",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const databases = new Databases(client);
type CreateUserProps = {
  username: string;
  email: string;
  password: string;
};

const avatar = new Avatars(client);

export const createUser = async ({
  username,
  email,
  password,
}: CreateUserProps) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );
    if (!newAccount.$id) {
      throw new Error("User not created");
    } else {
      const avatarUrl = avatar.getInitials(username);
      await signIn({ email, password });
      const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          avatar: avatarUrl,
          email,
          username,
        },
      );
      return newUser;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

type SignInProps = {
  email: string;
  password: string;
};

export const signIn = async ({ email, password }: SignInProps) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    if (!session.$id) {
      throw new Error("Session not created");
    }
    return session;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount.$id) {
      throw new Error("Account not found");
    }
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );
    if (!currentUser || !currentUser.documents?.length) {
      throw new Error("User not found");
    }
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};
