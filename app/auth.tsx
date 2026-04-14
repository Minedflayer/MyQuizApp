import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../global.css";
import { supabase } from "../src/shared/lib/supabase";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState("test_user2@example.com");
  const [password, setPassword] = useState("SuperSecretPassword123!");
  const [loading, setloading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const authenticationHandler = async () => {
    if (!email || !password) {
      console.log("❌ Auth Validation Failed: Missing email or password.");
      setErrorMessage("Please enter both email and password.");
      return;
    }
    console.log(
      `\n⏳ Starting ${isSignUp ? "Sign Up" : "Sign In"} process for: ${email}`,
    );
    setloading(true);
    setErrorMessage(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          console.log("⚠️ Supabase Sign Up Error:", error.message);
          throw error;
        }
        console.log("✅ Sign Up Successful! New User ID:", data.user?.id);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.log("⚠️ Supabase Sign In Error:", error.message);
          throw error;
        }
        console.log("✅ Sign In Successful! User ID:", data.user?.id);
      }

      // On success, navigate back to Home screen
      router.replace("/");
    } catch (error: any) {
      console.log("🛑 Catch Block Triggered. UI Error set to:", error.message);
      setErrorMessage(error.message);
    } finally {
      console.log(
        "🏁 Authentication handler finished. Resetting loading state.\n",
      );
      setloading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <View
        className="flex-1 justify-center p-6"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="mb-10">
          <Text className="text-4xl font-black text-slate-900 mb-2">
            {isSignUp ? "Join the Club" : "Welcome Back"}
          </Text>
          <Text className="text-lg text-slate-500">
            {isSignUp
              ? "Create an account to save your scores."
              : "Sign in to continue your streak."}
          </Text>
        </View>

        {errorMessage && (
          <View className="bg-red-100 p-4 rounded-xl mb-6 border border-red-200">
            <Text className="text-red-600 font-medium">{errorMessage}</Text>
          </View>
        )}

        <View className="gap-4">
          <View>
            <Text className="text-slate-700 font-bold mb-2 ml-1">Email</Text>
            <TextInput
              className="bg-white p-4 rounded-xl border border-slate-200 text-slate-900 text-lg"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <View className="mb-4">
            <Text className="text-slate-700 font-bold mb-2 ml-1">Password</Text>
            <TextInput
              className="bg-white p-4 rounded-xl border border-slate-200 text-slate-900 text-lg"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Main Action Button */}
          <Pressable
            onPress={authenticationHandler}
            disabled={loading}
            className={`p-4 rounded-xl items-center flex-row justify-center ${loading ? "bg-blue-400" : "bg-blue-600 active:bg-blue-700"}`}
          >
            {loading ? (
              <ActivityIndicator color="white" className="mr-2" />
            ) : null}
            <Text className="text-white font-bold text-lg">
              {isSignUp ? "Create Account" : "Sign In"}
            </Text>
          </Pressable>

          {/* Toggle Mode Button */}
          <Pressable
            onPress={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage(null);
            }}
            disabled={loading}
            className="p-4 items-center mt-2"
          >
            <Text className="text-blue-600 font-bold text-base">
              {isSignUp
                ? "Already have an account? Sign in "
                : "Don't have an account? Sign Up"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
