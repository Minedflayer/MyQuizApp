import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown, // <-- Add this for the "pop up" effect
  FadeOut,
  SlideInDown,
  SlideInRight, // <-- Changed to Slide
  SlideInUp,
  SlideOutDown, // <-- Changed to Slide
  SlideOutLeft, // <-- Changed to Slide
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
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
    startActiveQuestion,
  } = useQuizStore();

  // 3. Keep your fetching effect
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

  // Clock engine
  useEffect(() => {
    // Just run the interval. The store's tick() function will decide
    // if it should actually decrement the time based on its own state.
    const timer = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(timer);
  }, [tick]); // Only depend on tick

  // Log option button animation trigger
  useEffect(() => {
    console.log(
      "📊 Options animation triggered - Question Index:",
      currentIndex,
    );
  }, [currentIndex]);

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

  // // --- 2. FINISHED STATE (Updated with new gamified UI) ---
  // if (status === "finished") {
  //   return (
  //     <View
  //       className="flex-1 items-center justify-center bg-background p-6"
  //       style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
  //     >
  //       <Animated.View
  //         key={"results-screen"}
  //         entering={SlideInUp.duration(600).springify().damping(18)}
  //         className="flex-1 px-6 justify-center"
  //       >
  //         <Text className="text-5xl font-black text-textMain mb-2">
  //           Quiz Over!
  //         </Text>
  //         <Text className="text-2xl mt-2 text-textMuted mb-10">
  //           Score: <Text className="text-accent font-black">{score}</Text> /{" "}
  //           {questions.length}
  //         </Text>
  //       </Animated.View>

  //       <Pressable
  //         onPress={() => {
  //           reset();
  //           router.replace("/");
  //         }}
  //         className="w-full bg-primary px-8 py-5 rounded-2xl active:opacity-80 items-center shadow-sm"
  //       >
  //         <Text className="text-white font-bold text-xl">Back to Home</Text>
  //       </Pressable>
  //     </View>
  //   );
  // }

  // Calculate progress bar percentage
  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

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
        <Animated.View
          key="results-screen"
          // 2. REMOVED springify(). Replaced with a smooth 800ms elegant glide.
          entering={SlideInUp.duration(800).easing(Easing.out(Easing.exp))}
          // 3. ADDED 'absolute w-full h-full z-10' so it floats cleanly over the old screen
          className="absolute w-full h-full px-6 justify-center items-center z-10 bg-background"
        >
          <Text className="text-5xl font-black text-textMain mb-2 text-center">
            Quiz Over!
          </Text>
          <Text className="text-2xl mt-2 text-textMuted mb-10 text-center">
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
        </Animated.View>
      ) : (
        /* ==========================================
           2. ACTIVE QUIZ STATE (Drops DOWN)
        ========================================== */
        <Animated.View
          key="active-quiz-screen"
          // Smoothly accelerates downward
          // 4. ADDED 'absolute w-full h-full' so it doesn't push the layout around while exiting
          exiting={FadeOut.duration(600)}
          className="absolute w-full h-full z-0"
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
                <Text className="text-textMain font-black text-sm">
                  ⭐ {score}
                </Text>
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

          {/* --- REPLACED SCROLLVIEW WITH A FLEX VIEW --- */}
          <View className="flex-1 px-6">
            {/* --- THE QUESTION CARD --- */}
            <Animated.View
              key={`card-${currentIndex}`}
              entering={SlideInRight.duration(2225)
                .delay(100)
                .easing(Easing.out(Easing.exp))}
              exiting={SlideOutRight.duration(500).easing(
                Easing.in(Easing.ease),
              )}
              // 1. ADDED flex-1 so the card dynamically absorbs the extra screen space!
              className="py-2"
            >
              {/* 2. REMOVED aspect-[4/3] and ADDED w-full h-full max-h-[280px] */}
              {/* This ensures it shrinks on small phones but doesn't get too giant on iPads */}
              <View className="w-full aspect-[5/3] rounded-3xl overflow-hidden shadow-sm">
                <Svg
                  height="100%"
                  width="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <Defs>
                    <LinearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
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
                      {currentQuestion.text}
                    </Animated.Text>
                  )}
                </View>
              </View>
            </Animated.View>

            {/* --- 1.5. THE TIMER BAR (Keep exactly as is) --- */}
            {status === "active" && (
              <Animated.View
                key={`timer-${currentIndex}`}
                entering={ZoomIn.duration(2350)
                  .delay(150)
                  .easing(Easing.out(Easing.exp))}
                exiting={FadeOut.duration(150)}
                className="w-full flex-row items-center gap-3 mb-6 px-2" // Reduced mb-8 to mb-6 to save a tiny bit of space
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
            )}

            {/* --- 2. OPTION BUTTONS (Keep exactly as is) --- */}
            <Animated.View
              key={`options-${currentIndex}`}
              entering={SlideInRight.duration(2225)
                .delay(150)
                .easing(Easing.out(Easing.exp))}
              exiting={SlideOutLeft.duration(500).easing(
                Easing.in(Easing.ease),
              )}
            >
              <View className="gap-4 pb-2">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOptionIndex === index;
                  const isCorrectOption =
                    currentQuestion.correctIndex === index;
                  const isCountdown = status === "countdown";

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

                  const finalButtonStyle = isCountdown
                    ? "bg-transparent border-slate-300 border-dashed opacity-50"
                    : buttonStyle;

                  return (
                    <Pressable
                      key={index}
                      onPress={() => submitAnswer(index)}
                      disabled={isRevealing || isCountdown}
                      className={`p-5 rounded-2xl border-2 flex-row justify-between items-center ${finalButtonStyle}`}
                    >
                      {isCountdown ? (
                        <View className="h-4 w-2/3 bg-slate-200 rounded-full opacity-50" />
                      ) : (
                        <Animated.View
                          entering={FadeInDown.delay(index * 100).duration(300)}
                          className="flex-1 flex-row items-center justify-between"
                        >
                          <Text
                            className={`font-bold text-lg flex-1 ${textStyle}`}
                          >
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
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>

            {/* --- 3. RESERVED SPACE FOR CONTINUE BUTTON --- */}
            <View className="h-24 justify-end pb-6 mt-2">
              {isRevealing && (
                // Starts off-screen at the bottom and springs UP into place
                <Animated.View
                  entering={SlideInDown.duration(500)

                    .mass(0.8)}
                  // Drops down through the bottom of the screen
                  exiting={SlideOutDown.duration(300).easing(
                    Easing.in(Easing.ease),
                  )}
                >
                  <Pressable
                    onPress={nextQuestion}
                    className="bg-primary p-5 rounded-2xl items-center shadow-sm"
                  >
                    <Text className="text-white font-black text-xl tracking-wide">
                      {currentIndex === questions.length - 1
                        ? "Finish Quiz"
                        : "Continue"}
                    </Text>
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
