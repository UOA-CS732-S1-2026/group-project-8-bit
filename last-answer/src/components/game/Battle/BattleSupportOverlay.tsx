import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { supportToolConfigs } from "@/game/core/battleCore";
import type { BattleSession, SupportToolId } from "@/game/core/types";
import { useMCStore } from "@/store/mcStore";

type BattleSupportOverlayProps = {
  battle: BattleSession;
  onActivateTool: (toolId: SupportToolId) => void;
  onClose: () => void;
  scale?: number;
};

type SupportEntry = {
  toolId: SupportToolId;
  tool: (typeof supportToolConfigs)[SupportToolId];
  remainingUses: number;
  inventoryAmount: number;
  disabled: boolean;
  stateLabel: string;
};

type SlotLayout = {
  column: string;
  row: string;
};

type SupportSlotProps = {
  entry: SupportEntry;
  selected: boolean;
  onSelect: () => void;
  layout: SlotLayout;
  iconSrc: string;
  shortLabel: string;
  iconBoxClassName: string;
};

const SLOT_LAYOUTS: Record<SupportToolId, SlotLayout> = {
  analyze: { column: "1", row: "1" },
  hourglass: { column: "2", row: "1" },
  barrier: { column: "1", row: "2" },
  chainGuard: { column: "2", row: "2" },
};

function SupportSlot({
  entry,
  selected,
  onSelect,
  layout,
  iconSrc,
  shortLabel,
  iconBoxClassName,
}: SupportSlotProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "group relative z-20 aspect-square w-full overflow-hidden rounded-[0.2rem] outline-none transition duration-150",
        entry.disabled
          ? "cursor-not-allowed grayscale-[0.82] opacity-70"
          : "hover:brightness-110 focus-visible:brightness-110",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ gridColumn: layout.column, gridRow: layout.row }}
    >
      <div
        className={[
          "absolute inset-[2%] rounded-[0.2rem]",
          selected
            ? "shadow-[inset_0_0_0_1px_rgba(255,243,216,0.22),0_0_22px_rgba(245,196,104,0.2)]"
            : "",
        ].join(" ")}
      >
        <Image
          src="/battle/single_item_panel_refined.png"
          alt=""
          fill
          sizes="220px"
          className="pointer-events-none object-fill opacity-100"
        />
      </div>
      <div
        className={[
          "absolute inset-[2%] rounded-[0.2rem] border transition duration-150",
          selected
            ? "border-[1.6px] border-[#f6dfaf] shadow-[0_0_0_1px_rgba(255,233,184,0.78),0_0_18px_rgba(241,182,82,0.34),inset_0_0_16px_rgba(246,208,129,0.18)]"
            : "border-transparent group-hover:border-[#dcb67a]/28 group-focus-visible:border-[#dcb67a]/28",
        ].join(" ")}
      />
      {selected ? (
        <>
          <div className="support-slot-pulse-ring pointer-events-none absolute inset-[-2.5%] rounded-[0.32rem] border border-[#fff1c8]/82 shadow-[0_0_0_1px_rgba(103,63,22,0.68),0_0_30px_rgba(245,194,96,0.32)]" />
          <div className="pointer-events-none absolute inset-x-[11%] top-[3.8%] h-[0.18rem] rounded-full bg-[linear-gradient(90deg,rgba(255,245,217,0)_0%,rgba(255,233,174,0.98)_50%,rgba(255,245,217,0)_100%)] opacity-95" />
          <div className="pointer-events-none absolute inset-[1.2%] rounded-[0.24rem] overflow-hidden">
            <div className="support-slot-shimmer absolute inset-y-[-28%] left-[-62%] w-[38%] rotate-[18deg] bg-[linear-gradient(90deg,rgba(255,249,234,0)_0%,rgba(255,245,214,0.08)_20%,rgba(255,252,244,0.7)_38%,rgba(255,255,252,1)_50%,rgba(255,245,214,0.72)_61%,rgba(255,226,162,0.14)_76%,rgba(255,249,234,0)_100%)] opacity-95 blur-[0.35px]" />
          </div>
        </>
      ) : null}
      <div className="absolute inset-[5%] rounded-[0.18rem] bg-[radial-gradient(circle_at_50%_24%,rgba(240,191,106,0.06)_0%,rgba(38,23,13,0.03)_45%,rgba(0,0,0,0)_100%)]" />
      <div className="absolute inset-x-[6%] top-[10%] bottom-[18%] flex items-center justify-center">
        <Image
          src={iconSrc}
          alt={entry.tool.name}
          width={140}
          height={140}
          sizes="140px"
          className={[
            "object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.28)]",
            iconBoxClassName,
          ].join(" ")}
        />
      </div>
      <div className="absolute inset-x-[6%] bottom-[7%] text-center font-serif text-[0.84rem] font-semibold leading-none text-[#f1e1c1] drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:text-[0.96rem]">
        {shortLabel}
      </div>
      <div className="absolute right-[4%] top-[4%] z-20 rounded-full border border-[#f0d6a2]/24 bg-[linear-gradient(180deg,rgba(96,61,28,0.24)_0%,rgba(52,31,16,0.14)_100%)] px-2 py-[0.14rem] text-[0.44rem] font-bold uppercase leading-none tracking-[0.12em] text-[#ffe9bf]/92 shadow-[inset_0_1px_0_rgba(255,240,210,0.08),0_0_10px_rgba(0,0,0,0.08)] backdrop-blur-[1.2px] sm:text-[0.5rem]">
        {entry.stateLabel}
      </div>
      {entry.inventoryAmount <= 0 ? (
        <div className="absolute inset-[2%] rounded-[0.2rem] border border-dashed border-[#c8a36a]/16 bg-[rgba(8,6,5,0.08)]" />
      ) : null}
    </button>
  );
}

