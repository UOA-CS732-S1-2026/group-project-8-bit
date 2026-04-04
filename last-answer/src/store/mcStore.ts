"use client";

import { create, type StoreApi, type UseBoundStore } from "zustand";
import { applyLevelProgression, levelForTotalXp } from "@/game/core/level";
import type {
  BattleReward,
  Player,
  Property,
  Quest,
  SupportToolId,
} from "@/game/core/types";

const DEFAULT_STORAGE_KEY = "mc-store";
const DEFAULT_INVENTORY: Property[] = [
  {
    id: "analyze",
    leftNumber: 1,
    price: 60,
  },
  {
    id: "hourglass",
    leftNumber: 1,
    price: 20,
  },
  {
    id: "barrier",
    leftNumber: 1,
    price: 50,
  },
  {
    id: "chainGuard",
    leftNumber: 1,
    price: 30,
  },
];

const defaultPlayer: Player = {
  name: "Bruce",
  level: 1,
  hp: 100,
  maxHp: 100,
  attack: 10,
  defense: 5,
  exp: 0,
  coins: 0,
  location: "mainHub",
  activeQuest: null,
  completedQuests: null,
  inventory: DEFAULT_INVENTORY,
};

const clampStat = (value: number) => Math.max(0, value);
const clampHp = (hp: number, maxHp: number) => Math.min(maxHp, clampStat(hp));
const normalizePropertyAmount = (amount: number = 1): number | null =>
  Number.isInteger(amount) && amount > 0 ? amount : null;

const normalizeInventory = (inventory?: Property[] | null): Property[] => {
  const inventoryById = new Map<SupportToolId, Property>(
    (inventory ?? []).map((property) => [property.id, property]),
  );

  return DEFAULT_INVENTORY.map((defaultProperty) => {
    const persistedProperty = inventoryById.get(defaultProperty.id);

    return {
      id: defaultProperty.id,
      leftNumber: clampStat(
        persistedProperty?.leftNumber ?? defaultProperty.leftNumber,
      ),
      price: defaultProperty.price,
    };
  });
};

const getInventoryProperty = (
  inventory: Property[],
  propertyId: SupportToolId,
): Property | undefined => inventory.find((property) => property.id === propertyId);

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

const getBasePlayer = (player?: Partial<Player>): Player => ({
  ...defaultPlayer,
  ...player,
  name: player?.name ?? defaultPlayer.name,
  coins: player?.coins ?? defaultPlayer.coins,
  location: player?.location ?? defaultPlayer.location,
  activeQuest: player?.activeQuest ?? defaultPlayer.activeQuest,
  completedQuests: player?.completedQuests ?? defaultPlayer.completedQuests,
  inventory: normalizeInventory(player?.inventory),
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
    location: template?.location ?? defaultPlayer.location,
    activeQuest: template?.activeQuest ?? defaultPlayer.activeQuest,
    completedQuests:
      template?.completedQuests ?? defaultPlayer.completedQuests,
    inventory: normalizeInventory(template?.inventory),
  };
};

const normalizePlayer = (player?: Partial<Player> | null): Player => {
  const safeExp = clampStat(player?.exp ?? defaultPlayer.exp);
  const safeHp = clampStat(player?.hp ?? defaultPlayer.hp);
  const safeCoins = clampStat(player?.coins ?? defaultPlayer.coins);
  const rebuiltPlayer = rebuildPlayerForTotalXp(safeExp, {
    ...defaultPlayer,
    ...player,
    exp: safeExp,
    hp: safeHp,
    coins: safeCoins,
    name: player?.name ?? defaultPlayer.name,
  });

  return {
    ...rebuiltPlayer,
    hp: clampHp(safeHp, rebuiltPlayer.maxHp),
    coins: safeCoins,
    name: player?.name ?? defaultPlayer.name,
    location: player?.location ?? defaultPlayer.location,
    activeQuest: player?.activeQuest ?? defaultPlayer.activeQuest,
    completedQuests: player?.completedQuests ?? defaultPlayer.completedQuests,
    inventory: normalizeInventory(player?.inventory),
  };
};

const readPersistedPlayer = (storageKey: string): Player | null => {
  if (typeof window === "undefined") {
    return defaultPlayer;
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
  readPlayer: () => Player;
  readPersistPlayer: () => Player | null;
  savePlayer: (player: Player) => void;
  savePersistPlayer: (player: Player) => void;
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
  setLocation: (location: string) => void;
  startQuest: (quest: Quest) => void;
  completeQuest: (quest: Quest) => void;
  resetPlayer: () => void;
};

type MCStoreHook = UseBoundStore<StoreApi<MCStore>>;

const storeRegistry = new Map<string, MCStoreHook>();

const createMCStore = (storageKey: string = DEFAULT_STORAGE_KEY): MCStoreHook =>
  create<MCStore>()((set, get) => ({
    player: defaultPlayer,

    readPlayer: () => get().player,

    readPersistPlayer: () => readPersistedPlayer(storageKey),

    savePlayer: (player) =>
      set({
        player: normalizePlayer(player),
      }),

    savePersistPlayer: (player) => {
      savePersistedPlayer(storageKey, player);
    },

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

    resetPlayer: () => set({ player: defaultPlayer }),
  }));

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
