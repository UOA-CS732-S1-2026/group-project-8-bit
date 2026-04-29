import HPBar from "../HPBar";

type BattlePlayerPanelProps = {
  player: {
    name: string;
    level: number;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
  };
};

export function BattlePlayerPanel({ player }: BattlePlayerPanelProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-[0.6rem] bg-[linear-gradient(180deg,rgba(30,22,17,0.96)_0%,rgba(12,10,9,0.98)_100%)] shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-90" />
      <div className="relative px-3 py-2.5 sm:px-3.5">
        <div className="flex items-center gap-3" style={{ marginLeft: "0.25rem" }}>
          <div
          className="ml-2 shrink-0 overflow-hidden rounded-[0.45rem] bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{
              width: "4.7rem",
              height: "4.7rem",
              backgroundImage: "url('/portraits/mc-portrait.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="min-w-0 flex-1 pr-1">
            <div style={{ width: "14.2rem", maxWidth: "100%" }}>
              <div className="flex items-center justify-between gap-3 font-serif text-[#ead4b4]">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="truncate text-[1.08rem] font-semibold leading-none">
                    {player.name}
                  </div>
                  <div className="text-[0.88rem] font-semibold tracking-[0.05em] text-[#f0debf]">
                    Lv. {player.level}
                  </div>
                </div>
              </div>

              <div className="mt-2 min-w-0">
                <HPBar
                  currentHp={player.hp}
                  maxHp={player.maxHp}
                  label=""
                  className="max-w-none"
                  showValueText={false}
                  showOverlayPercent={false}
                  showOverlayValues
                />
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[0.92rem] font-semibold text-stone-200">
              <div className="flex items-center gap-2">
                <img
                  src="/battle/sword_cutout.png"
                  alt="Attack"
                  className="h-6 w-6 shrink-0 object-contain"
                />
                <span>{player.attack}</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/battle/shield_cutout.png"
                  alt="Defense"
                  className="h-6 w-6 shrink-0 object-contain"
                />
                <span>{player.defense}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
