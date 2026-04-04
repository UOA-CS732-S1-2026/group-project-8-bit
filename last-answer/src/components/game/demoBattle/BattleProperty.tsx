import { supportToolConfigs } from "@/game/core/battleCore";
import type { Player } from "@/game/core/types";
import { useMCStore } from "@/store/mcStore";

type BattlePropertyProps = {
  player: Player;
  onClose: () => void;
};

export function BattleProperty({ player, onClose }: BattlePropertyProps) {
  const buyProperty = useMCStore((state) => state.buyProperty);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-3xl border border-amber-200/15 bg-[radial-gradient(circle_at_top,#312318_0%,#17110d_45%,#090706_100%)] p-6 text-stone-100 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-stone-200/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-200 transition hover:border-stone-100/35 hover:bg-stone-100/10"
        >
          Close
        </button>

        <div className="pr-20">
          <p className="text-sm uppercase tracking-[0.32em] text-amber-300/80">
            Property Shop
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-50">
            Replenish Your Tactical Tools
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300">
            Spend coins to buy more support properties for future battles and
            extend your options in the current run.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-stone-700/80 bg-stone-900/80 px-4 py-3 text-sm text-stone-300">
          Available coins:{" "}
          <span className="font-bold text-amber-200">{player.coins}</span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {player.inventory.map((property) => {
            const tool = supportToolConfigs[property.id];
            const canAfford = player.coins >= property.price;

            return (
              <section
                key={property.id}
                className="rounded-2xl border border-stone-200/10 bg-black/25 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-amber-300/75">
                      {property.id}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-white">
                      {tool.name}
                    </h3>
                  </div>
                  <div className="rounded-full border border-stone-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
                    {property.leftNumber} owned
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-stone-300">
                  {tool.description}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-sm text-stone-300">
                    <span className="uppercase tracking-[0.18em] text-stone-400">
                      Price
                    </span>
                    <div className="mt-1 text-lg font-bold text-amber-200">
                      {property.price} coins
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => buyProperty(property.id, 1)}
                    disabled={!canAfford}
                    className="rounded-2xl border border-amber-300/30 bg-amber-400/15 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition hover:border-amber-200/60 hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Buy 1
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
