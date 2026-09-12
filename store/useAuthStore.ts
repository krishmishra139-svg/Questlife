"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;

  init: () => () => void; // returns an unsubscribe function
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  initialized: false,
  loading: false,
  error: null,

  // Call once (e.g. from a top-level layout) to hydrate the current session
  // and keep `user` in sync with Supabase's auth state going forward.
  init: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({ user: data.session?.user ?? null, initialized: true });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, initialized: true });
    });

    return () => listener.subscription.unsubscribe();
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ loading: false, error: error.message });
      return { error: error.message };
    }
    set({ user: data.user, loading: false });
    return { error: null };
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ loading: false, error: error.message });
      return { error: error.message };
    }
    set({ user: data.user, loading: false });
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));
