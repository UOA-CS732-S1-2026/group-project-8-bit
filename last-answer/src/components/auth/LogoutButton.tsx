"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useMCStore } from "@/store/mcStore";

type LogoutButtonProps = {
  children?: ReactNode;
  className?: string;
  showError?: boolean;
};

export function LogoutButton({
  children = "Logout",
  className,
  showError = true,
}: LogoutButtonProps) {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logoutPending = useAuthStore((state) => state.logoutPending);
  const setLogoutPending = useAuthStore((state) => state.setLogoutPending);
  const clearPlayerContext = useMCStore((state) => state.clearPlayerContext);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setError(null);
    setLogoutPending(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        setError(payload?.error ?? "Unable to log out right now.");
        return;
      }

      clearAuth();
      clearPlayerContext();
      router.push("/");
      router.refresh();
    } catch {
      setError("Unable to log out right now.");
    } finally {
      setLogoutPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleLogout}
        disabled={logoutPending}
        className={className}
      >
        {logoutPending ? "Leaving..." : children}
      </button>
      {showError && error ? (
        <p className="text-xs text-rose-300">{error}</p>
      ) : null}
    </div>
  );
}
