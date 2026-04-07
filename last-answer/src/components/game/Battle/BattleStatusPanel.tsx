import Image from "next/image";
import HPBar from "../HPBar";

type BattleStatusPanelProps = {
  name: string;
  portraitSrc: string;
  portraitAlt: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  topRightText?: string;
  className?: string;
};

export function BattleStatusPanel({
  name,
  portraitSrc,
  portraitAlt,
  hp,
  maxHp,
  attack,
  defense,
  topRightText,
  className,
}: BattleStatusPanelProps) {
  return (
    <section
      className={[
        "relative h-[6.1rem] overflow-hidden rounded-[0.95rem] bg-transparent shadow-[0_8px_16px_rgba(0,0,0,0.35)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="absolute inset-0 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat" />

      <div className="relative flex h-full items-center gap-3 px-5 py-3">
        <div
          className="shrink-0 overflow-hidden rounded-[0.7rem] bg-black/25"
          style={{ width: "3.35rem", height: "3.35rem" }}
        >
          <Image
            src={portraitSrc}
            alt={portraitAlt}
            width={80}
            height={80}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 truncate text-[1.22rem] font-semibold leading-none text-[#ecd5b4]">
              {name}
            </div>
            <div className="shrink-0 min-w-[4.5rem] text-right text-[0.86rem] font-semibold tracking-[0.12em] text-stone-200">
              {topRightText ?? ""}
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between gap-3">
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-stone-300">
              HP
            </div>
            <div className="text-[0.86rem] font-semibold tracking-[0.12em] text-stone-200">
              {hp} / {maxHp}
            </div>
          </div>

          <div className="mt-1 max-w-[16rem]">
            <HPBar
              currentHp={hp}
              maxHp={maxHp}
              label=""
              className="max-w-none"
              showValueText={false}
              showOverlayPercent={false}
            />
          </div>

          <div className="mt-1.5 flex items-center gap-4 text-[0.88rem] font-semibold text-stone-200">
            <div className="flex items-center gap-1.5">
              <span className="text-[0.64rem] uppercase tracking-[0.16em] text-stone-400">
                Atk
              </span>
              <span>{attack}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[0.64rem] uppercase tracking-[0.16em] text-stone-400">
                Def
              </span>
              <span>{defense}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
