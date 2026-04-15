import { HomePageClient } from "@/components/home/HomePageClient";
import { getCurrentSession } from "@/lib/auth";

export default async function Home() {
  const session = await getCurrentSession();

  return <HomePageClient user={session?.user ?? null} />;
}
