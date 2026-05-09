import type { Player, SupportToolId } from "./types";

export type FateRarity = "common" | "rare" | "epic" | "legendary";

export type FateCardEffect = {
  hp?: number;
  maxHp?: number;
  attack?: number;
  defense?: number;
  coins?: number;
  hpMultiplier?: number;
  inventoryDelta?: Partial<Record<SupportToolId, number>>;
  loseAllInventory?: boolean;
};

export type FateCard = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: FateRarity;
  effect: FateCardEffect;
  positiveText: string[];
  negativeText: string[];
};

// Item prices for reference: analyze=60, barrier=50, chainGuard=30, hourglass=20
// All item effects are +only (except Vagrant loseAll) to prevent 3-card stack from draining items.
//
// Probability per draw (total weighted pool = 868):
//   common    55 × 10 = 550  →  ~63%
//   rare      25 × 10 = 250  →  ~29%
//   epic      10 ×  6 =  60  →  ~ 7%
//   legendary  2 ×  4 =   8  →  < 1%
export const RARITY_WEIGHTS: Record<FateRarity, number> = {
  common: 55,
  rare: 25,
  epic: 10,
  legendary: 2,
};

export const FATE_CARDS: FateCard[] = [
  // ── COMMON (白) ── subtle, positive slightly outweighs negative ───────────
  {
    id: "pyromancer",
    name: "Pyromancer's Spark",
    emoji: "🔥",
    description: "Fire in the blood — but at a cost.",
    rarity: "common",
    effect: { attack: 2, defense: -1 },
    positiveText: ["Attack +2"],
    negativeText: ["Defense -1"],
  },
  {
    id: "iron",
    name: "Iron Stance",
    emoji: "🪨",
    description: "Hard as stone, slow as stone.",
    rarity: "common",
    effect: { defense: 2, attack: -1 },
    positiveText: ["Defense +2"],
    negativeText: ["Attack -1"],
  },
  {
    id: "hollow_courage",
    name: "Hollow Courage",
    emoji: "⚔️",
    description: "Courage without caution costs flesh.",
    rarity: "common",
    effect: { attack: 1, maxHp: -5 },
    positiveText: ["Attack +1"],
    negativeText: ["Max HP -5"],
  },
  {
    id: "sand_gift",
    name: "Sand Gift",
    emoji: "⌛",
    description: "A cheap boon — costs your edge.",
    rarity: "common",
    // hourglass is cheapest item (20). Paying ATK-1 for it is fair.
    effect: { inventoryDelta: { hourglass: 1 }, attack: -1 },
    positiveText: ["Suspended Sand ×1"],
    negativeText: ["Attack -1"],
  },
  {
    id: "tome_binding",
    name: "Tome Binding",
    emoji: "📖",
    description: "Wisdom earned at the cost of vigilance.",
    rarity: "common",
    // analyze is most expensive item (60). Paying DEF-1 is a good deal.
    effect: { inventoryDelta: { analyze: 1 }, defense: -1 },
    positiveText: ["Scripture of Unmasking ×1"],
    negativeText: ["Defense -1"],
  },
  {
    id: "purse",
    name: "Pilgrim's Purse",
    emoji: "💰",
    description: "Coin in hand, edge in sheath.",
    rarity: "common",
    effect: { coins: 50, attack: -1 },
    positiveText: ["+50 coins"],
    negativeText: ["Attack -1"],
  },
  {
    id: "gutterborn",
    name: "Gutterborn",
    emoji: "🗡️",
    description: "Scrappy and coin-hungry.",
    rarity: "common",
    effect: { attack: 2, coins: 15, defense: -1 },
    positiveText: ["Attack +2", "+15 coins"],
    negativeText: ["Defense -1"],
  },
  {
    id: "mending_scar",
    name: "Mending Scar",
    emoji: "🛡️",
    description: "Old wounds close. Skin grows back softer.",
    rarity: "common",
    effect: { maxHp: 12, defense: -1 },
    positiveText: ["Max HP +12"],
    negativeText: ["Defense -1"],
  },
  {
    id: "steady_hand",
    name: "Steady Hand",
    emoji: "✋",
    description: "Balanced in body, lighter in spirit.",
    rarity: "common",
    effect: { attack: 1, defense: 1, maxHp: -5 },
    positiveText: ["Attack +1", "Defense +1"],
    negativeText: ["Max HP -5"],
  },
  {
    id: "wanderer_toll",
    name: "Wanderer's Toll",
    emoji: "🪙",
    description: "The road demands a price.",
    rarity: "common",
    effect: { coins: 40, defense: -1 },
    positiveText: ["+40 coins"],
    negativeText: ["Defense -1"],
  },

  // ── RARE (蓝) ── slightly better than common, still balanced ─────────────
  {
    id: "tempered",
    name: "Tempered Soul",
    emoji: "⚖️",
    description: "Balanced in fire. A slight edge remains.",
    rarity: "rare",
    effect: { attack: 2, defense: 1, maxHp: -5 },
    positiveText: ["Attack +2", "Defense +1"],
    negativeText: ["Max HP -5"],
  },
  {
    id: "cursed",
    name: "Cursed Blood",
    emoji: "🩸",
    description: "Power runs deep — but so does the wound.",
    rarity: "rare",
    effect: { attack: 3, maxHp: -8 },
    positiveText: ["Attack +3"],
    negativeText: ["Max HP -8"],
  },
  {
    id: "silver_tongue",
    name: "Silver Tongue",
    emoji: "💬",
    description: "Words open purses — but blades stay sheathed.",
    rarity: "rare",
    effect: { coins: 80, defense: 1, attack: -1 },
    positiveText: ["+80 coins", "Defense +1"],
    negativeText: ["Attack -1"],
  },
  {
    id: "phantom_blade",
    name: "Phantom Strike",
    emoji: "🌙",
    description: "Strikes fast, but leaves you open.",
    rarity: "rare",
    effect: { attack: 3, defense: -1, maxHp: -5 },
    positiveText: ["Attack +3"],
    negativeText: ["Defense -1", "Max HP -5"],
  },
  {
    id: "aegis",
    name: "Aegis Pact",
    emoji: "🔰",
    description: "A shield sworn — at the cost of fury.",
    // barrier=50 coins. Paying ATK-1 and DEF+1 alongside is fair for rare.
    rarity: "rare",
    effect: { inventoryDelta: { barrier: 1 }, defense: 1, attack: -1 },
    positiveText: ["Veil of Aegis ×1", "Defense +1"],
    negativeText: ["Attack -1"],
  },
  {
    id: "sand",
    name: "Sandsorcerer",
    emoji: "🌀",
    description: "Time bends — but speed suffers.",
    rarity: "rare",
    effect: { inventoryDelta: { hourglass: 1 }, attack: 1, defense: -1 },
    positiveText: ["Suspended Sand ×1", "Attack +1"],
    negativeText: ["Defense -1"],
  },
  {
    id: "oath",
    name: "Oathbinder",
    emoji: "⛓️",
    description: "Bound by chain, freed from doubt.",
    // chainGuard=30. ATK+1 alongside makes it worthwhile.
    rarity: "rare",
    effect: { inventoryDelta: { chainGuard: 1 }, attack: 1, defense: -1 },
    positiveText: ["Oathbound Chain ×1", "Attack +1"],
    negativeText: ["Defense -1"],
  },
  {
    id: "scholar",
    name: "Scholar's Cache",
    emoji: "📜",
    description: "Knowledge gathered — swords neglected.",
    // analyze(60)+hourglass(20)=80 coin value. ATK-1 is a fair price.
    rarity: "rare",
    effect: { inventoryDelta: { analyze: 1, hourglass: 1 }, attack: -1 },
    positiveText: ["Scripture of Unmasking ×1", "Suspended Sand ×1"],
    negativeText: ["Attack -1"],
  },
  {
    id: "vagrant",
    name: "Vagrant",
    emoji: "🎒",
    description: "Travel light. Strike hard.",
    rarity: "rare",
    effect: { attack: 3, coins: 40, inventoryDelta: { analyze: -1, barrier: -1 } },
    positiveText: ["Attack +3", "+40 coins"],
    negativeText: ["Scripture of Unmasking -1", "Veil of Aegis -1"],
  },
  {
    id: "iron_will",
    name: "Iron Will",
    emoji: "💪",
    description: "Body mended through sheer endurance.",
    rarity: "rare",
    effect: { maxHp: 15, defense: 1, attack: -2 },
    positiveText: ["Max HP +15", "Defense +1"],
    negativeText: ["Attack -2"],
  },

  // ── EPIC (紫) ── item-focused, modest stat changes ────────────────────────
  {
    id: "arsenal",
    name: "Full Arsenal",
    emoji: "⚙️",
    description: "Every slot filled. No cost, no catch.",
    // All items +1 = 160 coin value. No stats to keep it pure and fun.
    rarity: "epic",
    effect: { inventoryDelta: { analyze: 1, hourglass: 1, barrier: 1, chainGuard: 1 } },
    positiveText: ["All items ×1"],
    negativeText: [],
  },
  {
    id: "chronicler",
    name: "Chronicler's Gift",
    emoji: "📚",
    description: "Two tomes gained — one blade dulled.",
    rarity: "epic",
    effect: { inventoryDelta: { analyze: 2 }, attack: 1, defense: -1 },
    positiveText: ["Scripture of Unmasking ×2", "Attack +1"],
    negativeText: ["Defense -1"],
  },
  {
    id: "warden",
    name: "Warden's Oath",
    emoji: "🏰",
    description: "Shield and chain, sworn together.",
    rarity: "epic",
    // barrier(50)+chainGuard(30)=80 value + DEF+1. Good epic reward.
    effect: { inventoryDelta: { chainGuard: 1, barrier: 1 }, defense: 1 },
    positiveText: ["Oathbound Chain ×1", "Veil of Aegis ×1", "Defense +1"],
    negativeText: [],
  },
  {
    id: "merchant",
    name: "Merchant's Luck",
    emoji: "💎",
    description: "Gold flows — but the sword-arm slackens.",
    rarity: "epic",
    effect: { coins: 100, inventoryDelta: { analyze: 1, hourglass: 1, barrier: 1, chainGuard: 1 }, attack: -1 },
    positiveText: ["+100 coins", "All items ×1"],
    negativeText: ["Attack -1"],
  },
  {
    id: "battle_sage",
    name: "Battle Sage",
    emoji: "🔮",
    description: "Wisdom and sand: a quiet edge.",
    rarity: "epic",
    effect: { inventoryDelta: { hourglass: 1, analyze: 1 }, attack: 1 },
    positiveText: ["Suspended Sand ×1", "Scripture of Unmasking ×1", "Attack +1"],
    negativeText: [],
  },
  {
    id: "iron_covenant",
    name: "Iron Covenant",
    emoji: "⚜️",
    description: "Steel and oath — bound without compromise.",
    rarity: "epic",
    effect: { inventoryDelta: { chainGuard: 1, barrier: 1 }, attack: 1, defense: 1 },
    positiveText: ["Oathbound Chain ×1", "Veil of Aegis ×1", "Attack +1", "Defense +1"],
    negativeText: [],
  },

  // ── LEGENDARY (橙) ── clearly better but still modest ────────────────────
  {
    id: "hero",
    name: "Hero's Path",
    emoji: "🌟",
    description: "A legend begins here.",
    // Two expensive items + modest stats
    rarity: "legendary",
    effect: { attack: 3, defense: 2, maxHp: 10, inventoryDelta: { analyze: 1, barrier: 1 } },
    positiveText: ["Attack +3", "Defense +2", "Max HP +10", "Scripture of Unmasking ×1", "Veil of Aegis ×1"],
    negativeText: [],
  },
  {
    id: "dragon_blood",
    name: "Dragon's Fury",
    emoji: "🐉",
    description: "Ancient power surges through mortal veins.",
    rarity: "legendary",
    effect: { attack: 4, maxHp: 8, coins: 60 },
    positiveText: ["Attack +4", "Max HP +8", "+60 coins"],
    negativeText: [],
  },
  {
    id: "divine_covenant",
    name: "Divine Grace",
    emoji: "👑",
    description: "Blessed by forces beyond mortal reach.",
    rarity: "legendary",
    effect: { attack: 2, defense: 2, maxHp: 8 },
    positiveText: ["Attack +2", "Defense +2", "Max HP +8"],
    negativeText: [],
  },
  {
    id: "phoenix_heart",
    name: "Phoenix Rising",
    emoji: "✨",
    description: "From ash, renewed.",
    rarity: "legendary",
    effect: { maxHp: 15, attack: 2, defense: 2, inventoryDelta: { barrier: 1, hourglass: 1 } },
    positiveText: ["Max HP +15", "Attack +2", "Defense +2", "Veil of Aegis ×1", "Suspended Sand ×1"],
    negativeText: [],
  },
];

