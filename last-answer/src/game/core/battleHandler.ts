import {
  BURST_DURATION_MS,
  HOURGLASS_BONUS_MS,
  calculateEnemyDamage,
  calculatePlayerDamage,
  canTriggerBurst,
  supportToolConfigs,
} from "./battleCore";
import { finalizeDefeat, finalizeVictory } from "./battleResultHandler";
import {
  createPendingBurst,
  getCorrectAnswerIndex,
  getCurrentQuestion,
  getQuestionOptions,
  initializeBattleSession,
  nextQuestionState,
  preserveOrBreakCombo,
} from "./battleUtil";
import type {
  BattleSession,
  BattleTransitionResult,
  Player,
  Question,
  SupportToolId,
} from "./types";

function finalizeOngoingBattle(battle: BattleSession): BattleTransitionResult {
  return {
    battle,
    enemyDamage: 0,
    completion: null,
  };
}

function finalizeLostBattle(
  battle: BattleSession,
  enemyDamage: number,
): BattleTransitionResult {
  return {
    battle: {
      ...battle,
      status: "lost",
      isTimerPaused: true,
      supportMenuOpen: false,
    },
    enemyDamage: enemyDamage,
    completion: finalizeDefeat(),
  };
}

function finalizeWonBattle(
  battle: BattleSession,
  player: Player,
): BattleTransitionResult {
  return {
    battle: {
      ...battle,
      status: "won",
      isTimerPaused: true,
      supportMenuOpen: false,
    },
    enemyDamage: 0,
    completion: finalizeVictory(battle, player),
  };
}

function resolveFailureState(
  battle: BattleSession,
  player: Player,
  timeRemainingMs: number,
): BattleTransitionResult {
  const comboState = preserveOrBreakCombo(battle);
  const turnsUsed = battle.turnsUsed + 1;
  const turnsRemaining = Math.max(0, battle.turnLimit - turnsUsed);
  const enemyDamage = battle.barrierActive
    ? 0
    : calculateEnemyDamage(player, battle.enemy);
  const playerHpAfter = Math.max(0, player.hp - enemyDamage);
  const lostBattle = playerHpAfter <= 0 || turnsRemaining <= 0;
  const resolvedBattle: BattleSession = {
    ...battle,
    turnsUsed,
    turnsRemaining,
    timeRemainingMs,
    barrierActive: false,
    supportMenuOpen: false,
    isTimerPaused: false,
    toolUsedThisTurn: true,
    ...comboState,
  };

  if (lostBattle) {
    return finalizeLostBattle(resolvedBattle, enemyDamage);
  }

  return {
    battle: nextQuestionState(resolvedBattle),
    enemyDamage: enemyDamage,
    completion: null,
  };
}

export function createBattle(args: {
  enemy: BattleSession["enemy"];
  questions: Question[];
  player: Player;
}): BattleSession {
  return initializeBattleSession(args.enemy, args.questions, args.player);
}

export function resolveTimeout(
  battle: BattleSession,
  player: Player,
): BattleTransitionResult {
  return resolveFailureState(battle, player, 0);
}

export function activateSupportTool(
  battle: BattleSession,
  toolId: SupportToolId,
): BattleTransitionResult {
  if (battle.status !== "question") {
    return finalizeOngoingBattle(battle);
  }

  const currentQuestion = getCurrentQuestion(battle);
  const remainingUses = battle.supportTools[toolId];

  if (
    !currentQuestion ||
    remainingUses <= 0 ||
    (toolId === "analyze" && currentQuestion.type === "boolean") ||
    battle.toolUsedThisTurn ||
    battle.supportMenuOpen === false
  ) {
    return finalizeOngoingBattle(battle);
  }

  const nextSupportTools = {
    ...battle.supportTools,
    [toolId]: remainingUses - 1,
  };
  const config = supportToolConfigs[toolId];
  let eliminatedOptionIndices = battle.eliminatedOptionIndices;
  let timeLimitMs = battle.timeLimitMs;
  let timeRemainingMs = battle.timeRemainingMs;
  let barrierActive = battle.barrierActive;
  let chainGuardActive = battle.chainGuardActive;

  if (toolId === "analyze") {
    const correctAnswerIndex = getCorrectAnswerIndex(currentQuestion);
    const wrongOptions = getQuestionOptions(currentQuestion)
      .map((_, index) => index)
      .filter(
        (index) =>
          index !== correctAnswerIndex &&
          !battle.eliminatedOptionIndices.includes(index),
      );

    eliminatedOptionIndices = [
      ...battle.eliminatedOptionIndices,
      ...wrongOptions.slice(0, 2),
    ];
  }

  if (toolId === "hourglass") {
    timeLimitMs += HOURGLASS_BONUS_MS;
    timeRemainingMs += HOURGLASS_BONUS_MS;
  }

  if (toolId === "barrier") {
    barrierActive = true;
  }

  if (toolId === "chainGuard") {
    chainGuardActive = true;
  }

  return finalizeOngoingBattle({
    ...battle,
    supportTools: nextSupportTools,
    eliminatedOptionIndices,
    timeLimitMs,
    timeRemainingMs,
    barrierActive,
    chainGuardActive,
    assistUses: battle.assistUses + (config.strongAssist ? 0 : 1),
    strongAssistUses: battle.strongAssistUses + (config.strongAssist ? 1 : 0),
    supportMenuOpen: false,
    isTimerPaused: false,
    toolUsedThisTurn: true,
  });
}

