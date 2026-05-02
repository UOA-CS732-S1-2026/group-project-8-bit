"use client";

import {
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  CATEGORYCODE,
  type CategoryCode,
  type Difficulty,
  type GameSettings,
  type QuestionType,
  useGameStore,
} from "@/store/game-store";
import ModalPortal from "./ModalPortal";
import { useModalCloseAnimation } from "./useModalCloseAnimation";

type SettingPanelProps = {
  onClose: () => void;
};

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard"];
const questionTypeOptions: QuestionType[] = ["multiple", "boolean"];
const categoryCodeValues = Object.values(CATEGORYCODE);

const fieldClass = "space-y-2";
const labelClass =
  "block text-base font-black uppercase tracking-[0.22em] text-amber-950 relative  top-[7px]";

const selectClass =
  "w-full rounded border border-stone-600/55 bg-stone-800/65 px-3 py-2.5 text-sm text-amber-100 outline-none transition focus:border-stone-500/70";
const panelButtonClass =
  "rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone-600/55 disabled:hover:bg-stone-800/70 disabled:active:translate-y-0 disabled:active:scale-100";

const SETTINGS_PANEL_DESIGN_WIDTH = 576;
const SETTINGS_PANEL_FALLBACK_HEIGHT = 600;
const SETTINGS_PANEL_GAP_X = 20;
const SETTINGS_PANEL_GAP_Y = 20;

function ScaledSettingsPanel({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    height: SETTINGS_PANEL_FALLBACK_HEIGHT,
    scale: 1,
  });

  useLayoutEffect(() => {
    const updateScale = () => {
      const frame = frameRef.current;
      const content = contentRef.current;

      if (!frame || !content) {
        return;
      }

      const contentHeight =
        content.scrollHeight ||
        content.offsetHeight ||
        SETTINGS_PANEL_FALLBACK_HEIGHT;
      const availableWidth = Math.max(
        frame.clientWidth - SETTINGS_PANEL_GAP_X,
        1,
      );
      const availableHeight = Math.max(
        frame.clientHeight - SETTINGS_PANEL_GAP_Y,
        1,
      );
      const nextScale = Math.min(
        availableWidth / SETTINGS_PANEL_DESIGN_WIDTH,
        availableHeight / contentHeight,
        1,
      );

      setMetrics((currentMetrics) => {
        const heightChanged =
          Math.abs(currentMetrics.height - contentHeight) > 0.5;
        const scaleChanged =
          Math.abs(currentMetrics.scale - nextScale) > 0.001;

        if (!heightChanged && !scaleChanged) {
          return currentMetrics;
        }

        return {
          height: contentHeight,
          scale: nextScale,
        };
      });
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);

    if (frameRef.current) {
      resizeObserver.observe(frameRef.current);
    }

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
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
          width: SETTINGS_PANEL_DESIGN_WIDTH * metrics.scale,
          height: metrics.height * metrics.scale,
        }}
      >
        <div
          ref={contentRef}
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: SETTINGS_PANEL_DESIGN_WIDTH,
            transform: `scale(${metrics.scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

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
  const { isClosing, requestClose } = useModalCloseAnimation(onClose);
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
    <ModalPortal>
    <div
      className="game-modal-backdrop fixed inset-0 z-[60] h-dvh w-dvw overflow-hidden bg-black/60 backdrop-blur-sm"
      data-closing={isClosing}
      onClick={requestClose}
    >
      <ScaledSettingsPanel>
        <section
          className="game-modal-panel relative w-full overflow-hidden bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[9%] text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
          data-closing={isClosing}
          role="dialog"
          aria-modal="true"
          aria-label="Game settings"
          onClick={(event) => event.stopPropagation()}
        >
          <h2 className="text-center font-serif text-5xl font-extrabold tracking-wide text-amber-950">
            Settings
          </h2>
          <div className="mt-3 border-t border-stone-600/30" />
          <p className="mt-3 text-center text-base italic text-amber-950">
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
            <p className="mt-5 text-center text-sm italic font-semibold text-emerald-300">
              {savedMessage}
            </p>
          ) : null}

          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              className={panelButtonClass}
              disabled={!hasChanges}
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className={panelButtonClass}
              onClick={requestClose}
            >
              Cancel
            </button>
          </div>
        </section>
      </ScaledSettingsPanel>
    </div>
    </ModalPortal>
  );
}
