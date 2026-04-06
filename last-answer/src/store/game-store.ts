"use client";

import { create } from "zustand";
import type { GameMode, Player } from "@/game/core/types";

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
