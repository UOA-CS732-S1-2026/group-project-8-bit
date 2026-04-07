"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useMCStore } from "@/store/mcStore";
import { BattleBottomBar } from "./BattleBottomBar";
import { BattleQuestionPanel } from "./BattleQuestionPanel";
import { BattleStage } from "./BattleStage";
import { BattleTurnBanner } from "./BattleTurnBanner";

const sampleAnswers = [
  {
    key: "A.",
    title: "Truth",
    subtitle: "What is remembered resists death.",
  },
  {
    key: "B.",
    title: "Fear",
    subtitle: "The unknown rules what minds cannot hold.",
  },
  {
    key: "C.",
    title: "Desire",
    subtitle: "Even broken wisdom is still pursued.",
  },
  {
    key: "D.",
    title: "Silence",
    subtitle: "Some truths are best left untouched.",
  },
];

const sampleEnemy = {
  name: "Whisper Scrap",
  hp: 14,
  maxHp: 20,
  attack: 8,
  defense: 0,
};

const SAMPLE_QUESTION_DURATION = 12;
const SAMPLE_TIMER_STEP = 0.05;

const battleScenes = {
  mainHub: {
    backgroundImage: "/backgrounds/city-hub.png",
    label: "City Hub",
  },
  cityHub: {
    backgroundImage: "/backgrounds/city-hub.png",
    label: "City Hub",
  },
  foggyForest: {
    backgroundImage: "/backgrounds/foggy-forest.png",
    label: "Foggy Forest",
  },
  monolith: {
    backgroundImage: "/backgrounds/monolith.png",
    label: "Monolith",
  },
} as const;

function resolveBattleScene(location: string) {
  return (
    battleScenes[location as keyof typeof battleScenes] ?? battleScenes.foggyForest
  );
}

export function BattlePage() {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [remainingTime, setRemainingTime] = useState(SAMPLE_QUESTION_DURATION);
  const player = useMCStore((state) => state.player);
  const scene = resolveBattleScene(player.location);
  const playerBattleStats = {
    name: player.name || "Bruce",
    level: player.level,
    hp: player.hp,
    maxHp: player.maxHp,
    attack: player.attack,
    defense: player.defense,
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const appHeader = document.querySelector("body section header") as
      | HTMLElement
      | null;
    const previousHeaderDisplay = appHeader?.style.display;

    document.body.style.overflow = "hidden";

    if (appHeader) {
      appHeader.style.display = "none";
    }

    return () => {
      document.body.style.overflow = previousOverflow;

      if (appHeader) {
        appHeader.style.display = previousHeaderDisplay ?? "";
      }
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingTime((currentTime) => {
        if (currentTime <= SAMPLE_TIMER_STEP) {
          return SAMPLE_QUESTION_DURATION;
        }

        return Math.max(currentTime - SAMPLE_TIMER_STEP, 0);
      });
    }, 100);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <main
      className="fixed inset-0 overflow-hidden bg-black text-stone-100"
      style={{ zIndex: 2147483647 }}
    >
      <div className="absolute inset-0">
        <Image
          src={scene.backgroundImage}
          alt={`${scene.label} background`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,5,0.28)_0%,rgba(8,6,5,0.12)_24%,rgba(8,6,5,0.3)_62%,rgba(7,5,4,0.62)_100%)]" />
      <BattleTurnBanner turn={1} />

      <div className="relative z-10 flex min-h-screen w-full flex-col px-4 py-4 lg:px-5 lg:py-5">
        <div className="mx-auto flex min-h-full w-full max-w-[70rem] flex-1 flex-col gap-3">
          <BattleStage backgroundLabel={scene.label} enemy={sampleEnemy} />

          <div className="space-y-2 pt-[clamp(1.5rem,4vh,2.5rem)]">
            <BattleQuestionPanel
              answers={sampleAnswers}
              question="Answer, wanderer-when knowledge is torn apart, what survives: truth, fear, or desire?"
              duration={SAMPLE_QUESTION_DURATION}
              remainingTime={remainingTime}
              warningThreshold={3}
            />
            <div className="flex justify-start">
              <BattleBottomBar player={playerBattleStats} />
            </div>
          </div>
        </div>
      </div>
    </main>,
    document.body
  );
}
