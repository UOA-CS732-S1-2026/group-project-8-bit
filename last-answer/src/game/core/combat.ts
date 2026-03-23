import type { Player } from "./types";

export function applyDamage(player: Player, damage: number): Player {
  return {
    ...player,
    health: Math.max(0, player.health - damage),
  };
}
