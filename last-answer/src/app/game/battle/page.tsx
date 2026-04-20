import { Suspense } from "react";
import { BattlePage } from "@/components/game/Battle/BattlePage";
import { createEnemy } from "@/game/core/battleCore";

const routeEnemy = createEnemy({
  id: "route-warden",
  name: "Route Warden",
  level: 2,
  tier: "elite",
});

export default function BattleRoutePage() {
  return (
    <Suspense
      fallback={
        <main className="flex h-full w-full items-center justify-center bg-black text-amber-100">
          Loading battle...
        </main>
      }
    >
      <BattlePage enemy={routeEnemy} />
    </Suspense>
  );
}
