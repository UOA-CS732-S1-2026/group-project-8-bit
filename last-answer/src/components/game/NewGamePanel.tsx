"use client";

import {
  type ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supportToolConfigs } from "@/game/core/battleCore";
import {
  applyFateCards,
  cardReducesInventory,
  drawSingleCard,
  rerollOne,
  type FateCard,
  type FateRarity,
} from "@/game/core/fateCards";
import type { Player, SupportToolId } from "@/game/core/types";
import { defaultPlayer } from "@/lib/player";
import { useMCStore } from "@/store/mcStore";
import ModalPortal from "./ModalPortal";
import { useModalCloseAnimation } from "./useModalCloseAnimation";

type NewGamePanelProps = {
  onClose: () => void;
  onCreated: () => void;
};

const MAX_REROLLS_PER_CARD = 2;
const BLOOD_REROLL_HP_COST = 5;

const statCardClass =
  "rounded border border-stone-700/45 bg-stone-900/55 px-3 py-2";

const actionButtonClass =
  "rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone-600/55 disabled:hover:bg-stone-800/70 disabled:active:translate-y-0 disabled:active:scale-100";

const NEW_GAME_PANEL_DESIGN_WIDTH = 760;
const NEW_GAME_PANEL_FALLBACK_HEIGHT = 720;
const CONFIRM_PANEL_DESIGN_WIDTH = 384;
const CONFIRM_PANEL_FALLBACK_HEIGHT = 220;
const PANEL_GAP_X = 20;
const PANEL_GAP_Y = 20;

const RARITY_FRAME: Record<FateRarity, string> = {
  common:    "border-stone-600/60",
  rare:      "border-stone-600/60",
  epic:      "border-stone-600/60",
  legendary: "border-stone-600/60",
};

const RARITY_LABEL: Record<FateRarity, string> = {
  common:    "Common",
  rare:      "Rare",
  epic:      "Epic",
  legendary: "Legend",
};

const RARITY_LABEL_COLOR: Record<FateRarity, string> = {
  common:    "text-stone-300/80",
  rare:      "text-blue-400/90",
  epic:      "text-purple-400/90",
  legendary: "text-orange-400/95",
};

const CARD_BASE_BG = "bg-stone-800/65";


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

type FateCardBackProps = {
  onClick: () => void;
};

function FateCardBack({ onClick }: FateCardBackProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fate-card-back relative flex h-[10.5rem] w-full flex-col items-center justify-center overflow-hidden rounded border border-stone-600/55 bg-stone-800/65 px-2 py-2 text-center outline-none transition duration-200 hover:border-amber-300/55 hover:translate-y-[-1px] active:translate-y-[1px]"
      aria-label="Reveal fate card"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(220,170,90,0.14)_0%,rgba(0,0,0,0)_65%)]" />
      <div className="pointer-events-none absolute inset-1 rounded border border-amber-200/15" />
      <div className="font-serif text-[2.2rem] leading-none text-amber-200/55 drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]">
        ⚜
      </div>
      <div className="mt-2 font-serif text-[0.7rem] uppercase tracking-[0.32em] text-amber-100/55">
        Sealed Fate
      </div>
      <div className="mt-1 font-serif text-[0.55rem] italic tracking-[0.18em] text-amber-100/40">
        Click to reveal
      </div>
    </button>
  );
}

type FateCardSlotProps = {
  card: FateCard;
  rerollLabel: string;
  rerollDisabled: boolean;
  onReroll: () => void;
};

