"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SettingPanel from "./SettingPanel";
import SaveLoadCloudPanel from "./saveLoad/SaveLoadCloudPanel";
import SaveLoadLocalPanel from "./saveLoad/SaveLoadLocalPanel";

type TopBarMenuProps = {
  isOpen: boolean;
  onCloseMenu: () => void;
};

type ActivePanel = "local" | "cloud" | "settings" | null;

const menuItemClass =
  "w-full rounded-md border border-amber-200/20 bg-black/30 px-3 py-2 text-left text-xs font-semibold text-amber-100 transition duration-150 hover:border-amber-100/60 hover:bg-amber-200/15 hover:text-amber-50 active:translate-y-[1px] active:scale-[0.98] sm:text-sm";

export function TopBarMenu({ isOpen, onCloseMenu }: TopBarMenuProps) {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const backgroundImage = "url('/panels/menu-panel.png')";

  useEffect(() => {
    const currentUrl = new URL(window.location.href);

    if (currentUrl.searchParams.get("panel") !== "cloudSave") {
      return;
    }

    const openCloudPanelTimer = window.setTimeout(() => {
      setActivePanel("cloud");
      onCloseMenu();
    }, 0);

    currentUrl.searchParams.delete("panel");
    const nextUrl = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;

    router.replace(nextUrl, {
      scroll: false,
    });

    return () => {
      window.clearTimeout(openCloudPanelTimer);
    };
  }, [onCloseMenu, router]);

  const openPanel = (panel: Exclude<ActivePanel, null>) => {
    setActivePanel(panel);
    onCloseMenu();
  };

  return (
    <>
      {isOpen ? (
        <nav
          className="w-44 bg-[length:100%_100%] bg-center bg-no-repeat px-3 py-4 shadow-[0_18px_38px_rgba(0,0,0,0.48)]"
          style={{ backgroundImage }}
          aria-label="Top bar menu"
        >
          <div className="space-y-2" role="menu">
            <button
              type="button"
              className={menuItemClass}
              onClick={() => openPanel("local")}
              role="menuitem"
            >
              Save&Load Local
            </button>
            <button
              type="button"
              className={menuItemClass}
              onClick={() => openPanel("cloud")}
              role="menuitem"
            >
              Save&Load Cloud
            </button>
            <button
              type="button"
              className={menuItemClass}
              onClick={() => openPanel("settings")}
              role="menuitem"
            >
              Settings
            </button>
          </div>
        </nav>
      ) : null}

      {activePanel === "local" ? (
        <SaveLoadLocalPanel onClose={() => setActivePanel(null)} />
      ) : null}
      {activePanel === "cloud" ? (
        <SaveLoadCloudPanel onClose={() => setActivePanel(null)} />
      ) : null}
      {activePanel === "settings" ? (
        <SettingPanel onClose={() => setActivePanel(null)} />
      ) : null}
    </>
  );
}
