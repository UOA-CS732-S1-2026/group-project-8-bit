"use client";

import { create } from "zustand";
import type { GameMode, Player, Quest } from "@/game/core/types";

// This store is intentionally slim and reserved for app-wide state that may later be saved.
type GameState = {
  player: Player | null;
  gameMode: GameMode;
  setMode: (mode: GameMode) => void;
};

export const useGameStore = create<GameState>((set) => ({
  player: null,
  gameMode: "hub",
  setMode: (mode) => set({ gameMode: mode }),
}));

const savePersistedGameState = (
  storageKey: string,
  state: GameState,
): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
};

const readPersistedGameState = (storageKey: string): GameState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue) as GameState | null;
    return parsedValue;
  } catch {
    return null;
  }
};
