import GameMainFooter from "@/components/game/GameMainFooter";
import { MainHub } from "@/components/game/MainHub";

export default function MainHubPage() {
  const backgroundImage = "url('/backgrounds/city-hub.png')";
  return (
    <main
      className="h-full w-full bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage }}
    >
      <div className="flex-1">{/* page content */}</div>
      <div>
        <MainHub />
      </div>
      <footer className="mt-auto">
        <GameMainFooter />
      </footer>
    </main>
  );
}
