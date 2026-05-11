import { describe, expect, it } from "vitest";

import {
  applyFateCards,
  cardReducesInventory,
  drawSingleCard,
  FATE_CARDS,
  rerollOne,
  type FateCard,
} from "./fateCards";
import type { Player } from "./types";

function createPlayer(overrides: Partial<Player> = {}): Player {
  return {
    name: "Tester",
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
    inventory: [
      { id: "analyze",   leftNumber: 1, price: 60 },
      { id: "hourglass", leftNumber: 1, price: 20 },
      { id: "barrier",   leftNumber: 1, price: 50 },
      { id: "chainGuard",leftNumber: 1, price: 30 },
    ],
    ...overrides,
  };
}

function makeCard(overrides: Partial<FateCard> = {}): FateCard {
  return {
    id: "test_card",
    name: "Test Card",
    emoji: "🎴",
    description: "A test card",
    rarity: "common",
    effect: {},
    positiveText: [],
    negativeText: [],
    ...overrides,
  };
}

describe("cardReducesInventory", () => {
  it("returns false when the card has no inventory effect", () => {
    expect(cardReducesInventory(makeCard({ effect: { attack: 2 } }))).toBe(false);
  });

  it("returns false when all inventory deltas are positive", () => {
    expect(
      cardReducesInventory(
        makeCard({ effect: { inventoryDelta: { analyze: 1, hourglass: 2 } } }),
      ),
    ).toBe(false);
  });

  it("returns true when any inventory delta is negative", () => {
    expect(
      cardReducesInventory(
        makeCard({ effect: { inventoryDelta: { analyze: -1 } } }),
      ),
    ).toBe(true);
  });

  it("returns true when loseAllInventory is set", () => {
    expect(
      cardReducesInventory(makeCard({ effect: { loseAllInventory: true } })),
    ).toBe(true);
  });

  it("correctly identifies the vagrant card from the real pool", () => {
    const vagrant = FATE_CARDS.find((c) => c.id === "vagrant");
    expect(vagrant).toBeDefined();
    expect(cardReducesInventory(vagrant!)).toBe(true);
  });
});

describe("drawSingleCard", () => {
  it("returns a card from the pool", () => {
    const card = drawSingleCard(new Set());
    expect(card).not.toBeNull();
    expect(FATE_CARDS.some((c) => c.id === card!.id)).toBe(true);
  });

  it("never returns a card whose id is excluded", () => {
    const allIds = new Set(FATE_CARDS.map((c) => c.id));
    const [first, ...rest] = FATE_CARDS;
    const excludeAll = new Set(rest.map((c) => c.id));

    for (let i = 0; i < 20; i++) {
      const card = drawSingleCard(excludeAll);
      expect(card?.id).toBe(first.id);
    }

    expect(allIds.size).toBeGreaterThan(1);
  });

  it("returns null when the entire pool is excluded", () => {
    const allIds = new Set(FATE_CARDS.map((c) => c.id));
    expect(drawSingleCard(allIds)).toBeNull();
  });

  it("never returns a card that reduces inventory when excludeNegativeInventory is true", () => {
    for (let i = 0; i < 50; i++) {
      const card = drawSingleCard(new Set(), true);
      expect(card).not.toBeNull();
      expect(cardReducesInventory(card!)).toBe(false);
    }
  });
});

describe("rerollOne", () => {
  it("returns a card with a different id than the one being rerolled", () => {
    const hand = [FATE_CARDS[0]];
    for (let i = 0; i < 20; i++) {
      const result = rerollOne(hand, 0);
      expect(result.id).not.toBe(hand[0].id);
    }
  });

  it("does not return any card already in the hand", () => {
    const hand = FATE_CARDS.slice(0, 3);
    for (let i = 0; i < 30; i++) {
      const result = rerollOne(hand, 0);
      expect(result.id).not.toBe(hand[1].id);
      expect(result.id).not.toBe(hand[2].id);
    }
  });

  it("falls back to the current card when the remaining pool is empty", () => {
    const allButOne = FATE_CARDS.slice(0, FATE_CARDS.length - 1);
    const result = rerollOne(allButOne, 0);
    expect(result.id).toBe(FATE_CARDS[FATE_CARDS.length - 1].id);
  });
});

