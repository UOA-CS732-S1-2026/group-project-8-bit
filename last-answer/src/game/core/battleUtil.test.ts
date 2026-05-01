import { afterEach, describe, expect, it, vi } from "vitest";

import {
  BOSS_TURN_LIMIT,
  QUESTION_TIME_LIMIT_MS,
  STANDARD_TURN_LIMIT,
} from "./battleCore";
import {
  createDemoEnemy,
  createPendingBurst,
  createSupportStateForPlayer,
  getCorrectAnswerIndex,
  getCurrentQuestion,
  getQuestionKey,
  getQuestionOptions,
  getQuestionPrompt,
  initializeBattleSession,
  nextQuestionState,
  pickBattleQuestions,
  preserveOrBreakCombo,
} from "./battleUtil";
import { defaultBattleQuestions } from "./questions";
import type { BattleSession, Enemy, Player, Question } from "./types";

function createQuestion(overrides: Partial<Question> = {}): Question {
  return {
    type: "multiple",
    difficulty: "easy",
    category: "Science: Computers",
    question: "Which data structure follows First-In, First-Out order?",
    correct_answer: "Queue",
    incorrect_answers: ["Stack", "Tree", "Graph"],
    ...overrides,
  };
}

function createPlayer(overrides: Partial<Player> = {}): Player {
  return {
    name: "Tester",
    level: 4,
    hp: 50,
    maxHp: 70,
    attack: 12,
    defense: 6,
    exp: 0,
    coins: 0,
    location: "mainHub",
    activeQuest: null,
    completedQuests: null,
    inventory: [],
    ...overrides,
  };
}

function createEnemy(overrides: Partial<Enemy> = {}): Enemy {
  return {
    id: "training-wisp",
    name: "Training Wisp",
    level: 4,
    tier: "normal",
    hp: 100,
    maxHp: 100,
    attack: 12,
    defense: 6,
    isBoss: false,
    ...overrides,
  };
}

function createBattle(overrides: Partial<BattleSession> = {}): BattleSession {
  return {
    ...initializeBattleSession(
      createEnemy(),
      [createQuestion(), createQuestion({ question: "Second question?" })],
      createPlayer(),
    ),
    ...overrides,
  };
}

function stubFetch(response: {
  ok: boolean;
  questions?: unknown;
  jsonRejects?: boolean;
}) {
  const fetchMock = vi.fn(async () => ({
    ok: response.ok,
    json: async () => {
      if (response.jsonRejects) {
        throw new Error("Invalid JSON");
      }

      return { questions: response.questions };
    },
  })) as unknown as typeof fetch;

  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("pickBattleQuestions", () => {
  it("returns no questions when the requested amount is not positive", async () => {
    await expect(
      pickBattleQuestions({
        amount: 0,
        category: null,
        difficulty: null,
        type: null,
      }),
    ).resolves.toEqual([]);
  });

  it("requests questions with selected filters and returns valid API questions", async () => {
    const apiQuestion = createQuestion({
      question: "What does CSS stand for?",
      correct_answer: "Cascading Style Sheets",
      incorrect_answers: [
        "Creative Style Sheets",
        "Computer Styled Syntax",
        "Colorful Sheet System",
      ],
    });
    const fetchMock = stubFetch({ ok: true, questions: [apiQuestion] });

    const questions = await pickBattleQuestions({
      amount: 1,
      category: "18",
      difficulty: "easy",
      type: "multiple",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/questions?amount=1&category=18&difficulty=easy&type=multiple",
    );
    expect(questions).toEqual([apiQuestion]);
  });

  it("falls back to default questions when the API response is not ok", async () => {
    stubFetch({ ok: false });

    const questions = await pickBattleQuestions({
      amount: 2,
      category: null,
      difficulty: null,
      type: null,
    });

    expect(questions).toHaveLength(2);
    expect(
      questions.every((question) =>
        defaultBattleQuestions.some(
          (defaultQuestion) => defaultQuestion.question === question.question,
        ),
      ),
    ).toBe(true);
  });

  it("falls back to default questions when the API returns no valid questions", async () => {
    stubFetch({
      ok: true,
      questions: [{ question: "Missing required fields" }],
    });

    const questions = await pickBattleQuestions({
      amount: 1,
      category: null,
      difficulty: null,
      type: null,
    });

    expect(questions).toHaveLength(1);
    expect(
      defaultBattleQuestions.some(
        (defaultQuestion) => defaultQuestion.question === questions[0]?.question,
      ),
    ).toBe(true);
  });

  it("falls back to default questions when fetch throws or JSON parsing fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("Network unavailable");
      }),
    );

    await expect(
      pickBattleQuestions({
        amount: 1,
        category: null,
        difficulty: null,
        type: null,
      }),
    ).resolves.toHaveLength(1);

    stubFetch({ ok: true, jsonRejects: true });

    await expect(
      pickBattleQuestions({
        amount: 1,
        category: null,
        difficulty: null,
        type: null,
      }),
    ).resolves.toHaveLength(1);
  });
});