export function cardReducesInventory(card: FateCard): boolean {
  if (card.effect.loseAllInventory) return true;
  if (!card.effect.inventoryDelta) return false;
  return Object.values(card.effect.inventoryDelta).some((v) => (v ?? 0) < 0);
}

function buildWeightedPool(
  excludeIds: Set<string> = new Set(),
  excludeNegativeInventory = false,
): FateCard[] {
  const pool: FateCard[] = [];
  for (const card of FATE_CARDS) {
    if (excludeIds.has(card.id)) continue;
    if (excludeNegativeInventory && cardReducesInventory(card)) continue;
    const weight = RARITY_WEIGHTS[card.rarity];
    for (let i = 0; i < weight; i += 1) {
      pool.push(card);
    }
  }
  return pool;
}

function pickFromPool(pool: FateCard[]): FateCard {
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

export function drawSingleCard(
  excludeIds: Set<string>,
  excludeNegativeInventory = false,
): FateCard | null {
  const pool = buildWeightedPool(excludeIds, excludeNegativeInventory);
  if (pool.length === 0) return null;
  return pickFromPool(pool);
}

export function rerollOne(
  currentCards: FateCard[],
  indexToReroll: number,
  excludeNegativeInventory = false,
): FateCard {
  const otherIds = new Set(
    currentCards.filter((_, i) => i !== indexToReroll).map((c) => c.id),
  );
  const currentCard = currentCards[indexToReroll];
  if (currentCard) otherIds.add(currentCard.id);
  const pool = buildWeightedPool(otherIds, excludeNegativeInventory);
  if (pool.length === 0) return currentCard;
  return pickFromPool(pool);
}

export function applyFateCards(basePlayer: Player, cards: FateCard[]): Player {
  let attack = basePlayer.attack;
  let defense = basePlayer.defense;
  let hp = basePlayer.hp;
  let maxHp = basePlayer.maxHp;
  let coins = basePlayer.coins;
  let inventory = basePlayer.inventory.map((p) => ({ ...p }));

  for (const card of cards) {
    const e = card.effect;
    if (e.attack) attack += e.attack;
    if (e.defense) defense += e.defense;
    if (e.hp) hp += e.hp;
    if (e.maxHp) maxHp += e.maxHp;
    if (e.coins) coins += e.coins;

    if (e.loseAllInventory) {
      inventory = inventory.map((p) => ({ ...p, leftNumber: 0 }));
    }

    if (e.inventoryDelta) {
      inventory = inventory.map((p) => {
        const delta = e.inventoryDelta?.[p.id] ?? 0;
        return { ...p, leftNumber: Math.max(0, p.leftNumber + delta) };
      });
    }
  }

  for (const card of cards) {
    if (card.effect.hpMultiplier) {
      maxHp = Math.max(1, Math.floor(maxHp * card.effect.hpMultiplier));
      hp = Math.max(1, Math.floor(hp * card.effect.hpMultiplier));
    }
  }

  return {
    ...basePlayer,
    hp: Math.max(1, Math.min(hp, maxHp)),
    maxHp: Math.max(1, maxHp),
    attack: Math.max(0, attack),
    defense: Math.max(0, defense),
    coins: Math.max(0, coins),
    inventory,
  };
}
