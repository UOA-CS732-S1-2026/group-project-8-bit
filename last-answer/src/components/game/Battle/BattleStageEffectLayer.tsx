type BattleStageEffectLayerProps = {
  visible?: boolean;
  anchor?: "enemy" | "player";
};

export function BattleStageEffectLayer({
  visible = false,
  anchor = "enemy",
}: BattleStageEffectLayerProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="absolute z-[24] mix-blend-screen"
      style={{
        bottom: anchor === "enemy" ? "10%" : "6%",
        right: anchor === "enemy" ? "15%" : undefined,
        left: anchor === "player" ? "12%" : undefined,
        height: "22%",
        width: "11%",
        opacity: 0.22,
      }}
    >
      <div
        className="h-full w-full bg-[url('/battle/burst-effect.png')] bg-contain bg-center bg-no-repeat"
        aria-label="Burst effect"
      />
    </div>
  );
}
