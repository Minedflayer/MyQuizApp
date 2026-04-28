import HapticButton from "@/src/shared/components/HapticButton";
import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";
import Animated, { Easing, SlideInUp } from "react-native-reanimated";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  reset: () => void;
}

export default function QuizResults({
  score,
  totalQuestions,
  reset,
}: QuizResultsProps) {
  const router = useRouter();
  const goToHomeView = () => {
    reset();
    router.replace("/");
  };

  return (
    <Animated.View
      key="results-screen"
      entering={SlideInUp.duration(1500).easing(Easing.out(Easing.exp))}
      className="absolute w-full h-full px-6 justify-center items-center z-10 bg-background"
    >
      <Text className="text-5xl font-black text-textMain mb-2 text-center">
        Quiz Over!
      </Text>
      <Text className="text-2xl mt-2 text-textMuted mb-10 text-center">
        Score: <Text className="text-accent font-black">{score}</Text> /{" "}
        {totalQuestions}
      </Text>

      <HapticButton
        onPress={goToHomeView}
        className="w-full bg-primary px-8 py-5 rounded-2xl active:opacity-80 items-center shadow-sm"
      >
        <Text className="text-white font-bold text-xl">Back to Home</Text>
      </HapticButton>
    </Animated.View>
  );
}
