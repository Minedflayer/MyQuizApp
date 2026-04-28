import React from "react";
import { Text, View } from "react-native";
import Animated, {
    Easing,
    SlideInDown,
    SlideOutDown,
} from "react-native-reanimated";
import HapticButton from "../../../shared/components/HapticButton";

interface ContinueButtonProps {
  isRevealing: boolean;
  currentIndex: number;
  totalQuestions: number;
  nextQuestion: () => void;
}

export default function ContinueButton({
  isRevealing,
  currentIndex,
  totalQuestions,
  nextQuestion,
}: ContinueButtonProps) {
  return (
    <View className="h-24 justify-end pb-6 mt-2">
      {isRevealing && (
        <Animated.View
          entering={SlideInDown.duration(500).mass(0.8)}
          exiting={SlideOutDown.duration(300).easing(Easing.in(Easing.ease))}
        >
          <HapticButton
            onPress={nextQuestion}
            className="bg-primary p-5 rounded-2xl items-center shadow-sm"
          >
            <Text className="text-white font-black text-xl tracking-wide">
              {currentIndex === totalQuestions - 1 ? "Finish Quiz" : "Continue"}
            </Text>
          </HapticButton>
        </Animated.View>
      )}
    </View>
  );
}
