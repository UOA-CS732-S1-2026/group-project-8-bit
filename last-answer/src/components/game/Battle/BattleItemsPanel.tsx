import Image from "next/image";

type BattleItemsPanelProps = {
  onClick?: () => void;
  disabled?: boolean;
  activeCount?: number;
  isOpen?: boolean;
};

export function BattleItemsPanel({
  onClick,
  disabled = false,
  activeCount = 0,
  isOpen = false,
}: BattleItemsPanelProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "group relative flex h-[4.35rem] w-[4.75rem] shrink-0 appearance-none items-center justify-center overflow-hidden border-0 bg-transparent p-0 text-center text-[0.82rem] font-semibold tracking-[0.02em] text-[#ead3b1] shadow-[0_10px_20px_rgba(0,0,0,0.42)] outline-none transition duration-200 sm:h-[4.7rem] sm:w-[5.05rem]",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:-translate-y-0.5 hover:brightness-[1.02] hover:shadow-[0_12px_22px_rgba(0,0,0,0.46),0_0_6px_rgba(214,154,84,0.08)]",
      ].join(" ")}
    >
      <Image
        src="/panels/item_buttons-panel.png"
        alt=""
        fill
        priority
        sizes="5.8rem"
        className="pointer-events-none object-fill"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,223,162,0.08)_0%,rgba(255,223,162,0.03)_34%,rgba(255,223,162,0)_72%)] opacity-0 transition duration-200 group-hover:opacity-100" />
      {activeCount > 0 ? (
        <div className="absolute right-1.5 top-1.5 z-20 flex h-5 min-w-5 items-center justify-center rounded-full border border-[#f0d6a2]/70 bg-[rgba(81,48,18,0.88)] px-1 text-[0.62rem] font-bold leading-none text-[#ffe4b7] shadow-[0_0_12px_rgba(240,190,120,0.28)]">
          {activeCount}
        </div>
      ) : null}
      {isOpen ? (
        <div className="pointer-events-none absolute inset-1 rounded-[0.8rem] border border-[#f0d6a2]/55 shadow-[0_0_18px_rgba(240,190,120,0.18)]" />
      ) : null}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-0 pt-0 sm:pt-0.5">
        <Image
          src="/battle/item-final.png"
          alt=""
          width={70}
          height={70}
          sizes="70px"
          className="pointer-events-none h-10 w-10 object-contain sm:h-[3.2rem] sm:w-[3.2rem]"
        />
        <span className="-mt-1.5 px-2 text-[0.74rem] leading-none text-[#ead3b1] drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] sm:text-[0.8rem]">
          Items
        </span>
      </div>
    </button>
  );
}
