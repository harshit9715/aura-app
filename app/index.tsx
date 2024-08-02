import { Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="font-pblack text-3xl">Aura</Text>
      <StatusBar style="auto" />
      <Link href="/home" style={{ color: "blue" }}>
        <Text>Go To Home</Text>
      </Link>
    </View>
  );
}
