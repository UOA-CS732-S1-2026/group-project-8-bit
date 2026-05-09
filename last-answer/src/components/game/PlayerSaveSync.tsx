"use client";

import { useEffect, useRef } from "react";
import { AUTO_SAVE_ID } from "@/lib/save-slots";
import { useAuthStore } from "@/store/authStore";
import { useMCStore } from "@/store/mcStore";

export function PlayerSaveSync() {
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const player = useMCStore((state) => state.player);
  const skipFirstSyncRef = useRef(true);

  useEffect(() => {
    skipFirstSyncRef.current = true;
  }, [user?.id]);

  useEffect(() => {
    if (!user || !isHydrated) {
      return;
    }

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
          body: JSON.stringify({ saveId: AUTO_SAVE_ID, player }),
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
  }, [isHydrated, player, user]);

  return null;
}
