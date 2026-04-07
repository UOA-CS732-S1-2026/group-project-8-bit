type BattleTurnBannerProps = {
  turn: number;
};

export function BattleTurnBanner({ turn }: BattleTurnBannerProps) {
  return (
    <div
      className="pointer-events-none"
      style={{
        position: "fixed",
        top: "0.75rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2147483647,
      }}
    >
      <div
        className="text-center"
        style={{
          width: "15rem",
          height: "4.5rem",
          padding: "0.875rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('/panels/state-panel.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="font-semibold leading-none text-stone-50"
          style={{
            fontSize: "1.5625rem",
            lineHeight: 1,
          }}
        >
          Turn {turn}
        </div>
      </div>
    </div>
  );
}
