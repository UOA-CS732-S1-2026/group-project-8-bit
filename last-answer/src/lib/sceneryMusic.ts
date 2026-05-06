"use client";

let audioInstance: HTMLAudioElement | null = null;
let retainCount = 0;
const SCENERY_VOLUME = 0.05;

function syncAudioSettings(audio: HTMLAudioElement) {
  audio.loop = true;
  audio.volume = SCENERY_VOLUME;
}

function ensureAudio() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!audioInstance) {
    const audio = new Audio("/music/scenery-music.mp3");
    audio.preload = "auto";
    syncAudioSettings(audio);
    audioInstance = audio;
  } else {
    syncAudioSettings(audioInstance);
  }

  return audioInstance;
}

export function retainSceneryMusic() {
  const audio = ensureAudio();
  if (!audio) {
    return;
  }

  retainCount += 1;
  syncAudioSettings(audio);

  if (!audio.paused) {
    return;
  }

  void audio.play().catch(() => {
    // Ignore autoplay rejections; browsers may require prior interaction.
  });
}

export function releaseSceneryMusic() {
  retainCount = Math.max(0, retainCount - 1);

  if (retainCount > 0 || !audioInstance) {
    return;
  }

  audioInstance.pause();
  audioInstance.currentTime = 0;
}

export function pauseSceneryMusic() {
  if (!audioInstance) {
    return;
  }

  audioInstance.pause();
}

export function resumeSceneryMusic() {
  const audio = ensureAudio();
  if (!audio) {
    return;
  }

  syncAudioSettings(audio);

  if (!audio.paused) {
    return;
  }

  void audio.play().catch(() => {
    // Ignore autoplay rejections; browsers may require prior interaction.
  });
}

export function stopSceneryMusicNow() {
  retainCount = 0;

  if (!audioInstance) {
    return;
  }

  audioInstance.pause();
  audioInstance.currentTime = 0;
}