describe("question helpers", () => {
  it("returns the question prompt and stable question key", () => {
    const question = createQuestion();

    expect(getQuestionPrompt(question)).toBe(question.question);
    expect(getQuestionKey(question)).toBe(question.question);
  });

  it("returns all answer options in a stable seeded order", () => {
    const question = createQuestion();
    const firstOptions = getQuestionOptions(question);
    const secondOptions = getQuestionOptions(question);

    expect(firstOptions).toEqual(secondOptions);
    expect(firstOptions).toHaveLength(4);
    expect(firstOptions).toEqual(
      expect.arrayContaining([
        question.correct_answer,
        ...question.incorrect_answers,
      ]),
    );
  });

  it("finds the correct answer index in the stable option list", () => {
    const question = createQuestion();
    const options = getQuestionOptions(question);

    expect(options[getCorrectAnswerIndex(question)]).toBe(
      question.correct_answer,
    );
  });
});

describe("support tool state", () => {
  it("creates support state from player inventory", () => {
    const state = createSupportStateForPlayer(
      createPlayer({
        inventory: [
          { id: "analyze", leftNumber: 1, price: 25 },
          { id: "hourglass", leftNumber: 1, price: 20 },
          { id: "barrier", leftNumber: 1, price: 20 },
          { id: "chainGuard", leftNumber: 1, price: 30 },
        ],
      }),
    );

    expect(state).toEqual({
      analyze: 1,
      hourglass: 1,
      barrier: 1,
      chainGuard: 1,
    });
  });

  it("caps support state at each tool max use", () => {
    const state = createSupportStateForPlayer(
      createPlayer({
        inventory: [
          { id: "analyze", leftNumber: 99, price: 25 },
          { id: "hourglass", leftNumber: 99, price: 20 },
          { id: "barrier", leftNumber: 99, price: 20 },
          { id: "chainGuard", leftNumber: 99, price: 30 },
        ],
      }),
    );

    expect(state).toEqual({
      analyze: 2,
      hourglass: 1,
      barrier: 1,
      chainGuard: 1,
    });
  });

  it("uses zero for support tools missing from inventory", () => {
    expect(createSupportStateForPlayer(createPlayer())).toEqual({
      analyze: 0,
      hourglass: 0,
      barrier: 0,
      chainGuard: 0,
    });
  });
});

