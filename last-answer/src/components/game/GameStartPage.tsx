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
  "inline-flex items-center justify-center rounded-xl border border-amber-400/60 bg-black/55 font-bold tracking-widest text-amber-100 backdrop-blur-[2px] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 font-[family-name:var(--font-cinzel)] w-[clamp(140px,15vw,240px)] text-[clamp(0.75rem,1.1vw,1rem)] px-[clamp(0.75rem,1.5vw,1.25rem)] py-[clamp(0.6rem,1vw,0.875rem)]";

type EmberConfig = {
  left: string;
  bottom: string;
  delay: string;
  duration: string;
  drift: string;
  size: number;
};

const EMBERS: EmberConfig[] = [
  { left: "8%",  bottom: "2%", delay: "0s",    duration: "7s",   drift: "25px",  size: 3   },
  { left: "14%", bottom: "5%", delay: "1.5s",  duration: "5.5s", drift: "-20px", size: 2.5 },
  { left: "22%", bottom: "1%", delay: "0.8s",  duration: "8s",   drift: "30px",  size: 4   },
  { left: "31%", bottom: "3%", delay: "2.3s",  duration: "6s",   drift: "-15px", size: 2   },
  { left: "38%", bottom: "2%", delay: "0.3s",  duration: "9s",   drift: "20px",  size: 3   },
  { left: "45%", bottom: "4%", delay: "1.8s",  duration: "6.5s", drift: "-25px", size: 2.5 },
  { left: "52%", bottom: "1%", delay: "3.1s",  duration: "7.5s", drift: "15px",  size: 3   },
  { left: "60%", bottom: "3%", delay: "0.6s",  duration: "5s",   drift: "-30px", size: 2   },
  { left: "67%", bottom: "2%", delay: "2.0s",  duration: "8.5s", drift: "25px",  size: 4   },
  { left: "75%", bottom: "5%", delay: "1.2s",  duration: "6s",   drift: "-20px", size: 2.5 },
  { left: "82%", bottom: "1%", delay: "3.5s",  duration: "7s",   drift: "30px",  size: 3   },
  { left: "88%", bottom: "3%", delay: "0.9s",  duration: "5.5s", drift: "-15px", size: 2   },
  { left: "93%", bottom: "2%", delay: "4.2s",  duration: "8s",   drift: "20px",  size: 3   },
  { left: "12%", bottom: "4%", delay: "2.8s",  duration: "6.5s", drift: "-25px", size: 2.5 },
  { left: "28%", bottom: "1%", delay: "1.0s",  duration: "9s",   drift: "15px",  size: 4   },
  { left: "42%", bottom: "2%", delay: "3.8s",  duration: "5s",   drift: "-30px", size: 2   },
  { left: "58%", bottom: "5%", delay: "0.4s",  duration: "7.5s", drift: "25px",  size: 3   },
  { left: "72%", bottom: "3%", delay: "2.5s",  duration: "6s",   drift: "-20px", size: 2.5 },
  { left: "86%", bottom: "1%", delay: "1.7s",  duration: "8.5s", drift: "30px",  size: 3   },
  { left: "5%",  bottom: "2%", delay: "3.2s",  duration: "7s",   drift: "-15px", size: 2   },
  { left: "96%", bottom: "4%", delay: "0.2s",  duration: "6.5s", drift: "20px",  size: 4   },
  { left: "18%", bottom: "1%", delay: "4.5s",  duration: "5.5s", drift: "-25px", size: 2.5 },
  { left: "35%", bottom: "3%", delay: "2.1s",  duration: "8s",   drift: "15px",  size: 3   },
  { left: "50%", bottom: "2%", delay: "1.4s",  duration: "6s",   drift: "-30px", size: 2   },
  { left: "78%", bottom: "5%", delay: "3.6s",  duration: "9s",   drift: "25px",  size: 4   },
  { left: "10%", bottom: "3%", delay: "5.0s",  duration: "6s",   drift: "18px",  size: 3   },
  { left: "20%", bottom: "1%", delay: "4.8s",  duration: "7.5s", drift: "-22px", size: 2   },
  { left: "33%", bottom: "4%", delay: "5.3s",  duration: "5s",   drift: "28px",  size: 3.5 },
  { left: "47%", bottom: "2%", delay: "4.1s",  duration: "8s",   drift: "-18px", size: 2.5 },
  { left: "55%", bottom: "3%", delay: "5.7s",  duration: "6.5s", drift: "22px",  size: 3   },
];

const MENU_BUTTONS = [
  { label: "Load Game",    delay: "0.3s"  },
  { label: "New Game",     delay: "0.45s" },
  { label: "Settings",     delay: "0.6s"  },
  { label: "Back to Home", delay: "0.75s" },
];

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
    if (!shouldClearLoadPanelParams) return;

    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get("panel") !== "load") return;

    currentUrl.searchParams.delete("panel");
    currentUrl.searchParams.delete("tab");
    const nextUrl = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
    router.replace(nextUrl, { scroll: false });
  }, [router, shouldClearLoadPanelParams]);

  function handleClick(label: string) {
    if (label === "Load Game")     setLoadPanel({ isOpen: true, initialTab: "local" });
    if (label === "New Game")      setIsNewGameOpen(true);
    if (label === "Settings")      setIsSettingsOpen(true);
    if (label === "Back to Home")  router.push("/");
  }

  return (
    <main className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-black text-amber-100">
      {/* 背景层 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/backgrounds/game-cover.png')" }}
      />

      {/* 火星粒子层 */}
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="animate-ember pointer-events-none absolute rounded-full"
          style={
            {
              left: e.left,
              bottom: e.bottom,
              width: `${e.size}px`,
              height: `${e.size}px`,
              backgroundColor: "#fb923c",
              boxShadow: `0 0 ${e.size * 2}px #f97316, 0 0 ${e.size * 4}px #f59e0b`,
              "--ember-duration": e.duration,
              "--ember-delay": e.delay,
              "--ember-drift": e.drift,
            } as React.CSSProperties
          }
        />
      ))}

      {/* 按钮组 */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-3 pb-[clamp(2.5rem,8vh,5rem)]">
        {MENU_BUTTONS.map(({ label, delay }) => (
          <button
            key={label}
            type="button"
            className={menuButtonClass}
            style={{
              animation: `btn-enter 1.1s cubic-bezier(0.16,1,0.3,1) ${delay} both, border-pulse 3s ease-in-out calc(${delay} + 1.1s) infinite`,
            }}
            onClick={() => handleClick(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {loadPanel.isOpen && (
        <LoadPanel
          initialTab={loadPanel.initialTab}
          onClose={() => setLoadPanel((c) => ({ ...c, isOpen: false }))}
        />
      )}
      {isNewGameOpen && (
        <NewGamePanel
          onClose={() => setIsNewGameOpen(false)}
          onCreated={() => { setIsNewGameOpen(false); setIsStartOpen(true); }}
        />
      )}
      {isSettingsOpen && (
        <SettingPanel onClose={() => setIsSettingsOpen(false)} />
      )}
      {isStartOpen && (
        <StartScene
          onClose={() => { setIsStartOpen(false); router.push("/game/tavern"); }}
        />
      )}
    </main>
  );
}
