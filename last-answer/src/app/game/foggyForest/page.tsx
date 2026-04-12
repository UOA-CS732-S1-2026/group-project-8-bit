import FoggyForestContent from "@/components/game/FoggyForestContent";

export default function foggyForest() {
  const backgroundImage = "url('/backgrounds/foggy-forest.png')";
  return (
    <main
      className="h-full w-full bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage }}
    >
      <div className="flex-1">{/* page content */}</div>
      <div>
        <FoggyForestContent />
      </div>
    </main>
  );
}
