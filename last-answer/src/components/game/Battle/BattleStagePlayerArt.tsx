import Image from "next/image";

export function BattleStagePlayerArt() {
  return (
    <div
      className="absolute z-[8] pointer-events-none"
      style={{
        bottom: "-60%",
        left: "16%",
        height: "clamp(21rem, 64vh, 31rem)",
        aspectRatio: "706 / 900",
      }}
    >
      <div className="relative h-full w-full">
        <Image
          src="/battle/male.png"
          alt="Player full-body art"
          fill
          sizes="20vw"
          className="object-contain object-bottom drop-shadow-[0_28px_30px_rgba(0,0,0,0.6)]"
          priority
        />
      </div>
    </div>
  );
}
