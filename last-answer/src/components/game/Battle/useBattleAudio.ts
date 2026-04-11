"use client";

import { useCallback, useEffect, useRef } from "react";

type ToneSpec = {
  from: number;
  to?: number;
  duration: number;
  gain: number;
  type?: OscillatorType;
};

function scheduleTone(
  ctx: AudioContext,
  destination: AudioNode,
  spec: ToneSpec,
  startOffset = 0,
) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const now = ctx.currentTime + startOffset;

  oscillator.type = spec.type ?? "triangle";
  oscillator.frequency.setValueAtTime(spec.from, now);
  if (typeof spec.to === "number") {
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(40, spec.to),
      now + spec.duration,
    );
  }

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(spec.gain, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    now + spec.duration,
  );

  oscillator.connect(gainNode);
  gainNode.connect(destination);
  oscillator.start(now);
  oscillator.stop(now + spec.duration + 0.03);
}

export function useBattleAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const armedRef = useRef(false);

  const ensureContext = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    if (!audioContextRef.current) {
      const AudioContextCtor =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextCtor) {
        return null;
      }

      audioContextRef.current = new AudioContextCtor();
    }

    return audioContextRef.current;
  }, []);

  const arm = useCallback(() => {
    const ctx = ensureContext();
    if (!ctx) {
      return;
    }

    armedRef.current = true;

    if (ctx.state === "suspended") {
      void ctx.resume();
    }
  }, [ensureContext]);

  const playPattern = useCallback(
    (tones: ToneSpec[], spacing = 0.05) => {
      if (!armedRef.current) {
        return;
      }

      const ctx = ensureContext();
      if (!ctx) {
        return;
      }

      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.42, ctx.currentTime);
      master.connect(ctx.destination);

      tones.forEach((tone, index) => {
        scheduleTone(ctx, master, tone, index * spacing);
      });
    },
    [ensureContext],
  );

  const playCorrect = useCallback(() => {
    playPattern(
      [
        { from: 520, to: 740, duration: 0.12, gain: 0.14, type: "triangle" },
        { from: 760, to: 980, duration: 0.14, gain: 0.12, type: "sine" },
      ],
      0.06,
    );
  }, [playPattern]);

  const playWrong = useCallback(() => {
    playPattern([
      { from: 260, to: 180, duration: 0.18, gain: 0.13, type: "sawtooth" },
    ]);
  }, [playPattern]);

  const playEnemyHit = useCallback(() => {
    playPattern([
      { from: 210, to: 120, duration: 0.16, gain: 0.14, type: "square" },
      { from: 430, to: 280, duration: 0.14, gain: 0.08, type: "triangle" },
    ]);
  }, [playPattern]);

  const playPlayerHit = useCallback(() => {
    playPattern([
      { from: 160, to: 95, duration: 0.2, gain: 0.16, type: "sawtooth" },
      { from: 120, to: 80, duration: 0.22, gain: 0.08, type: "triangle" },
    ]);
  }, [playPattern]);

  const playBurstIntro = useCallback(() => {
    playPattern(
      [
        { from: 460, to: 720, duration: 0.14, gain: 0.12, type: "triangle" },
        { from: 720, to: 1080, duration: 0.18, gain: 0.13, type: "triangle" },
        { from: 1080, to: 980, duration: 0.22, gain: 0.1, type: "sine" },
      ],
      0.07,
    );
  }, [playPattern]);

  const playBurstFinish = useCallback(() => {
    playPattern(
      [
        { from: 840, to: 620, duration: 0.16, gain: 0.11, type: "triangle" },
        { from: 240, to: 120, duration: 0.22, gain: 0.15, type: "square" },
      ],
      0.05,
    );
  }, [playPattern]);

  const playSupport = useCallback(() => {
    playPattern(
      [
        { from: 400, to: 520, duration: 0.09, gain: 0.08, type: "sine" },
        { from: 520, to: 680, duration: 0.12, gain: 0.09, type: "triangle" },
      ],
      0.05,
    );
  }, [playPattern]);

  const playBurstTap = useCallback(() => {
    playPattern([
      { from: 620, to: 760, duration: 0.06, gain: 0.05, type: "triangle" },
    ]);
  }, [playPattern]);

  const playOutcomeWin = useCallback(() => {
    playPattern(
      [
        { from: 420, to: 560, duration: 0.16, gain: 0.05, type: "triangle" },
        { from: 560, to: 720, duration: 0.18, gain: 0.05, type: "sine" },
      ],
      0.08,
    );
  }, [playPattern]);

  const playOutcomeLose = useCallback(() => {
    playPattern(
      [{ from: 220, to: 150, duration: 0.22, gain: 0.05, type: "sawtooth" }],
      0.06,
    );
  }, [playPattern]);

  useEffect(() => {
    return () => {
      const ctx = audioContextRef.current;
      if (!ctx) {
        return;
      }

      void ctx.close();
      audioContextRef.current = null;
    };
  }, []);

  return {
    arm,
    playCorrect,
    playWrong,
    playEnemyHit,
    playPlayerHit,
    playBurstIntro,
    playBurstFinish,
    playSupport,
    playBurstTap,
    playOutcomeWin,
    playOutcomeLose,
  };
}
