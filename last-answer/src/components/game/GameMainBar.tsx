"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useMCStore } from "@/store/mcStore";

function formatLocation(location: string) {
  if (location === "mainHub") {
    return "Main Hub";
  }

  return location
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/(^|\s)\S/g, (character) => character.toUpperCase());
}

type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  sourceWidth: number;
  sourceHeight: number;
};

type MeterProps = {
  shellSrc: string;
  shellCrop: CropRect;
  fillSrc?: string;
  fillCrop?: CropRect;
  percent?: number;
  valueText?: string;
  valueClassName?: string;
  valueStyle?: CSSProperties;
};

const PANE_CROP: CropRect = {
  x: 148,
  y: 276,
  width: 1241,
  height: 437,
  sourceWidth: 1536,
  sourceHeight: 1024,
};

const HP_SHELL_CROP: CropRect = {
  x: 112,
  y: 360,
  width: 1313,
  height: 197,
  sourceWidth: 1536,
  sourceHeight: 1024,
};

const XP_SHELL_CROP: CropRect = {
  x: 112,
  y: 372,
  width: 1313,
  height: 177,
  sourceWidth: 1536,
  sourceHeight: 1024,
};

const HP_FILL_CROP: CropRect = {
  x: 48,
  y: 412,
  width: 1439,
  height: 173,
  sourceWidth: 1536,
  sourceHeight: 1024,
};

const XP_FILL_CROP: CropRect = {
  x: 48,
  y: 416,
  width: 1439,
  height: 171,
  sourceWidth: 1536,
  sourceHeight: 1024,
};

const COIN_ICON_CROP: CropRect = {
  x: 5,
  y: 19,
  width: 1016,
  height: 1000,
  sourceWidth: 1024,
  sourceHeight: 1024,
};

const routeTitleMap: Record<string, string> = {
  "/game/foggyForest": "Foggy Forest",
  "/game/tavern": "Ashen Tavern - Last Light",
  "/game/monolith": "The Monolith",
  "/game/mainHub": "Main Hub",
};

