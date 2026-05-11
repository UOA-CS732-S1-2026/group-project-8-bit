"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supportToolConfigs } from "@/game/core/battleCore";
import type { SupportToolId } from "@/game/core/types";
import { defaultPlayer } from "@/lib/player";
import {
  applyTrainingAnswerResult,
  applyTrainingHeal,
  applyTrainingTimerTick,
  applyTrainingToolActivation,
  getActiveGuideSectionIndex,
  getAdjacentGuideSections,
  getWrappedGuideSectionIndex,
  renderTextWithGlossary,
  resolveActiveGuideSection,
  buildGlossaryEntries,
  buildTrainingGuideSteps,
  createTrainingInitialState,
  filterAndSortGuideToolRows,
  filterGlossaryEntries,
  filterGuideSections,
  highlightText,
  readGuideA11ySettings,
  resolveGlossaryDestinationSectionId,
  TRAINING_INITIAL_TOOLS,
  TRAINING_MAX_ENEMY_HP,
  TRAINING_MAX_PLAYER_HP,
  type GlossaryEntry,
  type GuideToolRow,
  type StoryGuideSection,
  type ToolAssistType,
  type ToolSortMode,
  type TrainingQuestion,
  type TrainingToolId,
  type TrainingRoundState,
  type TrainingToolState,
  writeGuideA11ySettings,
} from "./GuidePanel.utils";
import ModalPortal from "./ModalPortal";
import { useModalCloseAnimation } from "./useModalCloseAnimation";

type TrainingToolUsage = {
  analyze: number;
  hourglass: number;
  barrier: number;
  chainGuard: number;
};

type GuidePanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

const STORY_GUIDE_SECTIONS: StoryGuideSection[] = [
  {
    id: "gameplay",
    title: "Gameplay Basics",
    summary: "How to fight, use tools, recover HP, and grow your character.",
    blocks: [
      {
        heading: "How Combat Works",
        content:
          "Battles are question-driven and tempo-sensitive. Correct answers damage enemies immediately, while mistakes or timeouts create pressure and open windows for enemy counterplay. In practical terms, every decision is a tradeoff between speed and certainty. Standard battles run on 10-turn limits, while boss battles extend to 20 turns to test endurance, consistency, and emotional control under longer pressure cycles.",
      },
      {
        heading: "Timing and Burst",
        content:
          "Each question starts with a 12-second timer, so pacing is not cosmetic; it is core combat structure. Building streaks raises both risk and reward, because sustained accuracy feeds momentum and stronger outcomes. Burst opportunities appear on streak milestones and reward controlled execution, but over-forcing speed often backfires. The strongest runs usually come from stable rhythm rather than panic clicking.",
      },
      {
        heading: "How To Recover HP",
        content:
          "In tavern mode, choosing deep sleep restores HP directly to full. This is an explicit full-heal action from the player system, not passive regeneration, and it should be treated as strategic downtime between high-pressure encounters. If your HP is trending low after chained fights, resetting in tavern can preserve long-term progression better than gambling one more run while weakened.",
      },
      {
        heading: "When To Use Support Tools",
        content:
          "Use tools proactively before momentum breaks. Their role is stabilization: preventing combo loss, mitigating mistakes, and extending answer windows under pressure. Waiting until a collapse is already in progress often wastes their value. Good tool usage is preventive, not reactive: secure the run early, then convert stability into efficient damage and cleaner rewards.",
      },
      {
        heading: "Arcade Mode (Quick Sessions)",
        content:
          "Arcade mode focuses on direct battle loops for fast practice and progression. Use it when you want to train answer speed, combo control, and support-tool timing without story dialogue phases. It is the best place to stress-test execution habits, then bring those habits back into story mode where narrative decisions and resource management add extra complexity.",
      },
      {
        heading: "Rookie Training (Guide Simulator)",
        content:
          "Inside this Guide, Rookie Training provides a safe simulated round to rehearse answer flow, combo handling, tool timing, timeout response, and HP recovery without touching real battle records. Use it as a pre-combat warm-up to understand sequence and pressure before entering actual encounters.",
      },
    ],
    notes: [
      "Standard turn limit: 10.",
      "Boss turn limit: 20.",
      "Default question timer: 12s.",
      "Hourglass bonus: +4s.",
      "Deep Sleep in tavern restores HP to max.",
    ],
    growthTable: [
      { stat: "Max HP", perLevel: "+10" },
      { stat: "Attack", perLevel: "+2" },
      { stat: "Defense", perLevel: "+1" },
    ],
  },
  {
    id: "world",
    title: "World & Conflict",
    summary: "The world is caught between political fracture and the Great Silence.",
    blocks: [
      {
        heading: "Before the Silence",
        content:
          "For generations, social order leaned on the Monolith's authority. Law, ritual, and political legitimacy all felt anchored to a voice that always answered. Institutions were not merely governed by force; they were justified by certainty. That certainty made obedience seem natural, and dissent seem not only dangerous, but pointless.",
      },
      {
        heading: "The Break",
        content:
          "Then the Great Silence arrived. Guidance vanished, and certainty collapsed into rumor, fear, and competing claims of truth. Communities that had never learned to operate without a final authority were suddenly forced to improvise moral and political frameworks in real time. The resulting vacuum did not stay empty for long; it was filled by competing factions, survival ideologies, and escalating distrust.",
      },
      {
        heading: "Fragments as Existential Threat",
        content:
          "Knowledge Fragments do not merely kill. They erode memory, judgment, and identity, turning survival into a battle over what remains of the self. This is why encounters feel psychological as well as physical: losing control in combat is framed as losing narrative continuity, not just HP. The threat is not only death, but becoming unrecognizable to yourself.",
      },
      {
        heading: "The Current Divide",
        content:
          "The conflict is ideological as much as military: restore order through control, or accept risk to preserve human agency. In practice, most factions mix both instincts, but with different moral priorities. This tension drives the game's political tone and explains why even allied voices can disagree on method while still claiming to serve the same future.",
      },
    ],
    notes: [
      "The Monolith no longer gives clear guidance.",
      "Knowledge Fragments are increasing in dangerous regions.",
      "Stability and freedom are now in open tension.",
      "Public trust shifts between fear of chaos and fear of authority.",
    ],
  },
  {
    id: "people",
    title: "People & Factions",
    summary: "Allied voices disagree on methods, priorities, and truth.",
    blocks: [
      {
        heading: "Andrew",
        content:
          "Andrew is both guide and gatekeeper. His advice reflects painful realism: in a city of spies and divided loyalties, information can be deadlier than steel. He does not only provide quests; he frames how the player interprets risk, trust, and timing. His role is deliberately ambiguous, which makes him central to both tactical planning and narrative interpretation.",
      },
      {
        heading: "Seekers and Hunters",
        content:
          "Seekers carry institutional duty under strain; Hunters operate with practical survival logic. Both face the same danger, but not the same priorities. Seekers value continuity and structure, while Hunters value immediacy and adaptability. Their differences are less about courage and more about which failures they fear most.",
      },
      {
        heading: "Imperial Officers",
        content:
          "Officers focus on Ashes recovery and strategic containment. Their framework is logistical, often at odds with local human cost.",
      },
      {
        heading: "Civilians and Memory",
        content:
          "Public opinion is fractured. Some miss old stability, others remember old oppression. The same event can produce opposite moral conclusions.",
      },
    ],
    notes: [
      "Andrew acts as strategist and storyteller.",
      "Seekers represent institutional duty under strain.",
      "Hunters prioritize survival and practical outcomes.",
      "The same event is interpreted differently by each faction.",
    ],
  },
  {
    id: "progression",
    title: "Progression Path",
    summary: "Story mode advances through tavern leads, field encounters, and quest thresholds.",
    blocks: [
      {
        heading: "Hub to Field",
        content:
          "The tavern is your narrative hub. Dialogue there establishes motive, then pushes the player into forest and cave escalation. This rhythm is intentional: information first, commitment second. By the time you leave the hub, you should understand not only what to do, but why the next objective matters inside the wider conflict.",
      },
      {
        heading: "Escalation Pattern",
        content:
          "Story mode alternates information and pressure: discovery through dialogue, then consequence through encounters and combat. The design loop trains players to convert narrative context into tactical behavior. In other words, story scenes are not passive lore dumps; they are strategic briefings disguised as character moments.",
      },
      {
        heading: "Threshold Design",
        content:
          "Level gates and quest completion states ensure major reveals and risks happen when the player has enough context and capability.",
      },
      {
        heading: "Late-Game Commitment",
        content:
          "Final phases are built around irreversible choice. The question becomes not only whether you can win, but what outcome you endorse.",
      },
    ],
    notes: [
      "Level 5 unlocks deeper story discussions.",
      "Level 10 is required before high-risk quest escalation.",
      "Level 20 + Page quest completion opens the final challenge path.",
      "Major route decisions appear during the final sequence.",
    ],
  },
  {
    id: "combat",
    title: "Combat & Tools",
    summary: "Battle performance depends on timing, combo discipline, and support tool usage.",
    blocks: [
      {
        heading: "Tempo Over Panic",
        content:
          "Combat rewards consistency. Correct-answer speed, combo continuity, and burst timing all feed damage and reward multipliers. The system quietly punishes emotional overreaction: rushed guesses break rhythm, broken rhythm reduces pressure output, and reduced pressure lengthens fights. Stable fundamentals outperform flashy but inconsistent play.",
      },
      {
        heading: "Boss Pressure",
        content:
          "Boss fights punish impatience. Preserving rhythm is often stronger than chasing risky burst windows under stress.",
      },
      {
        heading: "Support Philosophy",
        content:
          "Support tools are tactical insurance. Their highest value appears when used to prevent collapse, not after collapse. A well-timed tool keeps your run coherent by protecting combo, time budget, and mental composure. Think of them as structure-preserving actions that protect your best state, rather than emergency buttons you press when everything is already failing.",
      },
      {
        heading: "Efficiency Tradeoff",
        content:
          "Heavy assist usage can improve short-term survival but reduce reward efficiency, so strategic restraint matters.",
      },
    ],
    notes: [
      "Strong-assist usage trades short-term safety for lower reward efficiency.",
      "Tool timing is usually more important than tool quantity.",
    ],
  },
  {
    id: "ashes",
    title: "Ashes & Monolith",
    summary: "Ashes of Knowledge are strategic resources and narrative catalysts.",
    blocks: [
      {
        heading: "Material and Meaning",
        content:
          "Ashes are not treated as common remains. They are controlled, measured, and contested because they carry strategic power. Whoever governs Ashes influences military leverage, political bargaining, and public fear. That is why Ashes-related incidents immediately escalate from local problems to faction-level crises.",
      },
      {
        heading: "The Page Incident",
        content:
          "Page's theft transformed a logistics problem into a political emergency, suggesting the stolen stock threatens far more than inventory.",
      },
      {
        heading: "Power Through Control",
        content:
          "Control of Ashes shapes military capability, bargaining leverage, and public fear. Their trail drives the central mid-game arc.",
      },
    ],
    notes: [
      "Ashes influence both economy and security.",
      "Major thefts trigger rapid escalation.",
      "Ashes are tied to larger Monolith-era contradictions.",
    ],
  },
  {
    id: "endings",
    title: "Endings & Consequence",
    summary: "Final choices frame the moral meaning of victory.",
    blocks: [
      {
        heading: "Choice Architecture",
        content:
          "Late-game branches are ideological commitments, not cosmetic variants. Your stance determines both route and interpretation, and each route asks what kind of order is acceptable after systemic collapse. The ending is designed as a moral answer, not just a victory screen.",
      },
      {
        heading: "Agreement Route",
        content:
          "One path prioritizes a specific vision of restored order through cooperation with Andrew's strategic judgment.",
      },
      {
        heading: "Refusal Route",
        content:
          "The opposing path escalates into direct confrontation and a different reckoning with truth, cost, and aftermath.",
      },
    ],
    notes: [
      "Endings represent competing answers to the same crisis.",
      "Battle outcomes and choice outcomes reinforce each other.",
      "The final question is what kind of world is worth saving.",
    ],
  },
];

