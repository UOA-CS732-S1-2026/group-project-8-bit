"use client";

let audioInstance: HTMLAudioElement | null = null;
let retainCount = 0;

function ensureAudio() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!audioInstance) {
    const audio = new Audio("/music/tarven-music.mp3");
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0.18;
    audioInstance = audio;
  }

  return audioInstance;
}

export function retainTavernMusic() {
  const audio = ensureAudio();
  if (!audio) {
    return;
  }

  retainCount += 1;

  void audio.play().catch(() => {
    // Ignore autoplay rejections; browsers may require prior interaction.
  });
}

export function releaseTavernMusic() {
  retainCount = Math.max(0, retainCount - 1);

  if (retainCount > 0 || !audioInstance) {
    return;
  }

  audioInstance.pause();
  audioInstance.currentTime = 0;
}

export function stopTavernMusicNow() {
  retainCount = 0;

  if (!audioInstance) {
    return;
  }

  audioInstance.pause();
  audioInstance.currentTime = 0;
}
