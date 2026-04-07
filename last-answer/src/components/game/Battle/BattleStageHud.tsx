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
          top: "1rem",
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
          anchor === "enemy" ? "clamp(21.5rem, 31vw, 29.5rem)" : "21.5rem",
        maxWidth: "calc(100vw - 2rem)",
        ...positionStyle,
      }}
    >
      {children}
    </div>
  );
}