describe("applyFateCards", () => {
  it("returns the player unchanged when no cards are applied", () => {
    const player = createPlayer();
    expect(applyFateCards(player, [])).toEqual(player);
  });

  it("applies an attack modifier", () => {
    const card = makeCard({ effect: { attack: 3 } });
    expect(applyFateCards(createPlayer(), [card]).attack).toBe(13);
  });

  it("applies a defense modifier", () => {
    const card = makeCard({ effect: { defense: 2 } });
    expect(applyFateCards(createPlayer(), [card]).defense).toBe(7);
  });

  it("applies a maxHp modifier", () => {
    const card = makeCard({ effect: { maxHp: 20 } });
    const result = applyFateCards(createPlayer(), [card]);
    expect(result.maxHp).toBe(120);
  });

  it("applies a coins modifier", () => {
    const card = makeCard({ effect: { coins: 50 } });
    expect(applyFateCards(createPlayer(), [card]).coins).toBe(50);
  });

  it("applies a positive inventory delta", () => {
    const card = makeCard({ effect: { inventoryDelta: { analyze: 2 } } });
    const result = applyFateCards(createPlayer(), [card]);
    expect(result.inventory.find((p) => p.id === "analyze")?.leftNumber).toBe(3);
  });

  it("applies a negative inventory delta clamped at zero", () => {
    const card = makeCard({ effect: { inventoryDelta: { analyze: -5 } } });
    const result = applyFateCards(createPlayer(), [card]);
    expect(result.inventory.find((p) => p.id === "analyze")?.leftNumber).toBe(0);
  });

  it("clamps attack at zero when modifiers would make it negative", () => {
    const card = makeCard({ effect: { attack: -20 } });
    expect(applyFateCards(createPlayer(), [card]).attack).toBe(0);
  });

  it("clamps maxHp at one when modifiers would reduce it to zero or below", () => {
    const card = makeCard({ effect: { maxHp: -200 } });
    expect(applyFateCards(createPlayer(), [card]).maxHp).toBe(1);
  });

  it("clamps hp to the new maxHp when maxHp is reduced", () => {
    const card = makeCard({ effect: { maxHp: -80 } });
    const result = applyFateCards(createPlayer({ hp: 100, maxHp: 100 }), [card]);
    expect(result.maxHp).toBe(20);
    expect(result.hp).toBeLessThanOrEqual(result.maxHp);
  });

  it("stacks effects from multiple cards", () => {
    const cards = [
      makeCard({ id: "a", effect: { attack: 2 } }),
      makeCard({ id: "b", effect: { attack: 3, defense: -1 } }),
    ];
    const result = applyFateCards(createPlayer(), cards);
    expect(result.attack).toBe(15);
    expect(result.defense).toBe(4);
  });

  it("applies hpMultiplier after all additive changes", () => {
    const cards = [
      makeCard({ id: "a", effect: { maxHp: 100 } }),
      makeCard({ id: "b", effect: { hpMultiplier: 0.5 } }),
    ];
    const result = applyFateCards(createPlayer({ maxHp: 100, hp: 100 }), cards);
    expect(result.maxHp).toBe(100);
    expect(result.hp).toBeLessThanOrEqual(result.maxHp);
  });

  it("zeros all inventory items when loseAllInventory is set", () => {
    const card = makeCard({ effect: { loseAllInventory: true } });
    const result = applyFateCards(createPlayer(), [card]);
    for (const item of result.inventory) {
      expect(item.leftNumber).toBe(0);
    }
  });
});
