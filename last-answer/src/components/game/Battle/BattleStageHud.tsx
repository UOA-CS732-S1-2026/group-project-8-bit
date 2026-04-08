import type { ReactNode } from "react";

type BattleStageHudProps = {
  children: ReactNode;
  anchor: "enemy" | "player";
};

export function BattleStageHud({ children, anchor }: BattleStageHudProps) {
  const positionStyle =
    anchor === "enemy"
      ? {
          left: "1rem",
          top: "-0.45rem",
        }
      : {
          left: "1rem",
          bottom: "1rem",
        };

  return (
    <div
      className="absolute"
      style={{
        zIndex: 20,
        width:
          anchor === "enemy"
            ? "min(clamp(19.5rem, 27vw, 26rem), calc(100vw - 1rem))"
            : "min(19.5rem, calc(100vw - 1rem))",
        ...positionStyle,
      }}
    >
      {children}
    </div>
  );
}
