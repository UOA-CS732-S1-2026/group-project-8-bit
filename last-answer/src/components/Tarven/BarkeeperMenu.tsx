"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useModalCloseAnimation } from "@/components/game/useModalCloseAnimation";
import DialogueScene, { DialogueSingle } from "../game/DialogueScene";
import { PageTarget } from "../game/quest/PageTarget";
import { getChatAndrewDialogues } from "@/game/dialogues/chatAndrew";
import { beforeStart } from "@/game/dialogues/questPage";
import Image from "next/image";
import { supportToolConfigs } from "@/game/core/battleCore";
import type { Player, SupportToolId } from "@/game/core/types";
import { retainSceneryMusic, stopSceneryMusicNow } from "@/lib/sceneryMusic";
import { retainTavernMusic, stopTavernMusicNow } from "@/lib/tavernMusic";
import { useMCStore } from "@/store/mcStore";

type BarkeeperMenuProps = {
  onClose: () => void;
};

type ShopItem = {
  id: SupportToolId;
  name: string;
  price: number;
  description: string;
  stock: number;
  iconSrc: string;
  shortLabel: string;
};

type MainMenuItem = {
  key: string;
  label: string;
  subtitle: string;
  iconSrc: string;
  onClick: () => void;
};

const backgroundImage = "url('/panels/tarven-panel.png')";
const chatDialogueBackground = "url('/backgrounds/chat-barkeeper.png')";
const pageDialogueBackground = "url('/backgrounds/barkeeper-interact.png')";

const pageQuest = {
  id: "PageFight",
  title: "Find Page",
  description: "After lv10, talk with barkeeper to find Page.",
};

const menuItemClass =
  "w-full rounded-[1rem] border border-amber-100/16 bg-[linear-gradient(180deg,rgba(30,21,14,0.82)_0%,rgba(16,12,10,0.92)_100%)] px-4 py-3 text-left shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition duration-150 hover:-translate-y-0.5 hover:border-amber-100/34 hover:shadow-[0_14px_32px_rgba(0,0,0,0.28)] active:translate-y-[1px] active:scale-[0.98]";

const closeButtonClass =
  "absolute right-8 top-6 rounded-md border border-amber-100/30 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100 transition hover:border-amber-100/65 hover:bg-amber-100/15 active:scale-95";

const shopVisuals: Record<
  SupportToolId,
  { iconSrc: string; shortLabel: string; lore: string }
> = {
  analyze: {
    iconSrc: "/battle/support-book.png",
    shortLabel: "Unmasking",
    lore: "Removes false paths before doubt can take hold.",
  },
  hourglass: {
    iconSrc: "/battle/magic-hourglass.png",
    shortLabel: "Sand",
    lore: "Buys precious seconds when the question clock turns cruel.",
  },
  barrier: {
    iconSrc: "/battle/aegis-shield.png",
    shortLabel: "Aegis",
    lore: "A defensive ward carried by hunters who expect retaliation.",
  },
  chainGuard: {
    iconSrc: "/battle/oathbound-chain.png",
    shortLabel: "Chain",
    lore: "Keeps a hard-earned combo from collapsing under pressure.",
  },
};

