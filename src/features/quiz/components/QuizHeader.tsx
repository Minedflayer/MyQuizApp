// src/features/quiz/components/QuizHeader.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface QuizHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  reset: () => void;
}

export default function QuizHeader({
  currentIndex,
  totalQuestions,
  score,
  reset,
}: QuizHeaderProps) {
  const router = useRouter();
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <View className="px-6 pt-4 pb-2">
      <View className="flex-row justify-between items-center mb-4">
        <Pressable
          onPress={() => {
            reset();
            router.replace("/");
          }}
          className="p-2 -ml-2 rounded-full active:bg-slate-200"
        >
          <Text className="text-textMuted font-bold text-lg">✕</Text>
        </Pressable>
        <Text className="text-textMuted font-bold text-base tracking-widest uppercase">
          Question {currentIndex + 1} / {totalQuestions}
        </Text>
        <View className="bg-accent px-4 py-1.5 rounded-full flex-row items-center">
          <Text className="text-textMain font-black text-sm">⭐ {score}</Text>
        </View>
      </View>

      {/* The Track */}
      <View className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-primary rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </View>
    </View>
  );
}
