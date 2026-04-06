import { Link, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* This sets the header title for this specific "fallback" screen */}
      <Stack.Screen options={{ title: "Oops!", headerShown: true }} />

      <View
        className="flex-1 items-center justify-center bg-white p-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Text className="text-2xl font-bold text-slate-800">
          This screen doesn't exist.
        </Text>

        <Link href="/" asChild>
          <Pressable className="mt-6 p-4 bg-blue-500 rounded-2xl active:bg-blue-600">
            <Text className="text-white font-semibold text-lg">
              Go to home screen!
            </Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
