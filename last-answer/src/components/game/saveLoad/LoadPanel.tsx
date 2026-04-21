"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Player } from "@/game/core/types";
import type { AuthUser } from "@/lib/auth-shared";
import { gameSlots } from "@/store/game-store";
import { useAuthStore } from "@/store/authStore";
import { useMCStore } from "@/store/mcStore";
import SaveLoadMenu from "./SaveLoadMenu";

export type LoadPanelTab = "local" | "cloud";

type LoadPanelProps = {
  onClose: () => void;
  initialTab?: LoadPanelTab;
};

type SessionResponse = {
  user?: AuthUser | null;
  error?: string;
};

type SavesResponse = {
  saveList?: Array<Player | null>;
  error?: string;
};

const emptySlots = () => gameSlots.slice(0, 10).map(() => null);

const panelButtonClass =
  "rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone-600/55 disabled:hover:bg-stone-800/70 disabled:active:translate-y-0 disabled:active:scale-100";

const tabButtonClass =
  "rounded border px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] transition duration-150 hover:-translate-y-0.5 hover:border-stone-500/65 hover:bg-stone-700/60 active:translate-y-[1px] active:scale-[0.98]";

const tabPanelClass =
  "mt-7 min-h-[18rem] rounded border border-stone-600/25 bg-stone-800/20 p-4";

function resolvePlayerRoute(location: string | undefined) {
  switch (location) {
    case "mainHub":
      return "/game/mainHub";
    case "foggyForest":
      return "/game/foggyForest";
    case "tavern":
      return "/game/tavern";
    case "monolith":
      return "/game/monolith";
    case "battle":
      return "/game/battle";
    default:
      return "/game/mainHub";
  }
}

