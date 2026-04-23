import { supabase } from "@/src/shared/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

interface AuthState {
  session: Session | null;
  user: User | null;
  isInitialized: boolean; // Tells us if Supabase has finished checking the keychain

  initializeAuth: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isInitialized: false,

  initializeAuth: () => {
    // 1. Check if the user is already logged in from a previous session
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({
        session,
        user: session?.user || null,
        isInitialized: true,
      });
    });

    // 2. Set up the Global Listener
    // If they log in or out anywhere in the app, this updates instantly
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user || null,
      });
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },
}));
