"use client";

import { useRouter } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Player } from "@/game/core/types";
import type { AuthUser } from "@/lib/auth-shared";
import { stopMainInterfaceMusicNow } from "@/lib/mainInterfaceMusic";
import { gameSlots } from "@/store/game-store";
import { useAuthStore } from "@/store/authStore";
import { useMCStore } from "@/store/mcStore";
import ModalPortal from "../ModalPortal";
import { useModalCloseAnimation } from "../useModalCloseAnimation";
import SaveLoadMenu from "./SaveLoadMenu";

export type LoadPanelTab = "local" | "cloud";

type LoadPanelProps = {
  onClose: () => void;
  initialTab?: LoadPanelTab;
  allowSave?: boolean;
};

type SessionResponse = {
  user?: AuthUser | null;
  error?: string;
};

type SavesResponse = {
  saveList?: Array<Player | null>;
  error?: string;
};

type SaveMessage = { type: "success" | "error"; text: string; id: number };
type PendingSave = {
  tab: LoadPanelTab;
  slot: number;
  existingSave: Player | null;
};
type PendingLoad = {
  tab: LoadPanelTab;
  slot: number;
  save: Player;
};

const emptySlots = () => gameSlots.slice(0, 10).map(() => null);

const LOAD_PANEL_DESIGN_WIDTH = 760;
const LOAD_PANEL_DESIGN_HEIGHT = 680;
const LOAD_PANEL_GAP_X = 20;
const LOAD_PANEL_GAP_Y = 20;

const panelButtonClass =
  "rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:bg-stone-700/75 hover:border-stone-500/65 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone-600/55 disabled:hover:bg-stone-800/70 disabled:active:translate-y-0 disabled:active:scale-100";

const tabButtonClass =
  "rounded border border-stone-700/45 bg-stone-900/55 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-stone-300/65 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:border-amber-100/65 hover:bg-amber-200/15 hover:text-amber-50 active:translate-y-[1px] active:scale-[0.98] data-[active=true]:border-amber-100/65 data-[active=true]:bg-amber-200/15 data-[active=true]:text-amber-50 data-[active=true]:shadow-[0_0_16px_rgba(251,191,36,0.22)]";

const tabPanelClass =
  "mx-auto mt-7 h-[18.25rem] w-[39rem] shrink-0 overflow-hidden rounded bg-black/18 p-4 shadow-[inset_0_0_0_1px_rgba(68,64,60,0.34),inset_0_18px_36px_rgba(0,0,0,0.08)]";

const confirmPanelButtonClass =
  "rounded border border-stone-600/55 bg-stone-800/70 px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-amber-100 transition duration-150 hover:border-stone-500/65 hover:bg-stone-700/75 active:translate-y-[1px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0 disabled:active:scale-100";

