export function BattleStageEffectLayer() {
  return (
    <div
      className="absolute z-[24] mix-blend-screen"
      style={{
        bottom: "10%",
        right: "15%",
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
