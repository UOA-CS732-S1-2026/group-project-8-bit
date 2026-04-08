const utilityStats = [
  { label: "Combo", value: "x2" },
  { label: "Support", value: "Ready" },
  { label: "Hint", value: "1" },
];

export function BattleUtilityPanel() {
  return (
    <aside className="relative w-[12.5rem] overflow-hidden rounded-[0.6rem] bg-[linear-gradient(180deg,rgba(30,22,17,0.96)_0%,rgba(12,10,9,0.98)_100%)] shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[url('/panels/interact-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat opacity-90" />
      <div className="relative px-3 py-2.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.68rem] uppercase tracking-[0.22em] text-[#bca17f]">
            Utility
          </span>
          <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[#e7d0a7]">
            Battle
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {utilityStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[0.45rem] border border-[#4d3929]/70 bg-black/18 px-2 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <div className="text-[0.62rem] uppercase tracking-[0.14em] text-[#bca17f]">
                {stat.label}
              </div>
              <div className="mt-1 text-[0.92rem] font-semibold text-[#ead4b4]">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
