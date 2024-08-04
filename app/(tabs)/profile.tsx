import { router } from "expo-router";
import { View, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import { getUserPosts, signOut } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { Models } from "react-native-appwrite";
import VideoCard from "@/components/VideoCard";
import { useGlobalContext } from "@/context/GlobalProvider";
import { icons } from "@/constants";
import InfoBox from "@/components/InfoBox";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();

  const handleLogout = async () => {
    await signOut().then(() => {
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/sign-in");
    });
  };
  const { data: posts } = useAppwrite(() =>
    getUserPosts({ userId: user?.$id as string }),
  );
  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={posts as Models.Document[]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="mb-12 mt-6 w-full items-center justify-center px-4">
            <TouchableOpacity
              className="mb-10 w-full items-end"
              onPress={handleLogout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="h-6 w-6"
              />
            </TouchableOpacity>
            <View className="h-16 w-16 items-center justify-center rounded-lg border border-secondary">
              <Image
                source={{ uri: user?.avatar }}
                resizeMode="cover"
                className="h-[90%] w-[90%] rounded-lg"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="mt-5 flex-row">
              <InfoBox
                title={posts?.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-sm"
              />
              <InfoBox
                title={"1.2k"}
                subtitle="Followers"
                titleStyles="text-sm"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found for this query"
            subtitle="Be the first one to upload a video"
            buttonProps={{
              title: "Go Back",
              handlePress: () => router.back(),
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
