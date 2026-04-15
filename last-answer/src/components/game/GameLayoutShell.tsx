"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { GameMainBar } from "./GameMainBar";

type GameLayoutShellProps = {
  children: ReactNode;
};

export function GameLayoutShell({ children }: GameLayoutShellProps) {
  const pathname = usePathname();
  const showGameChrome = pathname !== "/game";

  return (
    <div className="relative h-full w-full overflow-hidden">
      {showGameChrome ? (
        <header>
          <div className="absolute left-0 right-0 top-0 z-10">
            <GameMainBar />
          </div>
        </header>
      ) : null}
      {children}
    </div>
  );
}
