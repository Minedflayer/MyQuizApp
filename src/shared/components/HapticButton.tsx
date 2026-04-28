import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
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

// 1. Create a dictionary of your common UI sounds
const SOUND_FILES = {
  tap: require("../../../assets/sounds/switch25.mp3"),
};

type SoundType = keyof typeof SOUND_FILES;

const soundCache: Partial<Record<SoundType, Audio.Sound>> = {};

async function preloadSound(type: SoundType) {
  if (soundCache[type]) return; // Already loaded

  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync(SOUND_FILES[type]);
    soundCache[type] = sound;
  } catch (error) {
    console.error("Failed to preload sound:", error);
  }
}

// 3. Instant play function
async function playInstantSound(type: SoundType) {
  const sound = soundCache[type];
  if (sound) {
    try {
      // Replay instantly from the beginning
      await sound.replayAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  } else {
    // Fallback: If not loaded yet, load and play
    preloadSound(type).then(() => soundCache[type]?.playAsync());
  }
}

// Extend standard PressableProps so it accepts everything a normal Pressable does
interface HapticButtonProps extends PressableProps {
  className?: string;
  // We add an optional prop so you can make specific buttons "Heavy" or "Medium" if needed
  hapticStyle?: Haptics.ImpactFeedbackStyle;
  soundType?: SoundType | "none";
}

export default function HapticButton({
  onPress,
  className = "",
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  soundType = "tap",
  children,
  ...rest // Catches any other props like 'disabled'
}: HapticButtonProps) {
  // Preload sound as soon as the button is shown
  useEffect(() => {
    if (soundType !== "none") {
      preloadSound(soundType);
    }
  }, [soundType]);

  const handlePress = (e: GestureResponderEvent) => {
    Haptics.impactAsync(hapticStyle);

    // 4. Play the sound if it's not set to "none"
    if (soundType !== "none") {
      playInstantSound(soundType);
    }

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
