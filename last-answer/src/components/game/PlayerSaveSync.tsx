"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useMCStore } from "@/store/mcStore";

export function PlayerSaveSync() {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const player = useMCStore((state) => state.player);
  const savePersistPlayer = useMCStore((state) => state.savePersistPlayer);
  const skipFirstSyncRef = useRef(true);

  useEffect(() => {
    skipFirstSyncRef.current = true;
  }, [user?.id]);

  useEffect(() => {
    if (!user || !isHydrated) {
      return;
    }

    savePersistPlayer(player);

    if (skipFirstSyncRef.current) {
      skipFirstSyncRef.current = false;
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        await fetch("/api/saves", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ player }),
          signal: controller.signal,
        });
      } catch {
        // Best-effort sync; keep local state responsive even when the network fails.
      }
    }, 600);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [isHydrated, player, savePersistPlayer, user]);

  return null;
}