function ScaledLoadPanel({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    scale: 1,
  });

  useLayoutEffect(() => {
    const updateScale = () => {
      const frame = frameRef.current;
      const content = contentRef.current;

      if (!frame || !content) {
        return;
      }

      const availableWidth = Math.max(frame.clientWidth - LOAD_PANEL_GAP_X, 1);
      const availableHeight = Math.max(
        frame.clientHeight - LOAD_PANEL_GAP_Y,
        1,
      );
      const nextScale = Math.min(
        availableWidth / LOAD_PANEL_DESIGN_WIDTH,
        availableHeight / LOAD_PANEL_DESIGN_HEIGHT,
        1,
      );

      setMetrics((currentMetrics) => {
        const scaleChanged =
          Math.abs(currentMetrics.scale - nextScale) > 0.001;

        if (!scaleChanged) {
          return currentMetrics;
        }

        return {
          scale: nextScale,
        };
      });
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);

    if (frameRef.current) {
      resizeObserver.observe(frameRef.current);
    }

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden"
    >
      <div
        className="relative shrink-0"
          style={{
            flex: "0 0 auto",
            width: LOAD_PANEL_DESIGN_WIDTH * metrics.scale,
            height: LOAD_PANEL_DESIGN_HEIGHT * metrics.scale,
          }}
        >
        <div
          ref={contentRef}
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: LOAD_PANEL_DESIGN_WIDTH,
            height: LOAD_PANEL_DESIGN_HEIGHT,
            transform: `scale(${metrics.scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

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
  allowSave = false,
}: LoadPanelProps) {
  const router = useRouter();
  const readPersistPlayer = useMCStore((state) => state.readPersistPlayer);
  const savePlayer = useMCStore((state) => state.savePlayer);
  const savePersistPlayer = useMCStore((state) => state.savePersistPlayer);
  const player = useMCStore((state) => state.player);
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<SaveMessage | null>(null);
  const [pendingSave, setPendingSave] = useState<PendingSave | null>(null);
  const [pendingLoad, setPendingLoad] = useState<PendingLoad | null>(null);
  const { isClosing, requestClose } = useModalCloseAnimation(onClose);
  const { isClosing: isConfirmClosing, requestClose: requestCloseConfirm } =
    useModalCloseAnimation(() => setPendingSave(null));
  const {
    isClosing: isLoadConfirmClosing,
    requestClose: requestCloseLoadConfirm,
  } = useModalCloseAnimation(() => setPendingLoad(null));

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

        setIsCheckingSession(false);
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
    if (tab === activeTab) {
      return;
    }

    setSelectedSlot(null);
    setSaveMessage(null);
    setCloudError(null);

    if (tab === "cloud") {
      setCloudAuthRequired(false);

      if (user) {
        setIsLoadingCloudSaves(true);
      } else {
        setIsCheckingSession(true);
      }
    } else {
      setIsCheckingSession(false);
      setIsLoadingCloudSaves(false);
    }

    setActiveTab(tab);
  };

  const handleSaveRequest = () => {
    if (selectedSlot === null) return;

    setSaveMessage(null);
    setPendingSave({
      tab: activeTab,
      slot: selectedSlot,
      existingSave: selectedSave,
    });
  };

  const saveToSlot = async (tab: LoadPanelTab, slot: number) => {
    const slotId = gameSlots[slot];

    const slotLabel = `Slot ${slot + 1}`;

    if (tab === "local") {
      savePersistPlayer(player, slotId);
      refreshLocalSaves();
      setSaveMessage({
        type: "success",
        text: `Saved to Local — ${slotLabel}`,
        id: Date.now(),
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/saves", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saveId: slotId, player }),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        player?: Player;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save to cloud.");
      }

      setCloudSaveList((prev) => {
        const next = [...prev];
        next[slot] = payload?.player ?? player;
        return next;
      });
      setSaveMessage({
        type: "success",
        text: `Saved to Cloud — ${slotLabel}`,
        id: Date.now(),
      });
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to save to cloud.",
        id: Date.now(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmSave = () => {
    if (!pendingSave) return;

    const saveRequest = pendingSave;
    setPendingSave(null);
    void saveToSlot(saveRequest.tab, saveRequest.slot);
  };

  const handleLogin = () => {
    const params = new URLSearchParams({
      returnTo: "/game?panel=load&tab=cloud",
    });

    router.push(`/login?${params}`);
  };

  const handleLoadRequest = () => {
    if (selectedSlot === null || !selectedSave) {
      return;
    }

    setSaveMessage(null);
    setPendingLoad({
      tab: activeTab,
      slot: selectedSlot,
      save: selectedSave,
    });
  };

  const loadSave = (save: Player) => {
    stopMainInterfaceMusicNow();
    savePlayer(save);
    onClose();
    router.push(resolvePlayerRoute(save.location));
  };

  const handleConfirmLoad = () => {
    if (!pendingLoad) return;

    const loadRequest = pendingLoad;
    setPendingLoad(null);
    loadSave(loadRequest.save);
  };

  return (
    <ModalPortal>
      <div
        className="game-modal-backdrop fixed inset-0 z-[60] h-dvh w-dvw overflow-hidden bg-black/60 backdrop-blur-sm"
        data-closing={isClosing}
        onClick={requestClose}
      >
        <ScaledLoadPanel>
          <section
            className="game-modal-panel relative flex h-full w-full flex-col overflow-hidden bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-[8%] py-[8%] text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
            data-closing={isClosing}
            role="dialog"
            aria-modal="true"
            aria-label={allowSave ? "Save and load game panel" : "Load game panel"}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-center font-serif text-5xl font-extrabold tracking-wide text-amber-950">
              {allowSave ? "Save & Load" : "Load Game"}
            </h2>
            <div className="mt-3 border-t border-stone-600/30" />

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                className={tabButtonClass}
                aria-pressed={activeTab === "local"}
                data-active={activeTab === "local"}
                onClick={() => handleTabClick("local")}
              >
                Local
              </button>
              <button
                type="button"
                className={tabButtonClass}
                aria-pressed={activeTab === "cloud"}
                data-active={activeTab === "cloud"}
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
                        Log in to access cloud saves, then return here with the
                        Cloud tab open.
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

            {/* Fixed-height container prevents layout shift when message appears */}
            <div className="mt-5 flex h-7 shrink-0 items-center justify-center">
              {saveMessage ? (
                <p
                  key={saveMessage.id}
                  className={`save-msg-enter text-center text-base font-bold tracking-wide ${
                    saveMessage.type === "success"
                      ? "text-amber-950"
                      : "text-rose-700"
                  }`}
                >
                  {saveMessage.text}
                </p>
              ) : null}
            </div>

            <div className="mt-3 flex shrink-0 justify-center gap-4">
              {allowSave ? (
                <button
                  type="button"
                  className={panelButtonClass}
                  disabled={selectedSlot === null || isSaving || isCloudBusy}
                  onClick={handleSaveRequest}
                >
                  Save
                </button>
              ) : null}
              <button
                type="button"
                className={panelButtonClass}
                disabled={!selectedSave || isCloudBusy}
                onClick={handleLoadRequest}
              >
                Load
              </button>
              <button
                type="button"
                className={panelButtonClass}
                onClick={requestClose}
              >
                Cancel
              </button>
            </div>
          </section>
        </ScaledLoadPanel>

        {pendingSave ? (
          <div
            className="game-modal-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
            data-closing={isConfirmClosing}
            onClick={(event) => {
              event.stopPropagation();
              requestCloseConfirm();
            }}
          >
            <section
              className="game-modal-panel relative flex aspect-square w-[min(82vw,21rem)] flex-col items-center justify-center bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-10 py-9 text-center text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
              data-closing={isConfirmClosing}
              role="alertdialog"
              aria-modal="true"
              aria-label="Confirm save"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="font-serif text-2xl font-bold tracking-wide text-amber-950">
                Confirm Save
              </h3>
              <p className="mt-4 text-sm italic leading-relaxed text-stone-600">
                Save current progress to{" "}
                {pendingSave.tab === "local" ? "Local" : "Cloud"} Slot{" "}
                {pendingSave.slot + 1}?
              </p>
              {pendingSave.existingSave ? (
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">
                  Existing save will be replaced.
                </p>
              ) : (
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-600">
                  This slot is empty.
                </p>
              )}
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  className={confirmPanelButtonClass}
                  onClick={handleConfirmSave}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={confirmPanelButtonClass}
                  onClick={requestCloseConfirm}
                >
                  No
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {pendingLoad ? (
          <div
            className="game-modal-backdrop fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
            data-closing={isLoadConfirmClosing}
            onClick={(event) => {
              event.stopPropagation();
              requestCloseLoadConfirm();
            }}
          >
            <section
              className="game-modal-panel relative flex aspect-square w-[min(82vw,21rem)] flex-col items-center justify-center bg-[url('/panels/menu-panel6.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-10 py-9 text-center text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
              data-closing={isLoadConfirmClosing}
              role="alertdialog"
              aria-modal="true"
              aria-label="Confirm load"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="font-serif text-2xl font-bold tracking-wide text-amber-950">
                Confirm Load
              </h3>
              <p className="mt-4 text-sm italic leading-relaxed text-stone-600">
                Load {pendingLoad.tab === "local" ? "Local" : "Cloud"} Slot{" "}
                {pendingLoad.slot + 1}?
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">
                Current progress will be replaced.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  className={confirmPanelButtonClass}
                  onClick={handleConfirmLoad}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={confirmPanelButtonClass}
                  onClick={requestCloseLoadConfirm}
                >
                  No
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </ModalPortal>
  );
}
