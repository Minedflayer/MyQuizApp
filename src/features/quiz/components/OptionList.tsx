//import HapticButton from "../../../shared/components/HapticButton";
import HapticButton from "@/src/shared/components/HapticButton";
import React from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";

interface OptionListProps {
  currentIndex: number;
  options: string[];
  correctIndex: number;
  selectedOptionIndex: number | null;
  isRevealing: boolean;
  status: string;
  isLastQuestion: boolean;
  submitAnswer: (index: number) => void;
  playResultSound: (isCorrect: boolean) => void;
}

export default function OptionList({
  currentIndex,
  options,
  correctIndex,
  selectedOptionIndex,
  isRevealing,
  status,
  submitAnswer,
  playResultSound,
  isLastQuestion,
}: OptionListProps) {
  const isCountdown = status === "countdown";

  const exitingAnimation = isLastQuestion
    ? FadeOut.duration(300)
    : SlideOutLeft.duration(500).easing(Easing.in(Easing.ease));

  return (
    <Animated.View
      key={`options-${currentIndex}`}
      entering={SlideInRight.duration(2225)
        .delay(150)
        .easing(Easing.out(Easing.exp))}
      // exiting={SlideOutLeft.duration(500).easing(Easing.in(Easing.ease))} // Slide animation for question options when exiting the view
      exiting={exitingAnimation}
    >
      <View className="gap-4 pb-2">
        {options.map((option, index) => {
          const isSelected = selectedOptionIndex === index;
          const isCorrectOption = correctIndex === index;

          // Base styles
          let buttonStyle =
            "bg-surface border-slate-200 active:border-primary active:bg-red-50";
          let textStyle = "text-textMain";

          // State-based styling when revealing the answer
          if (isRevealing) {
            if (isCorrectOption) {
              buttonStyle = "bg-success border-success";
              textStyle = "text-white";
            } else if (isSelected) {
              buttonStyle = "bg-danger border-danger";
              textStyle = "text-white";
            } else {
              buttonStyle = "bg-surface border-slate-100 opacity-40";
              textStyle = "text-slate-400";
            }
          }

          // Apply countdown placeholder styles if needed
          const finalButtonStyle = isCountdown
            ? "bg-transparent border-slate-300 border-dashed opacity-50"
            : buttonStyle;

          return (
            <HapticButton
              key={`option-${option}`}
              onPress={() => {
                playResultSound(isCorrectOption);
                submitAnswer(index);
              }}
              disabled={isRevealing || isCountdown}
              soundType="none"
              className={`p-5 rounded-2xl border-2 flex-row justify-between items-center ${finalButtonStyle}`}
            >
              {isCountdown ? (
                // Skeleton UI shown during countdown
                <View className="h-4 w-2/3 bg-slate-200 rounded-full opacity-50" />
              ) : (
                <Animated.View
                  entering={FadeInDown.delay(index * 100).duration(300)}
                  className="flex-1 flex-row items-center justify-between"
                >
                  <Text className={`font-bold text-lg flex-1 ${textStyle}`}>
                    {option}
                  </Text>
                  <View
                    className={`w-6 h-6 rounded-full border-2 ml-4 ${
                      isRevealing && (isCorrectOption || isSelected)
                        ? "border-white bg-white/20"
                        : "border-slate-300"
                    }`}
                  />
                </Animated.View>
              )}
            </HapticButton>
          );
        })}
      </View>
    </Animated.View>
  );
}
