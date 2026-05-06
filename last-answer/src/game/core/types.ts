import type { EnemyTier } from "./level";
import type { categoryKey, Difficulty, QuestionType } from "@/store/game-store";

export type QuestId = string;

export type Player = {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  exp: number;
  coins: number;
  location: string | "mainHub";
  activeQuest: Quest[] | null;
  completedQuests: Quest[] | null;
  inventory: Property[];
};

export type Property = {
  id: SupportToolId;
  leftNumber: number;
  price: number;
};
export type BattleStatus = "idle" | "question" | "burst" | "won" | "lost";
export type SupportToolId = "analyze" | "hourglass" | "barrier" | "chainGuard";

export type Question = {
  type: QuestionType;
  difficulty: Difficulty;
  category: categoryKey;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type Enemy = {
  id: string;
  name: string;
  level: number;
  tier: EnemyTier;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  isBoss: boolean;
  portraitPath?: string;
  imagePath?: string;
  artPreset?: "default" | "page" | "andrew" | "darkside";
};

export type BattleSupportState = Record<SupportToolId, number>;

export type PendingBurst = {
  questionId: string;
  timeLeftMs: number;
  timeLimitMs: number;
  streak: number;
};

export type AssistBreakdown = {
  standardUses: number;
  strongUses: number;
};

export type BattleReward = {
  enemyId: string;
  enemyName: string;
  baseXp: number;
  finalXp: number;
  baseCoins: number;
  finalCoins: number;
  bestCombo: number;
  avgAnswerTimeMs: number;
  burstClicks: number;
  assistBreakdown: AssistBreakdown;
};

export type BattleSession = {
  enemy: Enemy;
  questions: Question[];
  currentQuestionIndex: number;
  turnLimit: number;
  turnsRemaining: number;
  turnsUsed: number;
  timeLimitMs: number;
  timeRemainingMs: number;
  burstRemainingMs: number;
  isTimerPaused: boolean;
  supportMenuOpen: boolean;
  correctStreak: number;
  bestCombo: number;
  correctAnswers: number;
  answerTimesMs: number[];
  speedRatios: number[];
  assistUses: number;
  strongAssistUses: number;
  burstClicks: number;
  currentBurstClicks: number;
  burstUsesThisBattle: number;
  burstTimerStarted: boolean;
  burstResolving: boolean;
  barrierActive: boolean;
  chainGuardActive: boolean;
  eliminatedOptionIndices: number[];
  toolUsedThisTurn: boolean;
  supportTools: BattleSupportState;
  status: BattleStatus;
  pendingBurst: PendingBurst | null;
};

export type BattleCompletionResult = {
  outcome: Extract<BattleStatus, "won" | "lost">;
  reward: BattleReward | null;
};

export type BattleOutcome = Extract<BattleStatus, "won" | "lost">;

export type BattleTransitionResult = {
  battle: BattleSession;
  enemyDamage: number;
  completion: BattleCompletionResult | null;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
};
