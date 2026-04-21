"use client";

import { useMemo, useState } from "react";
import { supportToolConfigs } from "@/game/core/battleCore";
import { defaultPlayer } from "@/lib/player";
import { useMCStore } from "@/store/mcStore";

type NewGamePanelProps = {
  onClose: () => void;
  onCreated: () => void;
};

const statCardClass =
  "rounded border border-stone-600/40 bg-stone-800/55 px-4 py-3";

const actionButtonClass =
  "rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone-600/55 disabled:hover:bg-stone-800/70 disabled:active:translate-y-0 disabled:active:scale-100";

export default function NewGamePanel({ onClose, onCreated }: NewGamePanelProps) {
  const resetPlayer = useMCStore((state) => state.resetPlayer);
  const [characterName, setCharacterName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const trimmedName = useMemo(() => characterName.trim(), [characterName]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedName) {
      setError("Character name is required.");
      return;
    }

    setError(null);
    setPendingName(trimmedName);
  };

  const handleConfirmCreate = () => {
    if (!pendingName) {
      return;
    }

    resetPlayer(pendingName);
    setPendingName(null);
    onCreated();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[9%] text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        role="dialog"
        aria-modal="true"
        aria-label="Create new character"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded border border-stone-600/50 bg-stone-800/65 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100 transition hover:bg-stone-700/75 hover:border-stone-500/65 active:scale-95"
        >
          Close
        </button>

        <h2 className="text-center font-serif text-3xl font-extrabold tracking-wide text-amber-950 sm:text-4xl">
          Create New Character
        </h2>
        <div className="mt-3 border-t border-stone-600/30" />
        <p className="mt-3 text-center text-base italic text-amber-950">
          Choose a name and begin with the default adventurer attributes.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-6">
          <label className="block space-y-2">
            <span className="block text-base font-black uppercase tracking-[0.22em] text-amber-950">
              Character Name
            </span>
            <input
              type="text"
              value={characterName}
              onChange={(event) => {
                setCharacterName(event.target.value);
                setError(null);
              }}
              className="w-full rounded border border-stone-600/55 bg-stone-800/65 px-3 py-2.5 text-sm text-amber-100 outline-none transition placeholder:text-stone-400/60 focus:border-stone-500/70"
              placeholder="Enter a name"
              maxLength={30}
            />
          </label>

          {error ? (
            <p className="text-sm font-semibold text-rose-200">{error}</p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className={statCardClass}>
              <p className="text-base font-black uppercase tracking-[0.22em] text-amber-950">
                Max HP
              </p>
              <p className="mt-1 text-lg font-semibold text-amber-100">
                {defaultPlayer.maxHp}
              </p>
            </div>
            <div className={statCardClass}>
              <p className="text-base font-black uppercase tracking-[0.22em] text-amber-950">
                Attack
              </p>
              <p className="mt-1 text-lg font-semibold text-amber-100">
                {defaultPlayer.attack}
              </p>
            </div>
            <div className={statCardClass}>
              <p className="text-base font-black uppercase tracking-[0.22em] text-amber-950">
                Defense
              </p>
              <p className="mt-1 text-lg font-semibold text-amber-100">
                {defaultPlayer.defense}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-black uppercase tracking-[0.28em] text-amber-950">
              Inventory
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {defaultPlayer.inventory.map((property) => {
                const tool = supportToolConfigs[property.id];

                return (
                  <div key={property.id} className={statCardClass}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-amber-100">
                          {tool.name}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-amber-100/60">
                          {property.id}
                        </p>
                      </div>
                      <p className="shrink-0 rounded-md border border-amber-200/20 bg-black/35 px-2 py-1 text-xs font-semibold text-amber-100">
                        x{property.leftNumber}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="submit"
              className={actionButtonClass}
              disabled={!trimmedName}
            >
              Create Character
            </button>
            <button
              type="button"
              className={actionButtonClass}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      {pendingName ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
          onClick={(event) => {
            event.stopPropagation();
            setPendingName(null);
          }}
        >
          <section
            className="relative w-full max-w-sm bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[9%] text-center text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm new character"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="font-serif text-xl font-bold tracking-wide text-stone-800">
              Create Character?
            </h3>
            <p className="mt-4 text-sm italic leading-relaxed text-stone-600">
              Start a new run as {pendingName}? Current unsaved player state
              will be replaced.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                className={actionButtonClass}
                onClick={handleConfirmCreate}
              >
                Yes
              </button>
              <button
                type="button"
                className={actionButtonClass}
                onClick={() => setPendingName(null)}
              >
                No
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
