import { useAuthStore } from "@/src/features/quiz/auth/store/useAuthStore";
import { useQuizStore } from "@/src/features/quiz/store/useQuizStore";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { availableQuizzes, isFetchingList, fetchQuizList } = useQuizStore();

  // Grab the auth state
  const { user, isInitialized, signOut } = useAuthStore();

  // Fetch list of quizzes when the app opens
  useEffect(() => {
    // Only fetch quizzes if we have a logged-in user
    if (user) {
      fetchQuizList();
    }
  }, [user]);

  // If Supabase is checking the vault, show a blank screen
  if (!isInitialized) return null;

  // If the vault is checked and there is no user, instantly redirect to Auth
  if (!user) {
    return <Redirect href="/auth" />;
  }

  return (
    <View
      className="flex-1 bg-slate-50 p-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="mb-8 mt-4">
        <Text className="text-4xl font-black text-slate-900">
          Quiz App 2026
        </Text>
        <Text className="text-lg text-slate-500 mt-2">
          {" "}
          Select a topic to begin
        </Text>
      </View>

      {/* Logout button */}
      <Pressable onPress={signOut} className="bg-slate-200 p-2 rounded-lg">
        <Text className="text-slate-600 font-bold text-xs">Log Out</Text>
      </Pressable>

      {isFetchingList ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-slate-500">Loading quizzes...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-4 pb-8">
            {availableQuizzes.map((quiz) => (
              <Pressable
                key={quiz.id}
                // Pass the ID securely via the URL parameters!
                onPress={() =>
                  router.push({ pathname: "/quiz", params: { id: quiz.id } })
                }
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 active:opacity-70 flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-xl font-bold text-slate-800">
                    {quiz.title}
                  </Text>
                  <Text className="text-sm font-medium text-blue-500 uppercase mt-1">
                    {quiz.difficulty}
                  </Text>
                </View>
                <View className="bg-blue-50 w-10 h-10 rounded-full items-center justify-center">
                  <Text className="text-blue-600 font-bold">→</Text>
                </View>
              </Pressable>
            ))}

            {/* --- DISCREET DEV BUTTON --- */}
            <Pressable
              onPress={() => router.push("/test-auth" as any)}
              className="mt-8 p-4 bg-slate-200 rounded-xl items-center border border-slate-300 border-dashed"
            >
              <Text className="text-slate-600 font-medium">
                🛠️ Open Dev Tools (Auth Test)
              </Text>
            </Pressable>
            {/* --------------------------- */}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
