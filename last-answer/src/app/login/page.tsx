import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { PublicShell } from "@/components/auth/PublicShell";
import { getCurrentSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/game/mainHub");
  }

  return (
    <PublicShell
      title="Return to the Oracle"
      description="Log in to pick up where you left off, with your stored player stats and progress restored into the game."
    >
      <LoginForm />
    </PublicShell>
  );
}
