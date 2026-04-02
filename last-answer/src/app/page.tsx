import { BattleRenderer } from "@/components/game/demoBattle/BattleRenderer";

// The home route currently mounts the battle screen directly as the main demo entry point.
export default function Home() {
  return <BattleRenderer />;
}
