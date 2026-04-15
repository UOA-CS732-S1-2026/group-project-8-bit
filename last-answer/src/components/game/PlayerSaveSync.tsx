"use client";

import { useEffect, useRef } from "react";
import { PLAYER_SAVE_SLOT_IDS, type PlayerSaveSlotId } from "@/lib/save-slots";
import { useAuthStore } from "@/store/authStore";
import { useMCStore } from "@/store/mcStore";

type PlayerSaveSyncProps = {
  saveId?: PlayerSaveSlotId;
};

export function PlayerSaveSync({
  saveId = PLAYER_SAVE_SLOT_IDS[0],
}: PlayerSaveSyncProps) {
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

    savePersistPlayer(player, saveId);

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
          body: JSON.stringify({ saveId, player }),
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
  }, [isHydrated, player, saveId, savePersistPlayer, user]);

  return null;
}
