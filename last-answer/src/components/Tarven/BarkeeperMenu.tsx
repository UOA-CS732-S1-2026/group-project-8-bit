"use client";

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

const backgroundImage = "url('/panels/state-panel3.png')";

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
  "absolute right-4 top-4 rounded-md border border-amber-100/30 bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100 transition hover:border-amber-100/65 hover:bg-amber-100/15 active:scale-95";

function BarkeeperSubMenu({
  subMenu,
  onClose,
}: {
  subMenu: SubMenuConfig;
  onClose: () => void;
}) {
  return (
    <section
      className="relative w-full max-w-sm bg-[length:100%_100%] bg-no-repeat bg-center px-6 py-8 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
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
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm"
      onClick={closeMenu}
    >
      <div
        className="flex w-full max-w-4xl flex-col items-center justify-center gap-4 md:flex-row md:items-stretch"
        onClick={(event) => event.stopPropagation()}
      >
        <section
          className="relative w-full max-w-md bg-[length:100%_100%] bg-no-repeat bg-center px-6 py-8 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
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

        {activeSubMenu ? (
          <BarkeeperSubMenu
            subMenu={subMenus[activeSubMenu]}
            onClose={() => setActiveSubMenu(null)}
          />
        ) : null}
      </div>
    </div>
  );
}
