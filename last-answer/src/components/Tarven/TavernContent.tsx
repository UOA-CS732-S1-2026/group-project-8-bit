"use client";

import { useEffect } from "react";
import { TavernActionsRow } from "./TavernActionsRow";
import { TavernNarrationPanel } from "./TavernNarrationPanel";
import { useMCStore } from "@/store/mcStore";

export default function TavernContent() {
  const setLocation = useMCStore((state) => state.setLocation);

  useEffect(() => {
    setLocation("tavern");
  }, [setLocation]);

  return (
    <main className="h-full w-full text-amber-100">
      <header className="flex items-start justify-between"></header>

      <TavernNarrationPanel />

      <footer className="space-y-3">
        <TavernActionsRow />
      </footer>
    </main>
  );
}
