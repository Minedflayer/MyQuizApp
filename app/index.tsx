import { useQuizStore } from "@/src/features/quiz/store/useQuizStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function Home() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-2xl font-bold">Quiz App 2026</Text>
//       <Link href="/quiz" className="mt-4 p-4 bg-red-500 rounded-xl">
//         <Text className="text-white font-semibold">Start Quiz</Text>
//       </Link>
//     </View>
//   );
// }

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { availableQuizzes, isFetchingList, fetchQuizList } = useQuizStore();

  // Fetch list of quizzes when the app opens
  useEffect(() => {
    fetchQuizList();
  }, []);

  return (
    <View
      className="flex-1 bg-slate-50 p-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="mb-8 mt-4">
        <Text className="text-4xl font-black text-slate-900">
          Quiz App 2026
        </Text>
        <Text className="text-lg text-slate-500 mt-2">
          Select a topic to begin
        </Text>
      </View>

      {isFetchingList ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-slate-500">Loading quizzes...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-4 pb-8">
            {availableQuizzes.map((quiz) => (
              <Pressable
                key={quiz.id}
                // Pass the ID securely via the URL parameters!
                onPress={() =>
                  router.push({ pathname: "/quiz", params: { id: quiz.id } })
                }
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 active:opacity-70 flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-xl font-bold text-slate-800">
                    {quiz.title}
                  </Text>
                  <Text className="text-sm font-medium text-blue-500 uppercase mt-1">
                    {quiz.difficulty}
                  </Text>
                </View>
                <View className="bg-blue-50 w-10 h-10 rounded-full items-center justify-center">
                  <Text className="text-blue-600 font-bold">→</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

// import { Text, View } from "react-native";
// import "../global.css"; // Force the import directly in the test file

// export default function CSSSanityTest() {
//   return (
//     // If Tailwind is working, the whole screen will be dark gray (zinc-900)
//     <View className="flex-1 items-center justify-center bg-zinc-900">
//       {/* TEST 1: Raw React Native Style. This should ALWAYS work and be RED. */}
//       <View
//         style={{
//           backgroundColor: "#ef4444",
//           padding: 20,
//           marginBottom: 20,
//           borderRadius: 10,
//         }}
//       >
//         <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
//           1. NATIVE STYLE (Should be Red)
//         </Text>
//       </View>

//       {/* TEST 2: NativeWind/Tailwind Style. This is the one failing. */}
//       <View className="bg-blue-500 p-5 rounded-xl">
//         <Text className="text-white font-bold text-base">
//           2. TAILWIND STYLE (Should be Blue)
//         </Text>
//       </View>
//     </View>
//   );
// }
