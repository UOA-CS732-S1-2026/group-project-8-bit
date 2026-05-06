import HPBar from "../HPBar";

type BattleEnemyPanelProps = {
  enemy: {
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    isBoss?: boolean;
    portraitPath?: string;
  };
};

export function BattleEnemyPanel({ enemy }: BattleEnemyPanelProps) {
  const portraitPath = enemy.portraitPath ?? "/battle/monster1-portrait.png";

  return (
    <section
      className={[
        "relative w-full overflow-hidden rounded-[0.6rem] bg-[linear-gradient(180deg,rgba(30,22,17,0.96)_0%,rgba(12,10,9,0.98)_100%)] shadow-[0_10px_24px_rgba(0,0,0,0.45)]",
        enemy.isBoss
          ? "ring-1 ring-[#d7b777]/55 shadow-[0_0_28px_rgba(216,181,104,0.18)]"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="absolute inset-0 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-90" />
      {enemy.isBoss ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,211,144,0.14)_0%,rgba(242,211,144,0.03)_28%,rgba(242,211,144,0)_56%)]" />
      ) : null}
      <div className="relative px-4 py-3">
        <div className="flex items-center gap-2" style={{ marginLeft: "0.1rem" }}>
          <div
            className="ml-4 shrink-0 overflow-hidden rounded-[0.45rem] bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{
              width: "5.6rem",
              height: "5.6rem",
              backgroundImage: `url('${portraitPath}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="min-w-0 flex-1 pr-1">
            <div style={{ width: "15.8rem", maxWidth: "100%" }}>
              <div className="flex items-center justify-between gap-3 font-serif text-[#ead4b4]">
                <div className="min-w-0">
                  <div className="truncate text-[1.28rem] font-semibold leading-none">
                    {enemy.name}
                  </div>
                </div>
                {enemy.isBoss ? (
                  <div className="shrink-0 rounded-full border border-[#ddb977]/70 bg-[rgba(88,62,28,0.75)] px-2 py-1 text-[0.58rem] font-black uppercase tracking-[0.22em] text-[#f6dfb0]">
                    Boss
                  </div>
                ) : null}
              </div>

              <div className="mt-2.5 min-w-0">
                <HPBar
                  currentHp={enemy.hp}
                  maxHp={enemy.maxHp}
                  label=""
                  className="max-w-none"
                  showValueText={false}
                  showOverlayPercent={false}
                  showOverlayValues
                />
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-5 text-[1.04rem] font-semibold text-stone-200">
              <div className="flex items-center gap-2">
                <img
                  src="/battle/sword_cutout.png"
                  alt="Attack"
                  className="h-7 w-7 shrink-0 object-contain"
                />
                <span>{enemy.attack}</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/battle/shield_cutout.png"
                  alt="Defense"
                  className="h-7 w-7 shrink-0 object-contain"
                />
                <span>{enemy.defense}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