function BarkeeperPurchasePanel({
  onClose,
  player,
  onPurchase,
}: {
  onClose: () => void;
  player: Player;
  onPurchase: (item: ShopItem, qty: number) => void;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQty = (id: string) => quantities[id] ?? 1;
  const setQty = (id: string, val: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, val) }));

  const shopItems: ShopItem[] = (
    Object.keys(supportToolConfigs) as SupportToolId[]
  ).map((toolId) => {
    const inventoryEntry = player.inventory.find(
      (property) => property.id === toolId,
    );
    const tool = supportToolConfigs[toolId];
    const visual = shopVisuals[toolId];

    return {
      id: toolId,
      name: tool.name,
      price: inventoryEntry?.price ?? 0,
      stock: inventoryEntry?.leftNumber ?? 0,
      description: tool.description,
      iconSrc: visual.iconSrc,
      shortLabel: visual.shortLabel,
    };
  });

  return (
    <section
      className="relative flex h-[min(78vh,56rem)] w-[min(46vw,39rem)] shrink-0 flex-col overflow-hidden bg-[length:100%_100%] bg-no-repeat bg-center px-10 py-10 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
      style={{ backgroundImage }}
      role="dialog"
      aria-label="Purchase submenu"
    >
      <button type="button" onClick={onClose} className={closeButtonClass}>
        Close
      </button>

      <div className="flex items-start justify-between gap-4 pr-32">
        <div>
          <h3 className="text-2xl font-semibold text-stone-100">Purchase</h3>
          <p className="mt-1 max-w-[18rem] text-sm leading-6 text-amber-100/72">
            Prepare for battle with the same four support tools used in combat.
          </p>
        </div>
        <div className="rounded-xl border border-amber-100/20 bg-black/30 px-4 py-2 text-right shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-100/60">
            Your Coin
          </div>
          <div className="flex items-center justify-end gap-2 text-lg font-semibold text-[#f5d58d]">
            <Image
              src="/topbar/gold_coin_icon.png"
              alt=""
              width={72}
              height={72}
              className="-my-3 h-[72px] w-[72px]"
            />
            <span>{player.coins}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-amber-100/52">
            Merchant Stock
          </div>
          <div className="text-xs text-amber-100/55">4 battle tools</div>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-color:rgba(212,176,122,0.65)_rgba(0,0,0,0.12)] [scrollbar-width:thin]">
          {shopItems.map((item) => {
            const qty = getQty(item.id);
            const affordable = player.coins >= item.price * qty;
            const tool = supportToolConfigs[item.id];

            return (
              <article
                key={item.id}
                className="rounded-[1rem] border border-amber-100/16 bg-[linear-gradient(180deg,rgba(30,21,14,0.82)_0%,rgba(16,12,10,0.92)_100%)] p-3 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[0.95rem] border border-amber-100/14 bg-[radial-gradient(circle_at_30%_30%,rgba(255,218,157,0.18)_0%,rgba(70,45,18,0.14)_46%,rgba(0,0,0,0.12)_100%)]">
                    <Image
                      src={item.iconSrc}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[0.6rem] uppercase tracking-[0.18em] text-amber-100/48">
                          {item.shortLabel}
                        </div>
                        <h4 className="mt-1 text-[1.08rem] font-semibold leading-5 text-stone-100">
                          {item.name}
                        </h4>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="flex items-center justify-end gap-1 text-sm font-semibold text-[#f5d58d]">
                          <Image
                            src="/topbar/gold_coin_icon.png"
                            alt=""
                            width={65}
                            height={65}
                            className="h-[65px] w-[65px]"
                          />
                          <span>{item.price}</span>
                        </div>
                        <div
                          className={[
                            "mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em]",
                            affordable ? "text-[#c5dfb8]" : "text-[#d28f83]",
                          ].join(" ")}
                        >
                          {affordable ? "Can Buy" : "No Coin"}
                        </div>
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-amber-50/76">
                      {item.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.62rem] uppercase tracking-[0.16em] text-amber-100/54">
                      <span>
                        {tool.strongAssist
                          ? "Strong Assist"
                          : "Standard Assist"}
                      </span>
                      <span>Owned {item.stock}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <div className="flex items-center rounded-md border border-amber-100/20 bg-black/30 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setQty(item.id, qty - 1)}
                          className="px-2.5 py-1.5 text-sm font-bold text-amber-100/70 hover:bg-amber-200/10 hover:text-amber-50 transition active:scale-95"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-[0.72rem] font-semibold text-amber-100">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(item.id, qty + 1)}
                          className="px-2.5 py-1.5 text-sm font-bold text-amber-100/70 hover:bg-amber-200/10 hover:text-amber-50 transition active:scale-95"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onPurchase(item, qty)}
                        disabled={!affordable}
                        className={[
                          "rounded-md border px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition",
                          affordable
                            ? "border-amber-200/40 bg-amber-200/10 text-amber-50 hover:-translate-y-0.5 hover:border-amber-100/70 hover:bg-amber-200/18 active:translate-y-0 active:scale-95"
                            : "cursor-not-allowed border-amber-100/12 bg-black/20 text-amber-100/32",
                        ].join(" ")}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getRandomAndrewDialogues(): DialogueSingle[] {
  const chatAndrewDialogues = getChatAndrewDialogues();
  const randomIndex = Math.floor(Math.random() * chatAndrewDialogues.length);
  return chatAndrewDialogues[randomIndex];
}

export default function BarkeeperMenu({ onClose }: BarkeeperMenuProps) {
  const router = useRouter();
  const [openPurchasePanel, setOpenPurchasePanel] = useState(false);
  const [chatDialogues, setChatDialogues] = useState<DialogueSingle[] | null>(
    null,
  );
  const [showPageDialogue, setShowPageDialogue] = useState(false);
  const [showPageTarget, setShowPageTarget] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [undoPurchase, setUndoPurchase] = useState<{
    item: ShopItem;
    qty: number;
    refundCoins: number;
  } | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<
    "pageQuest" | "lastAnswer" | null
  >(null);
  const { isClosing: isConfirmClosing, requestClose: closeConfirm } =
    useModalCloseAnimation(() => {
      setPendingConfirm(null);
      setShowPageDialogue(false);
    });
  const undoTimerRef = useRef<number | null>(null);
  const player = useMCStore((state) => state.player);
  const startQuest = useMCStore((state) => state.startQuest);
  const completeQuest = useMCStore((state) => state.completeQuest);
  const buyProperty = useMCStore((state) => state.buyProperty);
  const refundProperty = useMCStore((state) => state.refundProperty);
  const pageQuestCompleted =
    player.completedQuests?.some((quest) => quest.id === pageQuest.id) ?? false;

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    };
  }, []);

  const closeMenu = () => {
    setOpenPurchasePanel(false);
    setChatDialogues(null);
    onClose();
  };

  const handleChatClick = () => {
    setOpenPurchasePanel(false);
    setChatDialogues(getRandomAndrewDialogues());
  };

  const handlePageDialogueFinish = () => {
    setPendingConfirm("pageQuest");
  };

  const handlePageTargetFinish = () => {
    completeQuest(pageQuest);
    stopSceneryMusicNow();
    retainTavernMusic();
    setShowPageTarget(false);
    closeMenu();
  };

  const handleLastAnswerClick = () => {
    setPendingConfirm("lastAnswer");
  };

  const handleConfirmAction = () => {
    if (pendingConfirm === "pageQuest") {
      setPendingConfirm(null);
      setShowPageDialogue(false);
      if (player.level < 10) {
        setToastMessage("Reach level 10 before starting this challenge.");
        return;
      }
      startQuest(pageQuest);
      stopTavernMusicNow();
      retainSceneryMusic();
      setShowPageTarget(true);
    } else if (pendingConfirm === "lastAnswer") {
      setPendingConfirm(null);
      stopTavernMusicNow();
      closeMenu();
      router.push("/theQuest/theEnd");
    }
  };

  const handlePurchase = (item: ShopItem, qty: number) => {
    const purchased = buyProperty(item.id, qty);

    if (!purchased) {
      setToastMessage(`Not enough coin to buy ${item.name}.`);
      return;
    }

    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    setUndoPurchase({ item, qty, refundCoins: item.price * qty });
    undoTimerRef.current = window.setTimeout(() => setUndoPurchase(null), 5000);
  };

  const handleUndo = () => {
    if (!undoPurchase) return;
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    refundProperty(undoPurchase.item.id, undoPurchase.qty, undoPurchase.refundCoins);
    setUndoPurchase(null);
  };

  const mainMenuItems: MainMenuItem[] = [
    {
      key: "chat",
      label: "Chat",
      subtitle: "Talk with Andrew",
      iconSrc: "/icons/tavern-menu/chat.png?v=20260430b",
      onClick: handleChatClick,
    },
    {
      key: "purchase",
      label: "Purchase",
      subtitle: "Buy battle tools",
      iconSrc: "/icons/tavern-menu/purchase.png?v=20260430b",
      onClick: () => setOpenPurchasePanel(true),
    },
    {
      key: "end",
      label: "End",
      subtitle: "Leave this menu",
      iconSrc: "/icons/tavern-menu/end.png?v=20260430b",
      onClick: closeMenu,
    },
  ];

  if (player.level >= 5 && !pageQuestCompleted) {
    mainMenuItems.splice(2, 0, {
      key: "talk-page",
      label: "Talk about Page",
      subtitle: "Quest discussion",
      iconSrc: "/icons/tavern-menu/chat.png?v=20260430b",
      onClick: () => setShowPageDialogue(true),
    });
  }

  if (player.level >= 20 && pageQuestCompleted) {
    mainMenuItems.splice(mainMenuItems.length - 1, 0, {
      key: "last-answer",
      label: "The Last Answer",
      subtitle: "Final challenge",
      iconSrc: "/icons/tavern-menu/purchase.png?v=20260430b",
      onClick: handleLastAnswerClick,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm"
      onClick={closeMenu}
    >
      {chatDialogues && (
        <div
          className="absolute inset-0 z-[70]"
          onClick={(event) => event.stopPropagation()}
        >
          <DialogueScene
            dialogues={chatDialogues}
            backgroundImage={chatDialogueBackground}
            onFinish={() => setChatDialogues(null)}
          />
        </div>
      )}
      {showPageDialogue && (
        <div
          className="absolute inset-0 z-[70]"
          onClick={(event) => event.stopPropagation()}
        >
          <DialogueScene
            dialogues={beforeStart()}
            backgroundImage={pageDialogueBackground}
            onFinish={handlePageDialogueFinish}
          />
        </div>
      )}
      {showPageTarget && (
        <div
          className="absolute inset-0 z-[75]"
          onClick={(event) => event.stopPropagation()}
        >
          <PageTarget onFinish={handlePageTargetFinish} />
        </div>
      )}
      {undoPurchase && (
        <div className="fixed left-1/2 top-6 z-[80] -translate-x-1/2 flex items-center gap-3 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-8 py-4 text-amber-100 shadow-[0_18px_45px_rgba(0,0,0,0.55)]" onClick={(e) => e.stopPropagation()}>
          <span className="text-base font-semibold">
            Purchased {undoPurchase.qty}× {undoPurchase.item.name}
          </span>
          <button
            type="button"
            onClick={handleUndo}
            className="rounded border border-amber-200/40 bg-amber-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-50 transition hover:border-amber-100/70 hover:bg-amber-200/20 active:scale-95"
          >
            Undo
          </button>
        </div>
      )}
      {toastMessage && !undoPurchase && (
        <div className="pointer-events-none fixed left-1/2 top-6 z-[80] -translate-x-1/2 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-8 py-4 text-center text-lg font-semibold text-amber-100 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
          {toastMessage}
        </div>
      )}
      <div
        className="flex w-full max-w-5xl flex-row items-stretch justify-center gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <section
          className="relative flex h-[min(78vh,56rem)] min-h-0 w-[min(46vw,39rem)] shrink-0 flex-col overflow-hidden bg-[length:100%_100%] bg-no-repeat bg-center px-10 py-10 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
          style={{ backgroundImage }}
          role="dialog"
          aria-modal="true"
          aria-label="Barkeeper menu"
        >
          <button
            type="button"
            onClick={closeMenu}
            className={closeButtonClass}
          >
            Close
          </button>

          <h2 className="text-center text-3xl font-semibold text-stone-100">
            Andrew
          </h2>
          <p className="mt-4 text-center text-sm leading-6 text-amber-100/85">
            Good to see you. You can buy items, borrow books, or participate in
            competitions from me.
          </p>

          <div className="mt-6 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-color:rgba(212,176,122,0.65)_rgba(0,0,0,0.12)] [scrollbar-width:thin]">
            {mainMenuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={menuItemClass}
                onClick={item.onClick}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[0.85rem] border border-amber-100/14 bg-[radial-gradient(circle_at_30%_30%,rgba(255,218,157,0.18)_0%,rgba(70,45,18,0.14)_46%,rgba(0,0,0,0.12)_100%)]">
                    <Image
                      src={item.iconSrc}
                      alt=""
                      width={48}
                      height={48}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[1.05rem] font-semibold leading-5 text-stone-100">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-amber-100/52">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {openPurchasePanel ? (
          <BarkeeperPurchasePanel
            onClose={() => setOpenPurchasePanel(false)}
            player={player}
            onPurchase={handlePurchase}
          />
        ) : null}
      </div>

      {pendingConfirm && (
        <div
          className="game-modal-backdrop absolute inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          data-closing={isConfirmClosing}
          onClick={(e) => e.stopPropagation()}
        >
          <section
            className="game-modal-panel relative flex w-[min(88vw,26rem)] flex-col items-center bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-10 py-9 text-center text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
            data-closing={isConfirmClosing}
            role="alertdialog"
            aria-modal="true"
            aria-label={
              pendingConfirm === "pageQuest"
                ? "Confirm start quest"
                : "Confirm last challenge"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl font-bold tracking-wide text-amber-950">
              {pendingConfirm === "pageQuest"
                ? "Start the Quest?"
                : "Start the Last Challenge?"}
            </h3>
            <p className="mt-4 text-sm italic leading-relaxed text-amber-950">
              {pendingConfirm === "pageQuest"
                ? "Requires level 10. Make sure to save your progress first."
                : "This is the final challenge. Make sure to save your progress first."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                className="rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:border-stone-500/65 hover:bg-stone-700/75 active:translate-y-[1px] active:scale-[0.98]"
                onClick={handleConfirmAction}
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
    </div>
  );
}
