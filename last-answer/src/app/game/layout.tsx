import { GameMainBar } from "@/components/game/GameMainBar";
import type { ReactNode } from "react";

type GameLayoutProps = {
  children: ReactNode;
};

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="relative h-full w-full">
      <header>
        <div className="absolute top-0 left-0 right-0 z-10">
          <GameMainBar />
        </div>
      </header>
      {children}
    </div>
  );
}
