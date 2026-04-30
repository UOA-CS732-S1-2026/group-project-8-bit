import { applyLevelProgression, levelForTotalXp } from "@/game/core/level";
import type { Player, Property, SupportToolId } from "@/game/core/types";

export const DEFAULT_STORAGE_KEY_PREFIX = "mc-store";

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

export const defaultPlayer: Player = {
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
  const leveledPlayer = applyLevelProgression(
    {
      ...getBasePlayer(template),
      exp: 0,
    },
    safeXp,
  );
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
    completedQuests: template?.completedQuests ?? defaultPlayer.completedQuests,
    inventory: normalizeInventory(template?.inventory),
  };
};

export const buildInitialPlayer = (name?: string) =>
  normalizePlayer({
    ...defaultPlayer,
    name: name ?? defaultPlayer.name,
  });

export const createPlayerStorageKey = (
  userId?: string | null,
  slotId?: string | null,
) =>
  userId
    ? `${DEFAULT_STORAGE_KEY_PREFIX}:${userId}-${slotId}`
    : DEFAULT_STORAGE_KEY_PREFIX;

export const normalizePlayer = (player?: Partial<Player> | null): Player => {
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

export { clampHp, clampStat, normalizeInventory, normalizePropertyAmount };