const STORY_SECTION_ICON: Record<string, string> = {
  gameplay: "✢",
  world: "✧",
  people: "🛡",
  progression: "🜃",
  combat: "⚔",
  ashes: "⬟",
  endings: "✦",
};

const GLOSSARY: Record<string, string> = {
  Monolith:
    "The former source of authority and guidance in the world before the Great Silence.",
  "Great Silence":
    "The turning point when the Monolith stopped responding, triggering social and political collapse.",
  "Knowledge Fragments":
    "Hostile anomalies tied to both physical danger and identity erosion.",
  Ashes:
    "Strategic residue/resource tied to conflict escalation and faction power.",
  Burst:
    "A momentum spike mechanic that rewards sustained accuracy and timing.",
  combo:
    "Consecutive correct answers that increase pressure, damage, and reward efficiency.",
  Seeker:
    "A duty-driven faction aligned with institutional structure and order.",
  Hunter:
    "A practical survival-oriented faction focused on outcomes in dangerous zones.",
};

const GLOSSARY_TERMS = Object.keys(GLOSSARY).sort(
  (left, right) => right.length - left.length,
);

const TRAINING_QUESTIONS: TrainingQuestion[] = [
  {
    prompt: "Which support tool removes two wrong answers?",
    options: [
      "Suspended Sand",
      "Scripture of Unmasking",
      "Veil of Aegis",
      "Oathbound Chain",
    ],
    correctIndex: 1,
  },
  {
    prompt: "In this project, what is the default question timer?",
    options: ["8 seconds", "10 seconds", "12 seconds", "15 seconds"],
    correctIndex: 2,
  },
  {
    prompt: "Which action restores HP to full in tavern flow?",
    options: ["Drink ale", "Deep Sleep", "Talk to Andrew", "Open Menu"],
    correctIndex: 1,
  },
  {
    prompt: "What does Oathbound Chain protect?",
    options: [
      "Coin rewards",
      "Question timer",
      "Combo continuity",
      "Enemy armor",
    ],
    correctIndex: 2,
  },
  {
    prompt: "What does Veil of Aegis block?",
    options: [
      "Next enemy counterattack",
      "All future damage",
      "Boss phases",
      "Turn limit",
    ],
    correctIndex: 0,
  },
];