describe("battle session helpers", () => {
  it("initializes a normal battle session with default question state", () => {
    const player = createPlayer({
      inventory: [{ id: "analyze", leftNumber: 2, price: 25 }],
    });
    const enemy = createEnemy();
    const questions = [createQuestion()];

    expect(initializeBattleSession(enemy, questions, player)).toMatchObject({
      enemy,
      questions,
      currentQuestionIndex: 0,
      turnLimit: STANDARD_TURN_LIMIT,
      turnsRemaining: STANDARD_TURN_LIMIT,
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
      supportTools: {
        analyze: 2,
        hourglass: 0,
        barrier: 0,
        chainGuard: 0,
      },
      status: "question",
      pendingBurst: null,
    });
  });

  it("initializes a boss battle with the boss turn limit", () => {
    const battle = initializeBattleSession(
      createEnemy({ isBoss: true, tier: "boss" }),
      [createQuestion()],
      createPlayer(),
    );

    expect(battle.turnLimit).toBe(BOSS_TURN_LIMIT);
    expect(battle.turnsRemaining).toBe(BOSS_TURN_LIMIT);
  });

  it("creates demo enemies from player level and boss flag", () => {
    const normalEnemy = createDemoEnemy(createPlayer({ level: 7 }), false);
    const bossEnemy = createDemoEnemy(createPlayer({ level: 7 }), true);

    expect(normalEnemy).toMatchObject({
      id: "forest-wisp",
      name: "Forest Wisp",
      level: 7,
      tier: "normal",
      isBoss: false,
    });
    expect(bossEnemy).toMatchObject({
      id: "forest-lord",
      name: "Forest Lord",
      level: 8,
      tier: "boss",
      isBoss: true,
    });
  });

  it("returns the current question or null when the index is out of range", () => {
    const battle = createBattle();

    expect(getCurrentQuestion(battle)).toBe(battle.questions[0]);
    expect(
      getCurrentQuestion(
        createBattle({
          currentQuestionIndex: 99,
        }),
      ),
    ).toBeNull();
  });

  it("advances to the next question and resets per-question state", () => {
    const nextBattle = nextQuestionState(
      createBattle({
        currentQuestionIndex: 0,
        turnLimit: 10,
        turnsUsed: 3,
        turnsRemaining: 9,
        timeLimitMs: 16_000,
        timeRemainingMs: 5_000,
        burstRemainingMs: 1_000,
        isTimerPaused: true,
        supportMenuOpen: true,
        eliminatedOptionIndices: [1, 2],
        toolUsedThisTurn: true,
        currentBurstClicks: 15,
        burstTimerStarted: true,
        burstResolving: true,
        status: "burst",
        pendingBurst: {
          questionId: "old-question",
          timeLeftMs: 5_000,
          timeLimitMs: 16_000,
          streak: 5,
        },
      }),
    );

    expect(nextBattle).toMatchObject({
      currentQuestionIndex: 1,
      turnsRemaining: 7,
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
    });
  });

  it("does not allow turns remaining to drop below zero when advancing", () => {
    const nextBattle = nextQuestionState(
      createBattle({
        turnLimit: 3,
        turnsUsed: 8,
      }),
    );

    expect(nextBattle.turnsRemaining).toBe(0);
  });

  it("breaks combo unless chain guard is active", () => {
    expect(
      preserveOrBreakCombo(
        createBattle({ correctStreak: 4, chainGuardActive: false }),
      ),
    ).toEqual({
      correctStreak: 0,
      chainGuardActive: false,
    });

    expect(
      preserveOrBreakCombo(
        createBattle({ correctStreak: 4, chainGuardActive: true }),
      ),
    ).toEqual({
      correctStreak: 4,
      chainGuardActive: false,
    });
  });

  it("creates pending burst details for the current question", () => {
    const battle = createBattle({
      timeRemainingMs: 8_000,
      timeLimitMs: 12_000,
    });

    expect(createPendingBurst(battle, 5)).toEqual({
      questionId: getQuestionKey(battle.questions[0]),
      timeLeftMs: 8_000,
      timeLimitMs: 12_000,
      streak: 5,
    });
  });

  it("returns null pending burst when there is no current question", () => {
    expect(
      createPendingBurst(createBattle({ currentQuestionIndex: 99 }), 5),
    ).toBeNull();
  });
});
