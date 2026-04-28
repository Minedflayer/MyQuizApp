import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  Easing, // <-- Add this for the "pop up" effect
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";
import { useQuizStore } from "../src/features/quiz/store/useQuizStore";

import ContinueButton from "@/src/features/quiz/components/ContinueButton";
import OptionList from "@/src/features/quiz/components/OptionList";
import QuestionCard from "@/src/features/quiz/components/QuestionCard";
import QuizHeader from "@/src/features/quiz/components/QuizHeader";
import QuizResults from "@/src/features/quiz/components/QuizResults";
import QuizTimer from "@/src/features/quiz/components/QuizTimer";

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Refs to hold sound files in memory
  const correctSoundRef = useRef<Audio.Sound | null>(null);
  const wrongSoundRef = useRef<Audio.Sound | null>(null);

  // Pre-load sounds when Quiz screen opens
  useEffect(() => {
    async function loadGameSoundEffects() {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

        // Load correct sound
        const { sound: correctSound } = await Audio.Sound.createAsync(
          require("../assets/sounds/correct-sound.mp3"),
        );
        correctSoundRef.current = correctSound;

        // Load Wrong sound
        const { sound: wrongSound } = await Audio.Sound.createAsync(
          require("../assets/sounds/error-sound.mp3"),
        );
        wrongSoundRef.current = wrongSound;
      } catch (error) {
        console.error("Errog when pre-loading game sounds:", error);
      }
    }

    loadGameSoundEffects();

    // Unload sounds when thes user leaves the quiz
    return () => {
      if (correctSoundRef.current) correctSoundRef.current.unloadAsync();
      if (wrongSoundRef.current) wrongSoundRef.current.unloadAsync();
    };
  }, []);

  // Helper function for playing the sound
  const playResultSound = async (isCorrect: boolean) => {
    try {
      const soundToPlay = isCorrect
        ? correctSoundRef.current
        : wrongSoundRef.current;

      if (soundToPlay) {
        await soundToPlay.replayAsync();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Logic for grabbing the ID from the route
  const { id } = useLocalSearchParams<{ id: string }>();

  // store connections
  const {
    status,
    errorMessage,
    questions,
    currentIndex,
    score,
    selectedOptionIndex,
    isRevealing,
    fetchAndStartQuiz,
    submitAnswer,
    nextQuestion,
    reset,
    timeLeft,
    tick,
    startActiveQuestion,
  } = useQuizStore();

  // Fetching effect
  useEffect(() => {
    if (id) {
      fetchAndStartQuiz(id);
    }
  }, [id]);

  // -- The Coundown Engine --
  const [readyText, setReadyText] = useState<string | number>(3);

  useEffect(() => {
    if (status === "countdown") {
      setReadyText(3); // Reset to 3 when a countdown starts
      let current = 3;

      const interval = setInterval(() => {
        current -= 1;
        if (current > 0) {
          setReadyText(current);
        } else if (current === 0) {
          setReadyText("GO!");
        } else {
          clearInterval(interval);
          startActiveQuestion();
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [status, startActiveQuestion]);

  const currentQuestion = questions[currentIndex];

  // Clock engine: Drives the countdown timer by calling tick() every second (1000ms).
  // This updates the timeLeft state in the quiz store, which controls the timer display and progress bar color changes.
  // The interval is cleaned up when the component unmounts to prevent memory leaks.
  useEffect(() => {
    const timer = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(timer);
  }, [tick]); // Only depend on tick

  // Log option button animation trigger
  useEffect(() => {
    console.log("Options animation triggered - Question Index:", currentIndex);
  }, [currentIndex]);

  const progressWidth = useSharedValue(100);

  useEffect(() => {
    const targetPercentage = (timeLeft / 30) * 100;
    if (timeLeft === 30) {
      progressWidth.value = targetPercentage;
    } else {
      progressWidth.value = withTiming(targetPercentage, {
        duration: 1000,
        easing: Easing.linear,
      });
    }
  }, [timeLeft]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    // Default to your Primary color
    let bgColor = "#4ADE80";

    // If width drops below 17% (5 seconds left), turn Danger Red
    if (progressWidth.value <= 20) {
      bgColor = "#FF6B6B";
    }
    // If width drops below 50% (15 seconds left), turn Accent Yellow
    else if (progressWidth.value <= 50) {
      bgColor = "#FFD60A";
    }

    return {
      width: `${progressWidth.value}%`,
      backgroundColor: bgColor,
    };
  });

  // --- 0. ERROR STATE (Updated with new theme colors) ---
  if (status === "error") {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-background">
        <Text className="text-danger text-4xl font-black mb-4">Oops!</Text>
        <Text className="text-textMuted text-center mb-8 text-lg">
          {errorMessage}
        </Text>
        <Pressable
          onPress={() => {
            reset();
            router.replace("/");
          }}
          className="bg-primary px-8 py-4 rounded-2xl active:opacity-80"
        >
          <Text className="text-white font-bold text-lg">Go back</Text>
        </Pressable>
      </View>
    );
  }

  // --- 1. LOADING STATE (Updated with new theme colors) ---
  if (status === "loading" || (!currentQuestion && status !== "finished")) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#FF4E4E" />
        <Text className="text-xl font-medium text-textMuted mt-4">
          Loading Quiz...
        </Text>
      </View>
    );
  }

  return (
    <View
      // 1. ADDED 'relative' so the absolute children stay inside the safe area padding
      className="flex-1 bg-background relative"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {status === "finished" ? (
        /* ==========================================
           1. FINISHED STATE (Glides UP)
        ========================================== */
        <QuizResults
          score={score}
          totalQuestions={questions.length}
          reset={reset}
        />
      ) : (
        /* ==========================================
           2. ACTIVE QUIZ STATE (Drops DOWN)
        ========================================== */
        <Animated.View
          key="active-quiz-screen"
          // Smoothly accelerates downward
          exiting={FadeOut.duration(600)}
          className="absolute w-full h-full z-0"
        >
          {/* --- HEADER & PROGRESS BAR --- */}
          <QuizHeader
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            score={score}
            reset={reset}
          />

          <View className="flex-1 px-6">
            {/* --- THE QUESTION CARD --- */}
            <QuestionCard
              currentIndex={currentIndex}
              questionText={currentQuestion.text}
              status={status}
              readyText={readyText}
            />

            {/* --- 1.5. THE TIMER BAR (Keep exactly as is) --- */}
            {status === "active" && (
              <QuizTimer timeLeft={timeLeft} currentIndex={currentIndex} />
            )}

            {/* --- 2. OPTION BUTTONS --- */}
            <OptionList
              currentIndex={currentIndex}
              options={currentQuestion.options}
              correctIndex={currentQuestion.correctIndex}
              selectedOptionIndex={selectedOptionIndex}
              isRevealing={isRevealing}
              status={status}
              submitAnswer={submitAnswer}
              playResultSound={playResultSound}
            />

            {/* --- 3. RESERVED SPACE FOR CONTINUE BUTTON --- */}
            <ContinueButton
              isRevealing={isRevealing}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              nextQuestion={nextQuestion}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}
