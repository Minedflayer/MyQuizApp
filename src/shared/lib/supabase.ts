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
import "react-native-url-polyfill/auto";

// 1. Create a custom storage adapter for React Native
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// 2. Initialize Supabase with the native storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Not needed for React Native
  },
});
