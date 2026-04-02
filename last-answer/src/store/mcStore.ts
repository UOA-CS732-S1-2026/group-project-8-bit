"use client";

import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";
import { applyLevelProgression, levelForTotalXp } from "@/game/core/level";
import type { BattleReward, Player } from "@/game/core/types";

const DEFAULT_STORAGE_KEY = "mc-store";

const defaultPlayer: Player = {
  name: "Seeker",
  level: 1,
  hp: 100,
  maxHp: 100,
  attack: 10,
  defense: 5,
  exp: 0,
  coins: 0,
};

const clampStat = (value: number) => Math.max(0, value);
const clampHp = (hp: number, maxHp: number) => Math.min(maxHp, clampStat(hp));
const getBasePlayer = (player?: Player): Player => ({
  ...defaultPlayer,
  name: player?.name ?? defaultPlayer.name,
  coins: player?.coins ?? defaultPlayer.coins,
});

const rebuildPlayerForTotalXp = (
  totalXp: number,
  template?: Player,
): Player => {
  const safeXp = clampStat(totalXp);
  const leveledPlayer = applyLevelProgression(getBasePlayer(template), safeXp);
  const nextPlayer = leveledPlayer.player;
  const requestedLevel = levelForTotalXp(safeXp);

  return {
    ...nextPlayer,
    level: requestedLevel,
    hp: clampHp(template?.hp ?? nextPlayer.maxHp, nextPlayer.maxHp),
    coins: template?.coins ?? defaultPlayer.coins,
    name: template?.name ?? defaultPlayer.name,
  };
};

type MCStore = {
  player: Player;
  readPlayer: () => Player;
  savePlayer: (player: Player) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  setHp: (hp: number) => void;
  addHp: (amount: number) => void;
  applyDamage: (amount: number) => void;
  restoreHpToFull: () => void;
  setExp: (exp: number) => void;
  addExp: (amount: number) => void;
  grantBattleRewards: (reward: BattleReward) => void;
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
              ...rebuildPlayerForTotalXp(player.exp, player),
              hp: clampHp(player.hp, player.maxHp),
              coins: clampStat(player.coins),
            },
          }),

        updatePlayer: (updates) =>
          set((state) => ({
            player: rebuildPlayerForTotalXp(updates.exp ?? state.player.exp, {
              ...state.player,
              ...updates,
              hp: clampStat(updates.hp ?? state.player.hp),
              coins: clampStat(updates.coins ?? state.player.coins),
            }),
          })),

        setHp: (hp) =>
          set((state) => ({
            player: {
              ...state.player,
              hp: clampHp(hp, state.player.maxHp),
            },
          })),

        addHp: (amount) =>
          set((state) => ({
            player: {
              ...state.player,
              hp: clampHp(state.player.hp + amount, state.player.maxHp),
            },
          })),

        applyDamage: (amount) =>
          set((state) => ({
            player: {
              ...state.player,
              hp: clampHp(state.player.hp - amount, state.player.maxHp),
            },
          })),

        restoreHpToFull: () =>
          set((state) => ({
            player: {
              ...state.player,
              hp: state.player.maxHp,
            },
          })),

        setExp: (exp) =>
          set((state) => ({
            player: rebuildPlayerForTotalXp(exp, state.player),
          })),

        addExp: (amount) =>
          set((state) => ({
            player: applyLevelProgression(state.player, clampStat(amount)).player,
          })),

        grantBattleRewards: (reward) =>
          set((state) => ({
            player: {
              ...applyLevelProgression(state.player, reward.finalXp).player,
              coins: clampStat(state.player.coins + reward.finalCoins),
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
      },
    ),
  );

export const getMCStore = (
  storageKey: string = DEFAULT_STORAGE_KEY,
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