const pageTitle =
  routeTitleMap[pathname] ?? formatLocation(player.location) ?? "The Oracle of Lost Knowledge";

  const routeTitleMap: Record<string, string> = {
    "/game/foggyForest": "Foggy Forest",
    "/game/tavern": "Ashen Tavern - Last Light",
    "/game/mainHub": "Main Hub",
  };

  const pageTitle = routeTitleMap[pathname] ?? "The Oracle of Lost Knowledge";
  const topChromeHeight = "clamp(3.5rem, 6vw, 4.6rem)";
  // Keep the bar fill width driven by percent so later we can switch back to
  // dynamic cropping without restructuring the HUD.
  const hpFillPercent = 100;
  const xpFillPercent = 100;
  const paneStyle = createCroppedBackground("/topbar/main_status_pane.png", PANE_CROP);
  const rightButtonBaseStyle = createCroppedBackground(
    "/topbar/button_base_right.png (2).png",
    BUTTON_BASE_RIGHT_CROP,
  );

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex w-full items-start gap-0 p-0">
      <div
        className="relative w-[12.4rem] shrink-0 sm:w-[15rem] lg:w-[18.8rem] xl:w-[20.8rem]"
        style={{
          ...paneStyle,
          aspectRatio: `${PANE_CROP.width} / ${PANE_CROP.height}`,
        }}
      >
        <div
          className="absolute"
          style={STATUS_PANE_ZONES.portraitFrame}
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
            <div className="relative h-[84.5%] w-[84.5%] overflow-hidden rounded-[0.28rem]">
              <Image
                src="/portraits/mc-portrait.png"
                alt="Character Portrait"
                fill
                sizes="(max-width: 640px) 18vw, (max-width: 1280px) 10vw, 8vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>

        <div
          className="absolute"
          style={{
            ...STATUS_PANE_ZONES.levelFrame,
            ...retroFontStyle,
            fontVariant: "normal",
            fontVariantNumeric: "lining-nums tabular-nums",
            fontFeatureSettings: '"lnum" 1, "tnum" 1',
          }}
        >
          <div className="grid h-full grid-cols-[35%_1fr] items-center">
            <div />
            <div className="flex h-full items-center justify-center pr-[7%]">
              <div className="flex items-center justify-center gap-[0.15em] text-[clamp(0.58rem,0.8vw,0.78rem)] font-semibold uppercase tracking-[0.04em] text-stone-100 drop-shadow-[0_2px_1px_rgba(0,0,0,0.98)] leading-none">
                <span>LV</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute grid grid-rows-[1fr_1fr_1fr] gap-[4.2%]"
          style={STATUS_PANE_ZONES.rightPanel}
        >
          <div className="flex items-center justify-center">
            <div className="w-full">
              <Meter
                shellSrc="/topbar/hp_bar_shell.png"
                shellCrop={HP_SHELL_CROP}
                fillSrc="/topbar/hp_fill_texture.png"
                fillCrop={HP_FILL_CROP}
                percent={hpFillPercent}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full">
              <Meter
                shellSrc="/topbar/xp_bar_shell.png"
                shellCrop={XP_SHELL_CROP}
                fillSrc="/topbar/xp_fill_texture.png"
                fillCrop={XP_FILL_CROP}
                percent={xpFillPercent}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <CoinReadout />
          </div>
        </div>
      </div>

      <div className="center-banner -ml-[0.4rem] flex min-w-0 flex-1 items-start self-start">
        <div
          className="flex w-full items-center justify-center overflow-hidden bg-[url('/panels/top_banner_seamless_1.png')] bg-[center_top] bg-repeat-x bg-[length:auto_100%] px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-1px_0_rgba(0,0,0,0.65)] sm:px-6"
          style={{ height: topChromeHeight }}
        >
          <h2 className="truncate text-center text-xs font-semibold tracking-[0.08em] text-stone-200 sm:text-sm md:text-base">
            {pageTitle}
          </h2>
        </div>
      </div>

      <div
        className="-ml-[0.2rem] relative w-[clamp(8.7rem,14.9vw,11.45rem)] shrink-0 self-start"
        style={{
          ...rightButtonBaseStyle,
          height: topChromeHeight,
        }}
      >
        <div className="absolute inset-x-[6.4%] inset-y-[3.2%] grid grid-cols-3 gap-[0.9%]">
          <button
            type="button"
            aria-label="Info"
            className="relative flex h-full w-full items-center justify-center bg-transparent p-0"
          >
            <span
              className="block h-full w-full scale-[0.64] translate-x-[4%]"
              style={createCroppedBackground(
                "/topbar/info_icon_scroll.png3.png",
                INFO_ICON_SCROLL_CROP,
              )}
            />
          </button>

          <Link
            href="/game/mainHub"
            aria-label="Main hub"
            className="relative flex h-full w-full items-center justify-center"
          >
            <span
              className="block h-full w-full scale-[0.64] -translate-y-[3%]"
              style={createCroppedBackground(
                "/topbar/hub_icon_castle.png",
                HUB_ICON_CASTLE_CROP,
              )}
            />
          </Link>

          <div className="h-full [&>div]:flex [&>div]:h-full [&>div]:w-full [&>div]:items-stretch [&>div]:justify-center [&>div]:gap-0 [&>div>button]:h-full [&>div>button]:w-full">
            <LogoutButton
              showError={false}
              className="relative flex h-full w-full items-center justify-center bg-transparent p-0"
            >
              <span
                className="block h-full w-full scale-[0.64] -translate-y-[3%] -translate-x-[4%]"
                style={createCroppedBackground(
                  "/topbar/exit_icon_door.png",
                  EXIT_ICON_DOOR_CROP,
                )}
              />
            </LogoutButton>
          </div>
        </div>
      </div>
    </header>
  );
}
