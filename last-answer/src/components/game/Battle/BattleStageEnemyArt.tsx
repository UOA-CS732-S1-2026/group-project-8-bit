import Image from "next/image";

export function BattleStageEnemyArt() {
  return (
    <div
      className="absolute z-[18] pointer-events-none"
      style={{
        bottom: "-2%",
        right: "22%",
        height: "clamp(23rem, 52vh, 32rem)",
        aspectRatio: "1024 / 1536",
      }}
    >
      <div className="relative h-full w-full">
        <Image
          src="/battle/monster1.png"
          alt="Enemy full-body art"
          fill
          sizes="21vw"
          className="object-contain object-bottom drop-shadow-[0_24px_28px_rgba(0,0,0,0.55)]"
          priority
        />
      </div>
    </div>
  );
}
