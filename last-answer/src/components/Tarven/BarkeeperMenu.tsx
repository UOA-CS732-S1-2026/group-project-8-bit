"use client";

import Image from "next/image";
import { supportToolConfigs } from "@/game/core/battleCore";
import type { Player, SupportToolId } from "@/game/core/types";
import { useMCStore } from "@/store/mcStore";
import { useState } from "react";

type SubMenuKey = "purchase" | "books" | "competition";

type BarkeeperMenuProps = {
  onClose: () => void;
};

type SubMenuConfig = {
  title: string;
  items: string[];
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

const backgroundImage = "url('/panels/tarven-panel.png')";

const subMenus: Record<SubMenuKey, SubMenuConfig> = {
  purchase: {
    title: "Purchase",
    items: ["Health Tonic", "Iron Charm", "Traveler's Bread"],
  },
  books: {
    title: "Borrow Books",
    items: ["Bestiary Notes", "Old Tavern Ledger", "Map of Rumors"],
  },
  competition: {
    title: "Competition",
    items: ["Arm Wrestling", "Riddle Table", "Dart Challenge"],
  },
};

const menuItemClass =
  "w-full rounded-md border border-amber-200/20 bg-black/30 px-4 py-3 text-left text-base text-amber-100 transition duration-150 hover:border-amber-100/55 hover:bg-amber-200/15 hover:text-amber-50 active:translate-y-[1px] active:scale-[0.98]";

const closeButtonClass =
  "absolute right-6 top-6 rounded-md border border-amber-100/30 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100 transition hover:border-amber-100/65 hover:bg-amber-100/15 active:scale-95";

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
}: {
  onClose: () => void;
  player: Player;
}) {
  const shopItems: ShopItem[] = (
    Object.keys(supportToolConfigs) as SupportToolId[]
  ).map((toolId) => {
    const inventoryEntry = player.inventory.find((property) => property.id === toolId);
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
      className="relative flex h-[min(78vh,56rem)] w-full max-w-xl flex-col overflow-hidden bg-[length:100%_100%] bg-no-repeat bg-center px-10 py-10 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
      style={{ backgroundImage }}
      role="dialog"
      aria-label="Purchase submenu"
    >
      <button type="button" onClick={onClose} className={closeButtonClass}>
        Close
      </button>

      <div className="flex items-start justify-between gap-4 pr-20">
        <div>
          <h3 className="text-2xl font-semibold text-stone-100">Purchase</h3>
          <p className="mt-1 max-w-[18rem] text-sm leading-6 text-amber-100/72">
            Prepare for battle with the same four support tools used in combat.
          </p>
        </div>
        <div className="rounded-xl border border-amber-100/20 bg-black/30 px-4 py-3 text-right shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-amber-100/60">
            Your Coin
          </div>
          <div className="mt-1 flex items-center justify-end gap-2 text-lg font-semibold text-[#f5d58d]">
            <Image
              src="/topbar/gold_coin_icon.png"
              alt=""
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
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
            const affordable = player.coins >= item.price;
            const tool = supportToolConfigs[item.id];

            return (
              <article
                key={item.id}
                className="rounded-[1rem] border border-amber-100/16 bg-[linear-gradient(180deg,rgba(30,21,14,0.82)_0%,rgba(16,12,10,0.92)_100%)] p-3 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[0.95rem] border border-amber-100/14 bg-[radial-gradient(circle_at_30%_30%,rgba(255,218,157,0.18)_0%,rgba(70,45,18,0.14)_46%,rgba(0,0,0,0.12)_100%)]">
                    <Image
                      src={item.iconSrc}
                      alt={item.name}
                      width={42}
                      height={42}
                      className="h-[42px] w-[42px] object-contain"
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
                            width={13}
                            height={13}
                            className="h-[13px] w-[13px]"
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
                      <span>{tool.strongAssist ? "Strong Assist" : "Standard Assist"}</span>
                      <span>Owned {item.stock}</span>
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

function BarkeeperSubMenu({
  subMenu,
  onClose,
}: {
  subMenu: SubMenuConfig;
  onClose: () => void;
}) {
  return (
    <section
      className="relative w-full max-w-sm bg-[length:100%_100%] bg-no-repeat bg-center px-10 py-10 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
      style={{ backgroundImage }}
      role="dialog"
      aria-label={`${subMenu.title} submenu`}
    >
      <button type="button" onClick={onClose} className={closeButtonClass}>
        Close
      </button>

      <h3 className="text-center text-2xl font-semibold text-stone-100">
        {subMenu.title}
      </h3>

      <div className="mt-6 space-y-3">
        {subMenu.items.map((item) => (
          <button key={item} type="button" className={menuItemClass}>
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function BarkeeperMenu({ onClose }: BarkeeperMenuProps) {
  const [activeSubMenu, setActiveSubMenu] = useState<SubMenuKey | null>(null);
  const { player } = useMCStore((state) => state);

  const openSubMenu = (subMenu: SubMenuKey) => {
    setActiveSubMenu(subMenu);
  };

  const closeMenu = () => {
    setActiveSubMenu(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm"
      onClick={closeMenu}
    >
      <div
        className="flex w-full max-w-4xl flex-col items-center justify-center gap-4 md:flex-row md:items-stretch"
        onClick={(event) => event.stopPropagation()}
      >
        <section
          className="relative w-full max-w-md bg-[length:100%_100%] bg-no-repeat bg-center px-10 py-10 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
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

          <div className="mt-6 space-y-3">
            <button
              type="button"
              className={menuItemClass}
              onClick={() => setActiveSubMenu(null)}
            >
              Chat
            </button>
            <button
              type="button"
              className={menuItemClass}
              onClick={() => openSubMenu("purchase")}
            >
              Purchase
            </button>
            <button
              type="button"
              className={menuItemClass}
              onClick={() => openSubMenu("books")}
            >
              Borrow books
            </button>
            <button
              type="button"
              className={menuItemClass}
              onClick={() => openSubMenu("competition")}
            >
              Competition
            </button>
            <button type="button" className={menuItemClass} onClick={closeMenu}>
              End
            </button>
          </div>
        </section>

        {activeSubMenu === "purchase" ? (
          <BarkeeperPurchasePanel
            onClose={() => setActiveSubMenu(null)}
            player={player}
          />
        ) : null}

        {activeSubMenu && activeSubMenu !== "purchase" ? (
          <BarkeeperSubMenu
            subMenu={subMenus[activeSubMenu]}
            onClose={() => setActiveSubMenu(null)}
          />
        ) : null}
      </div>
    </div>
  );
}
