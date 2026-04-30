"use client";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createEnemy } from "@/game/core/battleCore";
import type { Enemy } from "@/game/core/types";
import { chatHunterDialogues } from "@/game/dialogues/chatHunter";
import { chatOfficerDialogues } from "@/game/dialogues/chatOfficer";
import { chatPageDialogues } from "@/game/dialogues/chatPage";
import { chatSeekerDialogues } from "@/game/dialogues/chatSeeker";
import { useMCStore } from "@/store/mcStore";
import InteractBtn from "./InteractBtn";
import DialogueScene, { type DialogueSingle } from "./DialogueScene";
import { BattlePage } from "./Battle/BattlePage";

const officerChatBackground = "url('/backgrounds/chatOfficer.png')";
const pageChatBackground = "url('/backgrounds/chatPage.png')";
const seekerHunterChatBackground =
  "url('/backgrounds/chatSeekerHunter.png')";
const explorePanelBackground = "url('/panels/tarven-panel.png')";
const exploreMenuItemClass =
  "w-full rounded-[1rem] border border-amber-100/16 bg-[linear-gradient(180deg,rgba(30,21,14,0.82)_0%,rgba(16,12,10,0.92)_100%)] px-8 py-5 text-center shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition duration-150 hover:-translate-y-0.5 hover:border-amber-100/34 hover:shadow-[0_14px_32px_rgba(0,0,0,0.28)] active:translate-y-[1px] active:scale-[0.98]";
const exploreCloseButtonClass =
  "absolute right-8 top-5 rounded-md border border-amber-100/30 bg-black/35 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-amber-100 transition hover:border-amber-100/65 hover:bg-amber-100/15 active:scale-95";

const EXPLORE_PANEL_DESIGN_WIDTH = 480;
const EXPLORE_PANEL_FALLBACK_HEIGHT = 370;
const EXPLORE_PANEL_GAP_X = 20;
const EXPLORE_PANEL_GAP_Y = 20;

