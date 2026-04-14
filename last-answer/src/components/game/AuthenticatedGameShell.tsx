"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Player } from "@/game/core/types";
import type { AuthUser } from "@/lib/auth-shared";
import { useAuthStore } from "@/store/authStore";
import { useMCStore } from "@/store/mcStore";
import { GameMainBar } from "./GameMainBar";
import GameMainFooter, { GAME_MAIN_FOOTER_HEIGHT } from "./GameMainFooter";
import { PlayerSaveSync } from "./PlayerSaveSync";

type AuthenticatedGameShellProps = {
  user: AuthUser;
  player: Player;
  children: ReactNode;
};

export function AuthenticatedGameShell({
  user,
  player,
  children,
}: AuthenticatedGameShellProps) {
  const pathname = usePathname();
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hydratePlayer = useMCStore((state) => state.hydratePlayer);
  const activeUserId = useMCStore((state) => state.userId);

  useEffect(() => {
    hydrateAuth(user);
    hydratePlayer(user.id, player);
  }, [hydrateAuth, hydratePlayer, player, user]);

  const ready = isHydrated && activeUserId === user.id;

  if (!ready) {
    return (
      <main className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,#173224_0%,#0f1517_45%,#090b10_100%)] text-stone-100">
        <div className="rounded-3xl border border-amber-200/15 bg-stone-950/55 px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-amber-100">
          Loading your save...
        </div>
      </main>
    );
  }

  const showSharedChrome = !pathname.startsWith("/game/battle");
  const shellStyle = {
    "--game-footer-height": GAME_MAIN_FOOTER_HEIGHT,
    "--game-topbar-height": "clamp(4.4rem, 9vw, 7.35rem)",
  } as CSSProperties;

  return (
    <div className="relative h-full w-full overflow-hidden" style={shellStyle}>
      <PlayerSaveSync />
      <div className="grid h-full w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
        {showSharedChrome ? (
          <div className="relative z-10 h-[var(--game-topbar-height)]">
            <GameMainBar />
          </div>
        ) : null}
        <div className="min-h-0">{children}</div>
        {showSharedChrome ? (
          <div aria-hidden="true" className="h-[var(--game-footer-height)]" />
        ) : null}
      </div>
      {showSharedChrome ? (
        <GameMainFooter />
      ) : null}
    </div>
  );
}
