import { useQuizStore } from "@/src/features/quiz/store/useQuizStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Grab the ?id=xyz from the route
  const { id } = useLocalSearchParams<{ id: string }>();

  // Connect to our store
  const {
    status,
    errorMessage,
    questions,
    currentIndex,
    score,
    // startQuiz,
    fetchAndStartQuiz,
    submitAnswer,
    nextQuestion,
    reset,
  } = useQuizStore();

  // Fetch if it finds an ID from the route
  // useEffect(() => {
  //   startQuiz(MOCK_QUESTIONS);
  // }, []);

  // Fetch if it finds an ID from the route
  useEffect(() => {
    if (id) {
      fetchAndStartQuiz(id);
    }
  }, [id]);

  const currentQuestion = questions[currentIndex];

  // --- 0. ERROR STATE ---
  if (status === "error") {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-white">
        <Text className="text-red-500 text-xl font-bold mb-4">Oops!</Text>
        <Text className="text-slate-600 text-center mb-8">{errorMessage}</Text>
        <Pressable
          onPress={() => {
            reset();
            router.replace("/");
          }}
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go back</Text>
        </Pressable>
      </View>
    );
  }

  // --- 1. LOADING STATE ---
  if (status === "loading" || !currentQuestion) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-medium animate-pulse text-slate-500">
          Fetching Database...
        </Text>
      </View>
    );
  }

  // --- 1. FINISHED STATE ---
  if (status === "finished") {
    return (
      <View
        className="flex-1 items-center justify-center bg-slate-50 p-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Text className="text-3xl font-bold text-slate-900">Quiz Over!</Text>
        <Text className="text-xl mt-2 text-slate-600">
          Your Score: {score} / {questions.length}
        </Text>

        <Pressable
          onPress={() => {
            reset();
            router.replace("/");
          }}
          className="mt-8 bg-blue-600 px-8 py-4 rounded-2xl active:opacity-70"
        >
          <Text className="text-white font-bold text-lg">Go Home</Text>
        </Pressable>
      </View>
    );
  }

  // --- 2. LOADING STATE ---
  if (!currentQuestion) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  // --- 3. ACTIVE QUIZ STATE ---
  return (
    <View
      className="flex-1 bg-white p-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-slate-400 font-medium">
          Question {currentIndex + 1} of {questions.length}
        </Text>
        <Text className="text-blue-600 font-bold">Score: {score}</Text>
      </View>

      {/* Question */}
      <View className="mb-10">
        <Text className="text-2xl font-bold text-slate-800">
          {currentQuestion.text}
        </Text>
      </View>

      {/* Options */}
      <View className="gap-4">
        {currentQuestion.options.map((option, index) => (
          <Pressable
            key={index}
            onPress={() => {
              submitAnswer(index);
              nextQuestion();
            }}
            className="p-5 border-2 border-slate-200 rounded-2xl active:bg-slate-100 active:border-blue-500"
          >
            <Text className="text-lg font-medium text-slate-700">{option}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
