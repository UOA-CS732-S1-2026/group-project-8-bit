"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

type ToneSpec = {
  from: number;
  to?: number;
  duration: number;
  gain: number;
  type?: OscillatorType;
};

type NoiseSpec = {
  duration: number;
  gain: number;
  cutoffFrom: number;
  cutoffTo?: number;
  startOffset?: number;
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

function scheduleNoise(
  ctx: AudioContext,
  destination: AudioNode,
  spec: NoiseSpec,
) {
  const frameCount = Math.max(1, Math.ceil(ctx.sampleRate * spec.duration));
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();
  const now = ctx.currentTime + (spec.startOffset ?? 0);

  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(spec.cutoffFrom, now);
  if (typeof spec.cutoffTo === "number") {
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(80, spec.cutoffTo),
      now + spec.duration,
    );
  }
  filter.Q.setValueAtTime(1.4, now);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(spec.gain, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + spec.duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(destination);
  source.start(now);
  source.stop(now + spec.duration + 0.03);
}

export function useBattleAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const armedRef = useRef(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmTrackRef = useRef<string | null>(null);

  const resetBattleMusic = useCallback(() => {
    if (!bgmAudioRef.current) {
      bgmTrackRef.current = null;
      return;
    }

    bgmAudioRef.current.pause();
    bgmAudioRef.current.currentTime = 0;
    bgmAudioRef.current = null;
    bgmTrackRef.current = null;
  }, []);

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

    const bgm = bgmAudioRef.current;
    if (bgm) {
      void bgm.play().catch(() => {
        // Ignore autoplay rejections until the next user gesture.
      });
    }
  }, [ensureContext]);

  const setBattleMusic = useCallback((track: "normal" | "boss" | null) => {
    if (typeof window === "undefined") {
      return;
    }

    const nextSrc =
      track === "boss"
        ? "/music/boss-battle-music.mp3"
        : track === "normal"
          ? "/music/normal-battle-music.mp3"
          : null;

    if (!nextSrc) {
      resetBattleMusic();
      return;
    }

    if (bgmTrackRef.current === nextSrc && bgmAudioRef.current) {
      return;
    }

    resetBattleMusic();

    const audio = new Audio(nextSrc);
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = track === "boss" ? 0.09 : 0.17;
    bgmAudioRef.current = audio;
    bgmTrackRef.current = nextSrc;

    void audio.play().catch(() => {
      // Ignore autoplay rejections until the next user gesture.
    });
  }, [resetBattleMusic]);

  const stopBattleMusic = resetBattleMusic;

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

  const withMaster = useCallback(
    (volume: number, run: (ctx: AudioContext, master: GainNode) => void) => {
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
      master.gain.setValueAtTime(volume, ctx.currentTime);
      master.connect(ctx.destination);
      run(ctx, master);
    },
    [ensureContext],
  );

  const playCorrect = useCallback(() => {
    withMaster(0.5, (ctx, master) => {
      scheduleTone(ctx, master, {
        from: 560,
        to: 760,
        duration: 0.09,
        gain: 0.11,
        type: "triangle",
      });
      scheduleTone(
        ctx,
        master,
        {
          from: 780,
          to: 1160,
          duration: 0.16,
          gain: 0.09,
          type: "sine",
        },
        0.04,
      );
      scheduleTone(
        ctx,
        master,
        {
          from: 1180,
          to: 1480,
          duration: 0.22,
          gain: 0.06,
          type: "triangle",
        },
        0.09,
      );
      scheduleNoise(ctx, master, {
        duration: 0.05,
        gain: 0.018,
        cutoffFrom: 2400,
        cutoffTo: 4200,
        startOffset: 0.035,
      });
    });
  }, [withMaster]);

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
    withMaster(0.56, (ctx, master) => {
      scheduleTone(ctx, master, {
        from: 210,
        to: 420,
        duration: 0.18,
        gain: 0.06,
        type: "sawtooth",
      });
      scheduleTone(
        ctx,
        master,
        {
          from: 440,
          to: 760,
          duration: 0.14,
          gain: 0.1,
          type: "triangle",
        },
        0.02,
      );
      scheduleTone(
        ctx,
        master,
        {
          from: 760,
          to: 1180,
          duration: 0.18,
          gain: 0.11,
          type: "triangle",
        },
        0.08,
      );
      scheduleTone(
        ctx,
        master,
        {
          from: 1180,
          to: 1540,
          duration: 0.26,
          gain: 0.08,
          type: "sine",
        },
        0.14,
      );
      scheduleNoise(ctx, master, {
        duration: 0.14,
        gain: 0.022,
        cutoffFrom: 900,
        cutoffTo: 2600,
        startOffset: 0.06,
      });
    });
  }, [withMaster]);

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
    withMaster(0.52, (ctx, master) => {
      const fanfare: Array<ToneSpec & { offset: number }> = [
        { from: 392, to: 392, duration: 0.16, gain: 0.05, type: "triangle", offset: 0 },
        { from: 523.25, to: 523.25, duration: 0.18, gain: 0.055, type: "triangle", offset: 0.08 },
        { from: 659.25, to: 659.25, duration: 0.22, gain: 0.06, type: "sine", offset: 0.16 },
        { from: 783.99, to: 783.99, duration: 0.28, gain: 0.065, type: "sine", offset: 0.28 },
        { from: 1046.5, to: 1046.5, duration: 0.42, gain: 0.05, type: "triangle", offset: 0.4 },
      ];

      fanfare.forEach(({ offset, ...tone }) => {
        scheduleTone(ctx, master, tone, offset);
      });

      scheduleTone(
        ctx,
        master,
        {
          from: 196,
          to: 261.63,
          duration: 0.42,
          gain: 0.04,
          type: "triangle",
        },
        0.02,
      );
      scheduleNoise(ctx, master, {
        duration: 0.1,
        gain: 0.012,
        cutoffFrom: 3000,
        cutoffTo: 5200,
        startOffset: 0.38,
      });
    });
  }, [withMaster]);

  const playOutcomeLose = useCallback(() => {
    playPattern(
      [{ from: 220, to: 150, duration: 0.22, gain: 0.05, type: "sawtooth" }],
      0.06,
    );
  }, [playPattern]);

  useEffect(() => {
    return () => {
      if (bgmAudioRef.current) {
        bgmAudioRef.current.pause();
        bgmAudioRef.current.currentTime = 0;
        bgmAudioRef.current = null;
      }

      const ctx = audioContextRef.current;
      if (!ctx) {
        return;
      }

      void ctx.close();
      audioContextRef.current = null;
    };
  }, []);

  return useMemo(
    () => ({
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
      setBattleMusic,
      stopBattleMusic,
    }),
    [
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
      setBattleMusic,
      stopBattleMusic,
    ],
  );
}
