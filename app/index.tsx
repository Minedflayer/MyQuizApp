import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Quiz App 2026</Text>
      <Link href="/quiz" className="mt-4 p-4 bg-red-500 rounded-xl">
        <Text className="text-white font-semibold">Start Quiz</Text>
      </Link>
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
