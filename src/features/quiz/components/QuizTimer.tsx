import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
    Easing,
    FadeOut,
    ZoomIn,
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
  }, [timeLeft, totalTime]);

  // Manage the color-changing logic dynamically
  const animatedProgressStyle = useAnimatedStyle(() => {
    // Default: Primary Green
    let bgColor = "#4ADE80";

    // If 20% or less time left (e.g. <= 6s), turn Danger Red
    if (progressWidth.value <= 20) {
      bgColor = "#FF6B6B";
    }
    // If 50% or less time left (e.g. <= 15s), turn Accent Yellow
    else if (progressWidth.value <= 50) {
      bgColor = "#FFD60A";
    }

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
