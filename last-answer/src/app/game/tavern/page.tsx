import GameMainFooter from "@/components/game/GameMainFooter";
import TavernContent from "@/components/Tarven/TavernContent";
export default function TavernPage() {
  const backgroundImage = "url('/backgrounds/Tavern_Background3.png')";
  return (
    <main
      className="h-full w-full bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage }}
    >
      <div className="flex-1">{/* page content */}</div>
      <div className="mb-3">
        <TavernContent />
      </div>
      <footer className="mt-auto">
        <GameMainFooter />
      </footer>
    </main>
  );
}
