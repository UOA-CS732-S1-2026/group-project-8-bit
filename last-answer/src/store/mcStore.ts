"use client";

import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";
import type { Player } from "@/game/core/types";

const DEFAULT_STORAGE_KEY = "mc-store";

const defaultPlayer: Player = {
  name: "Seeker",
  hp: 100,
  attack: 10,
  defense: 5,
  exp: 0,
  coins: 0,
};

const clampStat = (value: number) => Math.max(0, value);

type MCStore = {
  player: Player;
  readPlayer: () => Player;
  savePlayer: (player: Player) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  setHp: (hp: number) => void;
  addHp: (amount: number) => void;
  setExp: (exp: number) => void;
  addExp: (amount: number) => void;
  setCoins: (coins: number) => void;
  addCoins: (amount: number) => void;
  resetPlayer: () => void;
};

type MCStoreHook = UseBoundStore<StoreApi<MCStore>>;

const storeRegistry = new Map<string, MCStoreHook>();

const createMCStore = (storageKey: string = DEFAULT_STORAGE_KEY): MCStoreHook =>
  create<MCStore>()(
    persist(
      (set, get) => ({
        player: defaultPlayer,

        readPlayer: () => get().player,

        savePlayer: (player) =>
          set({
            player: {
              ...player,
              hp: clampStat(player.hp),
              exp: clampStat(player.exp),
              coins: clampStat(player.coins),
            },
          }),

        updatePlayer: (updates) =>
          set((state) => ({
            player: {
              ...state.player,
              ...updates,
              hp: clampStat(updates.hp ?? state.player.hp),
              exp: clampStat(updates.exp ?? state.player.exp),
              coins: clampStat(updates.coins ?? state.player.coins),
            },
          })),

        setHp: (hp) =>
          set((state) => ({
            player: {
              ...state.player,
              hp: clampStat(hp),
            },
          })),

        addHp: (amount) =>
          set((state) => ({
            player: {
              ...state.player,
              hp: clampStat(state.player.hp + amount),
            },
          })),

        setExp: (exp) =>
          set((state) => ({
            player: {
              ...state.player,
              exp: clampStat(exp),
            },
          })),

        addExp: (amount) =>
          set((state) => ({
            player: {
              ...state.player,
              exp: clampStat(state.player.exp + amount),
            },
          })),

        setCoins: (coins) =>
          set((state) => ({
            player: {
              ...state.player,
              coins: clampStat(coins),
            },
          })),

        addCoins: (amount) =>
          set((state) => ({
            player: {
              ...state.player,
              coins: clampStat(state.player.coins + amount),
            },
          })),

        resetPlayer: () => set({ player: defaultPlayer }),
      }),
      {
        name: storageKey,
        partialize: (state) => ({ player: state.player }),
      }
    )
  );

export const getMCStore = (
  storageKey: string = DEFAULT_STORAGE_KEY
): MCStoreHook => {
  const existingStore = storeRegistry.get(storageKey);

  if (existingStore) {
    return existingStore;
  }

  const store = createMCStore(storageKey);
  storeRegistry.set(storageKey, store);
  return store;
};

export const useMCStore = getMCStore();

export { createMCStore, DEFAULT_STORAGE_KEY, defaultPlayer };
export type { MCStore, MCStoreHook };