export function resolveAnswer(args: {
  battle: BattleSession;
  player: Player;
  choiceIndex: number;
}): BattleTransitionResult {
  const { battle, player, choiceIndex } = args;
  const currentQuestion = getCurrentQuestion(battle);

  if (
    battle.status !== "question" ||
    !currentQuestion ||
    battle.eliminatedOptionIndices.includes(choiceIndex)
  ) {
    return finalizeOngoingBattle(battle);
  }

  const turnsUsed = battle.turnsUsed + 1;
  const turnsRemaining = Math.max(0, battle.turnLimit - turnsUsed);
  const answerTimeMs = battle.timeLimitMs - battle.timeRemainingMs;
  const speedRatio = battle.timeRemainingMs / battle.timeLimitMs;
  const isCorrect = choiceIndex === getCorrectAnswerIndex(currentQuestion);

  if (!isCorrect) {
    return resolveFailureState(battle, player, battle.timeRemainingMs);
  }

  const nextStreak = battle.correctStreak + 1;
  const bestCombo = Math.max(battle.bestCombo, nextStreak);
  const updatedBattle: BattleSession = {
    ...battle,
    turnsUsed,
    turnsRemaining,
    correctStreak: nextStreak,
    bestCombo,
    correctAnswers: battle.correctAnswers + 1,
    answerTimesMs: [...battle.answerTimesMs, answerTimeMs],
    speedRatios: [...battle.speedRatios, speedRatio],
    supportMenuOpen: false,
    isTimerPaused: false,
    toolUsedThisTurn: true,
  };

  if (
    canTriggerBurst({
      streak: nextStreak,
      enemy: updatedBattle.enemy,
      burstUsesThisBattle: updatedBattle.burstUsesThisBattle,
    })
  ) {
    return finalizeOngoingBattle({
      ...updatedBattle,
      burstRemainingMs: BURST_DURATION_MS,
      currentBurstClicks: 0,
      burstTimerStarted: false,
      burstResolving: false,
      supportMenuOpen: false,
      isTimerPaused: true,
      status: "burst",
      pendingBurst: createPendingBurst(updatedBattle, nextStreak),
    });
  }

  const playerDamage = calculatePlayerDamage({
    player,
    enemy: updatedBattle.enemy,
    timeLeftMs: updatedBattle.timeRemainingMs,
    timeLimitMs: updatedBattle.timeLimitMs,
    streak: nextStreak,
  });
  const enemyHpAfter = Math.max(0, updatedBattle.enemy.hp - playerDamage);
  const resolvedBattle: BattleSession = {
    ...updatedBattle,
    enemy: {
      ...updatedBattle.enemy,
      hp: enemyHpAfter,
    },
  };

  if (enemyHpAfter <= 0) {
    return finalizeWonBattle(resolvedBattle, player);
  }

  if (turnsRemaining <= 0) {
    return finalizeLostBattle(resolvedBattle, 0);
  }

  return finalizeOngoingBattle(nextQuestionState(resolvedBattle));
}

export function resolveBurst(
  battle: BattleSession,
  player: Player,
): BattleTransitionResult {
  if (battle.status !== "burst" || battle.pendingBurst === null) {
    return finalizeOngoingBattle(battle);
  }

  const damage = calculatePlayerDamage({
    player,
    enemy: battle.enemy,
    timeLeftMs: battle.pendingBurst.timeLeftMs,
    timeLimitMs: battle.pendingBurst.timeLimitMs,
    streak: battle.pendingBurst.streak,
    burstClicks: battle.currentBurstClicks,
  });
  const enemyHpAfter = Math.max(0, battle.enemy.hp - damage);
  const burstClicks = battle.burstClicks + battle.currentBurstClicks;
  const turnsRemaining = Math.max(0, battle.turnLimit - battle.turnsUsed);
  const nextBattleBase: BattleSession = {
    ...battle,
    enemy: {
      ...battle.enemy,
      hp: enemyHpAfter,
    },
    burstClicks,
    burstUsesThisBattle: battle.burstUsesThisBattle + 1,
    currentBurstClicks: 0,
    burstTimerStarted: false,
    burstResolving: false,
    burstRemainingMs: 0,
    pendingBurst: null,
  };

  if (enemyHpAfter <= 0) {
    return finalizeWonBattle(nextBattleBase, player);
  }

  if (turnsRemaining <= 0) {
    return finalizeLostBattle(nextBattleBase, 0);
  }

  return finalizeOngoingBattle(nextQuestionState(nextBattleBase));
}
