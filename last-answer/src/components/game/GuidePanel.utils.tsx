import type { ReactNode } from "react";

export type GuideA11ySettings = {
  highContrast: boolean;
};

export type StoryGuideSection = {
  id: string;
  title: string;
  summary: string;
  blocks: Array<{
    heading: string;
    content: string;
  }>;
  notes: string[];
  growthTable?: Array<{
    stat: string;
    perLevel: string;
  }>;
};

export type ToolAssistType = "all" | "strong" | "standard";
export type ToolSortMode = "priceAsc" | "priceDesc" | "nameAsc" | "usesDesc";

export type GuideToolRow = {
  id: string;
  name: string;
  effect: string;
  type: "strong" | "standard";
  maxUses: number;
  price: number;
};

export type GlossaryEntry = {
  term: string;
  text: string;
  sectionCount: number;
  sectionIds: string[];
};

export type TrainingQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
};

type GlossaryTriggerHandlers = {
  onShowGlossary: (
    event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>,
    term: string,
  ) => void;
  onHideGlossary: () => void;
};

export type TrainingLogType = "system" | "correct" | "wrong" | "tool" | "heal";

export type TrainingLog = {
  id: number;
  type: TrainingLogType;
  text: string;
};

export type TrainingToolState = {
  analyze: number;
  hourglass: number;
  barrier: number;
  chainGuard: number;
};

export type TrainingToolId = keyof TrainingToolState;

export type TrainingRoundState = {
  playerHp: number;
  enemyHp: number;
  combo: number;
  bestCombo: number;
  questionIndex: number;
  turn: number;
  timeBudget: number;
  questionStartBudget: number;
  timerStarted: boolean;
  hasTakenDamage: boolean;
  answeredCount: number;
  correctCount: number;
  totalResponseMs: number;
  hiddenOptionIndexes: number[];
  barrierArmed: boolean;
  chainArmed: boolean;
  finished: boolean;
  logs: TrainingLog[];
};

export type TrainingGuideStep = {
  id: number;
  title: string;
  hint: string;
  done: boolean;
};

export const GUIDE_A11Y_STORAGE_KEY = "guide-a11y-settings-v1";
export const TRAINING_MAX_PLAYER_HP = 100;
export const TRAINING_MAX_ENEMY_HP = 120;
export const TRAINING_BASE_DAMAGE = 16;
export const TRAINING_ENEMY_DAMAGE = 12;
export const TRAINING_BASE_TIME = 12;
export const TRAINING_INITIAL_TOOLS: TrainingToolState = {
  analyze: 2,
  hourglass: 1,
  barrier: 1,
  chainGuard: 1,
};

type GuideSettingsStorage = Pick<Storage, "getItem" | "setItem">;

export function readGuideA11ySettings(
  storage: GuideSettingsStorage | null =
    typeof window === "undefined" ? null : window.localStorage,
): GuideA11ySettings {
  if (!storage) {
    return { highContrast: false };
  }

  try {
    const raw = storage.getItem(GUIDE_A11Y_STORAGE_KEY);
    if (!raw) {
      return { highContrast: false };
    }

    const parsed = JSON.parse(raw) as Partial<GuideA11ySettings>;
    return {
      highContrast: Boolean(parsed.highContrast),
    };
  } catch {
    return { highContrast: false };
  }
}

export function writeGuideA11ySettings(
  settings: GuideA11ySettings,
  storage: GuideSettingsStorage | null =
    typeof window === "undefined" ? null : window.localStorage,
) {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(GUIDE_A11Y_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage write failures.
  }
}

