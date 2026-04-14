import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInRight, // <-- Add this for the "pop up" effect
  FadeOut, // <-- Add this!
  SlideInRight, // <-- Changed to Slide
  SlideOutLeft, // <-- Changed to Slide
  SlideOutRight, // <-- Changed to Slide
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn, // <-- Add this for the "pop up" effect
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg"; // <-- Import SVG components
import "../global.css";
import { useQuizStore } from "../src/features/quiz/store/useQuizStore";

export default function QuizScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 1. Keep your logic for grabbing the ID from the route
  const { id } = useLocalSearchParams<{ id: string }>();

  // 2. Keep your specific store connections
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
    timeLeft, // <-- Add this
    tick, // <-- Add this
  } = useQuizStore();

  // 3. Keep your fetching effect
  useEffect(() => {
    if (id) {
      fetchAndStartQuiz(id);
    }
  }, [id]);

  const currentQuestion = questions[currentIndex];

  // Clock engine
  useEffect(() => {
    // Just run the interval. The store's tick() function will decide
    // if it should actually decrement the time based on its own state.
    const timer = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(timer);
  }, [tick]); // Only depend on tick

  // --- 3. MOVED REANIMATED HOOKS UP HERE! ---
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
      backgroundColor: bgColor, // <-- Reanimated handles the color now!
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

  // --- 2. FINISHED STATE (Updated with new gamified UI) ---
  if (status === "finished") {
    return (
      <View
        className="flex-1 items-center justify-center bg-background p-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Text className="text-5xl font-black text-textMain mb-2">
          Quiz Over!
        </Text>
        <Text className="text-2xl mt-2 text-textMuted mb-10">
          Score: <Text className="text-accent font-black">{score}</Text> /{" "}
          {questions.length}
        </Text>

        <Pressable
          onPress={() => {
            reset();
            router.replace("/");
          }}
          className="w-full bg-primary px-8 py-5 rounded-2xl active:opacity-80 items-center shadow-sm"
        >
          <Text className="text-white font-bold text-xl">Back to Home</Text>
        </Pressable>
      </View>
    );
  }

  // Calculate progress bar percentage
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  // CALCULATE TIMER VISUALS
  const timerPercentage = (timeLeft / 30) * 100;

  // --- 3. ACTIVE QUIZ STATE (The New Card UI) ---
  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* --- HEADER & PROGRESS BAR --- */}
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
            Question {currentIndex + 1} / {questions.length}
          </Text>
          <View className="bg-accent px-4 py-1.5 rounded-full flex-row items-center">
            <Text className="text-textMain font-black text-sm">⭐ {score}</Text>
          </View>
        </View>

        {/* The Track */}
        <View className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
          {/* The Fill */}
          <View
            className="h-full bg-primary rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* --- 1. SEPARATE WRAPPER: QUESTION CARD & TIMER --- */}
        {/* Exits to the RIGHT */}
        <Animated.View
          key={`card-${currentIndex}`}
          // Glides in from off-screen right
          entering={SlideInRight.duration(2225)
            .delay(100)
            .easing(Easing.out(Easing.exp))}
          // Sweeps 100% off-screen to the right
          exiting={SlideOutRight.duration(500).easing(Easing.in(Easing.ease))}
          className="pb-2"
        >
          {/* --- THE QUESTION CARD --- */}
          <View className="w-full aspect-[4/3] rounded-3xl mt-8 mb-5 overflow-hidden shadow-sm">
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
              <Text className="text-3xl font-black text-textMain leading-tight text-center">
                {currentQuestion.text}
              </Text>
            </View>
          </View>
        </Animated.View>
        {/* --- END CARD WRAPPER --- */}

        {/* --- 1.5. SEPARATE WRAPPER: THE TIMER BAR --- */}
        <Animated.View
          key={`timer-${currentIndex}`}
          // Starts just 50ms after the card, but takes 2350ms to finish!
          // We also use the same Easing.exp so their speed curves perfectly match.
          entering={ZoomIn.duration(2350)
            .delay(150)
            .easing(Easing.out(Easing.exp))}
          exiting={FadeOut.duration(150)}
          className="w-full flex-row items-center gap-3 mb-8 px-2"
        >
          <Text
            className={`font-black w-9 text-center ${timeLeft <= 5 ? "text-danger" : timeLeft <= 15 ? "text-accent" : "text-textMuted"}`}
          >
            {timeLeft}s
          </Text>
          <View className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
            <Animated.View
              className={"h-full rounded-full"}
              style={animatedProgressStyle}
            />
          </View>
        </Animated.View>
        {/* --- END TIMER WRAPPER --- */}

        {/* --- 2. SEPARATE WRAPPER: OPTION BUTTONS --- */}
        {/* Exits to the LEFT */}
        <Animated.View
          key={`options-${currentIndex}`}
          // Glides in from off-screen right, slightly delayed behind the card for a cascading effect
          entering={SlideInRight.duration(800)
            .delay(150)
            .easing(Easing.out(Easing.exp))}
          // Sweeps 100% off-screen to the left
          exiting={SlideOutLeft.duration(500).easing(Easing.in(Easing.ease))}
          className="pb-6 pt-6"
        >
          {/* --- THE OPTION BUTTONS --- */}
          <View className="gap-4 pb-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOptionIndex === index;
              const isCorrectOption = currentQuestion.correctIndex === index;

              let buttonStyle =
                "bg-surface border-slate-200 active:border-primary active:bg-red-50";
              let textStyle = "text-textMain";

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

              return (
                <Pressable
                  key={index}
                  onPress={() => submitAnswer(index)}
                  disabled={isRevealing}
                  className={`p-5 rounded-2xl border-2 flex-row justify-between items-center ${buttonStyle}`}
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
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
        {/* --- END OPTIONS WRAPPER --- */}

        {/* --- THE CONTINUE BUTTON (Fortsätt) --- */}
        {isRevealing && (
          <Animated.View entering={FadeInRight.duration(300)} className="mb-10">
            <Pressable
              onPress={nextQuestion}
              className="mt-6 bg-primary p-5 rounded-2xl items-center shadow-sm active:bg-red-500"
            >
              <Text className="text-white font-black text-xl tracking-wide">
                {currentIndex === questions.length - 1
                  ? "Finish Quiz"
                  : "Continue"}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
