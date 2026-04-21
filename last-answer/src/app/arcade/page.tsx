"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BattlePage } from "@/components/game/Battle/BattlePage";
import { createEnemy } from "@/game/core/battleCore";
import type { Enemy } from "@/game/core/types";
import {
  CATEGORYCODE,
  type CategoryCode,
  type Difficulty,
  type QuestionType,
  useGameStore,
} from "@/store/game-store";
import { defaultPlayer, getMCStore, useMCStore } from "@/store/mcStore";

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard"];
const questionTypeOptions: QuestionType[] = ["multiple", "boolean"];
const categoryCodeValues = Object.values(CATEGORYCODE);
const backgroundOptions = [
  {
    id: "forest",
    label: "Forest",
    path: "/backgrounds/foggy-forest.png",
  },
  {
    id: "mainHub",
    label: "Main Hub",
    path: "/backgrounds/city-hub.png",
  },
  {
    id: "tavern",
    label: "Tavern",
    path: "/backgrounds/Tavern_Background3.png",
  },
  {
    id: "cave",
    label: "Cave",
    path: "/backgrounds/cave-background.png",
  },
  {
    id: "source",
    label: "Source",
    path: "/backgrounds/source-background.png",
  },
] as const;

type BackgroundOptionId = (typeof backgroundOptions)[number]["id"];

const fieldClass = "space-y-2";
const labelClass =
  "block text-base font-black uppercase tracking-[0.22em] text-amber-950";
const selectClass =
  "w-full rounded border border-stone-600/55 bg-stone-800/65 px-3 py-2.5 text-sm font-medium text-amber-100 outline-none transition focus:border-stone-500/70";
const actionButtonClass =
  "rounded border border-stone-600/55 bg-stone-800/70 px-6 py-2.5 text-sm font-bold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98]";

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
    const confirmed = window.confirm(
      [
        "Start arcade battle with these settings?",
        "",
        `Category: ${selectedCategoryLabel}`,
        `Difficulty: ${formatSetting(difficulty)}`,
        `Type: ${formatSetting(type)}`,
        `Boss fight: ${fightBoss ? "Yes" : "No"}`,
        `Reset player: ${resetBeforeFight ? "Yes" : "No"}`,
        `Background: ${selectedBackground.label}`,
        `Enemy: ${enemyName}`,
        `Enemy level: ${enemyLevel}`,
      ].join("\n"),
    );

    if (!confirmed) {
      return;
    }

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

    setBattleEnemy(nextEnemy);
    setBattleStarted(true);
  };

  const handleBattleFinish = () => {
    setBattleStarted(false);
    setBattleEnemy(null);
    getMCStore().getState().restoreHpToFull();
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
    <main className="relative min-h-screen overflow-hidden bg-black text-stone-100">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url('/backgrounds/city-hub.png')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,5,0.48)_0%,rgba(8,6,5,0.28)_35%,rgba(7,5,4,0.78)_100%)]" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-4 py-10">
        <div className="bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[9%] shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
          <p className="text-center font-serif text-xs font-bold uppercase tracking-[0.5em] text-amber-950">
            Arcade
          </p>
          <h1 className="mt-2 text-center font-serif text-4xl font-extrabold tracking-wide text-amber-950 sm:text-5xl">
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

          <div className="mt-7 grid gap-5 md:grid-cols-2">
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
      </section>
    </main>
  );
}
