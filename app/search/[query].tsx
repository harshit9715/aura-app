import { router, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { searchPosts } from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { Models } from "react-native-appwrite";
import VideoCard from "@/components/VideoCard";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() =>
    searchPosts({ query: query as string }),
  );

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={posts as Models.Document[]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="font-psemibold text-2xl text-white">{query}</Text>
            <View className="mb-8 mt-6">
              <SearchInput initialQuery={query as string} />
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

export default Search;