export default function LoadPanel({
  onClose,
  initialTab = "local",
}: LoadPanelProps) {
  const router = useRouter();
  const readPersistPlayer = useMCStore((state) => state.readPersistPlayer);
  const savePlayer = useMCStore((state) => state.savePlayer);
  const user = useAuthStore((state) => state.user);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const [activeTab, setActiveTab] = useState<LoadPanelTab>(initialTab);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [localSaveList, setLocalSaveList] = useState<Array<Player | null>>(() =>
    gameSlots.slice(0, 10).map((slotId) => readPersistPlayer(slotId)),
  );
  const [cloudSaveList, setCloudSaveList] =
    useState<Array<Player | null>>(emptySlots);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [isLoadingCloudSaves, setIsLoadingCloudSaves] = useState(false);
  const [cloudAuthRequired, setCloudAuthRequired] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

  const refreshLocalSaves = useCallback(() => {
    setLocalSaveList(
      gameSlots.slice(0, 10).map((slotId) => readPersistPlayer(slotId)),
    );
  }, [readPersistPlayer]);

  useEffect(() => {
    setActiveTab(initialTab);
    setSelectedSlot(null);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === "local") {
      refreshLocalSaves();
    }
  }, [activeTab, refreshLocalSaves]);

  useEffect(() => {
    if (activeTab !== "cloud") {
      return;
    }

    const controller = new AbortController();

    async function loadCloudSaves() {
      setCloudAuthRequired(false);
      setCloudError(null);

      try {
        let activeUser = user;

        if (!activeUser) {
          setIsCheckingSession(true);
          const sessionResponse = await fetch("/api/auth/session", {
            signal: controller.signal,
          });
          const sessionPayload = (await sessionResponse
            .json()
            .catch(() => null)) as SessionResponse | null;

          if (!sessionResponse.ok) {
            throw new Error(
              sessionPayload?.error ?? "Unable to check cloud access.",
            );
          }

          activeUser = sessionPayload?.user ?? null;

          if (!activeUser) {
            setCloudSaveList(emptySlots());
            setCloudAuthRequired(true);
            return;
          }

          hydrateAuth(activeUser);
        }

        setIsLoadingCloudSaves(true);
        const savesResponse = await fetch("/api/saves", {
          signal: controller.signal,
        });
        const savesPayload = (await savesResponse
          .json()
          .catch(() => null)) as SavesResponse | null;

        if (!savesResponse.ok) {
          throw new Error(savesPayload?.error ?? "Unable to load cloud saves.");
        }

        if (!Array.isArray(savesPayload?.saveList)) {
          throw new Error("Unable to read cloud saves.");
        }

        setCloudSaveList(
          gameSlots
            .slice(0, 10)
            .map((_, index) => savesPayload.saveList?.[index] ?? null),
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          setCloudError(
            error instanceof Error
              ? error.message
              : "Unable to load cloud saves.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingSession(false);
          setIsLoadingCloudSaves(false);
        }
      }
    }

    void loadCloudSaves();

    return () => {
      controller.abort();
    };
  }, [activeTab, hydrateAuth, user]);

  const saveList = activeTab === "local" ? localSaveList : cloudSaveList;
  const selectedSave =
    selectedSlot === null ? null : saveList[selectedSlot] ?? null;
  const isCloudBusy = isCheckingSession || isLoadingCloudSaves;

  const handleTabClick = (tab: LoadPanelTab) => {
    setActiveTab(tab);
    setSelectedSlot(null);
  };

  const handleLogin = () => {
    const params = new URLSearchParams({
      returnTo: "/game?panel=load&tab=cloud",
    });

    router.push(`/login?${params}`);
  };

  const handleLoad = () => {
    if (!selectedSave) {
      return;
    }

    savePlayer(selectedSave);
    onClose();
    router.push(resolvePlayerRoute(selectedSave.location));
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[9%] text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        role="dialog"
        aria-modal="true"
        aria-label="Load game panel"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-center font-serif text-4xl font-extrabold tracking-wide text-amber-950 sm:text-5xl">
          Load Game
        </h2>
        <div className="mt-3 border-t border-stone-600/30" />

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            className={`${tabButtonClass} ${
              activeTab === "local"
                ? "border-stone-500 bg-stone-700/70 text-amber-100"
                : "border-stone-600/40 bg-stone-800/50 text-amber-100/70"
            }`}
            aria-pressed={activeTab === "local"}
            onClick={() => handleTabClick("local")}
          >
            Local
          </button>
          <button
            type="button"
            className={`${tabButtonClass} ${
              activeTab === "cloud"
                ? "border-stone-500 bg-stone-700/70 text-amber-100"
                : "border-stone-600/40 bg-stone-800/50 text-amber-100/70"
            }`}
            aria-pressed={activeTab === "cloud"}
            onClick={() => handleTabClick("cloud")}
          >
            Cloud
          </button>
        </div>

        <div className={tabPanelClass}>
          {activeTab === "local" ? (
            <SaveLoadMenu
              saveList={localSaveList}
              selectedSlot={selectedSlot}
              onSlotClick={setSelectedSlot}
            />
          ) : null}

          {activeTab === "cloud" ? (
            <>
              {isCheckingSession ? (
                <p className="py-12 text-center text-sm font-semibold uppercase tracking-[0.16em] text-amber-100/75">
                  Checking cloud access...
                </p>
              ) : null}

              {!isCheckingSession && cloudAuthRequired ? (
                <div className="flex min-h-[15rem] flex-col items-center justify-center gap-4 text-center">
                  <p className="max-w-md text-sm italic leading-relaxed text-stone-600">
                    Log in to load cloud saves, then return here with the Cloud
                    tab open.
                  </p>
                  <button
                    type="button"
                    className={panelButtonClass}
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                </div>
              ) : null}

              {!isCheckingSession && !cloudAuthRequired ? (
                <>
                  {cloudError ? (
                    <p className="mb-4 text-center text-sm font-semibold text-rose-200">
                      {cloudError}
                    </p>
                  ) : null}

                  {isLoadingCloudSaves ? (
                    <p className="py-12 text-center text-sm font-semibold uppercase tracking-[0.16em] text-amber-100/75">
                      Loading cloud saves...
                    </p>
                  ) : (
                    <SaveLoadMenu
                      saveList={cloudSaveList}
                      selectedSlot={selectedSlot}
                      onSlotClick={setSelectedSlot}
                    />
                  )}
                </>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            className={panelButtonClass}
            disabled={!selectedSave || isCloudBusy}
            onClick={handleLoad}
          >
            Load
          </button>
          <button type="button" className={panelButtonClass} onClick={onClose}>
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
}
