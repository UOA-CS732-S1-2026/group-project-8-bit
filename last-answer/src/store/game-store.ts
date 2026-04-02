"use client";

import { create } from "zustand";
import type { GameMode, Quest } from "@/game/core/types";

// This store is intentionally slim and reserved for app-wide state that may later be saved.
type GameState = {
  mode: GameMode;
  currentLocation: string;
  activeQuest: Quest | null;
  setMode: (mode: GameMode) => void;
  setLocation: (location: string) => void;
  startQuest: (quest: Quest) => void;
  clearQuest: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  mode: "hub",
  currentLocation: "capital",
  activeQuest: null,

  setMode: (mode) => set({ mode }),
  setLocation: (location) => set({ currentLocation: location }),
  startQuest: (quest) => set({ activeQuest: quest, mode: "dialogue" }),
  clearQuest: () => set({ activeQuest: null, mode: "hub" }),
}));
