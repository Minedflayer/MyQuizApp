import * as Haptics from "expo-haptics";
import React from "react";
import { GestureResponderEvent, Pressable, PressableProps } from "react-native";

/**
 * HapticButton: A reusable wrapper around React Native's Pressable component
 * that automatically adds haptic (vibration) feedback when pressed.
 *
 * HOW IT WORKS:
 * 1. Extends React Native's Pressable with built-in haptic feedback
 * 2. When the user presses the button, it triggers a haptic impact (vibration)
 * 3. After the haptic, it calls the provided onPress callback
 * 4. Uses native Pressable styling for pressed state (opacity & scale)
 *
 * KEY FEATURES:
 * - Accepts all standard Pressable props (disabled, testID, etc.)
 * - Optional hapticStyle prop to control vibration intensity (Light, Medium, Heavy)
 * - Default haptic style is Light for subtle feedback
 * - Clean pressed state styling without needing NativeWind active: modifiers
 *
 * USED IN quiz.tsx:
 * The "Continue" / "Finish Quiz" button uses HapticButton to give tactile feedback
 * when users advance to the next question. This makes the quiz feel more responsive
 * and polished.
 *
 *
 */

// Extend standard PressableProps so it accepts everything a normal Pressable does
interface HapticButtonProps extends PressableProps {
  className?: string;
  // We add an optional prop so you can make specific buttons "Heavy" or "Medium" if needed
  hapticStyle?: Haptics.ImpactFeedbackStyle;
}

export default function HapticButton({
  onPress,
  className = "",
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  children,
  ...rest // Catches any other props like 'disabled'
}: HapticButtonProps) {
  const handlePress = (e: GestureResponderEvent) => {
    // 1. Fire the haptic feedback
    Haptics.impactAsync(hapticStyle);

    // 2. Fire the actual function passed to the button (if one exists)
    if (onPress) {
      onPress(e);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      // Pass only standard NativeWind classes here, no active: modifiers
      className={className}
      // Use the native pressed state for your scale/opacity effects
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}
