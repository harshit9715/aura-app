import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import CustomButton from "./CustomButton";

type EmptyStateProps = {
  title: string;
  subtitle: string;
  buttonProps?: {
    title: string;
    handlePress: () => void;
  };
};

const EmptyState = ({ subtitle, title, buttonProps }: EmptyStateProps) => {
  return (
    <View className="items-center justify-start px-4">
      <Image
        source={images.empty}
        className="h-[215px] w-[270px]"
        resizeMode="contain"
      />
      <Text className="mt-2 text-center font-psemibold text-xl text-white">
        {title}
      </Text>
      <Text className="text-center font-pmedium text-sm text-gray-100">
        {subtitle}
      </Text>
      {buttonProps && (
        <CustomButton
          handlePress={buttonProps.handlePress}
          title={buttonProps.title}
          containerStyles="w-full my-5"
        />
      )}
    </View>
  );
};

export default EmptyState;