export default function GuidePanel({ isOpen, onClose }: GuidePanelProps) {
  const initialA11ySettings = readGuideA11ySettings();
  const [storyGuideQuery, setStoryGuideQuery] = useState("");
  const [activeGuideSectionId, setActiveGuideSectionId] = useState(
    STORY_GUIDE_SECTIONS[0].id,
  );
  const [toolTypeFilter, setToolTypeFilter] = useState<ToolAssistType>("all");
  const [toolSortMode, setToolSortMode] = useState<ToolSortMode>("priceAsc");
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [trainingState, setTrainingState] = useState<TrainingRoundState>(
    createTrainingInitialState(),
  );
  const [trainingTools, setTrainingTools] = useState<TrainingToolState>(
    TRAINING_INITIAL_TOOLS,
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(
    initialA11ySettings.highContrast,
  );
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const { isClosing, requestClose } = useModalCloseAnimation(onClose);
  const [glossaryTooltip, setGlossaryTooltip] = useState<{
    term: string;
    text: string;
    left: number;
    top: number;
    placeAbove: boolean;
  } | null>(null);
  const resetGuideEphemeralState = useCallback(() => {
    setStoryGuideQuery("");
    setGlossaryQuery("");
    setIsGlossaryOpen(false);
    setIsMobileNavOpen(false);
    setGlossaryTooltip(null);
    setToolTypeFilter("all");
    setToolSortMode("priceAsc");
  }, []);
  const closeGuide = useCallback(() => {
    resetGuideEphemeralState();
    requestClose();
  }, [requestClose, resetGuideEphemeralState]);

  const showGlossaryTooltip = (
    event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>,
    term: string,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipWidth = 224;
    const margin = 12;
    const centerX = rect.left + rect.width / 2;
    const left = Math.max(
      tooltipWidth / 2 + margin,
      Math.min(window.innerWidth - tooltipWidth / 2 - margin, centerX),
    );
    const estimatedHeight = 88;
    const placeAbove = rect.bottom + estimatedHeight > window.innerHeight - margin;
    const top = placeAbove ? rect.top - 8 : rect.bottom + 8;

    setGlossaryTooltip({
      term,
      text: GLOSSARY[term],
      left,
      top,
      placeAbove,
    });
  };

  const hideGlossaryTooltip = () => {
    setGlossaryTooltip(null);
  };
  const selectSection = (sectionId: string) => {
    setActiveGuideSectionId(sectionId);
    setIsMobileNavOpen(false);
  };

  const filteredGuideSections = useMemo(() => {
    return filterGuideSections(STORY_GUIDE_SECTIONS, storyGuideQuery);
  }, [storyGuideQuery]);

  const activeGuideSection = resolveActiveGuideSection(
    filteredGuideSections,
    activeGuideSectionId,
    STORY_GUIDE_SECTIONS,
  );
  const activeGuideSectionResolvedId = activeGuideSection.id;
  const activeIndex = getActiveGuideSectionIndex(
    filteredGuideSections,
    activeGuideSectionResolvedId,
  );

  const toolPriceById = useMemo(() => {
    return new Map(defaultPlayer.inventory.map((entry) => [entry.id, entry.price]));
  }, []);

  const baseToolRows = useMemo<GuideToolRow[]>(() => {
    return (Object.values(supportToolConfigs) as Array<(typeof supportToolConfigs)[SupportToolId]>).map(
      (tool) => ({
        id: tool.id,
        name: tool.name,
        effect: tool.description,
        type: tool.strongAssist ? "strong" : "standard",
        maxUses: tool.maxUses,
        price: toolPriceById.get(tool.id) ?? 0,
      }),
    );
  }, [toolPriceById]);

  const visibleToolRows = useMemo(() => {
    return filterAndSortGuideToolRows(
      baseToolRows,
      toolTypeFilter,
      toolSortMode,
    );
  }, [baseToolRows, toolSortMode, toolTypeFilter]);

  const glossaryEntries = useMemo<GlossaryEntry[]>(() => {
    return buildGlossaryEntries(
      GLOSSARY_TERMS,
      GLOSSARY,
      STORY_GUIDE_SECTIONS,
    );
  }, []);

  const filteredGlossaryEntries = useMemo(() => {
    return filterGlossaryEntries(glossaryEntries, glossaryQuery);
  }, [glossaryEntries, glossaryQuery]);

  const jumpToGlossaryTerm = (entry: GlossaryEntry) => {
    const destinationSectionId = resolveGlossaryDestinationSectionId(
      entry,
      activeGuideSectionResolvedId,
    );

    if (destinationSectionId) {
      selectSection(destinationSectionId);
    }
    setStoryGuideQuery(entry.term);
    setIsGlossaryOpen(false);
    contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentTrainingQuestion =
    TRAINING_QUESTIONS[
      Math.min(trainingState.questionIndex, TRAINING_QUESTIONS.length - 1)
    ];
  const trainingToolUsage: TrainingToolUsage = {
    analyze: 2 - trainingTools.analyze,
    hourglass: 1 - trainingTools.hourglass,
    barrier: 1 - trainingTools.barrier,
    chainGuard: 1 - trainingTools.chainGuard,
  };
  const totalToolUses =
    trainingToolUsage.analyze +
    trainingToolUsage.hourglass +
    trainingToolUsage.barrier +
    trainingToolUsage.chainGuard;
  const accuracy =
    trainingState.answeredCount > 0
      ? Math.round((trainingState.correctCount / trainingState.answeredCount) * 100)
      : 0;
  const avgResponseMs =
    trainingState.answeredCount > 0
      ? Math.round(trainingState.totalResponseMs / trainingState.answeredCount)
      : 0;
  const avgResponseSec = (avgResponseMs / 1000).toFixed(1);
  const timerBarMax = Math.max(trainingState.questionStartBudget, 1);
  const trainingGuideSteps = useMemo(
    () => buildTrainingGuideSteps(trainingState, trainingTools),
    [trainingState, trainingTools],
  );
  const activeTrainingGuideStep =
    trainingGuideSteps.find((step) => !step.done) ??
    trainingGuideSteps[trainingGuideSteps.length - 1];
  const completedGuideSteps = trainingGuideSteps.filter((step) => step.done).length;
  const trainingGuideProgress = Math.round(
    (completedGuideSteps / trainingGuideSteps.length) * 100,
  );

  const resetTraining = () => {
    setTrainingState(createTrainingInitialState());
    setTrainingTools(TRAINING_INITIAL_TOOLS);
  };

  const applyTrainingResult = (isCorrect: boolean, timedOut: boolean) => {
    setTrainingState((current) => {
      if (current.finished || !currentTrainingQuestion) {
        return current;
      }
      return applyTrainingAnswerResult(
        current,
        isCorrect,
        timedOut,
        TRAINING_QUESTIONS.length,
      );
    });
  };

  const answerTrainingQuestion = (optionIndex: number) => {
    if (!currentTrainingQuestion || trainingState.finished) {
      return;
    }
    if (!trainingState.timerStarted) {
      setTrainingState((current) => ({
        ...current,
        timerStarted: true,
      }));
    }
    const isCorrect = optionIndex === currentTrainingQuestion.correctIndex;
    applyTrainingResult(isCorrect, false);
  };

  const timeoutTrainingQuestion = () => {
    if (trainingState.finished) {
      return;
    }
    applyTrainingResult(false, true);
  };

  useEffect(() => {
    if (!isTrainingOpen || trainingState.finished || !trainingState.timerStarted) {
      return;
    }

    const timer = window.setTimeout(() => {
      setTrainingState((current) => {
        if (!isTrainingOpen || current.finished || !current.timerStarted) {
          return current;
        }
        return applyTrainingTimerTick(current, TRAINING_QUESTIONS.length);
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [
    isTrainingOpen,
    trainingState.finished,
    trainingState.timeBudget,
    trainingState.timerStarted,
  ]);

  const healInTraining = () => {
    setTrainingState((current) => applyTrainingHeal(current));
  };

  const activateTrainingTool = (toolId: TrainingToolId) => {
    if (trainingState.finished || !currentTrainingQuestion) {
      return;
    }
    setTrainingTools((currentTools) => {
      setTrainingState((currentState) => {
        return applyTrainingToolActivation(
          currentState,
          currentTools,
          toolId,
          currentTrainingQuestion,
        ).state;
      });
      return applyTrainingToolActivation(
        trainingState,
        currentTools,
        toolId,
        currentTrainingQuestion,
      ).tools;
    });
  };

  const { previousSection, nextSection } = getAdjacentGuideSections(
    filteredGuideSections,
    activeIndex,
  );

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    writeGuideA11ySettings({
      highContrast: next,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeGuide();
        return;
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) {
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
          return;
        }
        if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
          return;
        }
      }

      if (!filteredGuideSections.length) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = getWrappedGuideSectionIndex(
          activeIndex,
          filteredGuideSections.length,
          direction,
        );
        selectSection(filteredGuideSections[nextIndex].id);
      }

      if (event.key === "Enter" && activeIndex >= 0) {
        event.preventDefault();
        selectSection(filteredGuideSections[activeIndex].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, closeGuide, filteredGuideSections, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalPortal>
    <div
      className="game-modal-backdrop fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
      data-closing={isClosing}
      onClick={closeGuide}
    >
      <section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`guide-section-${activeGuideSection.id}`}
        aria-describedby="guide-panel-summary"
        className={[
          "game-modal-panel absolute left-1/2 top-1/2 h-[min(86vh,48rem)] w-[min(94vw,72rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border bg-[url('/panels/menu-panel6.png')] bg-[length:108%_108%] bg-center bg-no-repeat shadow-[0_24px_70px_rgba(0,0,0,0.65)]",
          highContrast
            ? "border-amber-100/60 text-[#1f1810]"
            : "border-amber-100/20 text-[#3d2e1f]",
        ].join(" ")}
        data-closing={isClosing}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-[6%] bottom-[7.4%] top-[8.4%] flex flex-col gap-3 md:inset-x-[9.4%] md:bottom-[8.4%] md:top-[9.3%] md:flex-row md:gap-5">
          <div className="flex items-center justify-between md:hidden">
            <button
              type="button"
              className="rounded-md border border-[#9a8464]/70 bg-[rgba(244,232,205,0.6)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#3e2f21]"
              onClick={() => setIsMobileNavOpen((current) => !current)}
            >
              {isMobileNavOpen ? "Hide Sections" : "Show Sections"}
            </button>
            <button
              type="button"
              ref={closeButtonRef}
              aria-label="Close guide panel"
              className="rounded border border-stone-600/55 bg-stone-800/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98]"
              onClick={closeGuide}
            >
              ✕ Close
            </button>
          </div>

          <aside
            className={[
              "min-h-0 border-stone-700/30 md:flex md:w-[29%] md:min-w-[13rem] md:flex-col md:border-r md:px-4 md:py-3",
              isMobileNavOpen
                ? "flex max-h-[38vh] flex-col overflow-y-auto rounded-md border bg-[rgba(244,232,206,0.35)] p-3"
                : "hidden",
              highContrast
                ? "md:rounded-lg md:border md:border-stone-800/48 md:bg-[rgba(248,242,229,0.64)]"
                : "",
            ].join(" ")}
          >
            <h3 className="text-2xl font-black uppercase tracking-[0.12em] text-[#2e2013]">
              ✧ Guide ✧
            </h3>
            <input
              type="text"
              value={storyGuideQuery}
              onChange={(event) => setStoryGuideQuery(event.target.value)}
              placeholder="Search lore, quest, items..."
              className="mt-3 w-full rounded-md border border-[#9a8464]/65 bg-[rgba(244,232,205,0.5)] px-3 py-2 text-sm text-[#3d3022] placeholder:text-[#7a664f]/75 outline-none transition focus:border-[#866944]"
            />
            <div
              className="guide-scroll mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto px-[1px]"
              role="tablist"
              aria-label="Guide sections"
            >
              {filteredGuideSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  role="tab"
                  aria-selected={activeGuideSectionId === section.id}
                  className={[
                    "w-full rounded-md border px-3 py-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8f6b41]/55",
                    activeGuideSectionId === section.id
                      ? "border-[#9a773f] bg-[rgba(247,236,210,0.72)] text-[#2f2418] shadow-[0_0_0_1px_rgba(146,108,53,0.35)] md:translate-x-[2px]"
                      : "border-[#9b8666]/55 bg-[rgba(244,232,206,0.42)] text-[#4c3d2d] hover:border-[#8b714b] hover:bg-[rgba(246,235,211,0.56)]",
                  ].join(" ")}
                  onClick={() => selectSection(section.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[1.12rem] leading-none text-[#8a6a3e]">
                      {STORY_SECTION_ICON[section.id] ?? "✧"}
                    </span>
                    <span className="text-[0.98rem] font-semibold">
                      {highlightText(section.title, storyGuideQuery)}
                    </span>
                  </div>
                  <div className="mt-1 text-[0.62rem] uppercase tracking-[0.16em] leading-7 text-[#644f39]/82">
                    {highlightText(section.summary, storyGuideQuery)}
                  </div>
                </button>
              ))}
              {filteredGuideSections.length === 0 ? (
                <div className="rounded-md border border-[#9b8666]/55 bg-[rgba(244,232,206,0.4)] px-3 py-3 text-sm text-[#584937]/80">
                  No matching section found.
                </div>
              ) : null}
            </div>
          </aside>

          <div
            className={[
              "min-h-0 flex flex-1 flex-col overflow-hidden rounded-xl border px-4 pb-4 pt-3 backdrop-blur-[0.5px] md:px-5 md:pb-5 md:pt-4",
              highContrast
                ? "border-stone-800/60 bg-[rgba(248,242,229,0.8)]"
                : "border-stone-700/38 bg-[rgba(245,238,220,0.48)]",
            ].join(" ")}
          >
            <div className="grid grid-cols-[minmax(max-content,1fr)_auto] items-start gap-1.5">
              <h2
                id={`guide-section-${activeGuideSection.id}`}
                className="min-w-0 whitespace-nowrap pr-1 text-[clamp(1.56rem,2.45vw,2.4rem)] font-extrabold leading-[1.01] tracking-[-0.03em] text-[#2d2217]"
              >
                {highlightText(activeGuideSection.title, storyGuideQuery)}
              </h2>
              <div className="hidden shrink-0 items-center gap-0.5 md:flex md:justify-self-end">
                <button
                  type="button"
                  aria-pressed={highContrast}
                  aria-label="Toggle high contrast mode"
                  className={[
                    "rounded border px-1.25 py-1.5 text-[0.48rem] font-semibold uppercase tracking-[0.08em] transition",
                    highContrast
                      ? "border-[#7f5f3a]/75 bg-[rgba(79,57,33,0.95)] text-amber-100"
                      : "border-[#8f7655]/60 bg-[rgba(245,236,218,0.62)] text-[#564333] hover:bg-[rgba(245,236,218,0.82)]",
                  ].join(" ")}
                  onClick={toggleHighContrast}
                >
                  Contrast
                </button>
                <button
                  type="button"
                  className={[
                    "rounded border px-1.75 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.08em] transition duration-150",
                    isGlossaryOpen
                      ? "border-[#8f6a3d]/75 bg-[rgba(245,236,218,0.86)] text-[#453524]"
                      : "border-[#8f7655]/60 bg-[rgba(245,236,218,0.62)] text-[#564333] hover:bg-[rgba(245,236,218,0.82)]",
                  ].join(" ")}
                  onClick={() => setIsGlossaryOpen((current) => !current)}
                >
                  Glossary ({glossaryEntries.length})
                </button>
                <button
                  type="button"
                  ref={closeButtonRef}
                  aria-label="Close guide panel"
                  className="rounded border border-stone-600/55 bg-stone-800/70 px-2 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98]"
                  onClick={closeGuide}
                >
                  ✕ Close
                </button>
              </div>
            </div>
            <p id="guide-panel-summary" className="mt-1 text-base italic text-[#5b4b37]/92">
              {highlightText(activeGuideSection.summary, storyGuideQuery)}
            </p>
            {isGlossaryOpen ? (
              <div className="mt-3 rounded-lg border border-[#8f7655]/32 bg-[linear-gradient(180deg,rgba(244,234,214,0.86)_0%,rgba(234,221,194,0.74)_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,248,232,0.45)]">
                <div className="flex items-center justify-between gap-2 border-b border-[#8f7655]/22 pb-2">
                  <h4 className="text-[0.75rem] font-bold uppercase tracking-[0.22em] text-[#5b4633]">
                    Glossary Index
                  </h4>
                  <button
                    type="button"
                    className="rounded-md border border-[#a88b63]/45 bg-[rgba(56,41,28,0.95)] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-amber-100 transition duration-150 hover:bg-[rgba(42,30,20,0.98)]"
                    onClick={() => setIsGlossaryOpen(false)}
                  >
                    Collapse
                  </button>
                </div>
                <input
                  type="text"
                  value={glossaryQuery}
                  onChange={(event) => setGlossaryQuery(event.target.value)}
                  placeholder="Search terms..."
                  className="mt-2 w-full rounded-md border border-[#8f7655]/38 bg-[rgba(252,246,232,0.9)] px-3 py-2 text-sm text-[#423321] placeholder:text-[#77624b]/68 outline-none transition focus:border-[#7a5f3d]/70 focus:bg-[rgba(252,246,235,0.96)]"
                />
                <div className="guide-scroll mt-2 max-h-[min(26vh,11rem)] space-y-2 overflow-y-auto overscroll-contain pr-1 [touch-action:pan-y]">
                  {filteredGlossaryEntries.map((entry) => (
                    <button
                      key={entry.term}
                      type="button"
                      className="w-full rounded-md border border-[#8f7655]/32 bg-[rgba(252,246,234,0.9)] px-2.5 py-2 text-left shadow-[0_1px_0_rgba(255,249,237,0.6)] transition duration-150 hover:-translate-y-[1px] hover:border-[#8f6a3d]/52 hover:bg-[rgba(253,248,238,0.98)]"
                      onClick={() => jumpToGlossaryTerm(entry)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.84rem] font-semibold text-[#3f301f]">
                          {entry.term}
                        </span>
                        <span className="rounded-full border border-[#8f7655]/42 bg-[rgba(172,139,98,0.2)] px-2 py-[0.12rem] text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[#6a543c]">
                          {entry.sectionCount} sec
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[0.72rem] leading-5 text-[#554230]/88">
                        {entry.text}
                      </p>
                    </button>
                  ))}
                  {filteredGlossaryEntries.length === 0 ? (
                    <div className="rounded-md border border-[#8f7655]/32 bg-[rgba(252,246,234,0.9)] px-2.5 py-2 text-[0.72rem] text-[#5e4b38]">
                      No glossary term matched.
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            {/* Reading progress bar (temporarily disabled) */}
            {/* <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#9c8566]/24">
              <div
                className="h-full bg-[linear-gradient(90deg,rgba(128,95,54,0.88)_0%,rgba(170,131,77,0.9)_100%)] transition-[width] duration-150"
                style={{ width: `${contentProgress}%` }}
              />
            </div> */}
            <div className="mt-3 h-px bg-stone-700/35" />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.62rem] uppercase tracking-[0.09em] text-[#614d38]/88">
              {activeGuideSection.blocks.map((block, index) => {
                const shortLabel = block.heading
                  .replace("Arcade Mode (Quick Sessions)", "Arcade")
                  .replace("Rookie Training (Guide Simulator)", "Rookie Training")
                  .replace("How To Recover HP", "Recover HP")
                  .replace("Seekers and Hunters", "Seekers & Hunters")
                  .replace("Civilians and Memory", "Civilians");
                return (
                  <a
                    key={block.heading}
                    href={`#guide-block-${activeGuideSection.id}-${index}`}
                    className="rounded border border-[#937756]/45 bg-[rgba(245,236,218,0.5)] px-2 py-1 hover:bg-[rgba(245,236,218,0.72)]"
                  >
                    {shortLabel}
                  </a>
                );
              })}
              {activeGuideSection.id === "gameplay" ? (
                <button
                  type="button"
                  className="rounded border border-[#7f5e35]/72 bg-[rgba(94,70,43,0.92)] px-2.5 py-1 font-semibold tracking-[0.07em] text-amber-100 shadow-[0_1px_0_rgba(255,242,213,0.14)] hover:bg-[rgba(80,58,35,0.94)]"
                  onClick={() => {
                    resetTraining();
                    setIsTrainingOpen(true);
                  }}
                >
                  ★ Rookie Training
                </button>
              ) : null}
              {activeGuideSection.growthTable ? (
                <span className="rounded border border-[#937756]/45 bg-[rgba(245,236,218,0.5)] px-2 py-1">
                  Level Growth
                </span>
              ) : null}
              {(activeGuideSection.id === "gameplay" ||
                activeGuideSection.id === "combat") ? (
                <span className="rounded border border-[#937756]/45 bg-[rgba(245,236,218,0.5)] px-2 py-1">
                  Support Items
                </span>
              ) : null}
              <span className="rounded border border-[#937756]/45 bg-[rgba(245,236,218,0.5)] px-2 py-1">
                Key Notes
              </span>
            </div>

            <div
              key={activeGuideSection.id}
              ref={contentScrollRef}
              className="guide-scroll mt-3 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 scroll-smooth animate-[game-modal-panel-in_180ms_ease-out]"
            >
              {activeGuideSection.blocks.map((block, index) => (
                <article
                  key={`${block.heading}-${index}`}
                  id={`guide-block-${activeGuideSection.id}-${index}`}
                  className="rounded-md px-1 py-0.5 transition-all duration-200 target:bg-amber-200/25 target:ring-1 target:ring-[#9b7a4e]/45"
                >
                  <h4 className="text-[0.84rem] font-bold uppercase tracking-[0.2em] text-[#5c4a36]/88">
                    {highlightText(block.heading, storyGuideQuery)}
                  </h4>
                  <p className="mt-1.5 text-[1.02rem] leading-8 text-[#3c2f21]/96">
                    {renderTextWithGlossary(
                      block.content,
                      storyGuideQuery,
                      GLOSSARY_TERMS,
                      {
                        onShowGlossary: showGlossaryTooltip,
                        onHideGlossary: hideGlossaryTooltip,
                      },
                    )}
                  </p>
                </article>
              ))}
              {activeGuideSection.growthTable ? (
                <div>
                  <h4 className="text-[0.86rem] font-semibold uppercase tracking-[0.22em] text-[#5e4d39]/85">
                    Level Growth (Per Level)
                  </h4>
                  <div className="mt-2 overflow-hidden rounded-md border border-stone-700/30">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-[rgba(120,96,68,0.14)]">
                          <th className="px-3 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#5f4d39]">
                            Stat
                          </th>
                          <th className="px-3 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#5f4d39]">
                            Increase
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeGuideSection.growthTable.map((row) => (
                          <tr key={row.stat} className="border-t border-stone-700/20 bg-[rgba(245,238,220,0.18)]">
                            <td className="px-3 py-2 text-[0.98rem] text-[#3f3325]">
                              {row.stat}
                            </td>
                            <td className="px-3 py-2 text-[0.98rem] font-semibold text-[#3f3325]">
                              {row.perLevel}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
              {activeGuideSection.id === "gameplay" ? (
                <div className="rounded-md border border-stone-700/28 bg-[rgba(245,238,220,0.24)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-[0.86rem] font-semibold uppercase tracking-[0.22em] text-[#5e4d39]/88">
                        Rookie Training Round
                      </h4>
                      <p className="mt-1 text-[0.82rem] text-[#4b3a29]/90">
                        Launch the simulator in a dedicated floating panel for a clearer walkthrough.
                      </p>
                      <p className="mt-1 text-[0.74rem] text-[#5a4733]/85">
                        Covers answer flow, combo carry, support-tool timing, timeout pressure, and HP recovery in one safe loop.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded border border-[#8f7655]/55 bg-[rgba(245,236,218,0.7)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#4f3d2b] transition hover:bg-[rgba(245,236,218,0.9)]"
                        onClick={() => {
                          resetTraining();
                          setIsTrainingOpen(true);
                        }}
                      >
                        Open Training Panel
                      </button>
                      <button
                        type="button"
                        className="rounded border border-[#8f7655]/55 bg-[rgba(245,236,218,0.7)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#4f3d2b] transition hover:bg-[rgba(245,236,218,0.9)]"
                        onClick={resetTraining}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              {activeGuideSection.id === "gameplay" || activeGuideSection.id === "combat" ? (
                <div>
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <h4 className="text-[0.86rem] font-semibold uppercase tracking-[0.22em] text-[#5e4d39]/85">
                      Support Item List
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#6a5641]">
                        Type
                      </label>
                      <select
                        value={toolTypeFilter}
                        onChange={(event) =>
                          setToolTypeFilter(event.target.value as ToolAssistType)
                        }
                        className="rounded border border-[#8f7655]/60 bg-[rgba(245,236,218,0.65)] px-2 py-1 text-[0.72rem] uppercase tracking-[0.1em] text-[#453524] outline-none focus:border-[#7a5f3d]"
                      >
                        <option value="all">All</option>
                        <option value="strong">Strong</option>
                        <option value="standard">Standard</option>
                      </select>
                      <label className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#6a5641]">
                        Sort
                      </label>
                      <select
                        value={toolSortMode}
                        onChange={(event) =>
                          setToolSortMode(event.target.value as ToolSortMode)
                        }
                        className="rounded border border-[#8f7655]/60 bg-[rgba(245,236,218,0.65)] px-2 py-1 text-[0.72rem] uppercase tracking-[0.1em] text-[#453524] outline-none focus:border-[#7a5f3d]"
                      >
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                        <option value="usesDesc">Uses: High to Low</option>
                        <option value="nameAsc">Name: A to Z</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-2 overflow-hidden rounded-md border border-stone-700/28">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-[rgba(120,96,68,0.16)]">
                          <th className="px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5f4d39]">
                            Tool
                          </th>
                          <th className="px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5f4d39]">
                            Type
                          </th>
                          <th className="px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5f4d39]">
                            Uses
                          </th>
                          <th className="px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#5f4d39]">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleToolRows.map((tool) => (
                          <tr
                            key={tool.id}
                            className="border-t border-stone-700/20 bg-[rgba(245,238,220,0.2)] align-top"
                          >
                            <td className="px-3 py-2.5">
                              <div className="text-[0.96rem] font-semibold text-[#3b2e20]">
                                {tool.name}
                              </div>
                              <p className="mt-1 text-[0.88rem] leading-6 text-[#3f3325]/94">
                                {renderTextWithGlossary(
                                  tool.effect,
                                  storyGuideQuery,
                                  GLOSSARY_TERMS,
                                  {
                                    onShowGlossary: showGlossaryTooltip,
                                    onHideGlossary: hideGlossaryTooltip,
                                  },
                                )}
                              </p>
                            </td>
                            <td className="px-3 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#6a5641]">
                              {tool.type === "strong" ? "Strong Assist" : "Standard Assist"}
                            </td>
                            <td className="px-3 py-2.5 text-[0.92rem] font-semibold text-[#3f3325]">
                              {tool.maxUses}
                            </td>
                            <td className="px-3 py-2.5 text-[0.92rem] font-semibold text-[#3f3325]">
                              {tool.price} coin
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
              <div className="pt-1">
                <h4 className="text-[0.86rem] font-semibold uppercase tracking-[0.22em] text-[#5e4d39]/85">
                  Key Notes
                </h4>
                <ul className="mt-2 space-y-2.5">
                  {activeGuideSection.notes.map((bullet, index) => (
                    <li key={index} className="rounded-md border border-stone-700/28 bg-stone-950/10 px-3 py-2.5 text-[1rem] leading-7 text-[#3f3325]/95">
                      {highlightText(bullet, storyGuideQuery)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-1 shrink-0 flex items-center justify-between gap-2 border-t border-stone-700/25 -pb-0.5 pt-1.5">
              <button
                type="button"
                disabled={!previousSection}
                className="min-w-[7.5rem] rounded border border-stone-600/55 bg-stone-800/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100 transition duration-150 hover:bg-stone-700/75 disabled:cursor-not-allowed disabled:opacity-35"
                onClick={() => previousSection && selectSection(previousSection.id)}
              >
                ← Previous
              </button>
              <div className="text-[0.68rem] uppercase tracking-[0.12em] text-[#5f4a35]/85">
                {Math.max(activeIndex + 1, 1)} / {Math.max(filteredGuideSections.length, 1)}
              </div>
              <button
                type="button"
                disabled={!nextSection}
                className="min-w-[7.5rem] rounded border border-stone-600/55 bg-stone-800/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100 transition duration-150 hover:bg-stone-700/75 disabled:cursor-not-allowed disabled:opacity-35"
                onClick={() => nextSection && selectSection(nextSection.id)}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </section>
      {isTrainingOpen ? (
        <div
          className="absolute inset-0 z-[92] flex items-center justify-center bg-black/62 p-4 animate-[game-modal-backdrop-in_170ms_ease-out]"
          onClick={() => {
            setIsTrainingOpen(false);
            resetTraining();
          }}
        >
          <section
            className="h-[min(82vh,42rem)] w-[min(90vw,52rem)] overflow-hidden rounded-xl border border-[#8e6d43]/44 bg-[rgba(229,215,191,0.96)] shadow-[0_22px_52px_rgba(0,0,0,0.5)] animate-[game-modal-panel-in_180ms_ease-out]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#6f5437]/45 px-4 py-3">
              <div>
                <h4 className="text-[0.9rem] font-semibold uppercase tracking-[0.2em] text-[#2f2419]">
                  Rookie Training Simulator
                </h4>
                <p className="mt-1 text-[0.75rem] text-[#3d2f22]/86">
                  Isolated demo only. No real battle state or settlement is modified.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded border border-[#7f6444]/60 bg-[rgba(199,179,149,0.9)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#3f2f21] transition hover:bg-[rgba(212,193,165,0.96)]"
                  onClick={resetTraining}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="rounded border border-[#4f3b26]/70 bg-[rgba(46,34,23,0.9)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-amber-100 transition hover:bg-[rgba(34,25,16,0.94)]"
                  onClick={() => {
                    setIsTrainingOpen(false);
                    resetTraining();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="guide-scroll h-[calc(100%-4.25rem)] space-y-3 overflow-y-auto px-4 py-3">
              <div className="rounded border border-[#73593c]/32 bg-[rgba(240,230,211,0.9)] px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#5f4b36]">
                    Guided Steps
                  </p>
                  <p className="text-[0.64rem] uppercase tracking-[0.12em] text-[#6b5640]">
                    {completedGuideSteps}/{trainingGuideSteps.length} complete
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#6e573b]/22">
                  <div
                    className="h-full bg-[linear-gradient(90deg,rgba(128,95,54,0.94)_0%,rgba(176,136,84,0.95)_100%)] transition-[width] duration-300"
                    style={{ width: `${trainingGuideProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-[0.76rem] text-[#4d3b2a]/92">
                  <span className="font-semibold">
                    Step {activeTrainingGuideStep.id}: {activeTrainingGuideStep.title}
                  </span>
                  {" · "}
                  {activeTrainingGuideStep.hint}
                </p>
                <div className="mt-2 grid grid-cols-1 gap-1.5 md:grid-cols-5">
                  {trainingGuideSteps.map((step) => (
                    <div
                      key={step.id}
                      className={[
                        "rounded border px-2 py-1 text-[0.62rem] uppercase tracking-[0.11em]",
                        step.done
                          ? "border-emerald-700/30 bg-emerald-100/35 text-emerald-900/85"
                          : step.id === activeTrainingGuideStep.id
                            ? "border-amber-700/35 bg-amber-100/35 text-amber-900/88"
                            : "border-stone-700/25 bg-stone-100/45 text-stone-700/90",
                      ].join(" ")}
                    >
                      {step.id}. {step.title}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4">
                <div className="rounded border border-[#73593c]/28 bg-[rgba(240,230,211,0.88)] px-2 py-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.14em] text-[#6a5743]">
                      Player HP
                    </p>
                    <p className="text-[0.8rem] font-bold text-[#3a2d20]">
                      {trainingState.playerHp}/{TRAINING_MAX_PLAYER_HP}
                    </p>
                  </div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-[#6e573b]/20">
                    <div
                      className="h-full bg-[linear-gradient(90deg,rgba(84,139,86,0.95)_0%,rgba(128,181,129,0.95)_100%)] transition-[width] duration-300"
                      style={{
                        width: `${Math.max(0, Math.min(100, (trainingState.playerHp / TRAINING_MAX_PLAYER_HP) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="rounded border border-[#73593c]/28 bg-[rgba(240,230,211,0.88)] px-2 py-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.14em] text-[#6a5743]">
                      Enemy HP
                    </p>
                    <p className="text-[0.8rem] font-bold text-[#3a2d20]">
                      {trainingState.enemyHp}/{TRAINING_MAX_ENEMY_HP}
                    </p>
                  </div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-[#6e573b]/20">
                    <div
                      className="h-full bg-[linear-gradient(90deg,rgba(150,66,66,0.95)_0%,rgba(200,100,100,0.95)_100%)] transition-[width] duration-300"
                      style={{
                        width: `${Math.max(0, Math.min(100, (trainingState.enemyHp / TRAINING_MAX_ENEMY_HP) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="rounded border border-[#73593c]/28 bg-[rgba(240,230,211,0.88)] px-2 py-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.14em] text-[#6a5743]">
                      Combo
                    </p>
                    <p className="text-[0.8rem] font-bold text-[#3a2d20]">x{trainingState.combo}</p>
                  </div>
                </div>
                <div className="rounded border border-[#73593c]/28 bg-[rgba(240,230,211,0.88)] px-2 py-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.14em] text-[#6a5743]">
                      Timer
                    </p>
                    <p className="text-[0.8rem] font-bold text-[#3a2d20]">
                      {trainingState.timeBudget}s
                    </p>
                  </div>
                  <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-[#6e573b]/20">
                    <div
                      className="h-full bg-[linear-gradient(90deg,rgba(163,119,58,0.95)_0%,rgba(214,173,96,0.95)_100%)] transition-[width] duration-300"
                      style={{
                        width: `${Math.max(0, Math.min(100, (trainingState.timeBudget / timerBarMax) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded border border-[#73593c]/28 bg-[rgba(240,230,211,0.88)] px-2 py-1.5">
                <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[#6a5743]">
                  Round Stats
                </p>
                <div className="mt-1 grid grid-cols-2 gap-1.5 md:grid-cols-4">
                  <div className="rounded border border-[#8f7655]/36 bg-[rgba(245,236,218,0.82)] px-2 py-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.12em] text-[#705a44]">Accuracy</p>
                      <p className="text-[0.8rem] font-semibold text-[#3a2d20]">{accuracy}%</p>
                    </div>
                  </div>
                  <div className="rounded border border-[#8f7655]/36 bg-[rgba(245,236,218,0.82)] px-2 py-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.12em] text-[#705a44]">Avg Reaction</p>
                      <p className="text-[0.8rem] font-semibold text-[#3a2d20]">{avgResponseSec}s</p>
                    </div>
                  </div>
                  <div className="rounded border border-[#8f7655]/36 bg-[rgba(245,236,218,0.82)] px-2 py-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.12em] text-[#705a44]">Best Combo</p>
                      <p className="text-[0.8rem] font-semibold text-[#3a2d20]">x{trainingState.bestCombo}</p>
                    </div>
                  </div>
                  <div className="rounded border border-[#8f7655]/36 bg-[rgba(245,236,218,0.82)] px-2 py-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[0.6rem] uppercase tracking-[0.12em] text-[#705a44]">Tool Uses</p>
                      <p className="text-[0.8rem] font-semibold text-[#3a2d20]">{totalToolUses}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded border border-[#73593c]/28 bg-[rgba(240,230,211,0.88)] px-3 py-2.5">
                <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[#6a5743]">
                  Question {Math.min(trainingState.turn, TRAINING_QUESTIONS.length)} / {TRAINING_QUESTIONS.length}
                </p>
                <p className="mt-1 text-[0.98rem] font-semibold text-[#3b2e20]">
                  {currentTrainingQuestion.prompt}
                </p>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {currentTrainingQuestion.options.map((option, index) => {
                    const isHidden = trainingState.hiddenOptionIndexes.includes(index);
                    return (
                      <button
                        key={`${option}-${index}`}
                        type="button"
                        disabled={trainingState.finished || isHidden}
                        className="rounded border border-[#8f7655]/52 bg-[rgba(219,201,171,0.92)] px-2.5 py-2 text-left text-[0.82rem] text-[#473626] transition hover:bg-[rgba(232,216,188,0.98)] disabled:cursor-not-allowed disabled:opacity-45"
                        onClick={() => answerTrainingQuestion(index)}
                      >
                        {isHidden ? "Hidden by Unmasking" : option}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={trainingState.finished}
                    className="rounded border border-[#8f7655]/45 bg-[rgba(245,236,218,0.82)] px-2.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#4f3d2b] transition hover:bg-[rgba(245,236,218,0.95)] disabled:cursor-not-allowed disabled:opacity-45"
                    onClick={timeoutTrainingQuestion}
                  >
                    Simulate Timeout
                  </button>
                  <button
                    type="button"
                    disabled={!trainingState.finished}
                    className="rounded border border-[#8f7655]/45 bg-[rgba(245,236,218,0.82)] px-2.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#4f3d2b] transition hover:bg-[rgba(245,236,218,0.95)] disabled:cursor-not-allowed disabled:opacity-45"
                    onClick={healInTraining}
                  >
                    Tavern Deep Sleep (Out of Combat)
                  </button>
                </div>
                <p className="mt-1 text-[0.68rem] text-[#5d4832]/80">
                  Deep Sleep is only available after the combat simulation ends.
                </p>
              </div>

              <div className="rounded border border-[#73593c]/28 bg-[rgba(240,230,211,0.88)] px-3 py-2.5">
                <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[#6a5743]">
                  Support Tool Demo
                </p>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <button
                    type="button"
                    disabled={trainingTools.analyze <= 0 || trainingState.finished}
                    className="rounded border border-[#8f7655]/45 bg-[rgba(245,236,218,0.82)] px-2.5 py-2 text-left text-[0.78rem] text-[#4b3928] transition hover:bg-[rgba(245,236,218,0.95)] disabled:cursor-not-allowed disabled:opacity-45"
                    onClick={() => activateTrainingTool("analyze")}
                  >
                    Scripture of Unmasking ({trainingTools.analyze})
                  </button>
                  <button
                    type="button"
                    disabled={trainingTools.hourglass <= 0 || trainingState.finished}
                    className="rounded border border-[#8f7655]/45 bg-[rgba(245,236,218,0.82)] px-2.5 py-2 text-left text-[0.78rem] text-[#4b3928] transition hover:bg-[rgba(245,236,218,0.95)] disabled:cursor-not-allowed disabled:opacity-45"
                    onClick={() => activateTrainingTool("hourglass")}
                  >
                    Suspended Sand ({trainingTools.hourglass})
                  </button>
                  <button
                    type="button"
                    disabled={trainingTools.barrier <= 0 || trainingState.finished}
                    className="rounded border border-[#8f7655]/45 bg-[rgba(245,236,218,0.82)] px-2.5 py-2 text-left text-[0.78rem] text-[#4b3928] transition hover:bg-[rgba(245,236,218,0.95)] disabled:cursor-not-allowed disabled:opacity-45"
                    onClick={() => activateTrainingTool("barrier")}
                  >
                    Veil of Aegis ({trainingTools.barrier})
                  </button>
                  <button
                    type="button"
                    disabled={trainingTools.chainGuard <= 0 || trainingState.finished}
                    className="rounded border border-[#8f7655]/45 bg-[rgba(245,236,218,0.82)] px-2.5 py-2 text-left text-[0.78rem] text-[#4b3928] transition hover:bg-[rgba(245,236,218,0.95)] disabled:cursor-not-allowed disabled:opacity-45"
                    onClick={() => activateTrainingTool("chainGuard")}
                  >
                    Oathbound Chain ({trainingTools.chainGuard})
                  </button>
                </div>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.12em] text-[#6c5843]">
                  Active: {trainingState.barrierArmed ? "Aegis armed" : "Aegis idle"} ·{" "}
                  {trainingState.chainArmed ? "Chain armed" : "Chain idle"}
                </p>
                <p className="mt-1 text-[0.68rem] text-[#5d4832]/82">
                  Used: Unmasking {trainingToolUsage.analyze} · Sand {trainingToolUsage.hourglass} · Aegis{" "}
                  {trainingToolUsage.barrier} · Chain {trainingToolUsage.chainGuard}
                </p>
              </div>

              <div className="rounded border border-[#73593c]/28 bg-[rgba(240,230,211,0.88)] px-3 py-2.5">
                <p className="text-[0.66rem] uppercase tracking-[0.14em] text-[#6a5743]">
                  Flow Log (Answer → Combo → Tool → HP Recovery)
                </p>
                <div className="guide-scroll mt-2 max-h-36 space-y-1.5 overflow-y-auto pr-1">
                  {trainingState.logs.map((log) => (
                    <p
                      key={log.id}
                      className={[
                        "rounded border px-2 py-1 text-[0.74rem] leading-5",
                        log.type === "correct"
                          ? "border-emerald-800/20 bg-emerald-100/35 text-emerald-900/85"
                          : log.type === "wrong"
                            ? "border-rose-800/20 bg-rose-100/35 text-rose-900/85"
                            : log.type === "tool"
                              ? "border-amber-800/20 bg-amber-100/35 text-amber-900/85"
                              : log.type === "heal"
                                ? "border-sky-800/20 bg-sky-100/35 text-sky-900/85"
                                : "border-stone-700/20 bg-stone-100/45 text-stone-900/80",
                      ].join(" ")}
                    >
                      {log.text}
                    </p>
                  ))}
                </div>
              </div>
              {trainingState.finished ? (
                <div className="rounded border border-[#7b5d3d]/40 bg-[linear-gradient(180deg,rgba(247,238,220,0.9)_0%,rgba(233,219,190,0.78)_100%)] px-3 py-2.5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[#5a4632]">
                    Round Summary
                  </p>
                  <p className="mt-1 text-[0.84rem] text-[#3f3124]">
                    {trainingState.enemyHp <= 0
                      ? "Great control: you finished the enemy within the demo loop."
                      : trainingState.playerHp <= 0
                        ? "High pressure detected: review timing and defensive tool usage."
                        : "Round completed: all training questions were consumed."}
                  </p>
                  <p className="mt-1 text-[0.78rem] text-[#4f3f2f]/92">
                    Accuracy {accuracy}% · Avg reaction {avgResponseSec}s · Best combo x{trainingState.bestCombo} · Tool uses {totalToolUses}.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
      {glossaryTooltip ? (
        <div
          className="pointer-events-none fixed z-[95] w-56 rounded-md border border-[#9b7f56]/55 bg-[rgba(31,22,15,0.94)] px-2.5 py-2 text-left text-[0.72rem] leading-5 text-[#f3e7cd] shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
          style={{
            left: glossaryTooltip.left,
            top: glossaryTooltip.top,
            transform: `translate(-50%, ${glossaryTooltip.placeAbove ? "-100%" : "0"})`,
          }}
        >
          <span className="block text-[0.64rem] font-bold uppercase tracking-[0.14em] text-[#d9bd8d]">
            {glossaryTooltip.term}
          </span>
          {glossaryTooltip.text}
        </div>
      ) : null}
    </div>
    </ModalPortal>
  );
}
