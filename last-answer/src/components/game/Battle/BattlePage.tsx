"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { BURST_DURATION_MS, supportToolConfigs } from "@/game/core/battleCore";
import type {
  BattleOutcome,
  BattleSession,
  Enemy,
  SupportToolId,
} from "@/game/core/types";
import {
  getCorrectAnswerIndex,
  getQuestionOptions,
  getQuestionPrompt,
} from "@/game/core/battleUtil";
import {
  resumeMainInterfaceMusic,
  suspendMainInterfaceMusic,
} from "@/lib/mainInterfaceMusic";
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

type BattlePageProps = {
  enemy?: Enemy | null;
  backgroundImage?: string;
  label?: string;
  suppressBattleMusic?: boolean;
  onFinish?: (outcome: BattleOutcome) => void;
};

export function BattlePage({
  enemy: initialEnemy = null,
  backgroundImage = "/backgrounds/foggy-forest.png",
  label = "battle",
  suppressBattleMusic = false,
  onFinish,
}: BattlePageProps) {
  const BATTLE_CANVAS_WIDTH = 1660;
  const BATTLE_CANVAS_HEIGHT = 940;
  const BATTLE_CANVAS_PADDING_X = 24;
  const BATTLE_CANVAS_PADDING_Y = 20;
  const router = useRouter();
  const searchParams = useSearchParams();
  const AUTO_LOG_LIMIT = 12;
  const FEEDBACK_DURATION_MS = 1600;
  const ANSWER_LOCK_DELAY_MS = 260;
  const ATTACK_WINDUP_MS = 120;
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
  const [enemyAttackFlash, setEnemyAttackFlash] = useState(false);
  const [stageShakeTone, setStageShakeTone] = useState<
    "none" | "playerHit" | "enemyHit"
  >("none");
  const [impactFlashTone, setImpactFlashTone] = useState<
    "none" | "playerHit" | "enemyHit"
  >("none");
  const [enemyHitTier, setEnemyHitTier] = useState<"normal" | "burst">(
    "normal",
  );
  const [hitStopActive, setHitStopActive] = useState(false);
  const [isResolvingAnswer, setIsResolvingAnswer] = useState(false);
  const [burstIntroActive, setBurstIntroActive] = useState(false);
  const [burstOutroState, setBurstOutroState] = useState<{
    active: boolean;
    damage: number | null;
  }>({ active: false, damage: null });
  const [outcomeVisible, setOutcomeVisible] = useState(false);
  const [viewportScale, setViewportScale] = useState(1);
  const [battleVisualHeight, setBattleVisualHeight] = useState(
    BATTLE_CANVAS_HEIGHT,
  );
  const [actionCue, setActionCue] = useState<{
    id: string;
    title: string;
    detail: string;
    tone: "player" | "enemy" | "system";
  } | null>(null);
  const [isBattleLogCollapsed, setIsBattleLogCollapsed] = useState(false);
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
  const battleFrameRef = useRef<HTMLDivElement | null>(null);
  const battleContentRef = useRef<HTMLDivElement | null>(null);
  const prevBattleRef = useRef<BattleSession | null>(null);
  const prevPlayerHpRef = useRef<number | null>(null);
  const answerDelayTimeoutRef = useRef<number | null>(null);
  const burstIntroTimeoutRef = useRef<number | null>(null);
  const burstOutroTimeoutRef = useRef<number | null>(null);
  const outcomeTimeoutRef = useRef<number | null>(null);
  const actionCueTimeoutRef = useRef<number | null>(null);
  const player = useMCStore((state) => state.player);
  const battleAudio = useBattleAudio();
  const { setBattleMusic, stopBattleMusic } = battleAudio;
  const {
    battle,
    currentQuestion,
    reward,
    startBattleWithEnemy,
    resumeQuestionTimer,
    setSupportMenuOpen,
    activateSupportTool,
    answerQuestion,
    registerBurstClick,
  } = useBattleSession();
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
    battle.correctStreak % 5 === 0;
  const availableItemCount = battle
    ? Object.values(battle.supportTools).reduce(
        (sum, amount) => sum + amount,
        0,
      )
    : 0;
  const debugSupportOpen = searchParams.get("debugSupport") === "1";

  useEffect(() => {
    suspendMainInterfaceMusic();

    return () => {
      resumeMainInterfaceMusic();
    };
  }, []);

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

  const pushActionCue = useCallback(
    (entry: { title: string; detail: string; tone: "player" | "enemy" | "system" }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setActionCue({ id, ...entry });
      if (actionCueTimeoutRef.current !== null) {
        window.clearTimeout(actionCueTimeoutRef.current);
      }
      actionCueTimeoutRef.current = window.setTimeout(() => {
        setActionCue((current) => (current?.id === id ? null : current));
        actionCueTimeoutRef.current = null;
      }, 1250);
    },
    [],
  );

  const triggerEnemyHit = useCallback(
    (text?: string) => {
      setPlayerAttackFlash(true);
      window.setTimeout(() => {
        setHitStopActive(true);
        setImpactFlashTone("enemyHit");
        setEnemyHitTier("normal");
      }, ATTACK_WINDUP_MS);
      window.setTimeout(() => {
        setHitStopActive(false);
        setEnemyHitFlash(true);
        setStageShakeTone("enemyHit");
        battleAudio.playEnemyHit();
        if (text) {
          pushFloatingText({ target: "enemy", text, tone: "damage" });
        }
      }, ATTACK_WINDUP_MS + HIT_STOP_MS);
      window.setTimeout(() => {
        setEnemyHitFlash(false);
        setPlayerAttackFlash(false);
        setStageShakeTone("none");
        setImpactFlashTone("none");
      }, ATTACK_WINDUP_MS + FEEDBACK_DURATION_MS);
    },
    [ATTACK_WINDUP_MS, FEEDBACK_DURATION_MS, HIT_STOP_MS, battleAudio, pushFloatingText],
  );

  const triggerPlayerHit = useCallback(
    (text?: string) => {
      setEnemyAttackFlash(true);
      window.setTimeout(() => {
        setHitStopActive(true);
        setImpactFlashTone("playerHit");
      }, ATTACK_WINDUP_MS);
      window.setTimeout(() => {
        setHitStopActive(false);
        setPlayerHitFlash(true);
        setStageShakeTone("playerHit");
        battleAudio.playPlayerHit();
        if (text) {
          pushFloatingText({ target: "player", text, tone: "damage" });
        }
      }, ATTACK_WINDUP_MS + HIT_STOP_MS);
      window.setTimeout(() => {
        setEnemyAttackFlash(false);
        setPlayerHitFlash(false);
        setStageShakeTone("none");
        setImpactFlashTone("none");
      }, ATTACK_WINDUP_MS + FEEDBACK_DURATION_MS);
    },
    [ATTACK_WINDUP_MS, FEEDBACK_DURATION_MS, HIT_STOP_MS, battleAudio, pushFloatingText],
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
    pushActionCue({
      title: "Burst Release",
      detail: "Stored combo energy detonates on impact.",
      tone: "system",
    });
    window.setTimeout(() => {
      setStageShakeTone("none");
      setImpactFlashTone("none");
      setEnemyHitTier("normal");
    }, 520);
  }, [HIT_STOP_MS, battleAudio, pushActionCue]);

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

  const startBattle = useCallback(() => {
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
    setIsBattleLogCollapsed(false);
    setFloatingTexts([]);
    setStageShakeTone("none");
    setImpactFlashTone("none");
    setEnemyHitTier("normal");
    setHitStopActive(false);
    setEnemyAttackFlash(false);
    prevBattleRef.current = null;
    prevPlayerHpRef.current = player.hp;

    startBattleWithEnemy(initialEnemy);
  }, [initialEnemy, player.hp, startBattleWithEnemy]);

  const handleFinish = useCallback(() => {
    const outcome =
      battle?.status === "won" || battle?.status === "lost"
        ? battle.status
        : null;

    if (!outcome) {
      router.back();
      return;
    }

    if (onFinish) {
      onFinish(outcome);
      return;
    }

    router.back();
  }, [battle, onFinish, router]);

  useEffect(() => {
    if (suppressBattleMusic) {
      stopBattleMusic();
      return;
    }

    const track = initialEnemy?.isBoss ? "boss" : "normal";
    setBattleMusic(track);

    return () => {
      stopBattleMusic();
    };
  }, [initialEnemy?.isBoss, setBattleMusic, stopBattleMusic, suppressBattleMusic]);

  useEffect(() => {
    if (hasAutoStartedRef.current || battle) {
      return;
    }

    const timerId = window.setTimeout(() => {
      hasAutoStartedRef.current = true;
      startBattle();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [battle, label, startBattle]);

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

  useLayoutEffect(() => {
    const measureVisualBounds = () => {
      const frame = battleFrameRef.current;
      const content = battleContentRef.current;

      if (!frame || !content) {
        return;
      }

      const measuredHeight = Math.max(
        BATTLE_CANVAS_HEIGHT,
        Math.ceil(content.scrollHeight || 0),
        Math.ceil(content.offsetHeight || 0),
      );
      const availableWidth = Math.max(
        frame.clientWidth - BATTLE_CANVAS_PADDING_X * 2,
        1,
      );
      const availableHeight = Math.max(
        frame.clientHeight - BATTLE_CANVAS_PADDING_Y * 2,
        1,
      );
      const scaleX = availableWidth / BATTLE_CANVAS_WIDTH;
      const scaleY = availableHeight / measuredHeight;
      const nextScale = Math.min(1, scaleX, scaleY);

      setBattleVisualHeight((currentHeight) => {
        return Math.abs(currentHeight - measuredHeight) > 1
          ? measuredHeight
          : currentHeight;
      });
      setViewportScale((currentScale) => {
        const safeScale = nextScale > 0 ? nextScale : 1;
        return Math.abs(currentScale - safeScale) > 0.001
          ? safeScale
          : currentScale;
      });
    };

    measureVisualBounds();
    const resizeObserver = new ResizeObserver(measureVisualBounds);

    if (battleFrameRef.current) {
      resizeObserver.observe(battleFrameRef.current);
    }

    if (battleContentRef.current) {
      resizeObserver.observe(battleContentRef.current);
    }

    window.addEventListener("resize", measureVisualBounds);
    window.visualViewport?.addEventListener("resize", measureVisualBounds);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureVisualBounds);
      window.visualViewport?.removeEventListener("resize", measureVisualBounds);
    };
  }, [
    BATTLE_CANVAS_HEIGHT,
    BATTLE_CANVAS_PADDING_X,
    BATTLE_CANVAS_PADDING_Y,
    BATTLE_CANVAS_WIDTH,
    battle,
    actionCue,
    burstOutroState.active,
    logEntries.length,
  ]);

  useEffect(() => {
    return () => {
      if (answerDelayTimeoutRef.current !== null) {
        window.clearTimeout(answerDelayTimeoutRef.current);
      }
      if (actionCueTimeoutRef.current !== null) {
        window.clearTimeout(actionCueTimeoutRef.current);
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

      const enemyDamageTaken = Math.max(
        0,
        previousBattle.enemy.hp - battle.enemy.hp,
      );

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

        if (
          previousBattle.chainGuardActive &&
          battle.correctStreak === previousBattle.correctStreak
        ) {
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
        const burstClicksAdded =
          battle.burstClicks - previousBattle.burstClicks;
        const burstDamage = Math.max(
          0,
          previousBattle.enemy.hp - battle.enemy.hp,
        );

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

        setBurstOutroState({
          active: true,
          damage: burstDamage > 0 ? burstDamage : null,
        });
        if (burstOutroTimeoutRef.current !== null) {
          window.clearTimeout(burstOutroTimeoutRef.current);
        }
        burstOutroTimeoutRef.current = window.setTimeout(() => {
          setBurstOutroState({ active: false, damage: null });
          resumeQuestionTimer();
        }, BURST_OUTRO_MS);
        setBurstIntroActive(false);
      }

      if (
        battle.currentQuestionIndex > previousBattle.currentQuestionIndex &&
        currentQuestion
      ) {
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
          const burstDamage = Math.max(
            0,
            previousBattle.enemy.hp - battle.enemy.hp,
          );

          if (burstDamage > 0) {
            triggerBurstFinishImpact();
            pushFloatingText({
              target: "center",
              text: `Final Burst Damage -${burstDamage}`,
              tone: "info",
              emphasis: "burst",
            });
          }

          setBurstOutroState({
            active: true,
            damage: burstDamage > 0 ? burstDamage : null,
          });
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
    pushActionCue,
    pushFloatingText,
    pushLogs,
    resumeQuestionTimer,
    triggerBurstFinishImpact,
    triggerEnemyHit,
    triggerPlayerHit,
  ]);

  const currentQuestionOptions = useMemo(
    () => (currentQuestion ? getQuestionOptions(currentQuestion) : []),
    [currentQuestion],
  );

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

      const selectedAnswerText =
        currentQuestionOptions[choiceIndex] ?? "that answer";
      const isCorrect = getCorrectAnswerIndex(currentQuestion) === choiceIndex;
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
          ? `You chose the correct answer: ${selectedAnswerText}.`
          : `You chose ${selectedAnswerText}. It was incorrect.`,
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
      currentQuestionOptions,
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

    return currentQuestionOptions.map((option, index) => {
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
          : (currentQuestion?.category ?? "Battle Quiz"),
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
    currentQuestionOptions,
    handleAnswer,
    resolvedAnswerIndex,
    resolvedAnswerWasCorrect,
    selectedAnswerIndex,
    isResolvingAnswer,
  ]);

  const questionText =
    battle?.status === "burst"
      ? "Burst phase: ignite the sigil with rapid taps before the window closes."
      : currentQuestion
        ? getQuestionPrompt(currentQuestion)
        : "Preparing next battle question...";
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

  return (
    <main className="relative h-full min-h-0 w-full overflow-hidden bg-black text-stone-100">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={`${label} background`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-[rgba(255,244,226,0.04)] backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(238,205,155,0.05)_0%,rgba(238,205,155,0.02)_30%,rgba(0,0,0,0)_68%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,5,0.2)_0%,rgba(8,6,5,0.22)_32%,rgba(8,6,5,0.28)_68%,rgba(7,5,4,0.5)_100%)]" />
      {isTensionActive ? (
        <div className="pointer-events-none absolute inset-0 z-[8] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(117,31,18,0.08)_54%,rgba(117,31,18,0.18)_100%)] animate-[battle-danger-pulse_900ms_ease-in-out_infinite]" />
      ) : null}
      <div
        ref={battleFrameRef}
        className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden"
      >
        <div
          className="relative shrink-0"
          style={{
            width: `${BATTLE_CANVAS_WIDTH * viewportScale}px`,
            height: `${battleVisualHeight * viewportScale}px`,
          }}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              width: `${BATTLE_CANVAS_WIDTH}px`,
              height: `${battleVisualHeight}px`,
            }}
          >
            <div
              className="absolute left-0 top-0"
              style={{
                width: `${BATTLE_CANVAS_WIDTH}px`,
                height: `${battleVisualHeight}px`,
                transform: `scale(${viewportScale})`,
                transformOrigin: "top left",
              }}
            >
              <div
                ref={battleContentRef}
                className="relative flex min-h-[940px] w-full flex-col px-2 py-2 sm:px-3 sm:py-3 lg:px-4 lg:py-4"
                style={{
                  width: `${BATTLE_CANVAS_WIDTH}px`,
                }}
              >
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

                <div className="flex min-h-0 w-full flex-1 flex-col gap-2.5 sm:gap-3">
                  <BattleStage
                    backgroundLabel={label}
                    enemy={
                      battle?.enemy ?? {
                        name: "Awaiting Battle",
                        hp: 0,
                        maxHp: 1,
                        attack: 0,
                        defense: 0,
                        imagePath: initialEnemy?.imagePath,
                      }
                    }
                    playerHit={playerHitFlash}
                    enemyHit={enemyHitFlash}
                    enemyAttacking={enemyAttackFlash}
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
                    actionCue={actionCue}
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
                      "shrink-0 pt-[clamp(0.25rem,1.4vh,1rem)] transition duration-300",
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
                    <div className="flex justify-start pt-2.5 sm:pt-3">
                      <BattleBottomBar
                        player={playerBattleStats}
                        logEntries={logEntries}
                        onToggleLogCollapsed={() =>
                          setIsBattleLogCollapsed((current) => !current)
                        }
                        onToggleItems={() =>
                          battle?.status === "question"
                            ? setSupportMenuOpen(!battle.supportMenuOpen)
                            : undefined
                        }
                        itemsDisabled={!battle || battle.status !== "question"}
                        itemCount={availableItemCount}
                        itemsOpen={battle?.supportMenuOpen ?? false}
                        logCollapsed={isBattleLogCollapsed}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      {battle?.supportMenuOpen ? (
        <BattleSupportOverlay
          battle={battle}
          scale={viewportScale}
          onActivateTool={handleSupportTool}
          onClose={() => setSupportMenuOpen(false)}
        />
      ) : null}
      {battle &&
      outcomeVisible &&
      (battle.status === "won" || battle.status === "lost") ? (
        <BattleOutcomeOverlay
          status={battle.status}
          reward={reward}
          scale={viewportScale}
          summary={outcomeSummary}
          onFinish={handleFinish}
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
    </main>
  );
}
