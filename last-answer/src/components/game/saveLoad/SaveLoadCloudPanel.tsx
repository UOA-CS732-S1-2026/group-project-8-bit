"use client";

import type { Player } from "@/game/core/types";
import type { AuthUser } from "@/lib/auth-shared";
import { gameSlots } from "@/store/game-store";
import { useAuthStore } from "@/store/authStore";
import { useMCStore } from "@/store/mcStore";
import { SaveLoadConfirmAlert } from "./SaveLoadConfirmAlert";
import SaveLoadMenu from "./SaveLoadMenu";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type SaveLoadCloudPanelProps = {
  onClose: () => void;
};

type PendingAction = "save" | "load" | null;
type SessionResponse = {
  user?: AuthUser | null;
};

type SavesResponse = {
  saveList?: Array<Player | null>;
  error?: string;
};

const emptyCloudSlots: Array<Player | null> = Array.from({ length: 10 }, () => null);

const panelButtonClass =
  "rounded-md border border-amber-200/30 bg-black/35 px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-amber-100 transition duration-150 hover:border-amber-100/65 hover:bg-amber-200/15 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-amber-200/30 disabled:hover:bg-black/35 disabled:active:translate-y-0 disabled:active:scale-100";

export default function SaveLoadCloudPanel({ onClose }: SaveLoadCloudPanelProps) {
  const router = useRouter();
  const player = useMCStore((state) => state.player);
  const savePlayer = useMCStore((state) => state.savePlayer);
  const user = useAuthStore((state) => state.user);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [saveList, setSaveList] =
    useState<Array<Player | null>>(emptyCloudSlots);
  const [isLoadingSaves, setIsLoadingSaves] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const isCheckingSession = !user;
  const selectedSave =
    selectedSlot === null ? null : saveList[selectedSlot] ?? null;
  const selectedSlotLabel =
    selectedSlot === null ? "" : `Slot ${selectedSlot + 1}`;

  const loadCloudSaves = useCallback(
    async (signal?: AbortSignal, showLoading = false) => {
      if (showLoading) {
        setIsLoadingSaves(true);
      }

      try {
        const response = await fetch("/api/saves", { signal });
        const payload = (await response.json().catch(() => null)) as
          | SavesResponse
          | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to load cloud saves.");
        }

        if (!Array.isArray(payload?.saveList)) {
          throw new Error("Unable to read cloud saves.");
        }

        setSaveList(
          gameSlots
            .slice(0, 10)
            .map((_, index) => payload.saveList?.[index] ?? null),
        );
        setSaveError(null);
      } catch (error) {
        if (signal?.aborted) {
          return;
        }

        setSaveError(
          error instanceof Error
            ? error.message
            : "Unable to load cloud saves.",
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoadingSaves(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (user) {
      return;
    }

    const controller = new AbortController();
    const redirectToLogin = () => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("panel");
      const returnTo = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
      const loginParams = new URLSearchParams({
        returnTo,
        panel: "cloudSave",
      });

      router.push(`/login?${loginParams}`);
    };

    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session", {
          signal: controller.signal,
        });

        if (!response.ok) {
          redirectToLogin();
          return;
        }

        const payload = (await response.json().catch(() => null)) as
          | SessionResponse
          | null;

        if (payload?.user) {
          hydrateAuth(payload.user);
          return;
        }

        redirectToLogin();
      } catch {
        if (!controller.signal.aborted) {
          redirectToLogin();
        }
      }
    }

    checkSession();

    return () => {
      controller.abort();
    };
  }, [hydrateAuth, router, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const controller = new AbortController();
    void loadCloudSaves(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadCloudSaves, user]);

  const handleConfirm = async () => {
    if (selectedSlot === null) {
      return;
    }

    const saveId = gameSlots[selectedSlot];

    if (!saveId) {
      setSaveError("Invalid cloud save slot.");
      return;
    }

    if (pendingAction === "save") {
      setIsSaving(true);

      try {
        const response = await fetch("/api/saves", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ saveId, player }),
        });
        const payload = (await response.json().catch(() => null)) as
          | SavesResponse
          | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to save to cloud.");
        }

        await loadCloudSaves(undefined, true);
        setSaveError(null);
      } catch (error) {
        setSaveError(
          error instanceof Error ? error.message : "Unable to save to cloud.",
        );
      } finally {
        setIsSaving(false);
      }

      return;
    }

    if (pendingAction === "load" && selectedSave) {
      savePlayer(selectedSave);
      setSaveError(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="relative w-full max-w-4xl bg-[url('/panels/menu-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[9%] text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        role="dialog"
        aria-modal="true"
        aria-label="Save and load cloud panel"
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
          Save&Load Cloud
        </h2>
        {isCheckingSession ? (
          <p className="mt-7 text-center text-sm font-semibold uppercase tracking-[0.16em] text-amber-100/75">
            Checking cloud access...
          </p>
        ) : (
          <>
            <p className="mt-3 text-center text-sm text-amber-100/70">
              Choose a cloud slot to save or load your run.
            </p>

            {saveError ? (
              <p className="mt-4 text-center text-sm font-semibold text-rose-200">
                {saveError}
              </p>
            ) : null}

            {isLoadingSaves ? (
              <p className="mt-7 text-center text-sm font-semibold uppercase tracking-[0.16em] text-amber-100/75">
                Loading cloud saves...
              </p>
            ) : (
              <div className="mt-7">
                <SaveLoadMenu
                  saveList={saveList}
                  selectedSlot={selectedSlot}
                  onSlotClick={setSelectedSlot}
                />
              </div>
            )}

            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                className={panelButtonClass}
                disabled={selectedSlot === null || isLoadingSaves || isSaving}
                onClick={() => setPendingAction("save")}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className={panelButtonClass}
                disabled={!selectedSave || isLoadingSaves || isSaving}
                onClick={() => setPendingAction("load")}
              >
                Load
              </button>
            </div>

            {pendingAction ? (
              <SaveLoadConfirmAlert
                message={`${pendingAction === "save" ? "Save to" : "Load"} ${selectedSlotLabel}?`}
                onConfirm={() => {
                  void handleConfirm();
                }}
                onClose={() => setPendingAction(null)}
              />
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
