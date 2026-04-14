import GameMainFooter from "@/components/game/GameMainFooter";
import MonolithContent from "@/components/game/MonolithContent";

export default function MonolithPage() {
  const backgroundImage = "url('/backgrounds/monolith.png')";
  return (
    <main
      className="h-full w-full bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage }}
    >
      <div className="flex-1">{/* page content */}</div>
      <div className="mb-3">
        <MonolithContent />
      </div>
      <footer className="mt-auto">
        <GameMainFooter />
      </footer>
    </main>
  );
}
