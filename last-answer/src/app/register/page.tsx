import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { PublicShell } from "@/components/auth/PublicShell";
import { getCurrentSession } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/game/mainHub");
  }

  return (
    <PublicShell
      title="Begin your journey into the archive"
      description="Create a persistent account so your player identity, inventory, and progress survive beyond a single browser session."
    >
      <RegisterForm />
    </PublicShell>
  );
}

