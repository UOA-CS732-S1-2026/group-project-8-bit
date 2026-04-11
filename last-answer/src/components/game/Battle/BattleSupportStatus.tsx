type BattleSupportStatusProps = {
  barrierActive: boolean;
  chainGuardActive: boolean;
};

export function BattleSupportStatus({
  barrierActive,
  chainGuardActive,
}: BattleSupportStatusProps) {
  const statuses = [
    barrierActive
      ? {
          label: "Barrier On",
          tone:
            "border-[#c9b07a]/45 bg-[rgba(76,55,25,0.74)] text-[#f2dfba] shadow-[0_0_16px_rgba(205,174,97,0.12)]",
        }
      : null,
    chainGuardActive
      ? {
          label: "ChainGuard On",
          tone:
            "border-[#b88972]/45 bg-[rgba(74,43,29,0.78)] text-[#f0d7bf] shadow-[0_0_16px_rgba(188,126,93,0.12)]",
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; tone: string }>;

  if (statuses.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {statuses.map((status) => (
        <div
          key={status.label}
          className={`rounded-full border px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.2em] ${status.tone}`}
        >
          {status.label}
        </div>
      ))}
    </div>
  );
}