function ScaledExplorePanel({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    height: EXPLORE_PANEL_FALLBACK_HEIGHT,
    scale: 1,
  });

  useLayoutEffect(() => {
    const updateScale = () => {
      const frame = frameRef.current;
      const content = contentRef.current;

      if (!frame || !content) {
        return;
      }

      const contentHeight =
        content.scrollHeight ||
        content.offsetHeight ||
        EXPLORE_PANEL_FALLBACK_HEIGHT;
      const availableWidth = Math.max(
        frame.clientWidth - EXPLORE_PANEL_GAP_X,
        1,
      );
      const availableHeight = Math.max(
        frame.clientHeight - EXPLORE_PANEL_GAP_Y,
        1,
      );
      const nextScale = Math.min(
        availableWidth / EXPLORE_PANEL_DESIGN_WIDTH,
        availableHeight / contentHeight,
        1,
      );

      setMetrics((currentMetrics) => {
        const heightChanged =
          Math.abs(currentMetrics.height - contentHeight) > 0.5;
        const scaleChanged =
          Math.abs(currentMetrics.scale - nextScale) > 0.001;

        if (!heightChanged && !scaleChanged) {
          return currentMetrics;
        }

        return {
          height: contentHeight,
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
          width: EXPLORE_PANEL_DESIGN_WIDTH * metrics.scale,
          height: metrics.height * metrics.scale,
        }}
      >
        <div
          ref={contentRef}
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: EXPLORE_PANEL_DESIGN_WIDTH,
            transform: `scale(${metrics.scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FoggyForestContent() {
  const setLocation = useMCStore((state) => state.setLocation);
  const player = useMCStore((state) => state.player);
  const [showExplorePanel, setShowExplorePanel] = useState(false);
  const [battleEnemy, setBattleEnemy] = useState<Enemy | null>(null);
  const [showDialogue, setShowDialogue] = useState(false);
  const [dialogues, setDialogues] = useState<DialogueSingle[]>([]);
  const [dialogBackgroundImage, setDialogBackgroundImage] = useState(
    "url('/backgrounds/the-opening.png')",
  );

  useEffect(() => {
    setLocation("foggyForest");
  }, [setLocation]);

  const explore = () => {
    setShowExplorePanel(true);
  };

  const startRimAreaBattle = () => {
    const enemyLevel = Math.min(player.level, 10);

    setBattleEnemy(
      createEnemy({
        id: "forest-rim-wisp",
        name: "Rim Forest Wisp",
        level: enemyLevel,
        tier: "normal",
        isBoss: false,
      }),
    );
    setShowExplorePanel(false);
    setShowDialogue(false);
  };

  const startDeepForestBattle = () => {
    const enemyLevel = Math.min(Math.max(player.level, 10), 20);

    setBattleEnemy(
      createEnemy({
        id: "deep-forest-wisp",
        name: "Deep Forest Wisp",
        level: enemyLevel,
        tier: "normal",
        isBoss: false,
      }),
    );
    setShowExplorePanel(false);
    setShowDialogue(false);
  };

  const openRandomDialogue = (
    dialogueGroups: DialogueSingle[][],
    backgroundImage: string,
  ) => {
    const randomIndex = Math.floor(Math.random() * dialogueGroups.length);

    setBattleEnemy(null);
    setShowExplorePanel(false);
    setDialogues(dialogueGroups[randomIndex]);
    setDialogBackgroundImage(backgroundImage);
    setShowDialogue(true);
  };

  const talkOfficer = () => {
    if (player.level >= 5) {
      openRandomDialogue(chatOfficerDialogues, officerChatBackground);
      return;
    }

    openRandomDialogue(chatPageDialogues, pageChatBackground);
  };

  const talkSeekers = () => {
    openRandomDialogue(chatSeekerDialogues, seekerHunterChatBackground);
  };

  const talkHunters = () => {
    openRandomDialogue(chatHunterDialogues, seekerHunterChatBackground);
  };

  const btnClass = "w-full max-w-[25%] min-h-[3rem] max-h-[6rem]";
  return (
    <main>
      {battleEnemy && (
        <div className="fixed inset-0 z-50">
          <BattlePage
            enemy={battleEnemy}
            backgroundImage="/backgrounds/foggy-forest.png"
            label="forest"
            onFinish={(didWin) => {
              void didWin;
              setBattleEnemy(null);
            }}
          />
        </div>
      )}
      {showDialogue && (
        <DialogueScene
          dialogues={dialogues}
          backgroundImage={dialogBackgroundImage}
          onFinish={() => setShowDialogue(false)}
        />
      )}
      {showExplorePanel && (
        <div
          className="fixed inset-0 z-40 h-dvh w-dvw overflow-hidden bg-black/60 backdrop-blur-sm"
          onClick={() => setShowExplorePanel(false)}
        >
          <ScaledExplorePanel>
          <section
            className="relative w-full bg-[length:100%_100%] bg-center bg-no-repeat px-10 py-12 text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
            style={{ backgroundImage: explorePanelBackground }}
            role="dialog"
            aria-modal="true"
            aria-label="Choose forest area"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowExplorePanel(false)}
              className={exploreCloseButtonClass}
            >
              Close
            </button>

            <h2 className="text-center text-3xl font-semibold text-stone-100">
              Choose Forest Path
            </h2>
            <p className="mt-4 text-center text-sm leading-6 text-amber-100/85">
              Pick a route through the fog and prepare for battle.
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                className={exploreMenuItemClass}
                onClick={startRimAreaBattle}
              >
                <p className="text-[1.25rem] font-semibold leading-6 text-stone-100">
                  Rim Area
                </p>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-amber-100/52">
                  Below level 10
                </p>
              </button>
              <button
                type="button"
                className={exploreMenuItemClass}
                onClick={startDeepForestBattle}
              >
                <p className="text-[1.25rem] font-semibold leading-6 text-stone-100">
                  Deep Forest
                </p>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.16em] text-amber-100/52">
                  Above level 10
                </p>
              </button>
            </div>
          </section>
          </ScaledExplorePanel>
        </div>
      )}
      <div className="flex flex-row gap-2">
        <InteractBtn
          className={btnClass}
          onPress={explore}
          title="Explore"
          content="Venture deeper into the forest with unknown dangers."
        />
        <InteractBtn
          className={btnClass}
          onPress={talkOfficer}
          title="Talk to Officer"
          content="Talk to the officer of the Empire."
        />
        <InteractBtn
          className={btnClass}
          onPress={talkSeekers}
          title="Talk to Seekers"
          content="The people work for the Empire to hunt monsters."
        />
        <InteractBtn
          className={btnClass}
          onPress={talkHunters}
          title="Talk to Hunters"
          content="The people hunt monsters for money."
        />
      </div>
    </main>
  );
}
