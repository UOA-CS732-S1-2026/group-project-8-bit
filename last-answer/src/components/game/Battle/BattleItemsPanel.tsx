import Image from "next/image";

export function BattleItemsPanel() {
  return (
    <button
      type="button"
      className="group relative flex h-[5rem] w-[5.4rem] shrink-0 appearance-none items-center justify-center overflow-hidden border-0 bg-transparent p-0 text-center text-[0.9rem] font-semibold tracking-[0.02em] text-[#ead3b1] shadow-[0_10px_20px_rgba(0,0,0,0.42)] outline-none transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.02] hover:shadow-[0_12px_22px_rgba(0,0,0,0.46),0_0_6px_rgba(214,154,84,0.08)] sm:h-[5.4rem] sm:w-[5.8rem]"
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
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-0 pt-0 sm:pt-0.5">
        <Image
          src="/battle/item-final.png"
          alt=""
          width={70}
          height={70}
          sizes="70px"
          className="pointer-events-none h-12 w-12 object-contain sm:h-[3.6rem] sm:w-[3.6rem]"
        />
        <span className="-mt-2 px-2 text-[0.82rem] leading-none text-[#ead3b1] drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] sm:-mt-2 sm:text-[0.9rem]">
          Items
        </span>
      </div>
    </button>
  );
}
