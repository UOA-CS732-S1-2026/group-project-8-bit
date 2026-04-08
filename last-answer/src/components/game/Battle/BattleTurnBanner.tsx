type BattleTurnBannerProps = {
  turn: number;
};

export function BattleTurnBanner({ turn }: BattleTurnBannerProps) {
  return (
    <div
      className="pointer-events-none px-3"
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
          width: "min(12.75rem, calc(100vw - 1.5rem))",
          height: "clamp(3rem, 8vw, 3.7rem)",
          padding: "0.55rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('/panels/buttons-panel.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="font-semibold leading-none text-[#ead8b8]"
          style={{
            fontSize: "clamp(1.05rem, 3vw, 1.34rem)",
            lineHeight: 1,
          }}
        >
          Turn {turn}
        </div>
      </div>
    </div>
  );
}
