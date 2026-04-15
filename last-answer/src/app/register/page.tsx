import { RegisterForm } from "@/components/auth/RegisterForm";
import { PublicShell } from "@/components/auth/PublicShell";
import { getCurrentSession } from "@/lib/auth";

type RegisterPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? null;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await getCurrentSession();
  const params = (await searchParams) ?? {};

  // if (session) {
  //   redirect("/");
  // }

  return (
    <PublicShell
      title="Begin your journey into the archive"
      description="Create a persistent account so your player identity, inventory, and progress survive beyond a single browser session."
      user={session?.user ?? null}
    >
      <RegisterForm
        returnTo={getFirstSearchParam(params.returnTo)}
        panel={getFirstSearchParam(params.panel)}
      />
    </PublicShell>
  );
}
