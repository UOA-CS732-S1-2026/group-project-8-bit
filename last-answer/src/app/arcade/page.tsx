"use client";

import {
  type ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { BattlePage } from "@/components/game/Battle/BattlePage";
import { createEnemy } from "@/game/core/battleCore";
import type { BattleOutcome, Enemy } from "@/game/core/types";
import {
  CATEGORYCODE,
  type CategoryCode,
  type Difficulty,
  type QuestionType,
  useGameStore,
} from "@/store/game-store";
import { defaultPlayer, getMCStore, useMCStore } from "@/store/mcStore";
import { useModalCloseAnimation } from "@/components/game/useModalCloseAnimation";

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard"];
const questionTypeOptions: QuestionType[] = ["multiple", "boolean"];
const categoryCodeValues = Object.values(CATEGORYCODE);
const backgroundOptions = [
  {
    id: "forest",
    label: "Forest",
    path: "/backgrounds/foggy-forest.jpg",
  },
  {
    id: "mainHub",
    label: "Main Hub",
    path: "/backgrounds/main-hub.jpg",
  },
  {
    id: "tavern",
    label: "Tavern",
    path: "/backgrounds/tavern-background.jpg",
  },
  {
    id: "cave",
    label: "Cave",
    path: "/backgrounds/cave-background.jpg",
  },
  {
    id: "source",
    label: "Source",
    path: "/backgrounds/source-background.jpg",
  },
] as const;

const enemyArtOptions = {
  normal: "/battle/monster1.png",
  boss: "/battle/monster1.png",
} as const;

type BackgroundOptionId = (typeof backgroundOptions)[number]["id"];

const fieldClass = "space-y-2";
const labelClass =
  "block text-base font-black uppercase tracking-[0.22em] text-amber-950";
const selectClass =
  "w-full rounded border border-stone-600/55 bg-stone-800/65 px-3 py-2.5 text-sm font-medium text-amber-100 outline-none transition focus:border-stone-500/70";
const actionButtonClass =
  "rounded border border-stone-600/55 bg-stone-800/70 px-6 py-2.5 text-sm font-bold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98]";

const ARCADE_PANEL_DESIGN_WIDTH = 992;
const ARCADE_PANEL_FALLBACK_HEIGHT = 900;
const ARCADE_PANEL_VIEWPORT_GAP_X = 32;
const ARCADE_PANEL_VIEWPORT_GAP_Y = 80;

function toCategoryCode(value: string): CategoryCode | null {
  if (!value) {
    return null;
  }

  return categoryCodeValues.includes(value as CategoryCode)
    ? (value as CategoryCode)
    : null;
}

function toDifficulty(value: string): Difficulty | null {
  if (!value) {
    return null;
  }

  return difficultyOptions.includes(value as Difficulty)
    ? (value as Difficulty)
    : null;
}

function toQuestionType(value: string): QuestionType | null {
  if (!value) {
    return null;
  }

  return questionTypeOptions.includes(value as QuestionType)
    ? (value as QuestionType)
    : null;
}

function getCategoryLabel(category: CategoryCode | null): string {
  if (!category) {
    return "Any category";
  }

  return (
    Object.entries(CATEGORYCODE).find(([, value]) => value === category)?.[0] ??
    "Any category"
  );
}

function formatSetting(value: string | null): string {
  return value ? value : "Any";
}

function ScaledArcadePanel({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [panelMetrics, setPanelMetrics] = useState({
    height: ARCADE_PANEL_FALLBACK_HEIGHT,
    scale: 1,
  });

  useLayoutEffect(() => {
    const updatePanelScale = () => {
      const frame = frameRef.current;
      const content = contentRef.current;

      if (!frame || !content) {
        return;
      }

      const contentHeight =
        content.scrollHeight ||
        content.offsetHeight ||
        ARCADE_PANEL_FALLBACK_HEIGHT;
      const availableWidth = Math.max(
        frame.clientWidth - ARCADE_PANEL_VIEWPORT_GAP_X,
        1,
      );
      const availableHeight = Math.max(
        frame.clientHeight - ARCADE_PANEL_VIEWPORT_GAP_Y,
        1,
      );
      const nextScale = Math.min(
        availableWidth / ARCADE_PANEL_DESIGN_WIDTH,
        availableHeight / contentHeight,
        1,
      );

      setPanelMetrics((currentMetrics) => {
        const heightChanged =
          Math.abs(currentMetrics.height - contentHeight) > 0.5;
        const scaleChanged = Math.abs(currentMetrics.scale - nextScale) > 0.001;

        if (!heightChanged && !scaleChanged) {
          return currentMetrics;
        }

        return {
          height: contentHeight,
          scale: nextScale,
        };
      });
    };

    updatePanelScale();

    const resizeObserver = new ResizeObserver(updatePanelScale);

    if (frameRef.current) {
      resizeObserver.observe(frameRef.current);
    }

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden"
    >
      <div
        className="relative shrink-0"
        style={{
          flex: "0 0 auto",
          width: ARCADE_PANEL_DESIGN_WIDTH * panelMetrics.scale,
          height: panelMetrics.height * panelMetrics.scale,
        }}
      >
        <div
          ref={contentRef}
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: ARCADE_PANEL_DESIGN_WIDTH,
            transform: `scale(${panelMetrics.scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ArcadePage() {
  const router = useRouter();
  const player = useMCStore((state) => state.player);
  const resetPlayer = useMCStore((state) => state.resetPlayer);
  const category = useGameStore((state) => state.category);
  const difficulty = useGameStore((state) => state.difficulty);
  const type = useGameStore((state) => state.type);
  const setCategory = useGameStore((state) => state.setCategory);
  const setDifficulty = useGameStore((state) => state.setDifficulty);
  const setType = useGameStore((state) => state.setType);
  const [fightBoss, setFightBoss] = useState(false);
  const [resetBeforeFight, setResetBeforeFight] = useState(false);
  const [selectedBackgroundId, setSelectedBackgroundId] =
    useState<BackgroundOptionId>("mainHub");
  const [battleEnemy, setBattleEnemy] = useState<Enemy | null>(null);
  const [battleStarted, setBattleStarted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { isClosing: isConfirmClosing, requestClose: closeConfirm } =
    useModalCloseAnimation(() => setShowConfirm(false));

  const enemyLevel = resetBeforeFight ? defaultPlayer.level : player.level;
  const enemyName = fightBoss ? "Arcade Overlord" : "Arcade Challenger";
  const selectedCategoryLabel = useMemo(
    () => getCategoryLabel(category),
    [category],
  );
  const selectedBackground = useMemo(
    () =>
      backgroundOptions.find(
        (background) => background.id === selectedBackgroundId,
      ) ?? backgroundOptions[0],
    [selectedBackgroundId],
  );

  const handleFight = () => {
    setShowConfirm(true);
  };

  const handleConfirmFight = () => {
    setShowConfirm(false);

    if (resetBeforeFight) {
      resetPlayer();
    }

    const playerForBattle = getMCStore().getState().readPlayer();
    const nextEnemy = createEnemy({
      id: fightBoss ? "arcade-overlord" : "arcade-challenger",
      name: enemyName,
      level: playerForBattle.level,
      tier: fightBoss ? "boss" : "normal",
      isBoss: fightBoss,
    });

    setBattleEnemy({
      ...nextEnemy,
      imagePath: fightBoss ? enemyArtOptions.boss : enemyArtOptions.normal,
      artPreset: "default",
    });
    setBattleStarted(true);
  };

  const handleBattleFinish = (outcome: BattleOutcome) => {
    void outcome;
    setBattleStarted(false);
    setBattleEnemy(null);
    const store = getMCStore().getState();
    store.restoreHpToFull();
    store.restockSupportTools(1);
  };

  if (battleStarted && battleEnemy) {
    return (
      <BattlePage
        enemy={battleEnemy}
        backgroundImage={selectedBackground.path}
        label={selectedBackground.label}
        onFinish={handleBattleFinish}
      />
    );
  }

  return (
    <main className="relative h-full min-h-0 w-full overflow-hidden bg-black text-stone-100">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url('/backgrounds/game-cover.jpg')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,5,0.48)_0%,rgba(8,6,5,0.28)_35%,rgba(7,5,4,0.78)_100%)]" />

      <section className="relative z-10 h-full min-h-0 w-full overflow-hidden">
        <ScaledArcadePanel>
          <div className="w-full bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[9%] shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
            <p className="text-center font-serif text-xs font-bold uppercase tracking-[0.5em] text-amber-950">
              Arcade
            </p>
            <h1 className="mt-2 text-center font-serif text-5xl font-extrabold tracking-wide text-amber-950">
              Choose your fight
            </h1>
            <div className="mt-4 border-t border-stone-600/30" />
            <p className="mt-4 max-w-2xl text-base italic leading-relaxed text-amber-950">
              Prepare the next battle and step in when the setup feels right.
            </p>

            <div className="mt-6 rounded border border-stone-600/40 bg-stone-800/55 px-4 py-3 text-sm font-medium text-amber-100">
              Current player: {player.name || defaultPlayer.name} | Level{" "}
              {player.level} | HP {player.hp}/{player.maxHp}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-5">
              <label className={fieldClass}>
                <span className={labelClass}>Category</span>
                <select
                  value={category ?? ""}
                  onChange={(event) =>
                    setCategory(toCategoryCode(event.target.value))
                  }
                  className={selectClass}
                >
                  <option value="">Any category</option>
                  {Object.entries(CATEGORYCODE).map(([label, value]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>Difficulty</span>
                <select
                  value={difficulty ?? ""}
                  onChange={(event) =>
                    setDifficulty(toDifficulty(event.target.value))
                  }
                  className={selectClass}
                >
                  <option value="">Any difficulty</option>
                  {difficultyOptions.map((difficultyOption) => (
                    <option key={difficultyOption} value={difficultyOption}>
                      {difficultyOption}
                    </option>
                  ))}
                </select>
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>Type</span>
                <select
                  value={type ?? ""}
                  onChange={(event) =>
                    setType(toQuestionType(event.target.value))
                  }
                  className={selectClass}
                >
                  <option value="">Any type</option>
                  {questionTypeOptions.map((typeOption) => (
                    <option key={typeOption} value={typeOption}>
                      {typeOption}
                    </option>
                  ))}
                </select>
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>Fight Boss</span>
                <select
                  value={fightBoss ? "boss" : "normal"}
                  onChange={(event) =>
                    setFightBoss(event.target.value === "boss")
                  }
                  className={selectClass}
                >
                  <option value="normal">No, fight normal enemy</option>
                  <option value="boss">Yes, fight boss</option>
                </select>
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>Reset Player</span>
                <select
                  value={resetBeforeFight ? "reset" : "keep"}
                  onChange={(event) =>
                    setResetBeforeFight(event.target.value === "reset")
                  }
                  className={selectClass}
                >
                  <option value="keep">No, use current player</option>
                  <option value="reset">Yes, reset before battle</option>
                </select>
              </label>

              <label className={fieldClass}>
                <span className={labelClass}>Background</span>
                <select
                  value={selectedBackgroundId}
                  onChange={(event) =>
                    setSelectedBackgroundId(
                      event.target.value as BackgroundOptionId,
                    )
                  }
                  className={selectClass}
                >
                  {backgroundOptions.map((background) => (
                    <option key={background.id} value={background.id}>
                      {background.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded border border-stone-600/35 bg-stone-800/50 px-4 py-3 text-sm italic leading-relaxed text-amber-100/90">
                Enemy preview: {enemyName}, level {enemyLevel}
                <br />
                Battle background: {selectedBackground.label}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className={actionButtonClass}
                onClick={handleFight}
              >
                Fight
              </button>
              <button
                type="button"
                className={actionButtonClass}
                onClick={() => router.back()}
              >
                Back
              </button>
            </div>
          </div>
        </ScaledArcadePanel>
      </section>

      {showConfirm && (
        <div
          className="game-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          data-closing={isConfirmClosing}
          onClick={(e) => {
            e.stopPropagation();
            closeConfirm();
          }}
        >
          <section
            className="game-modal-panel relative flex w-[min(88vw,26rem)] flex-col items-center bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-10 py-9 text-center text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
            data-closing={isConfirmClosing}
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm battle"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold tracking-wide text-amber-950">
              Start Arcade Battle?
            </h3>
            <ul className="mt-4 w-full space-y-1 text-center text-sm italic leading-relaxed text-amber-950">
              <li>Category: {selectedCategoryLabel}</li>
              <li>Difficulty: {formatSetting(difficulty)}</li>
              <li>Type: {formatSetting(type)}</li>
              <li>Boss fight: {fightBoss ? "Yes" : "No"}</li>
              <li>Reset player: {resetBeforeFight ? "Yes" : "No"}</li>
              <li>Background: {selectedBackground.label}</li>
              <li>Enemy: {enemyName}</li>
              <li>Enemy level: {enemyLevel}</li>
            </ul>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                className="rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:border-stone-500/65 hover:bg-stone-700/75 active:translate-y-[1px] active:scale-[0.98]"
                onClick={handleConfirmFight}
              >
                Yes
              </button>
              <button
                type="button"
                className="rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:border-stone-500/65 hover:bg-stone-700/75 active:translate-y-[1px] active:scale-[0.98]"
                onClick={closeConfirm}
              >
                No
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
