import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  applyTrainingAnswerResult,
  applyTrainingHeal,
  applyTrainingTimerTick,
  applyTrainingToolActivation,
  buildGlossaryEntries,
  buildGlossaryTermPattern,
  buildTrainingGuideSteps,
  createTrainingInitialState,
  escapeRegExp,
  filterAndSortGuideToolRows,
  filterGlossaryEntries,
  filterGuideSections,
  getActiveGuideSectionIndex,
  getAdjacentGuideSections,
  getWrappedGuideSectionIndex,
  GUIDE_A11Y_STORAGE_KEY,
  highlightText,
  nextLogId,
  readGuideA11ySettings,
  renderTextWithGlossary,
  resolveGlossaryDestinationSectionId,
  resolveActiveGuideSection,
  TRAINING_BASE_TIME,
  TRAINING_ENEMY_DAMAGE,
  TRAINING_MAX_PLAYER_HP,
  writeGuideA11ySettings,
  type GlossaryEntry,
  type GuideToolRow,
  type StoryGuideSection,
  type TrainingQuestion,
  type TrainingRoundState,
  type TrainingToolState,
} from "./GuidePanel.utils";

function createStorageStub(initialValue: string | null = null) {
  let storedValue = initialValue;

  return {
    getItem: vi.fn(() => storedValue),
    setItem: vi.fn((key: string, value: string) => {
      if (key === GUIDE_A11Y_STORAGE_KEY) {
        storedValue = value;
      }
    }),
  };
}

function createTrainingState(
  overrides: Partial<TrainingRoundState> = {},
): TrainingRoundState {
  return {
    ...createTrainingInitialState(),
    ...overrides,
  };
}

function createTrainingTools(
  overrides: Partial<TrainingToolState> = {},
): TrainingToolState {
  return {
    analyze: 2,
    hourglass: 1,
    barrier: 1,
    chainGuard: 1,
    ...overrides,
  };
}

const guideSectionsFixture: StoryGuideSection[] = [
  {
    id: "gameplay",
    title: "Gameplay Basics",
    summary: "Learn combo flow and support tools.",
    blocks: [
      {
        heading: "Burst timing",
        content: "Build combo and control pace under pressure.",
      },
    ],
    notes: ["Default timer: 12s."],
  },
  {
    id: "world",
    title: "World & Conflict",
    summary: "The Great Silence broke old authority.",
    blocks: [
      {
        heading: "Monolith",
        content: "The Monolith stopped responding after the Great Silence.",
      },
    ],
    notes: ["Knowledge Fragments threaten both body and identity."],
  },
];

const toolRowsFixture: GuideToolRow[] = [
  {
    id: "hourglass",
    name: "Suspended Sand",
    effect: "Add 4 seconds.",
    type: "standard",
    maxUses: 1,
    price: 20,
  },
  {
    id: "analyze",
    name: "Scripture of Unmasking",
    effect: "Remove wrong answers.",
    type: "strong",
    maxUses: 2,
    price: 60,
  },
  {
    id: "barrier",
    name: "Veil of Aegis",
    effect: "Block the next counterattack.",
    type: "standard",
    maxUses: 1,
    price: 50,
  },
];

const glossaryFixture = {
  Monolith: "Former source of authority before the Silence.",
  Burst: "A momentum spike mechanic tied to strong runs.",
};

const trainingQuestionFixture: TrainingQuestion = {
  prompt: "Which faction prioritises immediate survival logic?",
  options: ["Seekers", "Hunters", "Imperial Officers", "Civilians"],
  correctIndex: 1,
};

