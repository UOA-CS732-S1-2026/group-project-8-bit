"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import ModalPortal from "./ModalPortal";
import { useModalCloseAnimation } from "./useModalCloseAnimation";

type StoryGuideSection = {
  id: string;
  title: string;
  summary: string;
  blocks: Array<{
    heading: string;
    content: string;
  }>;
  notes: string[];
  toolList?: Array<{
    name: string;
    effect: string;
    type: "strong" | "standard";
    maxUses: number;
  }>;
  growthTable?: Array<{
    stat: string;
    perLevel: string;
  }>;
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
          "Battles are question-driven. Correct answers damage enemies; mistakes or timeouts trigger enemy pressure. Standard battles use 10-turn limits, while boss battles use 20 turns.",
      },
      {
        heading: "Timing and Burst",
        content:
          "Each question starts with a 12-second timer. Building streaks increases pressure and reward. Burst opportunities appear on streak milestones and reward controlled execution.",
      },
      {
        heading: "How To Recover HP",
        content:
          "In tavern mode, choosing deep sleep restores HP directly to full. This is an explicit full-heal action from the player system, not passive regeneration.",
      },
      {
        heading: "When To Use Support Tools",
        content:
          "Use tools proactively before momentum breaks. Their role is stabilization: preventing combo loss, mitigating mistakes, and extending answer windows under pressure.",
      },
      {
        heading: "Arcade Mode (Quick Sessions)",
        content:
          "Arcade mode focuses on direct battle loops for fast practice and progression. Use it when you want to train answer speed, combo control, and support-tool timing without story dialogue phases.",
      },
    ],
    notes: [
      "Standard turn limit: 10.",
      "Boss turn limit: 20.",
      "Default question timer: 12s.",
      "Hourglass bonus: +4s.",
      "Deep Sleep in tavern restores HP to max.",
    ],
    toolList: [
      {
        name: "Scripture of Unmasking",
        effect: "Remove two wrong answers from the current question.",
        type: "strong",
        maxUses: 2,
      },
      {
        name: "Suspended Sand",
        effect: "Add 4 seconds to the current question timer.",
        type: "standard",
        maxUses: 1,
      },
      {
        name: "Veil of Aegis",
        effect: "Block the next enemy counterattack after a mistake.",
        type: "standard",
        maxUses: 1,
      },
      {
        name: "Oathbound Chain",
        effect: "Preserve combo on the next wrong answer or timeout.",
        type: "strong",
        maxUses: 1,
      },
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
          "For generations, social order leaned on the Monolith's authority. Law, ritual, and political legitimacy all felt anchored to a voice that always answered.",
      },
      {
        heading: "The Break",
        content:
          "Then the Great Silence arrived. Guidance vanished, and certainty collapsed into rumor, fear, and competing claims of truth.",
      },
      {
        heading: "Fragments as Existential Threat",
        content:
          "Knowledge Fragments do not merely kill. They erode memory, judgment, and identity, turning survival into a battle over what remains of the self.",
      },
      {
        heading: "The Current Divide",
        content:
          "The conflict is ideological as much as military: restore order through control, or accept risk to preserve human agency.",
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
          "Andrew is both guide and gatekeeper. His advice reflects painful realism: in a city of spies and divided loyalties, information can be deadlier than steel.",
      },
      {
        heading: "Seekers and Hunters",
        content:
          "Seekers carry institutional duty under strain; Hunters operate with practical survival logic. Both face the same danger, but not the same priorities.",
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
          "The tavern is your narrative hub. Dialogue there establishes motive, then pushes the player into forest and cave escalation.",
      },
      {
        heading: "Escalation Pattern",
        content:
          "Story mode alternates information and pressure: discovery through dialogue, then consequence through encounters and combat.",
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
          "Combat rewards consistency. Correct-answer speed, combo continuity, and burst timing all feed damage and reward multipliers.",
      },
      {
        heading: "Boss Pressure",
        content:
          "Boss fights punish impatience. Preserving rhythm is often stronger than chasing risky burst windows under stress.",
      },
      {
        heading: "Support Philosophy",
        content:
          "Support tools are tactical insurance. Their highest value appears when used to prevent collapse, not after collapse.",
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
          "Ashes are not treated as common remains. They are controlled, measured, and contested because they carry strategic power.",
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
          "Late-game branches are ideological commitments, not cosmetic variants. Your stance determines both route and interpretation.",
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

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: string, query: string): ReactNode {
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

function renderTextWithGlossary(
  text: string,
  query: string,
  onShowGlossary: (
    event: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>,
    term: string,
  ) => void,
  onHideGlossary: () => void,
): ReactNode {
  if (!GLOSSARY_TERMS.length) {
    return highlightText(text, query);
  }

  const termPattern = new RegExp(
    `(${GLOSSARY_TERMS.map((term) => escapeRegExp(term)).join("|")})`,
    "gi",
  );
  const parts = text.split(termPattern);

  return parts.map((part, index) => {
    const matchedTerm = GLOSSARY_TERMS.find(
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
        onMouseEnter={(event) => onShowGlossary(event, matchedTerm)}
        onMouseLeave={onHideGlossary}
        onFocus={(event) => onShowGlossary(event, matchedTerm)}
        onBlur={onHideGlossary}
      >
        {highlightText(part, query)}
      </button>
    );
  });
}

export default function GuidePanel({ isOpen, onClose }: GuidePanelProps) {
  const [storyGuideQuery, setStoryGuideQuery] = useState("");
  const [activeGuideSectionId, setActiveGuideSectionId] = useState(
    STORY_GUIDE_SECTIONS[0].id,
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
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
    setIsMobileNavOpen(false);
    setGlossaryTooltip(null);
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
    const query = storyGuideQuery.trim().toLowerCase();

    if (!query) {
      return STORY_GUIDE_SECTIONS;
    }

    return STORY_GUIDE_SECTIONS.filter((section) => {
      const haystack = [
        section.title,
        section.summary,
        ...section.blocks.map((block) => `${block.heading} ${block.content}`),
        ...section.notes,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [storyGuideQuery]);

  const activeGuideSection =
    filteredGuideSections.find((section) => section.id === activeGuideSectionId) ??
    filteredGuideSections[0] ??
    STORY_GUIDE_SECTIONS[0];

  const activeIndex = filteredGuideSections.findIndex(
    (section) => section.id === activeGuideSection.id,
  );
  const previousSection =
    activeIndex > 0 ? filteredGuideSections[activeIndex - 1] : null;
  const nextSection =
    activeIndex >= 0 && activeIndex < filteredGuideSections.length - 1
      ? filteredGuideSections[activeIndex + 1]
      : null;

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

      if (!filteredGuideSections.length) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const startIndex = activeIndex >= 0 ? activeIndex : 0;
        const nextIndex =
          (startIndex + direction + filteredGuideSections.length) %
          filteredGuideSections.length;
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
        className="game-modal-panel absolute left-1/2 top-1/2 h-[min(86vh,48rem)] w-[min(94vw,72rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-amber-100/20 bg-[url('/panels/menu-panel6.png')] bg-[length:108%_108%] bg-center bg-no-repeat text-[#3d2e1f] shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
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
              className="rounded border border-stone-600/55 bg-stone-800/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98]"
              onClick={closeGuide}
            >
              ✕ Close
            </button>
          </div>

          <aside
            className={[
              "guide-scroll min-h-0 border-stone-700/30 md:flex md:w-[29%] md:min-w-[13rem] md:flex-col md:overflow-y-auto md:border-r md:pr-4",
              isMobileNavOpen
                ? "flex max-h-[38vh] flex-col overflow-y-auto rounded-md border bg-[rgba(244,232,206,0.35)] p-3"
                : "hidden",
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
            <div className="mt-3 min-h-0 flex-1 space-y-2 pr-1 md:overflow-y-auto">
              {filteredGuideSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
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
                    <span className="text-sm font-semibold">
                      {highlightText(section.title, storyGuideQuery)}
                    </span>
                  </div>
                  <div className="mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-[#644f39]/86">
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

          <div className="min-h-0 flex flex-1 flex-col overflow-hidden rounded-xl border border-stone-700/38 bg-[rgba(245,238,220,0.48)] px-4 py-3 backdrop-blur-[0.5px] md:px-5 md:py-4">
            <div className="flex items-start justify-between gap-3">
              <h2
                id={`guide-section-${activeGuideSection.id}`}
                className="text-[1.7rem] font-extrabold leading-tight text-[#2d2217] md:text-[2rem]"
              >
                {highlightText(activeGuideSection.title, storyGuideQuery)}
              </h2>
              <button
                type="button"
                className="hidden rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98] md:inline-block"
                onClick={closeGuide}
              >
                ✕ Close
              </button>
            </div>
            <p className="mt-1 text-base italic text-[#5b4b37]/92">
              {highlightText(activeGuideSection.summary, storyGuideQuery)}
            </p>
            {/* Reading progress bar (temporarily disabled) */}
            {/* <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#9c8566]/24">
              <div
                className="h-full bg-[linear-gradient(90deg,rgba(128,95,54,0.88)_0%,rgba(170,131,77,0.9)_100%)] transition-[width] duration-150"
                style={{ width: `${contentProgress}%` }}
              />
            </div> */}
            <div className="mt-3 h-px bg-stone-700/35" />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.66rem] uppercase tracking-[0.12em] text-[#614d38]/85">
              {activeGuideSection.blocks.map((block, index) => (
                <a
                  key={block.heading}
                  href={`#guide-block-${activeGuideSection.id}-${index}`}
                  className="rounded border border-[#937756]/45 bg-[rgba(245,236,218,0.5)] px-2 py-1 hover:bg-[rgba(245,236,218,0.72)]"
                >
                  {block.heading}
                </a>
              ))}
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
                      showGlossaryTooltip,
                      hideGlossaryTooltip,
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
              {activeGuideSection.toolList ? (
                <div>
                  <h4 className="text-[0.86rem] font-semibold uppercase tracking-[0.22em] text-[#5e4d39]/85">
                    Support Item List
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {activeGuideSection.toolList.map((tool) => (
                      <li
                        key={tool.name}
                        className="rounded-md border border-stone-700/30 bg-stone-950/10 px-3 py-2.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[1rem] font-semibold text-[#3b2e20]">
                            {tool.name}
                          </span>
                          <span className="text-[0.66rem] font-bold uppercase tracking-[0.16em] text-[#6a5641]">
                            {tool.type === "strong" ? "Strong Assist" : "Standard Assist"}
                          </span>
                        </div>
                        <p className="mt-1 text-[0.96rem] leading-7 text-[#3f3325]/94">
                          {renderTextWithGlossary(
                            tool.effect,
                            storyGuideQuery,
                            showGlossaryTooltip,
                            hideGlossaryTooltip,
                          )}
                        </p>
                        <p className="mt-0.5 text-[0.74rem] uppercase tracking-[0.12em] text-[#6d5843]">
                          Max uses per battle: {tool.maxUses}
                        </p>
                      </li>
                    ))}
                  </ul>
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

            <div className="mt-2 shrink-0 flex items-center justify-between gap-2 border-t border-stone-700/25 pt-2">
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
