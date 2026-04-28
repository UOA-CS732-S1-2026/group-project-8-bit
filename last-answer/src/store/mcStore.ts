"use client";

import { create } from "zustand";
import { applyLevelProgression } from "@/game/core/level";
import {
  buildInitialPlayer,
  clampHp,
  clampStat,
  createPlayerStorageKey,
  defaultPlayer,
  normalizePlayer,
  normalizePropertyAmount,
} from "@/lib/player";
import type {
  BattleReward,
  LastBattleResult,
  Player,
  Property,
  Quest,
  SupportToolId,
} from "@/game/core/types";

const getInventoryProperty = (
  inventory: Property[],
  propertyId: SupportToolId,
): Property | undefined =>
  inventory.find((property) => property.id === propertyId);

const updateInventoryProperty = (
  inventory: Property[],
  propertyId: SupportToolId,
  update: (property: Property) => Property,
): Property[] | null => {
  let foundProperty = false;

  const nextInventory = inventory.map((property) => {
    if (property.id !== propertyId) {
      return property;
    }

    foundProperty = true;
    return update(property);
  });

  return foundProperty ? nextInventory : null;
};

const readPersistedPlayer = (storageKey: string): Player | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue) as Partial<Player> | null;
    return normalizePlayer(parsedValue);
  } catch {
    return null;
  }
};

const savePersistedPlayer = (storageKey: string, player: Player): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const normalizedPlayer = normalizePlayer(player);
    window.localStorage.setItem(storageKey, JSON.stringify(normalizedPlayer));
    return true;
  } catch {
    return false;
  }
};

type MCStore = {
  player: Player;
  storageKey: string;
  userId: string | null;
  lastBattleResult: LastBattleResult | null;
  readPlayer: () => Player;
  readLastBattleResult: () => LastBattleResult | null;
  readPersistPlayer: (slotId: string) => Player | null;
  savePlayer: (player: Player) => void;
  setLastBattleResult: (result: LastBattleResult | null) => void;
  savePersistPlayer: (player: Player, slotId: string) => void;
  hydratePlayer: (userId: string, player: Player) => void;
  clearPlayerContext: () => void;
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
  buyProperty: (propertyId: SupportToolId, amount?: number) => boolean;
  addProperty: (propertyId: SupportToolId, amount?: number) => boolean;
  reduceProperty: (propertyId: SupportToolId, amount?: number) => boolean;
  restockSupportTools: (minimumAmount?: number) => void;
  setLocation: (location: string) => void;
  startQuest: (quest: Quest) => void;
  completeQuest: (quest: Quest) => void;
  resetPlayer: (name?: string) => void;
};

const createMCStore = () =>
  create<MCStore>()((set, get) => ({
    player: defaultPlayer,
    storageKey: createPlayerStorageKey(),
    userId: null,
    lastBattleResult: null,

    readPlayer: () => get().player,
    readLastBattleResult: () => get().lastBattleResult,

    readPersistPlayer: (slotId) =>
      readPersistedPlayer(createPlayerStorageKey(slotId)),

    savePlayer: (player) =>
      set({
        player: normalizePlayer(player),
      }),

    setLastBattleResult: (result) =>
      set({
        lastBattleResult: result,
      }),

    savePersistPlayer: (player, slotId) => {
      savePersistedPlayer(createPlayerStorageKey(slotId), player);
    },

    hydratePlayer: (userId, player) => {
      const storageKey = createPlayerStorageKey(userId);
      const normalizedPlayer = normalizePlayer(player);

      set({
        userId,
        storageKey,
        player: normalizedPlayer,
        lastBattleResult: null,
      });
    },

    clearPlayerContext: () =>
      set({
        userId: null,
        storageKey: createPlayerStorageKey(),
        player: defaultPlayer,
        lastBattleResult: null,
      }),

    updatePlayer: (updates) =>
      set((state) => ({
        player: normalizePlayer({
          ...state.player,
          ...updates,
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
        player: normalizePlayer({
          ...state.player,
          exp,
        }),
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

    buyProperty: (propertyId, amount = 1) => {
      const normalizedAmount = normalizePropertyAmount(amount);

      if (!normalizedAmount) {
        return false;
      }

      const player = get().player;
      const property = getInventoryProperty(player.inventory, propertyId);

      if (!property) {
        return false;
      }

      const totalCost = property.price * normalizedAmount;

      if (player.coins < totalCost) {
        return false;
      }

      const nextInventory = updateInventoryProperty(
        player.inventory,
        propertyId,
        (currentProperty) => ({
          ...currentProperty,
          leftNumber: currentProperty.leftNumber + normalizedAmount,
        }),
      );

      if (!nextInventory) {
        return false;
      }

      set({
        player: {
          ...player,
          coins: player.coins - totalCost,
          inventory: nextInventory,
        },
      });

      return true;
    },

    addProperty: (propertyId, amount = 1) => {
      const normalizedAmount = normalizePropertyAmount(amount);

      if (!normalizedAmount) {
        return false;
      }

      const player = get().player;
      const nextInventory = updateInventoryProperty(
        player.inventory,
        propertyId,
        (currentProperty) => ({
          ...currentProperty,
          leftNumber: currentProperty.leftNumber + normalizedAmount,
        }),
      );

      if (!nextInventory) {
        return false;
      }

      set({
        player: {
          ...player,
          inventory: nextInventory,
        },
      });

      return true;
    },

    restockSupportTools: (minimumAmount = 1) => {
      const normalizedMinimum = normalizePropertyAmount(minimumAmount);

      if (!normalizedMinimum) {
        return;
      }

      const player = get().player;
      const nextInventory = player.inventory.map((property) => ({
        ...property,
        leftNumber: Math.max(property.leftNumber, normalizedMinimum),
      }));

      set({
        player: {
          ...player,
          inventory: nextInventory,
        },
      });
    },

    reduceProperty: (propertyId, amount = 1) => {
      const normalizedAmount = normalizePropertyAmount(amount);

      if (!normalizedAmount) {
        return false;
      }

      const player = get().player;
      const property = getInventoryProperty(player.inventory, propertyId);

      if (!property || property.leftNumber < normalizedAmount) {
        return false;
      }

      const nextInventory = updateInventoryProperty(
        player.inventory,
        propertyId,
        (currentProperty) => ({
          ...currentProperty,
          leftNumber: currentProperty.leftNumber - normalizedAmount,
        }),
      );

      if (!nextInventory) {
        return false;
      }

      set({
        player: {
          ...player,
          inventory: nextInventory,
        },
      });

      return true;
    },

    setLocation: (location) =>
      set((state) => ({
        player: { ...state.player, location },
      })),
    startQuest: (quest) =>
      set((state) => ({
        player: {
          ...state.player,
          activeQuest: [...(state.player.activeQuest || []), quest],
        },
      })),
    completeQuest: (quest) =>
      set((state) => ({
        player: {
          ...state.player,
          activeQuest:
            state.player.activeQuest?.filter((q) => q.id !== quest.id) || null,
          completedQuests: [...(state.player.completedQuests || []), quest],
        },
      })),

    resetPlayer: (name) =>
      set((state) => ({
        player: buildInitialPlayer(name?.trim() || state.player.name),
        lastBattleResult: null,
      })),
  }));

export const useMCStore = createMCStore();

export const getMCStore = () => useMCStore;

export { createMCStore, defaultPlayer };
export type { MCStore };
