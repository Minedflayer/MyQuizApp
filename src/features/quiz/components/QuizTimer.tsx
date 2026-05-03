import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  FadeOut,
  ZoomIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface QuizTimerProps {
  timeLeft: number;
  currentIndex: number;
  totalTime?: number;
}

export default function QuizTimer({
  timeLeft,
  currentIndex,
  totalTime = 30, // Defaults to 30 seconds
}: QuizTimerProps) {
  const progressWidth = useSharedValue(100);

  // Manage the shrinking animation of the timer bar
  useEffect(() => {
    const targetPercentage = (timeLeft / totalTime) * 100;

    if (timeLeft === totalTime) {
      // Instantly snap back to 100% when a new question starts
      progressWidth.value = targetPercentage;
    } else {
      // Smoothly animate the width down every second
      progressWidth.value = withTiming(targetPercentage, {
        duration: 1000,
        easing: Easing.linear,
      });
    }
  }, [timeLeft, totalTime, progressWidth]);

  // Manage the color-changing logic dynamically
  // Smoothly transition between colors based on the width percentage
  const animatedProgressStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      progressWidth.value,
      [0, 20, 50, 100],
      ["#FF6B6B", "#FF6B6B", "#FFD60A", "#4ADE80"], // The corresponding colors
    );

    return {
      width: `${progressWidth.value}%`,
      backgroundColor: bgColor,
    };
  });

  return (
    <Animated.View
      key={`timer-${currentIndex}`}
      entering={ZoomIn.duration(2350).delay(150).easing(Easing.out(Easing.exp))}
      exiting={FadeOut.duration(150)}
      className="w-full flex-row items-center gap-3 mb-6 px-2"
    >
      <Text
        className={`font-black w-9 text-center ${
          timeLeft <= 5
            ? "text-danger"
            : timeLeft <= 15
              ? "text-accent"
              : "text-textMuted"
        }`}
      >
        {timeLeft}s
      </Text>
      <View className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
        <Animated.View
          className="h-full rounded-full"
          style={animatedProgressStyle}
        />
      </View>
    </Animated.View>
  );
}
