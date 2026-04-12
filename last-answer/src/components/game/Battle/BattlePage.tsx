"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { BURST_DURATION_MS, supportToolConfigs } from "@/game/core/battleCore";
import type {
  BattleSession,
  SupportToolId,
} from "@/game/core/types";
import { useBattleSession } from "@/game/useBattleSession";
import { useMCStore } from "@/store/mcStore";
import { BattleBottomBar } from "./BattleBottomBar";
import { BattleBurstOverlay } from "./BattleBurstOverlay";
import { BattleOutcomeOverlay } from "./BattleOutcomeOverlay";
import { BattleQuestionPanel } from "./BattleQuestionPanel";
import { BattleStateStrip } from "./BattleStateStrip";
import { BattleStage } from "./BattleStage";
import { BattleSupportOverlay } from "./BattleSupportOverlay";
import { useBattleAudio } from "./useBattleAudio";

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
  const searchParams = useSearchParams();
  const AUTO_LOG_LIMIT = 12;
  const FEEDBACK_DURATION_MS = 1600;
  const ANSWER_LOCK_DELAY_MS = 260;
  const HIT_STOP_MS = 90;
  const BURST_INTRO_MS = 820;
  const BURST_OUTRO_MS = 1500;
  const DEFEAT_ANIMATION_MS = 1800;
  const OUTCOME_DELAY_MS = 1950;
  const BURST_MUTED_CLASSES = "opacity-40 blur-[3px] saturate-[0.78]";
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [logEntries, setLogEntries] = useState<
    { id: string; kind: "player" | "enemy"; text: string }[]
  >([]);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null,
  );
  const [resolvedAnswerIndex, setResolvedAnswerIndex] = useState<number | null>(
    null,
  );
  const [resolvedAnswerWasCorrect, setResolvedAnswerWasCorrect] = useState<
    boolean | null
  >(null);
  const [playerHitFlash, setPlayerHitFlash] = useState(false);
  const [enemyHitFlash, setEnemyHitFlash] = useState(false);
  const [playerAttackFlash, setPlayerAttackFlash] = useState(false);
  const [stageShakeTone, setStageShakeTone] = useState<
    "none" | "playerHit" | "enemyHit"
  >("none");
  const [impactFlashTone, setImpactFlashTone] = useState<
    "none" | "playerHit" | "enemyHit"
  >("none");
  const [enemyHitTier, setEnemyHitTier] = useState<"normal" | "burst">("normal");
  const [hitStopActive, setHitStopActive] = useState(false);
  const [isResolvingAnswer, setIsResolvingAnswer] = useState(false);
  const [burstIntroActive, setBurstIntroActive] = useState(false);
  const [burstOutroState, setBurstOutroState] = useState<{
    active: boolean;
    damage: number | null;
  }>({ active: false, damage: null });
  const [outcomeVisible, setOutcomeVisible] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<
    Array<{
      id: string;
      target: "enemy" | "player" | "center";
      text: string;
      tone?: "damage" | "heal" | "info";
      emphasis?: "normal" | "burst";
    }>
  >([]);
  const hasAutoStartedRef = useRef(false);
  const prevBattleRef = useRef<BattleSession | null>(null);
  const prevPlayerHpRef = useRef<number | null>(null);
  const answerDelayTimeoutRef = useRef<number | null>(null);
  const burstIntroTimeoutRef = useRef<number | null>(null);
  const burstOutroTimeoutRef = useRef<number | null>(null);
  const outcomeTimeoutRef = useRef<number | null>(null);
  const player = useMCStore((state) => state.player);
  const battleAudio = useBattleAudio();
  const {
    battle,
    currentQuestion,
    reward,
    startSkirmishBattle,
    startBossBattle,
    resumeQuestionTimer,
    setSupportMenuOpen,
    activateSupportTool,
    answerQuestion,
    registerBurstClick,
  } = useBattleSession();
  const scene = resolveBattleScene(player.location);
  const playerBattleStats = {
    name: player.name || "Bruce",
    level: player.level,
    hp: player.hp,
    maxHp: player.maxHp,
    attack: player.attack,
    defense: player.defense,
  };
  const outcomeSummary = battle
    ? {
        enemyName: battle.enemy.name,
        turnsUsed: battle.turnsUsed,
        turnLimit: battle.turnLimit,
        correctAnswers: battle.correctAnswers,
        bestCombo: battle.bestCombo,
        burstClicks: battle.burstClicks,
      }
    : null;
  const burstReady =
    !!battle &&
    battle.correctStreak >= 5 &&
    (battle.enemy.isBoss || battle.burstUsesThisBattle === 0);
  const availableItemCount = battle
    ? Object.values(battle.supportTools).reduce((sum, amount) => sum + amount, 0)
    : 0;
  const debugSupportOpen = searchParams.get("debugSupport") === "1";

  const pushFloatingText = useCallback(
    (entry: {
      target: "enemy" | "player" | "center";
      text: string;
      tone?: "damage" | "heal" | "info";
      emphasis?: "normal" | "burst";
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setFloatingTexts((current) => [...current, { id, ...entry }]);
      window.setTimeout(() => {
        setFloatingTexts((current) => current.filter((item) => item.id !== id));
      }, FEEDBACK_DURATION_MS);
    },
    [FEEDBACK_DURATION_MS],
  );

  const triggerEnemyHit = useCallback(
    (text?: string) => {
      setHitStopActive(true);
      setImpactFlashTone("enemyHit");
      setEnemyHitTier("normal");
      window.setTimeout(() => {
        setHitStopActive(false);
        setEnemyHitFlash(true);
        setPlayerAttackFlash(true);
        setStageShakeTone("enemyHit");
        battleAudio.playEnemyHit();
        if (text) {
          pushFloatingText({ target: "enemy", text, tone: "damage" });
        }
      }, HIT_STOP_MS);
      window.setTimeout(() => {
        setEnemyHitFlash(false);
        setPlayerAttackFlash(false);
        setStageShakeTone("none");
        setImpactFlashTone("none");
      }, FEEDBACK_DURATION_MS);
    },
    [FEEDBACK_DURATION_MS, HIT_STOP_MS, battleAudio, pushFloatingText],
  );

  const triggerPlayerHit = useCallback(
    (text?: string) => {
      setHitStopActive(true);
      setImpactFlashTone("playerHit");
      window.setTimeout(() => {
        setHitStopActive(false);
        setPlayerHitFlash(true);
        setStageShakeTone("playerHit");
        battleAudio.playPlayerHit();
        if (text) {
          pushFloatingText({ target: "player", text, tone: "damage" });
        }
      }, HIT_STOP_MS);
      window.setTimeout(() => {
        setPlayerHitFlash(false);
        setStageShakeTone("none");
        setImpactFlashTone("none");
      }, FEEDBACK_DURATION_MS);
    },
    [FEEDBACK_DURATION_MS, HIT_STOP_MS, battleAudio, pushFloatingText],
  );

  const triggerBurstFinishImpact = useCallback(() => {
    setHitStopActive(true);
    setImpactFlashTone("enemyHit");
    setEnemyHitTier("burst");
    battleAudio.playBurstFinish();
    window.setTimeout(() => {
      setHitStopActive(false);
      setStageShakeTone("enemyHit");
    }, HIT_STOP_MS);
    window.setTimeout(() => {
      setStageShakeTone("none");
      setImpactFlashTone("none");
      setEnemyHitTier("normal");
    }, 520);
  }, [HIT_STOP_MS, battleAudio]);

  const pushLogs = useCallback(
    (entries: Array<{ kind: "player" | "enemy"; text: string }>) => {
      if (entries.length === 0) {
        return;
      }

      const scheduleLogUpdate = () => {
        setLogEntries((currentEntries) => [
          ...currentEntries.slice(
            -Math.max(0, AUTO_LOG_LIMIT - entries.length),
          ),
          ...entries.map((entry) => ({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            kind: entry.kind,
            text: entry.text,
          })),
        ]);
      };

      window.setTimeout(scheduleLogUpdate, 0);
    },
    [AUTO_LOG_LIMIT],
  );

  const appendLog = useCallback(
    (kind: "player" | "enemy", text: string) => {
      pushLogs([{ kind, text }]);
    },
    [pushLogs],
  );

  const startBattle = useCallback(
    (mode: "skirmish" | "boss") => {
      if (answerDelayTimeoutRef.current !== null) {
        window.clearTimeout(answerDelayTimeoutRef.current);
        answerDelayTimeoutRef.current = null;
      }
      setLogEntries([]);
      setSelectedAnswerIndex(null);
      setResolvedAnswerIndex(null);
      setResolvedAnswerWasCorrect(null);
      setIsResolvingAnswer(false);
      setBurstIntroActive(false);
      setBurstOutroState({ active: false, damage: null });
      setOutcomeVisible(false);
      setFloatingTexts([]);
      setStageShakeTone("none");
      setImpactFlashTone("none");
      setEnemyHitTier("normal");
      setHitStopActive(false);
      prevBattleRef.current = null;
      prevPlayerHpRef.current = player.hp;

      if (mode === "boss") {
        startBossBattle();
        return;
      }

      startSkirmishBattle();
    },
    [player.hp, startBossBattle, startSkirmishBattle],
  );

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
    if (hasAutoStartedRef.current || battle) {
      return;
    }

    const timerId = window.setTimeout(() => {
      hasAutoStartedRef.current = true;
      startBattle(scene.label === "Monolith" ? "boss" : "skirmish");
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [battle, scene.label, startBattle]);

  useEffect(() => {
    if (
      !debugSupportOpen ||
      !battle ||
      battle.status !== "question" ||
      battle.supportMenuOpen
    ) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setSupportMenuOpen(true);
    }, 150);

    return () => window.clearTimeout(timerId);
  }, [battle, debugSupportOpen, setSupportMenuOpen]);

  useEffect(() => {
    return () => {
      if (answerDelayTimeoutRef.current !== null) {
        window.clearTimeout(answerDelayTimeoutRef.current);
      }
      if (burstIntroTimeoutRef.current !== null) {
        window.clearTimeout(burstIntroTimeoutRef.current);
      }
      if (burstOutroTimeoutRef.current !== null) {
        window.clearTimeout(burstOutroTimeoutRef.current);
      }
      if (outcomeTimeoutRef.current !== null) {
        window.clearTimeout(outcomeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!battle) {
      prevBattleRef.current = null;
      prevPlayerHpRef.current = player.hp;
      return;
    }

    const previousBattle = prevBattleRef.current;
    const previousPlayerHp = prevPlayerHpRef.current ?? player.hp;
    const nextLogs: Array<{ kind: "player" | "enemy"; text: string }> = [];

    if (!previousBattle) {
      nextLogs.push({
        kind: "player",
        text: `${battle.enemy.name} appears. ${battle.enemy.isBoss ? "Boss battle" : "Battle"} started.`,
      });
    } else {
      (Object.keys(supportToolConfigs) as SupportToolId[]).forEach((toolId) => {
        if (battle.supportTools[toolId] < previousBattle.supportTools[toolId]) {
          nextLogs.push({
            kind: "player",
            text: `${supportToolConfigs[toolId].name} activated.`,
          });
        }
      });

      const enemyDamageTaken = Math.max(0, previousBattle.enemy.hp - battle.enemy.hp);

      if (enemyDamageTaken > 0) {
        triggerEnemyHit(`-${enemyDamageTaken}`);
        nextLogs.push({
          kind: "player",
          text: `Correct answer. ${battle.enemy.name} takes ${enemyDamageTaken} damage.`,
        });
      }

      const turnAdvanced = battle.turnsUsed > previousBattle.turnsUsed;
      const failureThisTurn =
        turnAdvanced && battle.correctAnswers === previousBattle.correctAnswers;

      if (failureThisTurn) {
        const enemyDamage = Math.max(0, previousPlayerHp - player.hp);

        nextLogs.push({
          kind: "enemy",
          text:
            previousBattle.timeRemainingMs <= 150
              ? "Time ran out before the answer was locked in."
              : "Wrong answer. The enemy seized the opening.",
        });

        if (previousBattle.barrierActive && enemyDamage === 0) {
          pushFloatingText({
            target: "player",
            text: "Blocked",
            tone: "info",
          });
          nextLogs.push({
            kind: "player",
            text: "Barrier blocked the enemy counterattack.",
          });
        } else if (enemyDamage > 0) {
          triggerPlayerHit(`-${enemyDamage}`);
          nextLogs.push({
            kind: "enemy",
            text: `${battle.enemy.name} counterattacks for ${enemyDamage} damage.`,
          });
        }

        if (previousBattle.chainGuardActive && battle.correctStreak === previousBattle.correctStreak) {
          nextLogs.push({
            kind: "player",
            text: "Chain Guard preserved your combo.",
          });
        } else if (
          previousBattle.correctStreak > 0 &&
          battle.correctStreak < previousBattle.correctStreak
        ) {
          nextLogs.push({
            kind: "enemy",
            text: "Your combo was broken.",
          });
        }
      }

      if (battle.status === "burst" && previousBattle.status !== "burst") {
        setBurstIntroActive(true);
        if (burstIntroTimeoutRef.current !== null) {
          window.clearTimeout(burstIntroTimeoutRef.current);
        }
        burstIntroTimeoutRef.current = window.setTimeout(() => {
          setBurstIntroActive(false);
        }, BURST_INTRO_MS);
        battleAudio.playBurstIntro();
        pushFloatingText({
          target: "enemy",
          text: "Burst",
          tone: "info",
        });
        nextLogs.push({
          kind: "player",
          text: `Combo x${battle.correctStreak} reached. Burst phase started.`,
        });
      }

      if (previousBattle.status === "burst" && battle.status === "question") {
        const burstClicksAdded = battle.burstClicks - previousBattle.burstClicks;
        const burstDamage = Math.max(0, previousBattle.enemy.hp - battle.enemy.hp);

        if (burstClicksAdded > 0) {
          nextLogs.push({
            kind: "player",
            text: `Burst ended with ${burstClicksAdded} registered strikes.`,
          });
        }

        if (burstDamage > 0) {
          triggerBurstFinishImpact();
          pushFloatingText({
            target: "center",
            text: `Final Burst Damage -${burstDamage}`,
            tone: "info",
            emphasis: "burst",
          });
        }

        setBurstOutroState({ active: true, damage: burstDamage > 0 ? burstDamage : null });
        if (burstOutroTimeoutRef.current !== null) {
          window.clearTimeout(burstOutroTimeoutRef.current);
        }
        burstOutroTimeoutRef.current = window.setTimeout(() => {
          setBurstOutroState({ active: false, damage: null });
          resumeQuestionTimer();
        }, BURST_OUTRO_MS);
        setBurstIntroActive(false);
      }

      if (battle.currentQuestionIndex > previousBattle.currentQuestionIndex && currentQuestion) {
        setSelectedAnswerIndex(null);
        setResolvedAnswerIndex(null);
        setResolvedAnswerWasCorrect(null);
        setIsResolvingAnswer(false);
        nextLogs.push({
          kind: "player",
          text: `Turn ${battle.turnsUsed + 1}/${battle.turnLimit}. ${currentQuestion.category ?? "Battle Quiz"} question loaded.`,
        });
      }

      if (battle.status === "won" && previousBattle.status !== "won") {
        battleAudio.playOutcomeWin();
        setOutcomeVisible(false);
        if (outcomeTimeoutRef.current !== null) {
          window.clearTimeout(outcomeTimeoutRef.current);
        }
        outcomeTimeoutRef.current = window.setTimeout(() => {
          setOutcomeVisible(true);
        }, OUTCOME_DELAY_MS);
        if (previousBattle.status === "burst") {
          const burstDamage = Math.max(0, previousBattle.enemy.hp - battle.enemy.hp);

          if (burstDamage > 0) {
            triggerBurstFinishImpact();
            pushFloatingText({
              target: "center",
              text: `Final Burst Damage -${burstDamage}`,
              tone: "info",
              emphasis: "burst",
            });
          }

          setBurstOutroState({ active: true, damage: burstDamage > 0 ? burstDamage : null });
          if (burstOutroTimeoutRef.current !== null) {
            window.clearTimeout(burstOutroTimeoutRef.current);
          }
          burstOutroTimeoutRef.current = window.setTimeout(() => {
            setBurstOutroState({ active: false, damage: null });
            resumeQuestionTimer();
          }, BURST_OUTRO_MS);
        }

        setIsResolvingAnswer(false);
        setBurstIntroActive(false);
        nextLogs.push({
          kind: "player",
          text: `${battle.enemy.name} has been defeated.`,
        });
      }

      if (battle.status === "lost" && previousBattle.status !== "lost") {
        battleAudio.playOutcomeLose();
        setOutcomeVisible(false);
        if (outcomeTimeoutRef.current !== null) {
          window.clearTimeout(outcomeTimeoutRef.current);
        }
        outcomeTimeoutRef.current = window.setTimeout(() => {
          setOutcomeVisible(true);
        }, OUTCOME_DELAY_MS);
        setIsResolvingAnswer(false);
        setBurstIntroActive(false);
        nextLogs.push({
          kind: "enemy",
          text: `${battle.enemy.name} survives the battle.`,
        });
      }
    }

    pushLogs(nextLogs);
    prevBattleRef.current = battle;
    prevPlayerHpRef.current = player.hp;
  }, [
    BURST_INTRO_MS,
    BURST_OUTRO_MS,
    DEFEAT_ANIMATION_MS,
    OUTCOME_DELAY_MS,
    battle,
    battleAudio,
    currentQuestion,
    player.hp,
    pushFloatingText,
    pushLogs,
    resumeQuestionTimer,
    triggerBurstFinishImpact,
    triggerEnemyHit,
    triggerPlayerHit,
  ]);

  const handleAnswer = useCallback(
    (choiceIndex: number) => {
      if (!battle || !currentQuestion || battle.status !== "question") {
        return;
      }

      if (battle.eliminatedOptionIndices.includes(choiceIndex)) {
        return;
      }

      if (isResolvingAnswer) {
        return;
      }

      const isCorrect = currentQuestion.answerIndex === choiceIndex;
      battleAudio.arm();
      if (isCorrect) {
        battleAudio.playCorrect();
      } else {
        battleAudio.playWrong();
      }
      setSelectedAnswerIndex(choiceIndex);
      setResolvedAnswerIndex(choiceIndex);
      setResolvedAnswerWasCorrect(isCorrect);
      setIsResolvingAnswer(true);
      appendLog(
        isCorrect ? "player" : "enemy",
        isCorrect
          ? `You chose the correct answer: ${currentQuestion.options[choiceIndex]}.`
          : `You chose ${currentQuestion.options[choiceIndex]}. It was incorrect.`,
      );
      answerDelayTimeoutRef.current = window.setTimeout(() => {
        answerQuestion(choiceIndex);
        answerDelayTimeoutRef.current = null;
      }, ANSWER_LOCK_DELAY_MS);
    },
    [
      ANSWER_LOCK_DELAY_MS,
      battleAudio,
      answerQuestion,
      appendLog,
      battle,
      currentQuestion,
      isResolvingAnswer,
    ],
  );

  const handleSupportTool = useCallback(
    (toolId: SupportToolId) => {
      battleAudio.arm();
      battleAudio.playSupport();
      activateSupportTool(toolId);
    },
    [activateSupportTool, battleAudio],
  );

  const handleBurstClick = useCallback(() => {
    battleAudio.arm();
    battleAudio.playBurstTap();
    registerBurstClick();
  }, [battleAudio, registerBurstClick]);

  const answerOptions = useMemo(() => {
    if (!battle) {
      return [];
    }

    if (battle.status === "burst") {
      return ["Strike", "Hit", "Strike", "Hit"].map((label, index) => ({
        key: `${String.fromCharCode(65 + index)}.`,
        title: label,
        subtitle: "Tap the sigil above",
        disabled: true,
        isEliminated: false,
        tone: "dim" as const,
      }));
    }

    return (currentQuestion?.options ?? []).map((option, index) => {
      const isEliminated = battle.eliminatedOptionIndices.includes(index);
      let tone: "idle" | "selected" | "correct" | "wrong" | "dim" = "idle";

      if (selectedAnswerIndex === index) {
        tone = "selected";
      } else if (selectedAnswerIndex !== null && resolvedAnswerIndex === null) {
        tone = "dim";
      }

      if (resolvedAnswerIndex !== null) {
        if (resolvedAnswerIndex === index) {
          tone = resolvedAnswerWasCorrect ? "correct" : "wrong";
        } else {
          tone = "dim";
        }
      }

      return {
        key: `${String.fromCharCode(65 + index)}.`,
        title: option,
        subtitle: isEliminated
          ? "This wrong answer has been removed."
          : currentQuestion?.category ?? "Battle Quiz",
        onClick: () => handleAnswer(index),
        disabled:
          battle.status !== "question" ||
          battle.supportMenuOpen ||
          isEliminated ||
          isResolvingAnswer,
        isEliminated,
        tone,
      };
    });
  }, [
    battle,
    currentQuestion,
    handleAnswer,
    resolvedAnswerIndex,
    resolvedAnswerWasCorrect,
    selectedAnswerIndex,
    isResolvingAnswer,
  ]);

  const questionText =
    battle?.status === "burst"
      ? "Burst phase: ignite the sigil with rapid taps before the window closes."
      : currentQuestion?.prompt ?? "Preparing next battle question...";
  const questionMeta =
    battle?.status === "burst"
      ? `Burst Window | ${battle.currentBurstClicks} hits`
      : battle
        ? `${currentQuestion?.category ?? "Battle Quiz"} | Turn ${battle.turnsUsed + 1}/${battle.turnLimit}`
        : "Battle";
  const isTensionActive =
    battle?.status === "question" &&
    !battle.isTimerPaused &&
    battle.timeRemainingMs / 1000 <= 3;

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <main
      className={[
        "fixed inset-0 overflow-x-hidden bg-black text-stone-100",
        battle?.supportMenuOpen ? "overflow-y-hidden" : "overflow-y-auto",
      ].join(" ")}
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
      <div className="absolute inset-0 bg-white/12 backdrop-blur-[6px]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,5,0.28)_0%,rgba(8,6,5,0.12)_24%,rgba(8,6,5,0.3)_62%,rgba(7,5,4,0.62)_100%)]" />
      {isTensionActive ? (
        <div className="pointer-events-none absolute inset-0 z-[8] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(117,31,18,0.08)_54%,rgba(117,31,18,0.18)_100%)] animate-[battle-danger-pulse_900ms_ease-in-out_infinite]" />
      ) : null}
      {battle ? (
        <BattleStateStrip
          turn={Math.min(battle.turnsUsed + 1, battle.turnLimit)}
          turnLimit={battle.turnLimit}
          combo={battle.correctStreak}
          burstReady={burstReady}
          isBossBattle={battle.enemy.isBoss}
          muted={battle.status === "burst"}
        />
      ) : null}

      <div className="relative z-10 flex min-h-screen w-full flex-col px-2 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
        <div className="flex min-h-full w-full flex-1 flex-col gap-3">
          <BattleStage
            backgroundLabel={scene.label}
            enemy={
              battle?.enemy ?? {
                name: "Awaiting Battle",
                hp: 0,
                maxHp: 1,
                attack: 0,
                defense: 0,
              }
            }
            playerHit={playerHitFlash}
            enemyHit={enemyHitFlash}
            playerAttacking={playerAttackFlash}
            burstActive={false}
            floatingTexts={floatingTexts}
            shakeTone={stageShakeTone}
            hitStopActive={hitStopActive}
            impactFlashTone={impactFlashTone}
            enemyHitTier={enemyHitTier}
            enemyDefeated={battle?.status === "won"}
            playerDefeated={battle?.status === "lost"}
            hudMuted={battle?.status === "burst"}
            defeatAnimationMs={DEFEAT_ANIMATION_MS}
          />
          {battle?.status === "burst" || burstOutroState.active ? (
            <BattleBurstOverlay
              comboCount={battle?.correctStreak ?? 0}
              remainingMs={battle?.burstRemainingMs ?? 0}
              durationMs={BURST_DURATION_MS}
              currentBurstClicks={battle?.currentBurstClicks ?? 0}
              timerStarted={battle?.burstTimerStarted ?? false}
              resolving={battle?.burstResolving ?? false}
              introActive={burstIntroActive}
              outroActive={burstOutroState.active}
              outroDamage={burstOutroState.damage}
              onBurstClick={handleBurstClick}
            />
          ) : null}

          <div
            className={[
              "pt-[clamp(0.75rem,3vh,2.5rem)] transition duration-300",
              battle?.status === "burst"
                ? BURST_MUTED_CLASSES
                : burstOutroState.active
                  ? "opacity-60 blur-[1px] saturate-[0.9]"
                : isTensionActive
                  ? "saturate-[1.05]"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <BattleQuestionPanel
              answers={answerOptions}
              question={questionText}
              questionMeta={questionMeta}
              duration={(battle?.timeLimitMs ?? 12_000) / 1000}
              remainingTime={
                battle?.status === "burst"
                  ? battle.burstRemainingMs / 1000
                  : (battle?.timeRemainingMs ?? 12_000) / 1000
              }
              warningThreshold={3}
              isTensionActive={!!isTensionActive}
            />
            <div className="flex justify-start pt-4 sm:pt-6 xl:pt-8">
              <BattleBottomBar
                player={playerBattleStats}
                logEntries={logEntries}
                onToggleItems={() =>
                  battle?.status === "question"
                    ? setSupportMenuOpen(!battle.supportMenuOpen)
                    : undefined
                }
                itemsDisabled={!battle || battle.status !== "question"}
                itemCount={availableItemCount}
                itemsOpen={battle?.supportMenuOpen ?? false}
                itemsOverlay={
                  battle?.supportMenuOpen ? (
                    <BattleSupportOverlay
                      battle={battle}
                      onActivateTool={handleSupportTool}
                      onClose={() => setSupportMenuOpen(false)}
                    />
                  ) : null
                }
              />
            </div>
          </div>
        </div>
      </div>
      {battle &&
      outcomeVisible &&
      (battle.status === "won" || battle.status === "lost") ? (
        <BattleOutcomeOverlay
          status={battle.status}
          reward={reward}
          summary={outcomeSummary}
          onRetry={() => startBattle("skirmish")}
          onChallengeBoss={() => startBattle("boss")}
        />
      ) : null}
      <style jsx>{`
        @keyframes battle-danger-pulse {
          0%,
          100% {
            opacity: 0.72;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </main>,
    document.body
  );
}

