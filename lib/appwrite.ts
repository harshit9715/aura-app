import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite";
import * as ImagePicker from "expo-image-picker";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.ddc.aora",
  projectId: "66acaf21001b850db660",
  databaseId: "66ad4203000d3cc818c0",
  userCollectionId: "66ad42140037467ece8e",
  videoCollectionId: "66ad422a00268e059ffb",
  storageId: "66ad433000004c0ed009",
};

const {
  endpoint,
  platform,
  projectId,
  storageId,
  databaseId,
  userCollectionId,
  videoCollectionId,
} = config;

const client = new Client();
const storage = new Storage(client);
client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

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
        databaseId,
        userCollectionId,
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
      databaseId,
      userCollectionId,
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

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);
    if (!posts || !posts.documents?.length) {
      throw new Error("Posts not found");
    }
    return posts.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);
    if (!posts || !posts.documents?.length) {
      throw new Error("Posts not found");
    }
    return posts.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const searchPosts = async ({ query }: { query: string }) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    if (!posts || !posts.documents?.length) {
      throw new Error("Posts not found");
    }
    return posts.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getUserPosts = async ({ userId }: { userId: string }) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);
    if (!posts || !posts.documents?.length) {
      throw new Error("Posts not found");
    }
    return posts.documents;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getFilePreview = async (fileId: string, type: "image" | "video") => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100,
      );
      if (!fileUrl) {
        throw new Error("File not found");
      }
    } else {
      throw new Error("Invalid file type");
    }
    return fileUrl;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const uploadFile = async (
  file: ImagePicker.ImagePickerAsset,
  type: "image" | "video",
) => {
  if (!file.uri) return;

  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), {
      name: file.fileName!,
      size: file.fileSize!,
      type: file.mimeType!,
      uri: file.uri,
    });

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    console.log(type, fileUrl);
    return fileUrl;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

type CreateVideoProps = {
  title: string;
  video: ImagePicker.ImagePickerAsset;
  thumbnail: ImagePicker.ImagePickerAsset;
  prompt: string;
  userId: string;
};

export const createVideo = async ({
  title,
  prompt,
  thumbnail,
  video,
  userId,
}: CreateVideoProps) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(thumbnail, "image"),
      uploadFile(video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title,
        prompt,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        creator: userId,
      },
    );
    return newPost;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
