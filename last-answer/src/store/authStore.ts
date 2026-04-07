"use client";

import { create } from "zustand";
import type { AuthUser } from "@/lib/auth-shared";

type AuthState = {
  user: AuthUser | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  logoutPending: boolean;
  hydrateAuth: (user: AuthUser | null) => void;
  setLogoutPending: (pending: boolean) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isHydrated: false,
  isAuthenticated: false,
  logoutPending: false,
  hydrateAuth: (user) =>
    set({
      user,
      isHydrated: true,
      isAuthenticated: Boolean(user),
    }),
  setLogoutPending: (logoutPending) => set({ logoutPending }),
  clearAuth: () =>
    set({
      user: null,
      isHydrated: true,
      isAuthenticated: false,
      logoutPending: false,
    }),
}));

