type HPBarProps = {
  currentHp: number;
  maxHp: number;
  label?: string;
  className?: string;
  showValues?: boolean;
  showValueText?: boolean;
  showOverlayPercent?: boolean;
  showOverlayValues?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function HPBar({
  currentHp,
  maxHp,
  label = "HP",
  className,
  showValues = true,
  showValueText = true,
  showOverlayPercent = true,
  showOverlayValues = false,
}: HPBarProps) {
  const safeMaxHp = maxHp > 0 ? maxHp : 1;
  const safeCurrentHp = clamp(currentHp, 0, safeMaxHp);
  const ratio = safeCurrentHp / safeMaxHp;
  const percentage = Math.round(ratio * 100);
  const isLow = ratio <= 0.35;
  const isCritical = ratio <= 0.15;

  const fillGradient =
    "linear-gradient(180deg, #7a1c12 0%, #99261a 35%, #7d1a12 65%, #5a0f0c 100%)";
  // : ratio > 0.3
  //   ? "linear-gradient(180deg, #ef4444 0%, #b91c1c 55%, #450a0a 100%)"
  //   : "linear-gradient(180deg, #fb7185 0%, #be123c 55%, #4a044e 100%)";

  const darknessOpacity = 0.18 + (1 - ratio) * 0.5;

  return (
    <div className={["w-full max-w-sm", className].filter(Boolean).join(" ")}>
      {showValueText ? (
        <div className="flex items-center justify-between gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-stone-200">
          <span>{label}</span>
          {showValues ? (
            <span className="text-xs tracking-[0.2em] text-stone-300">
              {safeCurrentHp} / {safeMaxHp}
            </span>
          ) : (
            <span className="text-xs tracking-[0.2em] text-stone-300">
              {percentage}%
            </span>
          )}
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <span className="mr-1 text-stone-200">{label}</span>
        <div
          role="progressbar"
          aria-label={`${label} bar`}
          aria-valuemin={0}
          aria-valuemax={safeMaxHp}
          aria-valuenow={safeCurrentHp}
          className={[
            "relative flex-1 overflow-hidden border bg-stone-950/90 p-0.5 ",
            isLow ? "border-red-500/45" : "border-stone-600/70",
            isCritical
              ? "animate-pulse shadow-[0_0_18px_rgba(239,68,68,0.38),0_10px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]"
              : "shadow-[0_10px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="relative h-2.5 overflow-hidden border border-white/5 bg-gradient-to-b from-[#201010] to-[#120707] shadow-[inset_0_2px_8px_rgba(0,0,0,0.65)] sm:h-3.5">
            <div
              className={[
                "absolute inset-y-0 left-0 transition-all duration-500 ease-out",
                isCritical ? "shadow-[0_0_18px_rgba(248,113,113,0.75)]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                width: `${percentage}%`,
                backgroundImage: fillGradient,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
              <div
                className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/75"
                style={{ opacity: darknessOpacity }}
              />
            </div>

            {isCritical ? (
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,0,0,0.08)_0%,rgba(255,140,140,0.28)_50%,rgba(255,0,0,0.08)_100%)]" />
            ) : null}
          </div>

          {showOverlayValues ? (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[10px] font-bold tracking-[0.14em] text-stone-200/90 mix-blend-screen sm:text-xs">
              {safeCurrentHp} / {safeMaxHp}
            </div>
          ) : null}

          {showOverlayPercent && !showOverlayValues ? (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[10px] font-bold uppercase tracking-[0.28em] text-stone-200/90 mix-blend-screen sm:text-xs">
              {percentage}%
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
