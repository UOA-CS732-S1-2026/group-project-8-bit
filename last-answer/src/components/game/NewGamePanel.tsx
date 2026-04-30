"use client";

import {
  type ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supportToolConfigs } from "@/game/core/battleCore";
import { defaultPlayer } from "@/lib/player";
import { useMCStore } from "@/store/mcStore";
import ModalPortal from "./ModalPortal";
import { useModalCloseAnimation } from "./useModalCloseAnimation";

type NewGamePanelProps = {
  onClose: () => void;
  onCreated: () => void;
};

const statCardClass =
  "rounded border border-stone-600/40 bg-stone-800/55 px-4 py-3";

const actionButtonClass =
  "rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone-600/55 disabled:hover:bg-stone-800/70 disabled:active:translate-y-0 disabled:active:scale-100";

const NEW_GAME_PANEL_DESIGN_WIDTH = 760;
const NEW_GAME_PANEL_FALLBACK_HEIGHT = 680;
const CONFIRM_PANEL_DESIGN_WIDTH = 384;
const CONFIRM_PANEL_FALLBACK_HEIGHT = 220;
const PANEL_GAP_X = 20;
const PANEL_GAP_Y = 20;

type ScaledPanelFrameProps = {
  children: ReactNode;
  designWidth: number;
  fallbackHeight: number;
};

function ScaledPanelFrame({
  children,
  designWidth,
  fallbackHeight,
}: ScaledPanelFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    height: fallbackHeight,
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
        content.scrollHeight || content.offsetHeight || fallbackHeight;
      const availableWidth = Math.max(frame.clientWidth - PANEL_GAP_X, 1);
      const availableHeight = Math.max(frame.clientHeight - PANEL_GAP_Y, 1);
      const nextScale = Math.min(
        availableWidth / designWidth,
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

    return () => {
      resizeObserver.disconnect();
    };
  }, [designWidth, fallbackHeight]);

  return (
    <div
      ref={frameRef}
      className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden"
    >
      <div
        className="relative shrink-0"
        style={{
          flex: "0 0 auto",
          width: designWidth * metrics.scale,
          height: metrics.height * metrics.scale,
        }}
      >
        <div
          ref={contentRef}
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: designWidth,
            transform: `scale(${metrics.scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function NewGamePanel({ onClose, onCreated }: NewGamePanelProps) {
  const resetPlayer = useMCStore((state) => state.resetPlayer);
  const [characterName, setCharacterName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const trimmedName = useMemo(() => characterName.trim(), [characterName]);
  const { isClosing, requestClose } = useModalCloseAnimation(onClose);
  const { isClosing: isConfirmClosing, requestClose: requestCloseConfirm } =
    useModalCloseAnimation(() => setPendingName(null));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedName) {
      setError("Character name is required.");
      return;
    }

    setError(null);
    setPendingName(trimmedName);
  };

  const handleConfirmCreate = () => {
    if (!pendingName) {
      return;
    }

    resetPlayer(pendingName);
    setPendingName(null);
    onCreated();
  };

  return (
    <ModalPortal>
    <div
      className="game-modal-backdrop fixed inset-0 z-[60] overflow-hidden bg-black/60 backdrop-blur-sm"
      data-closing={isClosing}
      onClick={requestClose}
    >
      <ScaledPanelFrame
        designWidth={NEW_GAME_PANEL_DESIGN_WIDTH}
        fallbackHeight={NEW_GAME_PANEL_FALLBACK_HEIGHT}
      >
      <section
        className="game-modal-panel relative w-full overflow-hidden bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[9%] text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        data-closing={isClosing}
        role="dialog"
        aria-modal="true"
        aria-label="Create new character"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-center font-serif text-4xl font-extrabold tracking-wide text-amber-950">
          Create New Character
        </h2>
        <div className="mt-3 border-t border-stone-600/30" />
        <p className="mt-3 text-center text-base italic text-amber-950">
          Choose a name and begin with the default adventurer attributes.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-6">
          <label className="block space-y-2">
            <span className="block text-base font-black uppercase tracking-[0.22em] text-amber-950">
              Character Name
            </span>
            <input
              type="text"
              value={characterName}
              onChange={(event) => {
                setCharacterName(event.target.value);
                setError(null);
              }}
              className="w-full rounded border border-stone-600/55 bg-stone-800/65 px-3 py-2.5 text-sm text-amber-100 outline-none transition placeholder:text-stone-400/60 focus:border-stone-500/70"
              placeholder="Enter a name"
              maxLength={30}
            />
          </label>

          {error ? (
            <p className="text-sm font-semibold text-rose-200">{error}</p>
          ) : null}

          <div className="grid grid-cols-3 gap-3">
            <div className={statCardClass}>
              <p className="text-base font-black uppercase tracking-[0.22em] text-amber-950">
                Max HP
              </p>
              <p className="mt-1 text-lg font-semibold text-amber-100">
                {defaultPlayer.maxHp}
              </p>
            </div>
            <div className={statCardClass}>
              <p className="text-base font-black uppercase tracking-[0.22em] text-amber-950">
                Attack
              </p>
              <p className="mt-1 text-lg font-semibold text-amber-100">
                {defaultPlayer.attack}
              </p>
            </div>
            <div className={statCardClass}>
              <p className="text-base font-black uppercase tracking-[0.22em] text-amber-950">
                Defense
              </p>
              <p className="mt-1 text-lg font-semibold text-amber-100">
                {defaultPlayer.defense}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-black uppercase tracking-[0.28em] text-amber-950">
              Inventory
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {defaultPlayer.inventory.map((property) => {
                const tool = supportToolConfigs[property.id];

                return (
                  <div key={property.id} className={statCardClass}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-amber-100">
                          {tool.name}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-amber-100/60">
                          {property.id}
                        </p>
                      </div>
                      <p className="shrink-0 rounded-md border border-amber-200/20 bg-black/35 px-2 py-1 text-xs font-semibold text-amber-100">
                        x{property.leftNumber}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="submit"
              className={actionButtonClass}
              disabled={!trimmedName}
            >
              Create Character
            </button>
            <button
              type="button"
              className={actionButtonClass}
              onClick={requestClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
      </ScaledPanelFrame>

      {pendingName ? (
        <div
          className="game-modal-backdrop absolute inset-0 z-[70] overflow-hidden bg-black/55 backdrop-blur-sm"
          data-closing={isConfirmClosing}
          onClick={(event) => {
            event.stopPropagation();
            requestCloseConfirm();
          }}
        >
          <ScaledPanelFrame
            designWidth={CONFIRM_PANEL_DESIGN_WIDTH}
            fallbackHeight={CONFIRM_PANEL_FALLBACK_HEIGHT}
          >
          <section
            className="game-modal-panel relative w-full bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[9%] text-center text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
            data-closing={isConfirmClosing}
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm new character"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="font-serif text-xl font-bold tracking-wide text-stone-800">
              Create Character?
            </h3>
            <p className="mt-4 text-sm italic leading-relaxed text-stone-600">
              Start a new run as {pendingName}? Current unsaved player state
              will be replaced.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                className={actionButtonClass}
                onClick={handleConfirmCreate}
              >
                Yes
              </button>
              <button
                type="button"
                className={actionButtonClass}
                onClick={requestCloseConfirm}
              >
                No
              </button>
            </div>
          </section>
          </ScaledPanelFrame>
        </div>
      ) : null}
    </div>
    </ModalPortal>
  );
}
