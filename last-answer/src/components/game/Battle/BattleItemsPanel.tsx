import Image from "next/image";

export function BattleItemsPanel() {
  return (
    <button
      type="button"
      className="relative flex h-full min-h-[8.8rem] aspect-square shrink-0 appearance-none items-center justify-center overflow-hidden border-0 bg-transparent p-0 text-center text-[1.05rem] font-semibold tracking-[0.02em] text-[#ead3b1] shadow-none outline-none transition hover:-translate-y-0.5 hover:brightness-110"
    >
      <Image
        src="/panels/item_buttons-panel.png"
        alt=""
        fill
        priority
        sizes="(max-width: 768px) 8.8rem, 12rem"
        className="pointer-events-none object-fill"
      />
      <span className="relative z-10 px-3 text-[1.15rem] text-[#ead3b1] drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)]">
        Items
      </span>
    </button>
  );
}
