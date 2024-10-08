import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { getCurrentUser, signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      if (!form.email || !form.password) {
        Alert.alert("Please fill all fields");
        return;
      }
      setIsSubmitting(true);
      await signIn(form);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoggedIn(true);
      router.replace("/home");
    } catch (error) {
      console.log(error);
      Alert.alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="h-full bg-primary">
      {/* todo: replace with keyboard avoiding view */}
      <ScrollView>
        <View className="my-6 min-h-[83vh] w-full justify-center px-4">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="h=[35px] w-[115px]"
          />
          <Text className="font-psemibold text-2xl text-white">
            Log in to Aora
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            keyboardType="visible-password"
          />
          <CustomButton
            title="Sign in"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
            textStyles=""
          />
          <View className="flex-row justify-center gap-2 pt-5">
            <Text className="font-pregular text-lg text-gray-100">
              {"Don't have an account?"}
            </Text>
            <Link
              href={"/sign-up"}
              className="font-psemibold text-lg text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
