import Image from "next/image";
import HPBar from "./HPBar";

export function GameMainBar() {
  const panelFill = "bg-center bg-no-repeat bg-[length:100%_100%]";
  const buttonClass =
    "flex items-center justify-center gap-1 rounded-sm bg-[url('/buttons/parchment-btn.png')] px-1 text-[10px] font-semibold text-zinc-900 sm:gap-1.5 sm:px-2 sm:text-xs";

  return (
    <header className="flex w-full items-start gap-1 p-1.5 sm:items-center sm:gap-2 sm:p-2">
      <div
        className={`min-w-0 bg-[url('/panels/state-panel3.png')] px-2 py-1 ${panelFill} flex shrink-0 items-start gap-1 sm:items-center sm:gap-2`}
      >
        <div
          className={`relative flex size-[clamp(3rem,8vw,5rem)] items-center justify-center bg-[url('/panels/mc-portrait-frame3.png')] ${panelFill}`}
        >
          <Image
            src="/portraits/mc-portrait.png"
            alt="Character Portrait"
            width={96}
            height={96}
            className="h-[86%] w-[86%] object-cover"
            priority
          />
        </div>

        <div className={`p-2`}>
          <div className="text-[10px] font-semibold tracking-wide text-white sm:text-xs">
            LV 12
          </div>
          <HPBar
            currentHp={10}
            maxHp={100}
            className="w-[clamp(8.25rem,30vw,15.5rem)] max-w-none"
            showValues={true}
          />
        </div>
      </div>

      <div className="center-banner min-w-0 flex-1">
        <div
          className={`w-full bg-[url('/banners/game-title-banner.png')] px-2 py-1 ${panelFill}`}
        >
          <h2 className="truncate text-center text-xs font-semibold tracking-[0.08em] text-stone-200 sm:text-sm md:text-base">
            Foggy Forest
          </h2>
        </div>
      </div>

      <div
        className={`shrink-0 bg-[url('/panels/buttons-panel2.png')] px-2 py-2 sm:px-4 ${panelFill}`}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={`${buttonClass} h-[clamp(1.5rem,5vh,2rem)] w-[clamp(3rem, 8vw, 4.2rem)] ${panelFill}`}
          >
            <Image
              src="/icons/info-icon.png"
              alt="information"
              width={32}
              height={32}
              className="size-3.5 sm:size-5"
            />
            <span className="hidden sm:inline">Info</span>
          </button>

          <button
            type="button"
            className={`${buttonClass} h-[clamp(1.5rem,5vh,2rem)] w-[clamp(3rem, 8vw, 4.2rem)] ${panelFill}`}
          >
            <Image
              src="/icons/menu-icon.png"
              alt="Menu"
              width={32}
              height={32}
              className="size-3.5 sm:size-5"
            />
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
