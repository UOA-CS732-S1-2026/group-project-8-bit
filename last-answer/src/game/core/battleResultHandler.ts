import { calculateBattleReward } from "./battleCore";
import type {
  BattleCompletionResult,
  BattleReward,
  BattleSession,
  Player,
} from "./types";

type BattleRewardSink = {
  grantBattleRewards: (reward: BattleReward) => void;
};

// A finished winning battle is translated into a reward payload here, not in the UI.
export function finalizeVictory(
  battle: BattleSession,
  player: Player,
): BattleCompletionResult {
  return {
    outcome: "won",
    reward: calculateBattleReward({
      player,
      enemy: battle.enemy,
      turnsUsed: battle.turnsUsed,
      correctAnswers: battle.correctAnswers,
      answerTimesMs: battle.answerTimesMs,
      speedRatios: battle.speedRatios,
      assistUses: battle.assistUses,
      strongAssistUses: battle.strongAssistUses,
      bestCombo: battle.bestCombo,
      burstClicks: battle.burstClicks,
    }),
  };
}

export function finalizeDefeat(): BattleCompletionResult {
  return {
    outcome: "lost",
    reward: null,
  };
}

// Reward application is intentionally separate so battle resolution can stay testable.
export function applyBattleCompletion(
  rewardSink: BattleRewardSink,
  completion: BattleCompletionResult | null,
): void {
  if (completion?.outcome === "won" && completion.reward) {
    rewardSink.grantBattleRewards(completion.reward);
  }
}
