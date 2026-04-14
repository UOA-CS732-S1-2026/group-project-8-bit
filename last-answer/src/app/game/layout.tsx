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
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (!session && !isDevelopment) {
    redirect("/login");
  }

  if (!session) {
    return <>{children}</>;
  }

  const player = await ensurePlayerSave(session.user.id, session.user.username);

  return (
    <AuthenticatedGameShell user={session.user} player={player}>
      {children}
    </AuthenticatedGameShell>
  );
}
