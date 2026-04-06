import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AuthenticatedGameShell } from "@/components/game/AuthenticatedGameShell";
import { getCurrentSession } from "@/lib/auth";
import { ensurePlayerSave } from "@/lib/player-save";

type GameLayoutProps = {
  children: ReactNode;
};

export const runtime = "nodejs";

export default async function GameLayout({ children }: GameLayoutProps) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const player = await ensurePlayerSave(session.user.id, session.user.username);

  return (
    <AuthenticatedGameShell user={session.user} player={player}>
      {children}
    </AuthenticatedGameShell>
  );
}
