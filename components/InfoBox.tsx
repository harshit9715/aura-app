import { View, Text } from "react-native";
import React from "react";

type InfoBoxProps = {
  title: string;
  subtitle?: string;
  containerStyles?: string;
  titleStyles?: string;
};
const InfoBox = ({
  title,
  subtitle,
  containerStyles,
  titleStyles,
}: InfoBoxProps) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-center font-psemibold text-white`}>{title}</Text>
      {subtitle && (
        <Text
          className={`text-center font-pregular text-gray-100 ${titleStyles}`}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default InfoBox;
