"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { applyLevelProgression } from "@/game/core/level";
import {
  buildInitialPlayer,
  clampHp,
  createLegacyPlayerStorageKey,
  clampStat,
  createPlayerStorageKey,
  defaultPlayer,
  normalizePlayer,
  normalizePropertyAmount,
} from "@/lib/player";
import type {
  BattleReward,
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

type SaveEnvelope = {
  player: Player;
  savedAt: string;
};

const isSaveEnvelope = (value: unknown): value is SaveEnvelope =>
  isRecord(value) &&
  "player" in value &&
  "savedAt" in value &&
  typeof value.savedAt === "string";

const readPersistedPlayer = (storageKey: string): Player | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return null;
    }

    const parsed: unknown = JSON.parse(storedValue);

    if (isSaveEnvelope(parsed)) {
      return normalizePlayer(parsed.player);
    }

    return normalizeStoredPlayer(parsed);
  } catch {
    return null;
  }
};

const readPersistedSavedAt = (storageKey: string): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);
    if (!storedValue) return null;
    const parsed: unknown = JSON.parse(storedValue);
    if (isSaveEnvelope(parsed)) return parsed.savedAt;
    return null;
  } catch {
    return null;
  }
};

const readPersistedPlayerWithFallbacks = (
  storageKeys: string[],
): Player | null => {
  for (const storageKey of storageKeys) {
    const player = readPersistedPlayer(storageKey);

    if (player) {
      return player;
    }
  }

  return null;
};

const savePersistedPlayer = (storageKey: string, player: Player): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const envelope: SaveEnvelope = {
      player: normalizePlayer(player),
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(storageKey, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
};

type MCStore = {
  player: Player;
  storageKey: string;
  userId: string | null;
  readPlayer: () => Player;
  readPersistPlayer: (slotId: string) => Player | null;
  readPersistSavedAt: (slotId: string) => string | null;
  savePlayer: (player: Player) => void;
  savePersistPlayer: (player: Player, slotId: string) => boolean;
  deletePersistPlayer: (slotId: string) => void;
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
  refundProperty: (propertyId: SupportToolId, amount: number, refundCoins: number) => boolean;
  addProperty: (propertyId: SupportToolId, amount?: number) => boolean;
  reduceProperty: (propertyId: SupportToolId, amount?: number) => boolean;
  restockSupportTools: (minimumAmount?: number) => void;
  setLocation: (location: string) => void;
  startQuest: (quest: Quest) => void;
  completeQuest: (quest: Quest) => void;
  resetPlayer: (name?: string) => void;
};

type PersistedMCStore = {
  player?: Partial<Player> | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeStoredPlayer = (value: unknown): Player | null => {
  if (!isRecord(value)) {
    return null;
  }

  const state = value.state;

  if (isRecord(state) && "player" in state) {
    return normalizePlayer(state.player as Partial<Player> | null);
  }

  return normalizePlayer(value as Partial<Player>);
};

const getPersistedPlayer = (persistedState: unknown): Player | null => {
  if (!isRecord(persistedState)) {
    return null;
  }

  if ("player" in persistedState) {
    return normalizePlayer(
      persistedState.player as Partial<Player> | null | undefined,
    );
  }

  return normalizeStoredPlayer(persistedState);
};

const createMCStore = () =>
  create<MCStore>()(
    persist(
      (set, get) => ({
        player: defaultPlayer,
        storageKey: createPlayerStorageKey(),
        userId: null,

        readPlayer: () => get().player,

        readPersistPlayer: (slotId) =>
          readPersistedPlayerWithFallbacks([
            createPlayerStorageKey(slotId),
            createLegacyPlayerStorageKey(slotId),
          ]),

        readPersistSavedAt: (slotId) =>
          readPersistedSavedAt(createPlayerStorageKey(slotId)),

        savePlayer: (player) =>
          set({
            player: normalizePlayer(player),
          }),

        savePersistPlayer: (player, slotId) => {
          return savePersistedPlayer(createPlayerStorageKey(slotId), player);
        },

        deletePersistPlayer: (slotId) => {
          if (typeof window === "undefined") return;
          window.localStorage.removeItem(createPlayerStorageKey(slotId));
          window.localStorage.removeItem(createLegacyPlayerStorageKey(slotId));
        },

        hydratePlayer: (userId, player) => {
          set({
            userId,
            storageKey: createPlayerStorageKey(),
            player: normalizePlayer(player),
          });
        },

        clearPlayerContext: () =>
          set({
            userId: null,
            storageKey: createPlayerStorageKey(),
            player: defaultPlayer,
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
            player: applyLevelProgression(state.player, clampStat(amount))
              .player,
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

        refundProperty: (propertyId, amount, refundCoins) => {
          const player = get().player;
          const property = getInventoryProperty(player.inventory, propertyId);

          if (!property || property.leftNumber < amount) {
            return false;
          }

          const nextInventory = updateInventoryProperty(
            player.inventory,
            propertyId,
            (currentProperty) => ({
              ...currentProperty,
              leftNumber: currentProperty.leftNumber - amount,
            }),
          );

          if (!nextInventory) {
            return false;
          }

          set({
            player: {
              ...player,
              coins: clampStat(player.coins + refundCoins),
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
                state.player.activeQuest?.filter((q) => q.id !== quest.id) ||
                null,
              completedQuests: [...(state.player.completedQuests || []), quest],
            },
          })),

        resetPlayer: (name) =>
          set((state) => ({
            player: buildInitialPlayer(name?.trim() || state.player.name),
          })),
      }),
      {
        name: createPlayerStorageKey(),
        storage: createJSONStorage(() => localStorage),
        partialize: ({ player }): PersistedMCStore => ({
          player: normalizePlayer(player),
        }),
        merge: (persistedState, currentState) => ({
          ...currentState,
          player:
            getPersistedPlayer(persistedState) ??
            normalizePlayer(currentState.player),
          storageKey: createPlayerStorageKey(),
          userId: currentState.userId,
        }),
      },
    ),
  );

export const useMCStore = createMCStore();

export const getMCStore = () => useMCStore;

export { createMCStore, defaultPlayer };
export type { MCStore };
