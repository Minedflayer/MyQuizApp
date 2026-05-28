// src/features/quiz/components/QuizHeader.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Rive, { Alignment, Fit, RiveRef } from "rive-react-native";
import { useQuizStore } from "../store/useQuizStore";

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

  // Grab the streak from the store (assuming you added it in the previous step)
  const streak = useQuizStore((state) => state.streak);
  const riveRef = useRef<RiveRef>(null);

  // Trigger animation
  useEffect(() => {
    if (score > 0) {
      // execute a trigger in Rive state machine
      riveRef.current?.fireState;
    }
  }, [score, streak]);

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

        {/* Score & Rive Animation Container */}
        <View className="bg-accent pl-2 pr-4 py-1.5 rounded-full flex-row items-center">
          {/* 3. The Rive Component */}
          <View className="w-8 h-8 mr-1">
            <Rive
              ref={riveRef}
              // If using a local file in your assets:
              // resourceName="star_animation" // No .riv extension needed here for local bundled assets
              // OR if using a remote URL:
              url="https://public.rive.app/community/runtime-files/your-star-animation.riv"
              stateMachineName="State Machine 1"
              fit={Fit.Contain}
              alignment={Alignment.Center}
            />
          </View>
          <Text className="text-textMain font-black text-sm">{score}</Text>
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
