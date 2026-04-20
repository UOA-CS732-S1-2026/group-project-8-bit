"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadPanel, { type LoadPanelTab } from "./saveLoad/LoadPanel";
import NewGamePanel from "./NewGamePanel";
import SettingPanel from "./SettingPanel";
import StartScene from "./StartScene";

type LoadPanelState = {
  isOpen: boolean;
  initialTab: LoadPanelTab;
};

type GameStartPageProps = {
  initialLoadPanelOpen?: boolean;
  initialLoadPanelTab?: LoadPanelTab;
  shouldClearLoadPanelParams?: boolean;
};

const menuButtonClass =
  "w-56 rounded-md border border-amber-200/30 bg-black/35 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-amber-100 transition duration-150 hover:-translate-y-0.5 hover:border-amber-100/65 hover:bg-amber-200/15 active:translate-y-[1px] active:scale-[0.98]";

export function GameStartPage({
  initialLoadPanelOpen = false,
  initialLoadPanelTab = "local",
  shouldClearLoadPanelParams = false,
}: GameStartPageProps) {
  const router = useRouter();
  const [loadPanel, setLoadPanel] = useState<LoadPanelState>({
    isOpen: initialLoadPanelOpen,
    initialTab: initialLoadPanelTab,
  });
  const [isNewGameOpen, setIsNewGameOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false);

  useEffect(() => {
    if (!shouldClearLoadPanelParams) {
      return;
    }

    const currentUrl = new URL(window.location.href);

    if (currentUrl.searchParams.get("panel") !== "load") {
      return;
    }

    currentUrl.searchParams.delete("panel");
    currentUrl.searchParams.delete("tab");

    const nextUrl = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
    router.replace(nextUrl, { scroll: false });
  }, [router, shouldClearLoadPanelParams]);

  return (
    <main className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-black px-4 text-amber-100">
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          className={menuButtonClass}
          onClick={() => setLoadPanel({ isOpen: true, initialTab: "local" })}
        >
          Load game
        </button>
        <button
          type="button"
          className={menuButtonClass}
          onClick={() => setIsNewGameOpen(true)}
        >
          New game
        </button>
        <button
          type="button"
          className={menuButtonClass}
          onClick={() => setIsSettingsOpen(true)}
        >
          Settings
        </button>
        <button
          type="button"
          className={menuButtonClass}
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>

      {loadPanel.isOpen ? (
        <LoadPanel
          initialTab={loadPanel.initialTab}
          onClose={() =>
            setLoadPanel((current) => ({
              ...current,
              isOpen: false,
            }))
          }
        />
      ) : null}

      {isNewGameOpen ? (
        <NewGamePanel
          onClose={() => setIsNewGameOpen(false)}
          onCreated={() => {
            setIsNewGameOpen(false);
            setIsStartOpen(true);
          }}
        />
      ) : null}

      {isSettingsOpen ? (
        <SettingPanel onClose={() => setIsSettingsOpen(false)} />
      ) : null}

      {isStartOpen ? (
        <StartScene
          onClose={() => {
            setIsStartOpen(false);
            router.push("/game/tavern");
          }}
        />
      ) : null}
    </main>
  );
}