export function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightText(text: string, query: string): ReactNode {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return text;
  }

  const pattern = new RegExp(`(${escapeRegExp(cleanQuery)})`, "ig");
  const parts = text.split(pattern);

  return parts.map((part, index) =>
    pattern.test(part) ? (
      <mark
        key={`${part}-${index}`}
        className="rounded-sm bg-amber-300/55 px-[0.08rem] text-inherit"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

export function createTrainingInitialState(): TrainingRoundState {
  return {
    playerHp: 72,
    enemyHp: TRAINING_MAX_ENEMY_HP,
    combo: 0,
    bestCombo: 0,
    questionIndex: 0,
    turn: 1,
    timeBudget: TRAINING_BASE_TIME,
    questionStartBudget: TRAINING_BASE_TIME,
    timerStarted: false,
    hasTakenDamage: false,
    answeredCount: 0,
    correctCount: 0,
    totalResponseMs: 0,
    hiddenOptionIndexes: [],
    barrierArmed: false,
    chainArmed: false,
    finished: false,
    logs: [
      {
        id: 1,
        type: "system",
        text: "Training started: answer questions, build combo, and use tools before momentum breaks.",
      },
    ],
  };
}

export function nextLogId(logs: TrainingLog[]): number {
  return logs.length ? logs[logs.length - 1].id + 1 : 1;
}

export function pushTrainingLog(
  currentLogs: TrainingLog[],
  type: TrainingLogType,
  text: string,
): TrainingLog[] {
  const item: TrainingLog = { id: nextLogId(currentLogs), type, text };
  return [...currentLogs, item].slice(-8);
}

export function buildTrainingGuideSteps(
  state: TrainingRoundState,
  tools: TrainingToolState,
): TrainingGuideStep[] {
  const usedAnyTool =
    tools.analyze < 2 ||
    tools.hourglass < 1 ||
    tools.barrier < 1 ||
    tools.chainGuard < 1;
  const tookDamage = state.hasTakenDamage;
  const comboBuilt = state.combo >= 2;
  const healedBackToFull =
    state.playerHp === TRAINING_MAX_PLAYER_HP && state.hasTakenDamage;

  return [
    {
      id: 1,
      title: "Start The Timer",
      hint: "Click your first answer option to start the countdown.",
      done: state.timerStarted,
    },
    {
      id: 2,
      title: "Build Combo",
      hint: "Land consecutive correct answers to build momentum.",
      done: comboBuilt,
    },
    {
      id: 3,
      title: "Use A Support Tool",
      hint: "Trigger any one tool to see tactical intervention.",
      done: usedAnyTool,
    },
    {
      id: 4,
      title: "Handle Pressure",
      hint: "Experience timeout or a wrong answer and observe recovery flow.",
      done: tookDamage || state.logs.some((log) => log.text.includes("Timeout")),
    },
    {
      id: 5,
      title: "Recover HP",
      hint: "Use Deep Sleep to restore HP after pressure.",
      done: healedBackToFull,
    },
  ];
}

export function filterGuideSections(
  sections: StoryGuideSection[],
  query: string,
): StoryGuideSection[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return sections;
  }

  return sections.filter((section) => {
    const haystack = [
      section.title,
      section.summary,
      ...section.blocks.map((block) => `${block.heading} ${block.content}`),
      ...section.notes,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function filterAndSortGuideToolRows(
  toolRows: GuideToolRow[],
  toolTypeFilter: ToolAssistType,
  toolSortMode: ToolSortMode,
): GuideToolRow[] {
  const filtered = toolRows.filter((tool) =>
    toolTypeFilter === "all" ? true : tool.type === toolTypeFilter,
  );

  const sorted = [...filtered];
  sorted.sort((left, right) => {
    if (toolSortMode === "priceAsc") return left.price - right.price;
    if (toolSortMode === "priceDesc") return right.price - left.price;
    if (toolSortMode === "usesDesc") return right.maxUses - left.maxUses;
    return left.name.localeCompare(right.name);
  });

  return sorted;
}

export function buildGlossaryEntries(
  terms: string[],
  glossary: Record<string, string>,
  sections: StoryGuideSection[],
): GlossaryEntry[] {
  return terms.map((term) => {
    const termRegex = new RegExp(`\\b${escapeRegExp(term)}\\b`, "i");
    const sectionIds = sections
      .filter((section) => {
        const searchable = [
          section.title,
          section.summary,
          ...section.blocks.map((block) => `${block.heading} ${block.content}`),
          ...section.notes,
        ].join(" ");
        return termRegex.test(searchable);
      })
      .map((section) => section.id);

    return {
      term,
      text: glossary[term] ?? "",
      sectionCount: sectionIds.length,
      sectionIds,
    };
  });
}

export function filterGlossaryEntries(
  glossaryEntries: GlossaryEntry[],
  query: string,
): GlossaryEntry[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return glossaryEntries;
  }

  return glossaryEntries.filter((entry) => {
    return (
      entry.term.toLowerCase().includes(normalizedQuery) ||
      entry.text.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function resolveGlossaryDestinationSectionId(
  entry: GlossaryEntry,
  activeSectionId: string,
): string | undefined {
  return entry.sectionIds.includes(activeSectionId)
    ? activeSectionId
    : entry.sectionIds[0];
}

export function buildGlossaryTermPattern(terms: string[]): RegExp | null {
  if (!terms.length) {
    return null;
  }

  return new RegExp(
    `(${terms.map((term) => escapeRegExp(term)).join("|")})`,
    "gi",
  );
}

export function renderTextWithGlossary(
  text: string,
  query: string,
  glossaryTerms: string[],
  handlers: GlossaryTriggerHandlers,
): ReactNode {
  const termPattern = buildGlossaryTermPattern(glossaryTerms);
  if (!termPattern) {
    return highlightText(text, query);
  }

  const parts = text.split(termPattern);

  return parts.map((part, index) => {
    const matchedTerm = glossaryTerms.find(
      (term) => term.toLowerCase() === part.toLowerCase(),
    );
    if (!matchedTerm) {
      return <span key={`${part}-${index}`}>{highlightText(part, query)}</span>;
    }

    return (
      <button
        key={`${matchedTerm}-${index}`}
        type="button"
        tabIndex={0}
        className="rounded-sm border-b border-dashed border-[#8f6b41]/70 px-[0.05rem] font-semibold text-[#4a3725] transition-colors hover:text-[#2e2116] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8f6b41]/55"
        aria-label={`${matchedTerm}: glossary term`}
        onMouseEnter={(event) => handlers.onShowGlossary(event, matchedTerm)}
        onMouseLeave={handlers.onHideGlossary}
        onFocus={(event) => handlers.onShowGlossary(event, matchedTerm)}
        onBlur={handlers.onHideGlossary}
      >
        {highlightText(part, query)}
      </button>
    );
  });
}

export function resolveActiveGuideSection(
  filteredSections: StoryGuideSection[],
  activeGuideSectionId: string,
  allSections: StoryGuideSection[],
): StoryGuideSection {
  return (
    filteredSections.find((section) => section.id === activeGuideSectionId) ??
    filteredSections[0] ??
    allSections[0]
  );
}

export function getActiveGuideSectionIndex(
  filteredSections: StoryGuideSection[],
  activeSectionId: string,
): number {
  return filteredSections.findIndex((section) => section.id === activeSectionId);
}

export function getAdjacentGuideSections(
  filteredSections: StoryGuideSection[],
  activeIndex: number,
) {
  return {
    previousSection: activeIndex > 0 ? filteredSections[activeIndex - 1] : null,
    nextSection:
      activeIndex >= 0 && activeIndex < filteredSections.length - 1
        ? filteredSections[activeIndex + 1]
        : null,
  };
}

export function getWrappedGuideSectionIndex(
  activeIndex: number,
  totalSections: number,
  direction: 1 | -1,
): number {
  if (totalSections <= 0) {
    return -1;
  }

  const startIndex = activeIndex >= 0 ? activeIndex : 0;
  return (startIndex + direction + totalSections) % totalSections;
}

export function applyTrainingAnswerResult(
  current: TrainingRoundState,
  isCorrect: boolean,
  timedOut: boolean,
  questionCount: number,
): TrainingRoundState {
  let nextPlayerHp = current.playerHp;
  let nextEnemyHp = current.enemyHp;
  let nextCombo = current.combo;
  let nextBarrier = current.barrierArmed;
  let nextChain = current.chainArmed;
  let nextLogs = current.logs;
  const responseSeconds = timedOut
    ? current.questionStartBudget
    : Math.max(0, current.questionStartBudget - current.timeBudget);
  const responseMs = Math.round(responseSeconds * 1000);
  const nextAnsweredCount = current.answeredCount + 1;
  const nextCorrectCount = current.correctCount + (isCorrect ? 1 : 0);
  const nextTotalResponseMs = current.totalResponseMs + responseMs;

  if (isCorrect) {
    const damage = TRAINING_BASE_DAMAGE + Math.min(12, current.combo * 2);
    nextEnemyHp = Math.max(0, current.enemyHp - damage);
    nextCombo = current.combo + 1;
    nextLogs = pushTrainingLog(
      nextLogs,
      "correct",
      `Correct: dealt ${damage} damage. Combo increased to ${nextCombo}.`,
    );
  } else {
    const blockedByBarrier = current.barrierArmed;
    if (!blockedByBarrier) {
      nextPlayerHp = Math.max(0, current.playerHp - TRAINING_ENEMY_DAMAGE);
    }
    if (current.chainArmed) {
      nextChain = false;
      nextLogs = pushTrainingLog(
        nextLogs,
        "tool",
        "Oathbound Chain triggered: combo was preserved despite the mistake.",
      );
    } else {
      nextCombo = 0;
    }
    nextBarrier = false;
    nextLogs = pushTrainingLog(
      nextLogs,
      "wrong",
      timedOut
        ? blockedByBarrier
          ? "Timeout: Veil of Aegis blocked enemy counterattack."
          : `Timeout: enemy dealt ${TRAINING_ENEMY_DAMAGE} damage.`
        : blockedByBarrier
          ? "Wrong answer: Veil of Aegis blocked enemy counterattack."
          : `Wrong answer: enemy dealt ${TRAINING_ENEMY_DAMAGE} damage.`,
    );
  }

  const nextQuestionIndex = current.questionIndex + 1;
  const exhaustedQuestions = nextQuestionIndex >= questionCount;
  const isVictory = nextEnemyHp <= 0;
  const isDefeat = nextPlayerHp <= 0;
  const finished = isVictory || isDefeat || exhaustedQuestions;
  const resultText = isVictory
    ? "Training success: enemy defeated."
    : isDefeat
      ? "Training failed: player HP dropped to 0."
      : exhaustedQuestions
        ? "Training finished: all demo questions used."
        : "";

  if (resultText) {
    nextLogs = pushTrainingLog(nextLogs, "system", resultText);
  }

  return {
    ...current,
    playerHp: nextPlayerHp,
    enemyHp: nextEnemyHp,
    combo: nextCombo,
    bestCombo: Math.max(current.bestCombo, nextCombo),
    questionIndex: Math.min(nextQuestionIndex, questionCount - 1),
    turn: current.turn + 1,
    answeredCount: nextAnsweredCount,
    correctCount: nextCorrectCount,
    totalResponseMs: nextTotalResponseMs,
    hasTakenDamage: current.hasTakenDamage || nextPlayerHp < current.playerHp,
    hiddenOptionIndexes: [],
    barrierArmed: nextBarrier,
    chainArmed: nextChain,
    timeBudget: TRAINING_BASE_TIME,
    questionStartBudget: TRAINING_BASE_TIME,
    timerStarted: true,
    finished,
    logs: nextLogs,
  };
}

export function applyTrainingTimerTick(
  current: TrainingRoundState,
  questionCount: number,
): TrainingRoundState {
  if (current.finished || !current.timerStarted) {
    return current;
  }

  if (current.timeBudget > 1) {
    return {
      ...current,
      timeBudget: current.timeBudget - 1,
    };
  }

  return applyTrainingAnswerResult(current, false, true, questionCount);
}

export function applyTrainingHeal(current: TrainingRoundState): TrainingRoundState {
  const restored = TRAINING_MAX_PLAYER_HP - current.playerHp;
  if (restored <= 0) {
    return {
      ...current,
      logs: pushTrainingLog(
        current.logs,
        "heal",
        "Deep Sleep used: HP is already full.",
      ),
    };
  }

  return {
    ...current,
    playerHp: TRAINING_MAX_PLAYER_HP,
    logs: pushTrainingLog(
      current.logs,
      "heal",
      `Deep Sleep used: restored ${restored} HP to full.`,
    ),
  };
}

export function applyTrainingToolActivation(
  currentState: TrainingRoundState,
  currentTools: TrainingToolState,
  toolId: TrainingToolId,
  currentQuestion: TrainingQuestion,
): { state: TrainingRoundState; tools: TrainingToolState } {
  if (currentTools[toolId] <= 0) {
    return {
      state: {
        ...currentState,
        logs: pushTrainingLog(
          currentState.logs,
          "tool",
          "No remaining uses for this tool in training.",
        ),
      },
      tools: currentTools,
    };
  }

  const nextTools = {
    ...currentTools,
    [toolId]: currentTools[toolId] - 1,
  };
  const nextState = { ...currentState };

  if (toolId === "analyze") {
    const wrongIndexes = currentQuestion.options
      .map((_, index) => index)
      .filter((index) => index !== currentQuestion.correctIndex)
      .slice(0, 2);
    nextState.hiddenOptionIndexes = wrongIndexes;
    nextState.logs = pushTrainingLog(
      currentState.logs,
      "tool",
      "Scripture of Unmasking used: two wrong options are now hidden.",
    );
  }
  if (toolId === "hourglass") {
    nextState.timeBudget = currentState.timeBudget + 4;
    nextState.questionStartBudget = currentState.questionStartBudget + 4;
    nextState.logs = pushTrainingLog(
      currentState.logs,
      "tool",
      "Suspended Sand used: +4s added to this question timer.",
    );
  }
  if (toolId === "barrier") {
    nextState.barrierArmed = true;
    nextState.logs = pushTrainingLog(
      currentState.logs,
      "tool",
      "Veil of Aegis armed: next enemy counterattack will be blocked.",
    );
  }
  if (toolId === "chainGuard") {
    nextState.chainArmed = true;
    nextState.logs = pushTrainingLog(
      currentState.logs,
      "tool",
      "Oathbound Chain armed: next mistake will not break combo.",
    );
  }

  return {
    state: nextState,
    tools: nextTools,
  };
}
