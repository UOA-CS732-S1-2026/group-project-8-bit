"use client";

import { useEffect } from "react";
import { TavernActionsRow } from "./TavernActionsRow";
import { TavernNarrationPanel } from "./TavernNarrationPanel";
import { useMCStore } from "@/store/mcStore";
import { useRouter } from "next/navigation";

const BackMainHub =
  "text-black w-[140px] h-[88px] bg-[length:100%_100%] bg-no-repeat absolute left- -bottom-6 z-50 flex items-center justify-center origin-bottom-left transition-transform duration-150 ease-out hover:scale-105 active:scale-95";



const backgroundImage = "url('/assets/button/button-pannel.png')";

import { stopMainInterfaceMusicNow } from "@/lib/mainInterfaceMusic";
import { releaseTavernMusic, retainTavernMusic } from "@/lib/tavernMusic";

export default function TavernContent() {
  const setLocation = useMCStore((state) => state.setLocation);
const router = useRouter();

  useEffect(() => {
    setLocation("tavern");
  }, [setLocation]);

  useEffect(() => {
    stopMainInterfaceMusicNow();
    retainTavernMusic();

    return () => {
      releaseTavernMusic();
    };
  }, []);

  return (
    <main className="h-full w-full text-amber-100">
      <header className="flex items-start justify-between"></header>

      <TavernNarrationPanel />
      <div>
        

      </div>
      <footer className="space-y-3">
        <TavernActionsRow />
      </footer>
    </main>
  );
}
