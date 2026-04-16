import { BattlePage } from "@/components/game/Battle/BattlePage";
import { createEnemy } from "@/game/core/battleCore";

const routeEnemy = createEnemy({
  id: "route-warden",
  name: "Route Warden",
  level: 2,
  tier: "elite",
});

export default function BattleRoutePage() {
  return <BattlePage enemy={routeEnemy} />;
}