function SupportBookSlot(props: Omit<SupportSlotProps, "iconSrc" | "shortLabel" | "iconBoxClassName">) {
  return (
    <SupportSlot
      {...props}
      iconSrc="/battle/support-book.png"
      shortLabel="Unmasking"
      iconBoxClassName="h-[clamp(3.3rem,11vw,4.9rem)] w-[clamp(3.3rem,11vw,4.9rem)]"
    />
  );
}

function HourglassSlot(props: Omit<SupportSlotProps, "iconSrc" | "shortLabel" | "iconBoxClassName">) {
  return (
    <SupportSlot
      {...props}
      iconSrc="/battle/magic-hourglass.png"
      shortLabel="Sand"
      iconBoxClassName="h-[clamp(3.2rem,10.4vw,4.7rem)] w-[clamp(3.2rem,10.4vw,4.7rem)]"
    />
  );
}

function AegisShieldSlot(props: Omit<SupportSlotProps, "iconSrc" | "shortLabel" | "iconBoxClassName">) {
  return (
    <SupportSlot
      {...props}
      iconSrc="/battle/aegis-shield.png"
      shortLabel="Aegis"
      iconBoxClassName="h-[clamp(3.1rem,9.8vw,4.45rem)] w-[clamp(3.1rem,9.8vw,4.45rem)]"
    />
  );
}

function OathboundChainSlot(props: Omit<SupportSlotProps, "iconSrc" | "shortLabel" | "iconBoxClassName">) {
  return (
    <SupportSlot
      {...props}
      iconSrc="/battle/oathbound-chain.png"
      shortLabel="Chain"
      iconBoxClassName="h-[clamp(3.45rem,11.4vw,5.05rem)] w-[clamp(3.45rem,11.4vw,5.05rem)]"
    />
  );
}

