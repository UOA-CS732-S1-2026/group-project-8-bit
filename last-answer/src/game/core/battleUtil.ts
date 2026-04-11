import {
  QUESTION_TIME_LIMIT_MS,
  createEnemy,
  getBattleTurnLimit,
  supportToolConfigs,
} from "./battleCore";
import { defaultBattleQuestions } from "./questions";
import type {
  BattleSession,
  PendingBurst,
  Player,
  Question,
} from "./types";

function shuffleArray<T>(items: T[]): T[] {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = nextItems[index];
    nextItems[index] = nextItems[targetIndex];
    nextItems[targetIndex] = currentItem;
  }

  return nextItems;
}

export function pickBattleQuestions(count: number): Question[] {
  if (count <= 0 || defaultBattleQuestions.length === 0) {
    return [];
  }

  const questions: Question[] = [];

  while (questions.length < count) {
    const shuffledBatch = shuffleArray(defaultBattleQuestions);
    const remainingCount = count - questions.length;
    questions.push(...shuffledBatch.slice(0, remainingCount));
  }

  return questions;
}

function getInventoryUses(
  player: Player,
  toolId: keyof BattleSession["supportTools"],
): number {
  const property = player.inventory.find((item) => item.id === toolId);
  return property?.leftNumber ?? 0;
}

export function createSupportStateForPlayer(
  player: Player,
): BattleSession["supportTools"] {
  return {
    analyze: Math.min(
      supportToolConfigs.analyze.maxUses,
      getInventoryUses(player, "analyze"),
    ),
    hourglass: Math.min(
      supportToolConfigs.hourglass.maxUses,
      getInventoryUses(player, "hourglass"),
    ),
    barrier: Math.min(
      supportToolConfigs.barrier.maxUses,
      getInventoryUses(player, "barrier"),
    ),
    chainGuard: Math.min(
      supportToolConfigs.chainGuard.maxUses,
      getInventoryUses(player, "chainGuard"),
    ),
  };
}

export function initializeBattleSession(
  enemy: BattleSession["enemy"],
  questions: Question[],
  player: Player,
): BattleSession {
  const turnLimit = getBattleTurnLimit(enemy.isBoss);

  return {
    enemy,
    questions,
    currentQuestionIndex: 0,
    turnLimit,
    turnsRemaining: turnLimit,
    turnsUsed: 0,
    timeLimitMs: QUESTION_TIME_LIMIT_MS,
    timeRemainingMs: QUESTION_TIME_LIMIT_MS,
    burstRemainingMs: 0,
    isTimerPaused: false,
    supportMenuOpen: false,
    correctStreak: 0,
    bestCombo: 0,
    correctAnswers: 0,
    answerTimesMs: [],
    speedRatios: [],
    assistUses: 0,
    strongAssistUses: 0,
    burstClicks: 0,
    currentBurstClicks: 0,
    burstUsesThisBattle: 0,
    burstTimerStarted: false,
    burstResolving: false,
    barrierActive: false,
    chainGuardActive: false,
    eliminatedOptionIndices: [],
    toolUsedThisTurn: false,
    supportTools: createSupportStateForPlayer(player),
    status: "question",
    pendingBurst: null,
  };
}

export function createDemoEnemy(player: Player, isBoss: boolean) {
  return createEnemy({
    id: isBoss ? "forest-lord" : "forest-wisp",
    name: isBoss ? "Forest Lord" : "Forest Wisp",
    level: isBoss ? player.level + 1 : player.level,
    tier: isBoss ? "boss" : "normal",
    isBoss,
  });
}

export function getCurrentQuestion(battle: BattleSession): Question | null {
  return battle.questions[battle.currentQuestionIndex] ?? null;
}

export function nextQuestionState(battle: BattleSession): BattleSession {
  return {
    ...battle,
    currentQuestionIndex: battle.currentQuestionIndex + 1,
    turnsRemaining: Math.max(0, battle.turnLimit - battle.turnsUsed),
    timeLimitMs: QUESTION_TIME_LIMIT_MS,
    timeRemainingMs: QUESTION_TIME_LIMIT_MS,
    burstRemainingMs: 0,
    isTimerPaused: false,
    supportMenuOpen: false,
    eliminatedOptionIndices: [],
    toolUsedThisTurn: false,
    currentBurstClicks: 0,
    burstTimerStarted: false,
    burstResolving: false,
    status: "question",
    pendingBurst: null,
  };
}

export function preserveOrBreakCombo(battle: BattleSession): Pick<
  BattleSession,
  "correctStreak" | "chainGuardActive"
> {
  if (battle.chainGuardActive) {
    return {
      correctStreak: battle.correctStreak,
      chainGuardActive: false,
    };
  }

  return {
    correctStreak: 0,
    chainGuardActive: false,
  };
}

export function createPendingBurst(
  battle: BattleSession,
  streak: number,
): PendingBurst | null {
  const question = getCurrentQuestion(battle);

  if (!question) {
    return null;
  }

  return {
    questionId: question.id,
    timeLeftMs: battle.timeRemainingMs,
    timeLimitMs: battle.timeLimitMs,
    streak,
  };
}
