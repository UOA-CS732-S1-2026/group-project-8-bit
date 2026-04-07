"use client";

import { useEffect, type ReactNode } from "react";
import type { Player } from "@/game/core/types";
import type { AuthUser } from "@/lib/auth-shared";
import { useAuthStore } from "@/store/authStore";
import { useMCStore } from "@/store/mcStore";
import { GameMainBar } from "./GameMainBar";
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

  return (
    <div className="relative h-full w-full">
      <PlayerSaveSync />
      <header>
        <div className="absolute top-0 left-0 right-0 z-10">
          <GameMainBar />
        </div>
      </header>
      {children}
    </div>
  );
}