export function BattleSupportOverlay({
  battle,
  onActivateTool,
  onClose,
  scale = 1,
}: BattleSupportOverlayProps) {
  const contentScale = Math.min(Math.max(scale * 0.94, 0.42), 1);
  const inventory = useMCStore((state) => state.player.inventory);
  const supportEntries = useMemo(
    () =>
      (Object.entries(supportToolConfigs) as Array<
        [SupportToolId, (typeof supportToolConfigs)[SupportToolId]]
      >).map(([toolId, tool]) => {
        const remainingUses = battle.supportTools[toolId];
        const inventoryAmount =
          inventory.find((property) => property.id === toolId)?.leftNumber ?? 0;
        const blockedByQuestionType =
          toolId === "analyze" &&
          battle.questions[battle.currentQuestionIndex]?.type === "boolean";
        const disabled =
          remainingUses <= 0 ||
          blockedByQuestionType ||
          battle.toolUsedThisTurn ||
          battle.status !== "question";

        return {
          toolId,
          tool,
          remainingUses,
          inventoryAmount,
          disabled,
          stateLabel:
            remainingUses <= 0
              ? "Sealed"
              : blockedByQuestionType
                ? "Locked"
              : battle.toolUsedThisTurn
                ? "Invoked"
                : `${remainingUses} Left`,
        };
      }),
    [
      battle.currentQuestionIndex,
      battle.questions,
      battle.status,
      battle.supportTools,
      battle.toolUsedThisTurn,
      inventory,
    ],
  );
  const [selectedToolId, setSelectedToolId] = useState<SupportToolId>(
    supportEntries[0]?.toolId ?? "analyze",
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const selectedEntry =
    supportEntries.find((entry) => entry.toolId === selectedToolId) ??
    supportEntries.find((entry) => !entry.disabled) ??
    supportEntries[0];

  if (!selectedEntry) {
    return null;
  }

  const detailLines =
    selectedEntry.remainingUses <= 0
      ? "No charges remain for this battle."
      : selectedEntry.toolId === "analyze" &&
          battle.questions[battle.currentQuestionIndex]?.type === "boolean"
        ? "Truth-or-lie questions cannot be simplified by Unmasking."
      : battle.toolUsedThisTurn
        ? "You have already invoked one support on this question."
        : "Ready to invoke on this question.";

  const slotPropsById = Object.fromEntries(
    supportEntries.map((entry) => [
      entry.toolId,
      {
        entry,
        selected: entry.toolId === selectedToolId,
        onSelect: () => setSelectedToolId(entry.toolId),
        layout: SLOT_LAYOUTS[entry.toolId],
      },
    ]),
  ) as Record<
    SupportToolId,
    Omit<SupportSlotProps, "iconSrc" | "shortLabel" | "iconBoxClassName">
  >;

  return (
    <>
      <div className="absolute inset-0 z-[35] overflow-hidden bg-[rgba(0,0,0,0.68)] backdrop-blur-[6px]">
        <button
          type="button"
          aria-label="Close item menu"
          className="absolute inset-0 cursor-default"
          onClick={onClose}
        />

        <aside className="relative z-10 flex h-full w-full items-center justify-center px-6 py-8">
          <div
            className="flex w-full max-w-[48rem] origin-center flex-col items-center"
            style={{
              transform: `scale(${contentScale})`,
            }}
          >
            <div className="relative w-full max-w-[36rem]">
              <div className="relative aspect-[1388/1299] w-full">
                <Image
                  src="/battle/item_panel_2_refined.png"
                  alt=""
                  fill
                  priority
                  sizes="36rem"
                  className="pointer-events-none object-contain drop-shadow-[0_22px_44px_rgba(0,0,0,0.58)]"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute left-[84.2%] top-[8.1%] z-30 rounded-full border border-[#bf9b62]/45 bg-[rgba(27,17,10,0.88)] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#f7e3b8] transition hover:border-[#e5c084]/75 hover:text-[#fff1d1]"
                >
                  Close
                </button>
                <div className="absolute left-[26.4%] top-[27.5%] grid w-[46.8%] grid-cols-2 gap-x-[12.5%] gap-y-[19%]">
                  <SupportBookSlot {...slotPropsById.analyze} />
                  <HourglassSlot {...slotPropsById.hourglass} />
                  <AegisShieldSlot {...slotPropsById.barrier} />
                  <OathboundChainSlot {...slotPropsById.chainGuard} />
                </div>
              </div>
            </div>

            <div className="relative mt-3 w-full max-w-[41rem] rounded-[1rem] border border-[#9c7749]/55 bg-[linear-gradient(180deg,rgba(32,22,15,0.94)_0%,rgba(15,11,9,0.98)_100%)] px-6 py-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
              <div className="pointer-events-none absolute inset-0 rounded-[1rem] bg-[radial-gradient(circle_at_top,rgba(241,189,98,0.08)_0%,rgba(0,0,0,0)_52%)]" />
              <div className="relative flex flex-col gap-2.5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-[0.62rem] uppercase tracking-[0.28em] text-[#ba9d73]">
                      Forbidden Support
                    </div>
                    <div className="mt-1 font-serif text-[1.02rem] font-semibold text-[#f4dfb8] lg:text-[1.06rem]">
                      {selectedEntry.tool.name}
                    </div>
                  </div>
                  <div className="rounded-full border border-[#a88458]/35 bg-[rgba(64,44,24,0.54)] px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-[#d4bc92]">
                    {selectedEntry.stateLabel}
                  </div>
                </div>

                <p className="text-[0.76rem] leading-5 text-[#dbc7a3]">
                  {selectedEntry.tool.description}
                </p>

                <div className="flex flex-wrap gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[#e8d1a5]">
                  <span className="rounded-full border border-[#856242]/50 bg-[rgba(57,39,24,0.55)] px-3 py-1">
                    Inventory {selectedEntry.inventoryAmount}
                  </span>
                  <span className="rounded-full border border-[#856242]/50 bg-[rgba(57,39,24,0.55)] px-3 py-1">
                    Battle Uses {selectedEntry.remainingUses}
                  </span>
                  <span className="rounded-full border border-[#856242]/50 bg-[rgba(57,39,24,0.55)] px-3 py-1">
                    {selectedEntry.tool.strongAssist ? "Strong Assist" : "Standard Assist"}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[0.62rem] uppercase tracking-[0.17em] text-[#bb9b73]">
                    {detailLines}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      !selectedEntry.disabled && onActivateTool(selectedEntry.toolId)
                    }
                    disabled={selectedEntry.disabled}
                    className="w-full rounded-[0.8rem] border border-[#d4b07a]/65 bg-[linear-gradient(180deg,rgba(117,78,34,0.88)_0%,rgba(61,35,16,0.92)_100%)] px-4 py-3 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#fff0cc] shadow-[0_10px_24px_rgba(0,0,0,0.28)] transition hover:border-[#f0d29b]/85 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                  >
                    Invoke Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        @keyframes supportSlotPulse {
          0%,
          100% {
            opacity: 0.72;
            transform: scale(0.995);
            box-shadow:
              0 0 0 1px rgba(103, 63, 22, 0.68),
              0 0 22px rgba(245, 194, 96, 0.22);
          }
          50% {
            opacity: 1;
            transform: scale(1.01);
            box-shadow:
              0 0 0 1px rgba(121, 76, 28, 0.72),
              0 0 34px rgba(245, 194, 96, 0.42);
          }
        }

        @keyframes supportSlotShimmer {
          0% {
            opacity: 0;
            transform: translateX(0) rotate(18deg);
          }
          10% {
            opacity: 0.15;
          }
          45% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(520%) rotate(18deg);
          }
        }

        .support-slot-pulse-ring {
          animation: supportSlotPulse 1.9s ease-in-out infinite;
          transform-origin: center;
        }

        .support-slot-shimmer {
          animation: supportSlotShimmer 2.2s cubic-bezier(0.22, 0.61, 0.36, 1) infinite;
          transform-origin: center;
          mix-blend-mode: screen;
        }
      `}</style>
    </>
  );
}
