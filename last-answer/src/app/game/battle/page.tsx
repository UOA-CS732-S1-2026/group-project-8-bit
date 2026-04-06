"use client";

import { useEffect } from "react";
import { BattleRenderer } from "@/components/game/demoBattle/BattleRenderer";
import { useMCStore } from "@/store/mcStore";

export default function BattlePage() {
  const setLocation = useMCStore((state) => state.setLocation);

  useEffect(() => {
    setLocation("battleDemo");
  }, [setLocation]);

  return <BattleRenderer />;
}
