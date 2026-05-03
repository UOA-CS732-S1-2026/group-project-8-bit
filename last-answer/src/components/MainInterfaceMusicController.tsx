"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  releaseMainInterfaceMusic,
  retainMainInterfaceMusic,
} from "@/lib/mainInterfaceMusic";

export function MainInterfaceMusicController() {
  const pathname = usePathname();
  const shouldPlay =
    !pathname.startsWith("/game/battle") &&
    !pathname.startsWith("/game/tavern");

  useEffect(() => {
    if (!shouldPlay) {
      return;
    }

    retainMainInterfaceMusic();

    return () => {
      releaseMainInterfaceMusic();
    };
  }, [pathname, shouldPlay]);

  return null;
}