describe("GuidePanel utils", () => {
  it("reads default accessibility settings when storage is unavailable", () => {
    expect(readGuideA11ySettings(null)).toEqual({ highContrast: false });
  });

  it("reads persisted accessibility settings from storage", () => {
    const storage = createStorageStub('{"highContrast":true}');

    expect(readGuideA11ySettings(storage)).toEqual({ highContrast: true });
    expect(storage.getItem).toHaveBeenCalledWith(GUIDE_A11Y_STORAGE_KEY);
  });

  it("falls back to default accessibility settings for malformed storage data", () => {
    const storage = createStorageStub("{not-json");

    expect(readGuideA11ySettings(storage)).toEqual({ highContrast: false });
  });

  it("writes accessibility settings using the guide storage key", () => {
    const storage = createStorageStub();

    writeGuideA11ySettings({ highContrast: true }, storage);

    expect(storage.setItem).toHaveBeenCalledWith(
      GUIDE_A11Y_STORAGE_KEY,
      JSON.stringify({ highContrast: true }),
    );
  });

  it("escapes regular expression metacharacters literally", () => {
    expect(escapeRegExp("combo+burst?")).toBe("combo\\+burst\\?");
  });

  it("highlights matching text segments case-insensitively", () => {
    const html = renderToStaticMarkup(
      <>{highlightText("Burst timing builds BURST control.", "burst")}</>,
    );

    expect(html).toContain("<mark");
    expect(html).toContain(">Burst<");
    expect(html).toContain(">BURST<");
  });

  it("builds a glossary term regex pattern ordered from the provided terms", () => {
    const pattern = buildGlossaryTermPattern(["Great Silence", "Monolith"]);

    expect(pattern?.source).toContain("Great Silence");
    expect(pattern?.source).toContain("Monolith");
    expect(buildGlossaryTermPattern([])).toBeNull();
  });

  it("treats special characters in the query as plain text during highlighting", () => {
    const html = renderToStaticMarkup(
      <>{highlightText("Use combo+burst to stabilise pace.", "combo+burst")}</>,
    );

    expect(html).toContain(">combo+burst<");
  });

  it("renders glossary terms as interactive buttons and preserves text highlighting elsewhere", () => {
    const html = renderToStaticMarkup(
      <>
        {renderTextWithGlossary(
          "The Monolith enables burst discipline.",
          "burst",
          ["Monolith", "Burst"],
          {
            onShowGlossary: vi.fn(),
            onHideGlossary: vi.fn(),
          },
        )}
      </>,
    );

    expect(html).toContain('aria-label="Monolith: glossary term"');
    expect(html).toContain("<button");
    expect(html).toContain("<mark");
    expect(html).toContain(">burst<");
  });

  it("falls back to plain highlighted text when there are no glossary terms", () => {
    const html = renderToStaticMarkup(
      <>{renderTextWithGlossary("Combo rhythm", "combo", [], {
        onShowGlossary: vi.fn(),
        onHideGlossary: vi.fn(),
      })}</>,
    );

    expect(html).not.toContain("<button");
    expect(html).toContain("<mark");
  });

  it("creates the expected training initial state", () => {
    const state = createTrainingInitialState();

    expect(state.playerHp).toBe(72);
    expect(state.enemyHp).toBe(120);
    expect(state.timerStarted).toBe(false);
    expect(state.logs).toHaveLength(1);
    expect(state.logs[0]).toMatchObject({
      id: 1,
      type: "system",
    });
  });

  it("computes the next log id from the last log entry", () => {
    expect(nextLogId([])).toBe(1);
    expect(
      nextLogId([
        { id: 2, type: "system", text: "start" },
        { id: 7, type: "tool", text: "used barrier" },
      ]),
    ).toBe(8);
  });

  it("marks no training guide steps as done at the beginning", () => {
    const steps = buildTrainingGuideSteps(
      createTrainingState(),
      createTrainingTools(),
    );

    expect(steps.map((step) => step.done)).toEqual([
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it("marks combo, tool use, pressure, and recovery when the round state shows them", () => {
    const steps = buildTrainingGuideSteps(
      createTrainingState({
        timerStarted: true,
        combo: 3,
        hasTakenDamage: true,
        playerHp: TRAINING_MAX_PLAYER_HP,
      }),
      createTrainingTools({ analyze: 1 }),
    );

    expect(steps.map((step) => step.done)).toEqual([
      true,
      true,
      true,
      true,
      true,
    ]);
  });

  it("treats timeout logs as pressure even if direct damage was blocked", () => {
    const steps = buildTrainingGuideSteps(
      createTrainingState({
        logs: [
          { id: 1, type: "system", text: "Training started." },
          { id: 2, type: "wrong", text: "Timeout: Veil of Aegis blocked enemy counterattack." },
        ],
      }),
      createTrainingTools(),
    );

    expect(steps[3]?.done).toBe(true);
    expect(steps[4]?.done).toBe(false);
  });

  it("filters guide sections by title, content, and notes", () => {
    expect(filterGuideSections(guideSectionsFixture, "combo")).toEqual([
      guideSectionsFixture[0],
    ]);
    expect(filterGuideSections(guideSectionsFixture, "knowledge fragments")).toEqual([
      guideSectionsFixture[1],
    ]);
  });

  it("returns all guide sections when the search query is empty", () => {
    expect(filterGuideSections(guideSectionsFixture, "   ")).toEqual(
      guideSectionsFixture,
    );
  });

  it("filters and sorts tool rows by price ascending", () => {
    const rows = filterAndSortGuideToolRows(
      toolRowsFixture,
      "all",
      "priceAsc",
    );

    expect(rows.map((row) => row.id)).toEqual([
      "hourglass",
      "barrier",
      "analyze",
    ]);
  });

  it("filters strong tool rows and sorts them by uses or name", () => {
    const usesSorted = filterAndSortGuideToolRows(
      toolRowsFixture,
      "strong",
      "usesDesc",
    );
    const nameSorted = filterAndSortGuideToolRows(
      toolRowsFixture,
      "all",
      "nameAsc",
    );

    expect(usesSorted.map((row) => row.id)).toEqual(["analyze"]);
    expect(nameSorted.map((row) => row.name)).toEqual([
      "Scripture of Unmasking",
      "Suspended Sand",
      "Veil of Aegis",
    ]);
  });

  it("builds glossary entries with the sections that mention each term", () => {
    const entries = buildGlossaryEntries(
      ["Monolith", "Burst"],
      glossaryFixture,
      guideSectionsFixture,
    );

    expect(entries).toEqual([
      {
        term: "Monolith",
        text: glossaryFixture.Monolith,
        sectionCount: 1,
        sectionIds: ["world"],
      },
      {
        term: "Burst",
        text: glossaryFixture.Burst,
        sectionCount: 1,
        sectionIds: ["gameplay"],
      },
    ]);
  });

  it("filters glossary entries by term or description text", () => {
    const entries: GlossaryEntry[] = [
      {
        term: "Monolith",
        text: "Former source of authority.",
        sectionCount: 1,
        sectionIds: ["world"],
      },
      {
        term: "Burst",
        text: "Rewards sustained accuracy.",
        sectionCount: 1,
        sectionIds: ["gameplay"],
      },
    ];

    expect(filterGlossaryEntries(entries, "mono")).toEqual([entries[0]]);
    expect(filterGlossaryEntries(entries, "accuracy")).toEqual([entries[1]]);
    expect(filterGlossaryEntries(entries, "")).toEqual(entries);
  });

  it("resolves glossary jump destination to the active section when possible", () => {
    const entry: GlossaryEntry = {
      term: "Monolith",
      text: "Former source of authority.",
      sectionCount: 2,
      sectionIds: ["world", "people"],
    };

    expect(resolveGlossaryDestinationSectionId(entry, "people")).toBe("people");
    expect(resolveGlossaryDestinationSectionId(entry, "gameplay")).toBe("world");
  });

  it("resolves the active guide section with filtered and fallback behavior", () => {
    expect(
      resolveActiveGuideSection(
        guideSectionsFixture,
        "world",
        guideSectionsFixture,
      ).id,
    ).toBe("world");

    expect(
      resolveActiveGuideSection(
        [guideSectionsFixture[1]],
        "missing",
        guideSectionsFixture,
      ).id,
    ).toBe("world");
  });

  it("computes active guide indices and adjacent sections", () => {
    const activeIndex = getActiveGuideSectionIndex(guideSectionsFixture, "world");
    const adjacent = getAdjacentGuideSections(guideSectionsFixture, activeIndex);

    expect(activeIndex).toBe(1);
    expect(adjacent.previousSection?.id).toBe("gameplay");
    expect(adjacent.nextSection).toBeNull();
  });

  it("wraps guide section navigation indices in both directions", () => {
    expect(getWrappedGuideSectionIndex(0, 2, -1)).toBe(1);
    expect(getWrappedGuideSectionIndex(1, 2, 1)).toBe(0);
    expect(getWrappedGuideSectionIndex(-1, 2, 1)).toBe(1);
    expect(getWrappedGuideSectionIndex(0, 0, 1)).toBe(-1);
  });

  it("applies correct training answers with combo growth and damage", () => {
    const next = applyTrainingAnswerResult(
      createTrainingState({
        combo: 2,
        timeBudget: 9,
        questionStartBudget: 12,
      }),
      true,
      false,
      4,
    );

    expect(next.enemyHp).toBe(100);
    expect(next.combo).toBe(3);
    expect(next.bestCombo).toBe(3);
    expect(next.correctCount).toBe(1);
    expect(next.answeredCount).toBe(1);
    expect(next.totalResponseMs).toBe(3000);
    expect(next.turn).toBe(2);
    expect(next.questionIndex).toBe(1);
    expect(next.logs.at(-1)?.text).toContain("Combo increased to 3");
  });

  it("resets combo and damages the player on a wrong answer", () => {
    const next = applyTrainingAnswerResult(
      createTrainingState({
        combo: 3,
        bestCombo: 3,
        playerHp: 50,
      }),
      false,
      false,
      4,
    );

    expect(next.playerHp).toBe(50 - TRAINING_ENEMY_DAMAGE);
    expect(next.combo).toBe(0);
    expect(next.bestCombo).toBe(3);
    expect(next.hasTakenDamage).toBe(true);
    expect(next.logs.at(-1)?.text).toBe(
      `Wrong answer: enemy dealt ${TRAINING_ENEMY_DAMAGE} damage.`,
    );
  });

  it("uses barrier and chain guard correctly on a mistake", () => {
    const next = applyTrainingAnswerResult(
      createTrainingState({
        combo: 4,
        bestCombo: 4,
        playerHp: 61,
        barrierArmed: true,
        chainArmed: true,
      }),
      false,
      false,
      4,
    );

    expect(next.playerHp).toBe(61);
    expect(next.combo).toBe(4);
    expect(next.barrierArmed).toBe(false);
    expect(next.chainArmed).toBe(false);
    expect(next.logs.map((log) => log.text)).toContain(
      "Oathbound Chain triggered: combo was preserved despite the mistake.",
    );
    expect(next.logs.at(-1)?.text).toBe(
      "Wrong answer: Veil of Aegis blocked enemy counterattack.",
    );
  });

  it("finishes the training when the last question is consumed", () => {
    const next = applyTrainingAnswerResult(
      createTrainingState({
        questionIndex: 2,
      }),
      true,
      false,
      3,
    );

    expect(next.finished).toBe(true);
    expect(next.questionIndex).toBe(2);
    expect(next.logs.at(-1)?.text).toBe(
      "Training finished: all demo questions used.",
    );
  });

  it("ticks the training timer down by one second while time remains", () => {
    const next = applyTrainingTimerTick(
      createTrainingState({
        timerStarted: true,
        timeBudget: 7,
      }),
      4,
    );

    expect(next.timeBudget).toBe(6);
    expect(next.logs).toHaveLength(1);
  });

  it("converts the final timer tick into a timeout result", () => {
    const next = applyTrainingTimerTick(
      createTrainingState({
        timerStarted: true,
        timeBudget: 1,
        questionStartBudget: TRAINING_BASE_TIME,
      }),
      4,
    );

    expect(next.answeredCount).toBe(1);
    expect(next.totalResponseMs).toBe(TRAINING_BASE_TIME * 1000);
    expect(next.logs.at(-1)?.text).toBe(
      `Timeout: enemy dealt ${TRAINING_ENEMY_DAMAGE} damage.`,
    );
  });

  it("logs when deep sleep is used at full HP", () => {
    const next = applyTrainingHeal(
      createTrainingState({
        playerHp: TRAINING_MAX_PLAYER_HP,
      }),
    );

    expect(next.playerHp).toBe(TRAINING_MAX_PLAYER_HP);
    expect(next.logs.at(-1)?.text).toBe("Deep Sleep used: HP is already full.");
  });

  it("restores HP to full when deep sleep is used after damage", () => {
    const next = applyTrainingHeal(
      createTrainingState({
        playerHp: 41,
      }),
    );

    expect(next.playerHp).toBe(TRAINING_MAX_PLAYER_HP);
    expect(next.logs.at(-1)?.text).toBe(
      `Deep Sleep used: restored ${TRAINING_MAX_PLAYER_HP - 41} HP to full.`,
    );
  });

  it("hides two wrong answers when analyze is activated", () => {
    const result = applyTrainingToolActivation(
      createTrainingState(),
      createTrainingTools(),
      "analyze",
      trainingQuestionFixture,
    );

    expect(result.tools.analyze).toBe(1);
    expect(result.state.hiddenOptionIndexes).toEqual([0, 2]);
    expect(result.state.logs.at(-1)?.text).toBe(
      "Scripture of Unmasking used: two wrong options are now hidden.",
    );
  });

  it("adds time and arms defensive tools when training tools are activated", () => {
    const hourglassResult = applyTrainingToolActivation(
      createTrainingState({
        timeBudget: 8,
        questionStartBudget: 8,
      }),
      createTrainingTools(),
      "hourglass",
      trainingQuestionFixture,
    );
    const barrierResult = applyTrainingToolActivation(
      createTrainingState(),
      createTrainingTools(),
      "barrier",
      trainingQuestionFixture,
    );
    const chainResult = applyTrainingToolActivation(
      createTrainingState(),
      createTrainingTools(),
      "chainGuard",
      trainingQuestionFixture,
    );

    expect(hourglassResult.tools.hourglass).toBe(0);
    expect(hourglassResult.state.timeBudget).toBe(12);
    expect(hourglassResult.state.questionStartBudget).toBe(12);
    expect(hourglassResult.state.logs.at(-1)?.text).toBe(
      "Suspended Sand used: +4s added to this question timer.",
    );

    expect(barrierResult.tools.barrier).toBe(0);
    expect(barrierResult.state.barrierArmed).toBe(true);
    expect(barrierResult.state.logs.at(-1)?.text).toBe(
      "Veil of Aegis armed: next enemy counterattack will be blocked.",
    );

    expect(chainResult.tools.chainGuard).toBe(0);
    expect(chainResult.state.chainArmed).toBe(true);
    expect(chainResult.state.logs.at(-1)?.text).toBe(
      "Oathbound Chain armed: next mistake will not break combo.",
    );
  });

  it("logs when a training tool has no remaining uses", () => {
    const result = applyTrainingToolActivation(
      createTrainingState(),
      createTrainingTools({ analyze: 0 }),
      "analyze",
      trainingQuestionFixture,
    );

    expect(result.tools.analyze).toBe(0);
    expect(result.state.logs.at(-1)?.text).toBe(
      "No remaining uses for this tool in training.",
    );
  });
});