function FateCardSlot({
  card,
  rerollLabel,
  rerollDisabled,
  onReroll,
}: FateCardSlotProps) {
  return (
    <div
      className={[
        "fate-card-flip relative flex h-[10.5rem] flex-col overflow-hidden rounded border px-2 py-2 text-center",
        CARD_BASE_BG,
        RARITY_FRAME[card.rarity],
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-1 rounded border border-stone-600/30" />

      <div className="relative flex items-center justify-between">
        <span className={`font-serif text-[0.6rem] tracking-[0.2em] ${RARITY_LABEL_COLOR[card.rarity]}`}>
          {RARITY_LABEL[card.rarity]}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-1 py-1">
        <div className="font-serif text-[0.82rem] font-bold leading-tight text-amber-100">
          {card.name}
        </div>
        <div className="mt-1 flex flex-col items-center gap-[0.2rem]">
          {card.positiveText.map((text) => (
            <span
              key={`pos-${text}`}
              className="font-serif text-[0.62rem] tracking-[0.06em] text-amber-200/90"
            >
              {text.replace(/^\+\s*/, "")}
            </span>
          ))}
          {card.negativeText.map((text) => (
            <span
              key={`neg-${text}`}
              className="font-serif text-[0.62rem] italic tracking-[0.06em] text-stone-400/85"
            >
              {text.replace(/^-\s*/, "")}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReroll}
        disabled={rerollDisabled}
        className="relative w-full rounded border border-stone-600/55 bg-stone-800/60 px-1 py-1 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-amber-100/85 transition hover:border-stone-500/65 hover:bg-stone-700/60 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone-600/55 disabled:hover:bg-stone-800/60"
      >
        {rerollLabel}
      </button>
    </div>
  );
}

function getInventoryAmount(player: Player, toolId: SupportToolId) {
  return player.inventory.find((p) => p.id === toolId)?.leftNumber ?? 0;
}

export default function NewGamePanel({ onClose, onCreated }: NewGamePanelProps) {
  const savePlayer = useMCStore((state) => state.savePlayer);
  const [characterName, setCharacterName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<(FateCard | null)[]>([
    null,
    null,
    null,
  ]);
  const [rerollCounts, setRerollCounts] = useState<number[]>([0, 0, 0]);
  const [bloodPaid, setBloodPaid] = useState(0);
  const trimmedName = useMemo(() => characterName.trim(), [characterName]);
  const { isClosing, requestClose } = useModalCloseAnimation(onClose);
  const { isClosing: isConfirmClosing, requestClose: requestCloseConfirm } =
    useModalCloseAnimation(() => setPendingName(null));

  const previewPlayer = useMemo<Player>(() => {
    const base: Player = {
      ...defaultPlayer,
      inventory: defaultPlayer.inventory.map((p) => ({ ...p })),
    };
    const drawn = revealedCards.filter(
      (c): c is FateCard => c !== null,
    );
    const withCards = applyFateCards(base, drawn);
    const newMaxHp = Math.max(1, withCards.maxHp - bloodPaid);
    return {
      ...withCards,
      maxHp: newMaxHp,
      hp: Math.min(withCards.hp, newMaxHp),
    };
  }, [revealedCards, bloodPaid]);

  const handleRevealSlot = (index: number) => {
    if (revealedCards[index] !== null) return;
    const alreadyDrawn = revealedCards.filter((c): c is FateCard => c !== null);
    const excludeIds = new Set(alreadyDrawn.map((c) => c.id));
    const excludeNegInv = alreadyDrawn.some(cardReducesInventory);
    const newCard = drawSingleCard(excludeIds, excludeNegInv);
    if (!newCard) return;
    setRevealedCards((prev) =>
      prev.map((c, i) => (i === index ? newCard : c)),
    );
    setError(null);
  };

  const handleReroll = (index: number) => {
    const card = revealedCards[index];
    if (!card) return;
    const currentCount = rerollCounts[index];
    if (currentCount >= MAX_REROLLS_PER_CARD) return;

    const drawnAsList = revealedCards
      .map((c) => c)
      .filter((c): c is FateCard => c !== null);
    const indexInDrawn = drawnAsList.indexOf(card);
    const otherCards = drawnAsList.filter((_, i) => i !== indexInDrawn);
    const excludeNegInv = otherCards.some(cardReducesInventory);
    const newCard = rerollOne(drawnAsList, indexInDrawn, excludeNegInv);

    setRevealedCards((prev) =>
      prev.map((c, i) => (i === index ? newCard : c)),
    );
    setRerollCounts((prev) =>
      prev.map((n, i) => (i === index ? n + 1 : n)),
    );
    if (currentCount > 0) {
      setBloodPaid((b) => b + BLOOD_REROLL_HP_COST);
    }
  };

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

    const base: Player = {
      ...defaultPlayer,
      name: pendingName,
      inventory: defaultPlayer.inventory.map((p) => ({ ...p })),
    };
    const drawn = revealedCards.filter(
      (c): c is FateCard => c !== null,
    );
    const withCards = applyFateCards(base, drawn);
    const newMaxHp = Math.max(1, withCards.maxHp - bloodPaid);
    const finalPlayer: Player = {
      ...withCards,
      maxHp: newMaxHp,
      hp: newMaxHp,
    };

    savePlayer(finalPlayer);
    setPendingName(null);
    onCreated();
  };

  const rerollLabelFor = (count: number) => {
    if (count >= MAX_REROLLS_PER_CARD) return "Sealed";
    if (count === 0) return "Reroll · Free";
    return `Reroll · -${BLOOD_REROLL_HP_COST} Max HP`;
  };

  const drawnCount = revealedCards.filter((c) => c !== null).length;
  const canCreate = !!trimmedName;

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
        className="game-modal-panel relative w-full overflow-hidden bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[7%] py-[7%] text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        data-closing={isClosing}
        role="dialog"
        aria-modal="true"
        aria-label="Create new character"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-center font-serif text-3xl font-extrabold tracking-wide text-amber-950">
          Create New Character
        </h2>
        <div className="mt-2 border-t border-stone-600/30" />
        <p className="mt-2 text-center text-sm italic text-amber-950/85">
          Choose a name. Tempt fate if you dare.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block space-y-1.5">
            <span className="block text-sm font-black uppercase tracking-[0.22em] text-amber-950">
              Character Name
            </span>
            <input
              type="text"
              value={characterName}
              onChange={(event) => {
                setCharacterName(event.target.value);
                setError(null);
              }}
              className="w-full rounded border border-stone-600/55 bg-stone-800/65 px-3 py-2 text-sm text-amber-100 outline-none transition placeholder:text-stone-400/60 focus:border-stone-500/70"
              placeholder="Enter a name"
              maxLength={30}
            />
          </label>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-amber-950">
              Attributes
            </h3>
            <div className="mt-2 grid grid-cols-4 gap-2">
              <div className={statCardClass}>
                <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-amber-950">
                  Max HP
                </p>
                <p className="mt-0.5 text-base font-semibold text-amber-100">
                  {previewPlayer.maxHp}
                </p>
              </div>
              <div className={statCardClass}>
                <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-amber-950">
                  Attack
                </p>
                <p className="mt-0.5 text-base font-semibold text-amber-100">
                  {previewPlayer.attack}
                </p>
              </div>
              <div className={statCardClass}>
                <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-amber-950">
                  Defense
                </p>
                <p className="mt-0.5 text-base font-semibold text-amber-100">
                  {previewPlayer.defense}
                </p>
              </div>
              <div className={statCardClass}>
                <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-amber-950">
                  Coins
                </p>
                <p className="mt-0.5 text-base font-semibold text-amber-100">
                  {previewPlayer.coins}
                </p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-4 gap-2">
              {(Object.keys(supportToolConfigs) as SupportToolId[]).map(
                (toolId) => {
                  const tool = supportToolConfigs[toolId];
                  const amount = getInventoryAmount(previewPlayer, toolId);
                  return (
                    <div
                      key={toolId}
                      className="rounded border border-stone-700/45 bg-stone-900/45 px-2 py-1 text-center"
                    >
                      <p className="truncate text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-amber-100/65">
                        {tool.name}
                      </p>
                      <p
                        className={[
                          "mt-0.5 text-sm font-bold",
                          amount === 0 ? "text-stone-400" : "text-amber-100",
                        ].join(" ")}
                      >
                        x{amount}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-3">
              <h3 className="text-sm font-black uppercase tracking-[0.22em] text-amber-950">
                Fate Cards
                <span className="ml-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-amber-950/60">
                  Optional
                </span>
              </h3>
              <div className="mr-6 text-right text-[0.58rem] font-bold uppercase tracking-[0.14em] text-amber-950/80">
                <div>
                  Revealed:{" "}
                  <span className="text-amber-950">{drawnCount}/3</span>
                </div>
                {bloodPaid > 0 ? (
                  <div className="text-rose-700">
                    Blood paid: -{bloodPaid} Max HP
                  </div>
                ) : (
                  <div className="text-amber-950/65">
                    1 free reroll · then -{BLOOD_REROLL_HP_COST} Max HP each
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-3">
              {revealedCards.map((card, index) => (
                <div
                  key={`${index}-${rerollCounts[index]}-${card?.id ?? "back"}`}
                  className="fate-card-flip-in"
                >
                  {card ? (
                    <FateCardSlot
                      card={card}
                      rerollLabel={rerollLabelFor(rerollCounts[index])}
                      rerollDisabled={
                        rerollCounts[index] >= MAX_REROLLS_PER_CARD
                      }
                      onReroll={() => handleReroll(index)}
                    />
                  ) : (
                    <FateCardBack onClick={() => handleRevealSlot(index)} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {error ? (
            <p className="text-center text-sm font-semibold text-rose-200">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="submit"
              className={actionButtonClass}
              disabled={!canCreate}
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
              Seal Your Fate?
            </h3>
            <p className="mt-4 text-sm italic leading-relaxed text-stone-600">
              Begin as {pendingName}. Current unsaved progress will be lost.
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

      <style jsx global>{`
        @keyframes fateFlipIn {
          0% {
            transform: perspective(640px) rotateY(120deg);
            opacity: 0;
          }
          55% {
            opacity: 1;
          }
          100% {
            transform: perspective(640px) rotateY(0deg);
            opacity: 1;
          }
        }
        .fate-card-flip-in {
          animation: fateFlipIn 360ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
          transform-style: preserve-3d;
        }
        .fate-card-back {
          background-image: none;
        }
      `}</style>
    </div>
    </ModalPortal>
  );
}
