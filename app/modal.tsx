import { StatusBar } from "expo-status-bar";
import { Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ModalScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center bg-white p-6"
      style={{ paddingBottom: insets.bottom }}
    >
      <Text className="text-2xl font-bold text-slate-800">
        Quiz Information
      </Text>

      <View className="my-8 h-[1px] w-4/5 bg-slate-200" />

      <Text className="text-center text-slate-600 leading-6">
        This is a solo-player quiz app built with React Native, Zustand, and
        NativeWind. Good luck with your trivia!
      </Text>

      {/* Use a light status bar on iOS to account for the modal lifestyle */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
