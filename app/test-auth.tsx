import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";
import { useAuthStore } from "../src/features/quiz/auth/store/useAuthStore";
import { supabase } from "../src/shared/lib/supabase";

export default function TestAuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isInitialized, signOut } = useAuthStore();

  const testSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email: "test_user@example.com",
      password: "SuperSecretPassword123!",
    });
    if (error) Alert.alert("Sign Up Error", error.message);
  };

  const testSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "test_user@example.com",
      password: "SuperSecretPassword123!",
    });
    if (error) Alert.alert("Sign In Error", error.message);
  };

  return (
    <View
      className="flex-1 bg-slate-50 p-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Pressable onPress={() => router.back()} className="mb-6">
        <Text className="text-blue-500 font-bold">← Back to Home</Text>
      </Pressable>

      <Text className="text-3xl font-black text-slate-900 mb-6">
        Auth Plumbing Test
      </Text>

      <View className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        {!isInitialized ? (
          <Text className="text-slate-500">Checking encrypted vault...</Text>
        ) : user ? (
          <View>
            <Text className="text-green-600 font-bold text-lg mb-4">
              ✅ Logged in!
            </Text>
            <Text className="text-slate-600 mb-6">Email: {user.email}</Text>
            <Pressable
              onPress={signOut}
              className="bg-red-500 p-4 rounded-xl items-center active:opacity-70"
            >
              <Text className="text-white font-bold">Sign Out</Text>
            </Pressable>
          </View>
        ) : (
          <View className="gap-4">
            <Text className="text-slate-600 mb-2">No user found in vault.</Text>
            <Pressable
              onPress={testSignUp}
              className="bg-blue-500 p-4 rounded-xl items-center active:opacity-70"
            >
              <Text className="text-white font-bold">Test Sign Up</Text>
            </Pressable>
            <Pressable
              onPress={testSignIn}
              className="bg-green-500 p-4 rounded-xl items-center active:opacity-70"
            >
              <Text className="text-white font-bold">Test Sign In</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
