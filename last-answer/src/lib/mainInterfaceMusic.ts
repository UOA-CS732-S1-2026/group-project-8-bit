"use client";

let audioInstance: HTMLAudioElement | null = null;
let retainCount = 0;
let pendingStopTimeout: number | null = null;

function clearPendingStop() {
  if (pendingStopTimeout !== null && typeof window !== "undefined") {
    window.clearTimeout(pendingStopTimeout);
    pendingStopTimeout = null;
  }
}

function ensureAudio() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!audioInstance) {
    const audio = new Audio("/music/main-interface-music.mp3");
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0.2;
    audioInstance = audio;
  }

  return audioInstance;
}

export function retainMainInterfaceMusic() {
  const audio = ensureAudio();
  if (!audio) {
    return;
  }

  clearPendingStop();
  retainCount += 1;

  void audio.play().catch(() => {
    // Ignore autoplay rejections; browsers may require prior interaction.
  });
}

export function releaseMainInterfaceMusic() {
  if (typeof window === "undefined") {
    return;
  }

  retainCount = Math.max(0, retainCount - 1);
  clearPendingStop();

  if (retainCount > 0) {
    return;
  }

  pendingStopTimeout = window.setTimeout(() => {
    if (retainCount > 0 || !audioInstance) {
      return;
    }

    audioInstance.pause();
    audioInstance.currentTime = 0;
  }, 1200);
}

export function stopMainInterfaceMusicNow() {
  clearPendingStop();
  retainCount = 0;

  if (!audioInstance) {
    return;
  }

  audioInstance.pause();
  audioInstance.currentTime = 0;
}
