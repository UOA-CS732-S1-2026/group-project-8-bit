import { LoginForm } from "@/components/auth/LoginForm";
import { PublicShell } from "@/components/auth/PublicShell";
import { getCurrentSession } from "@/lib/auth";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : (value ?? null);
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentSession();
  const params = (await searchParams) ?? {};

  // if (session) {
  //   redirect("/");
  // }

  return (
    <PublicShell
      title="Return to the Game"
      description="Log in to pick up where you left off, with your stored player stats and progress restored into the game."
      user={session?.user ?? null}
    >
      <LoginForm
        returnTo={getFirstSearchParam(params.returnTo)}
        panel={getFirstSearchParam(params.panel)}
      />
    </PublicShell>
  );
}
