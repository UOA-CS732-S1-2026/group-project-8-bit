"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PLAYER_SAVE_SLOT_IDS } from "@/lib/save-slots";

export const CATEGORYCODE = {
  "General Knowledge": "9",
  "Entertainment: Books": "10",
  "Entertainment: Film": "11",
  "Entertainment: Music": "12",
  "Entertainment: Musicals & Theatres": "13",
  "Entertainment: Television": "14",
  "Entertainment: Video Games": "15",
  "Entertainment: Board Games": "16",
  "Science & Nature": "17",
  "Science: Computers": "18",
  "Science: Mathematics": "19",
  Mythology: "20",
  Sports: "21",
  Geography: "22",
  History: "23",
  Politics: "24",
  Art: "25",
  Celebrities: "26",
  Animals: "27",
  Vehicles: "28",
  "Entertainment: Comics": "29",
  "Science: Gadgets": "30",
  "Entertainment: Japanese Anime & Manga": "31",
  "Entertainment: Cartoon & Animations": "32",
} as const;

export type CategoryCode = (typeof CATEGORYCODE)[keyof typeof CATEGORYCODE];
export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "multiple" | "boolean";

export type GameSettings = {
  category: CategoryCode | null;
  difficulty: Difficulty | null;
  type: QuestionType | null;
};

type GameState = GameSettings & {
  readGameSettings: () => GameSettings;
  setCategory: (category: CategoryCode | null) => void;
  setDifficulty: (difficulty: Difficulty | null) => void;
  setType: (type: QuestionType | null) => void;
  setGameSettings: (settings: Partial<GameSettings>) => void;
  resetGameSettings: () => void;
};

const defaultGameSettings: GameSettings = {
  category: null,
  difficulty: null,
  type: null,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...defaultGameSettings,
      readGameSettings: () => {
        const { category, difficulty, type } = get();

        return {
          category,
          difficulty,
          type,
        };
      },
      setCategory: (category) => set({ category }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setType: (type) => set({ type }),
      setGameSettings: (settings) => set(settings),
      resetGameSettings: () => set(defaultGameSettings),
    }),
    {
      name: "lastAnswer",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ category, difficulty, type }) => ({
        category,
        difficulty,
        type,
      }),
    },
  ),
);

export const gameSlots = [...PLAYER_SAVE_SLOT_IDS];
