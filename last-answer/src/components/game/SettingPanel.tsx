"use client";

import { useState } from "react";
import {
  CATEGORYCODE,
  type CategoryCode,
  type Difficulty,
  type GameSettings,
  type QuestionType,
  useGameStore,
} from "@/store/game-store";

type SettingPanelProps = {
  onClose: () => void;
};

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard"];
const questionTypeOptions: QuestionType[] = ["multiple", "boolean"];
const categoryCodeValues = Object.values(CATEGORYCODE);

const fieldClass = "space-y-2";
const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.18em] text-amber-200";
const selectClass =
  "w-full rounded-md border border-amber-200/25 bg-black/45 px-3 py-2 text-sm text-stone-100 outline-none transition focus:border-amber-100/70";
const panelButtonClass =
  "rounded-md border border-amber-200/30 bg-black/35 px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-amber-100 transition duration-150 hover:border-amber-100/65 hover:bg-amber-200/15 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-amber-200/30 disabled:hover:bg-black/35 disabled:active:translate-y-0 disabled:active:scale-100";

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

function settingsAreEqual(left: GameSettings, right: GameSettings) {
  return (
    left.category === right.category &&
    left.difficulty === right.difficulty &&
    left.type === right.type
  );
}

export default function SettingPanel({ onClose }: SettingPanelProps) {
  const category = useGameStore((state) => state.category);
  const difficulty = useGameStore((state) => state.difficulty);
  const type = useGameStore((state) => state.type);
  const readGameSettings = useGameStore((state) => state.readGameSettings);
  const setGameSettings = useGameStore((state) => state.setGameSettings);
  const [draftSettings, setDraftSettings] = useState<GameSettings>(() =>
    readGameSettings(),
  );
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const currentSettings: GameSettings = {
    category,
    difficulty,
    type,
  };
  const hasChanges = !settingsAreEqual(draftSettings, currentSettings);

  const updateDraftSettings = (settings: Partial<GameSettings>) => {
    setDraftSettings((currentDraft) => ({
      ...currentDraft,
      ...settings,
    }));
    setSavedMessage(null);
  };

  const handleSave = () => {
    setGameSettings(draftSettings);
    setSavedMessage("Saved successfully.");
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="relative w-full max-w-xl bg-[url('/panels/menu-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-7 py-8 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        role="dialog"
        aria-modal="true"
        aria-label="Game settings"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-md border border-amber-100/30 bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100 transition hover:border-amber-100/65 hover:bg-amber-100/15 active:scale-95"
        >
          Close
        </button>

        <h2 className="text-center text-2xl font-semibold text-stone-100">
          Settings
        </h2>
        <p className="mt-3 text-center text-sm text-amber-100/70">
          Choose your quiz settings.
        </p>

        <div className="mt-7 space-y-5">
          <label className={fieldClass}>
            <span className={labelClass}>Category</span>
            <select
              value={draftSettings.category ?? ""}
              onChange={(event) =>
                updateDraftSettings({
                  category: toCategoryCode(event.target.value),
                })
              }
              className={selectClass}
            >
              <option value="">--</option>
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
              value={draftSettings.difficulty ?? ""}
              onChange={(event) =>
                updateDraftSettings({
                  difficulty: toDifficulty(event.target.value),
                })
              }
              className={selectClass}
            >
              <option value="">--</option>
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
              value={draftSettings.type ?? ""}
              onChange={(event) =>
                updateDraftSettings({
                  type: toQuestionType(event.target.value),
                })
              }
              className={selectClass}
            >
              <option value="">--</option>
              {questionTypeOptions.map((typeOption) => (
                <option key={typeOption} value={typeOption}>
                  {typeOption}
                </option>
              ))}
            </select>
          </label>
        </div>

        {savedMessage ? (
          <p className="mt-5 text-center text-sm font-semibold text-emerald-200">
            {savedMessage}
          </p>
        ) : null}

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className={panelButtonClass}
            disabled={!hasChanges}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
}
