// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createClient } from "@supabase/supabase-js";
// import "react-native-url-polyfill/auto";

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
// const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// export const supabase = createClient(supabaseUrl, supabaseKey, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto";

// 1. Create a custom storage adapter for React Native

// Define a helper to check if we are on a native platform
const isNative = Platform.OS !== "web";

const MySecureStoreAdapter = {
  getItem: (key: string) => {
    if (isNative) {
      return SecureStore.getItemAsync(key);
    }
    // Fallback for web/build environments
    return typeof window !== "undefined"
      ? window.localStorage.getItem(key)
      : null;
  },
  setItem: (key: string, value: string) => {
    if (isNative) {
      return SecureStore.setItemAsync(key, value);
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (isNative) {
      return SecureStore.deleteItemAsync(key);
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// 2. Initialize Supabase with the native storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: MySecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Not needed for React Native
  },
});
