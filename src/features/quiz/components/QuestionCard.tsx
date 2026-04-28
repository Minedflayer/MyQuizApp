// src/features/quiz/components/QuestionCard.tsx
import React from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    FadeIn,
    SlideInRight,
    SlideOutRight,
    ZoomIn,
} from "react-native-reanimated";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

interface QuestionCardProps {
  currentIndex: number;
  questionText: string;
  status: string;
  readyText: string | number;
}

export default function QuestionCard({
  currentIndex,
  questionText,
  status,
  readyText,
}: QuestionCardProps) {
  return (
    <Animated.View
      key={`card-${currentIndex}`}
      entering={SlideInRight.duration(2225)
        .delay(100)
        .easing(Easing.out(Easing.exp))}
      exiting={SlideOutRight.duration(500).easing(Easing.in(Easing.ease))}
      className="py-2"
    >
      <View className="w-full aspect-[5/3] rounded-3xl overflow-hidden shadow-sm">
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#C872E9" />
              <Stop offset="30%" stopColor="#7E7EFF" />
              <Stop offset="55%" stopColor="#81E0F5" />
              <Stop offset="80%" stopColor="#B4E981" />
              <Stop offset="100%" stopColor="#F5D77F" />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100"
            height="100"
            rx="10"
            ry="10"
            fill="white"
            stroke="url(#gradient)"
            strokeWidth="3"
          />
        </Svg>

        <View className="absolute inset-0 justify-center items-center p-8">
          {status === "countdown" ? (
            <Animated.Text
              key={readyText}
              entering={ZoomIn.duration(300)}
              className="text-7xl font-nunito-black text-textMain"
            >
              {readyText}
            </Animated.Text>
          ) : (
            <Animated.Text
              entering={FadeIn.duration(400)}
              className="text-2xl font-nunito-black text-textMain leading-tight text-center"
            >
              {questionText}
            </Animated.Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
