import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setform] = useState({
    title: "",
    video: { uri: "" } as ImagePicker.ImagePickerAsset,
    thumbnail: { uri: "" } as ImagePicker.ImagePickerAsset,
    prompt: "",
  });

  const openPicker = async (type: "video" | "thumbnail") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        type === "video"
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (type === "thumbnail") {
        setform({ ...form, thumbnail: result.assets[0] });
      } else if (type === "video") {
        setform({ ...form, video: result.assets[0] });
      }
    }
  };

  const handleUpload = async () => {
    if (
      !form.title ||
      !form.video.uri ||
      !form.thumbnail.uri ||
      !form.prompt ||
      !user?.$id
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      setUploading(true);
      await createVideo({ ...form, userId: user.$id });
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "An error occurred while uploading video, please try again later",
      );
    } finally {
      setUploading(false);
      setform({
        title: "",
        video: { uri: "" } as ImagePicker.ImagePickerAsset,
        thumbnail: { uri: "" } as ImagePicker.ImagePickerAsset,
        prompt: "",
      });
    }
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView className="my-6 px-4">
        <Text className="font-psemibold text-2xl text-white">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          handleChangeText={(text) => setform({ ...form, title: text })}
          keyboardType="default"
          placeholder="Get your video a catchy title"
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="font-pmedium text-base text-gray-100">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video.uri ? (
              <Video
                className="h-64 w-full rounded-2xl"
                source={{ uri: form.video.uri }}
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="h-40 w-full items-center justify-center rounded-2xl bg-black-100 px-4">
                <View className="h-14 w-14 items-center justify-center border border-dashed border-secondary-100">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="h-1/2 w-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="font-pmedium text-base text-gray-100">
            Add Thumbnail
          </Text>
          <TouchableOpacity onPress={() => openPicker("thumbnail")}>
            {form.thumbnail.uri ? (
              <Image
                className="h-64 w-full rounded-2xl"
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
              />
            ) : (
              <View className="h-16 w-full flex-row items-center justify-center space-x-2 rounded-2xl border-2 border-black-200 bg-black-100 px-4">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="h-5 w-5"
                />
                <Text className="font-pmedium text-sm text-gray-100">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          handleChangeText={(text) => setform({ ...form, prompt: text })}
          keyboardType="default"
          placeholder="The AI prompt you used to generate this video"
          otherStyles="mt-7"
        />
        <CustomButton
          handlePress={handleUpload}
          title="Submit & Publish"
          isLoading={uploading}
          containerStyles="mt-7"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
