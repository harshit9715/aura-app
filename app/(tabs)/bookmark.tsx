import { router } from "expo-router";
import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { getAllPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { Models } from "react-native-appwrite";
import VideoCard from "@/components/VideoCard";

const BookMark = () => {
  const { data: posts, refetch } = useAppwrite(() => getAllPosts());

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={posts as Models.Document[]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-psemibold text-2xl text-white">
              Saved Videos
            </Text>
            <View className="mb-8 mt-6">
              <SearchInput />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos saved"
            subtitle="Videos you save will appear here"
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

export default BookMark;
