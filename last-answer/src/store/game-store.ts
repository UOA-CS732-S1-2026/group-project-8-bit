"use client";

import { create } from "zustand";
import type { Player, GameMode, Quest, Question } from "@/game/core/types";

type GameState = {
  player: Player;
  mode: GameMode;
  currentLocation: string;
  activeQuest: Quest | null;
  currentQuestion: Question | null;

  setMode: (mode: GameMode) => void;
  setLocation: (location: string) => void;
  startQuest: (quest: Quest) => void;
  setQuestion: (question: Question | null) => void;

  applyCorrectAnswer: () => void;
  applyWrongAnswer: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  player: {
    name: "Seeker",
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 5,
    exp: 0,
    coins: 0,
  },
  mode: "hub",
  currentLocation: "capital",
  activeQuest: null,
  currentQuestion: null,

  setMode: (mode: GameMode) => set({ mode }),
  setLocation: (location: string) => set({ currentLocation: location }),
  startQuest: (quest: Quest) => set({ activeQuest: quest, mode: "dialogue" }),
  setQuestion: (question: Question | null) =>
    set({ currentQuestion: question }),

  applyCorrectAnswer: () =>
    set((state) => ({
      player: {
        ...state.player,
        exp: state.player.exp + 10,
        coins: state.player.coins + 5,
      },
    })),

  applyWrongAnswer: () =>
    set((state) => ({
      player: {
        ...state.player,
        hp: Math.max(0, state.player.hp - 10),
      },
      mode: "battle",
    })),
}));
