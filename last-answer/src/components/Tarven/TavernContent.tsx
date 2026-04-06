
import GameMainFooter from "@/components/game/GameMainFooter";
import { TavernActionsRow } from "./TavernActionsRow";
import { TavernNarrationPanel } from "./TavernNarrationPanel";
import { url } from "inspector";

export default function TavernContent() {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-amber-100"
      style={{ backgroundImage: "url('/backgrounds/Tavern_Background3.png')" }}
    >
      {/* whole page content */}
      <div className="absolute inset-0 flex flex-col p-4 md:p-6">
        {/* 1) top bar */}
        <header className="flex items-start justify-between">
          {/* <div className="rounded-md bg-black/55 px-4 py-2 text-lg md:text-2xl">
            Ashen Tavern - Last Light
          </div> */}

          {/* <div className="flex gap-2">
            <button className="rounded-md border border-amber-200/40 bg-black/50 px-4 py-2 hover:bg-black/70">
              Info
            </button>
            <button className="rounded-md border border-amber-200/40 bg-black/50 px-4 py-2 hover:bg-black/70">
              Menu
            </button>
          </div> */}
        </header>

        
       <TavernNarrationPanel />

        
        <footer className="space-y-3">
          <TavernActionsRow />

          <div
  className=" text-center text-lg md:text-2xl bg-no-repeat bg-center bg-[length:100%_480%] m-[0.1px] p-1 "
  style={{ backgroundImage: "url('/panels/Tavern-bottom.png')" }}
>
  Objective: Find answers in the tavern | Day 5 | EXP 320/500
</div>
        </footer>
        <GameMainFooter />
      </div>
    </main>
  );
}

