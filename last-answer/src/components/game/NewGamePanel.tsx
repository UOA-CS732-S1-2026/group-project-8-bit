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
  "rounded-md border border-amber-200/20 bg-black/35 px-4 py-3";

const actionButtonClass =
  "rounded-md border border-amber-200/30 bg-black/35 px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-amber-100 transition duration-150 hover:border-amber-100/65 hover:bg-amber-200/15 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-amber-200/30 disabled:hover:bg-black/35 disabled:active:translate-y-0 disabled:active:scale-100";

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
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto bg-[url('/panels/menu-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-7 py-8 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        role="dialog"
        aria-modal="true"
        aria-label="Create new character"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-md border border-amber-100/30 bg-black/35 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100 transition hover:border-amber-100/65 hover:bg-amber-100/15 active:scale-95"
        >
          Close
        </button>

        <h2 className="text-center text-2xl font-semibold text-stone-100">
          Create New Character
        </h2>
        <p className="mt-3 text-center text-sm text-amber-100/70">
          Choose a name and begin with the default adventurer attributes.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-6">
          <label className="block space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              Character Name
            </span>
            <input
              type="text"
              value={characterName}
              onChange={(event) => {
                setCharacterName(event.target.value);
                setError(null);
              }}
              className="w-full rounded-md border border-amber-200/25 bg-black/45 px-3 py-2 text-sm text-stone-100 outline-none transition placeholder:text-amber-100/35 focus:border-amber-100/70"
              placeholder="Enter a name"
              maxLength={30}
            />
          </label>

          {error ? (
            <p className="text-sm font-semibold text-rose-200">{error}</p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
            <div className={statCardClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/85">
                Max HP
              </p>
              <p className="mt-1 text-lg font-semibold text-stone-100">
                {defaultPlayer.maxHp}
              </p>
            </div>
            <div className={statCardClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/85">
                Attack
              </p>
              <p className="mt-1 text-lg font-semibold text-stone-100">
                {defaultPlayer.attack}
              </p>
            </div>
            <div className={statCardClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200/85">
                Defense
              </p>
              <p className="mt-1 text-lg font-semibold text-stone-100">
                {defaultPlayer.defense}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
              Inventory
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {defaultPlayer.inventory.map((property) => {
                const tool = supportToolConfigs[property.id];

                return (
                  <div key={property.id} className={statCardClass}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-stone-100">
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
            className="relative w-full max-w-sm bg-[url('/panels/menu-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-6 py-7 text-center text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm new character"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-stone-100">
              Create Character?
            </h3>
            <p className="mt-4 text-sm leading-6 text-amber-100/85">
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
