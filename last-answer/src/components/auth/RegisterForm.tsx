"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validatePassword, validateUsername } from "@/lib/auth-shared";

type AuthResponse = {
  error?: string;
};

type RegisterFormProps = {
  returnTo?: string | null;
  panel?: string | null;
};

const DEFAULT_AUTH_REDIRECT = "/game/mainHub";
const CLOUD_SAVE_PANEL_PARAM = "cloudSave";

function getSafeReturnTo(returnTo: string | null) {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return returnTo;
}

function buildPostAuthRedirect(returnTo: string | null, panel: string | null) {
  const redirectUrl = new URL(getSafeReturnTo(returnTo), "https://last-answer.local");

  if (panel === CLOUD_SAVE_PANEL_PARAM) {
    redirectUrl.searchParams.set("panel", CLOUD_SAVE_PANEL_PARAM);
  }

  return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
}

function buildAuthLink(pathname: string, returnTo: string | null, panel: string | null) {
  const params = new URLSearchParams();

  if (returnTo && getSafeReturnTo(returnTo) === returnTo) {
    params.set("returnTo", returnTo);
  }

  if (panel === CLOUD_SAVE_PANEL_PARAM) {
    params.set("panel", panel);
  }

  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

export function RegisterForm({ returnTo = null, panel = null }: RegisterFormProps) {
  const router = useRouter();
  const loginHref = buildAuthLink("/login", returnTo, panel);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUsername = username.trim();
    const usernameError = validateUsername(trimmedUsername);
    const passwordError = validatePassword(password);

    if (usernameError) {
      setError(usernameError);
      return;
    }

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password,
        }),
        });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | AuthResponse
          | null;

        setError(payload?.error ?? "Unable to create account.");
        return;
      }

      router.push(buildPostAuthRedirect(returnTo, panel));
      router.refresh();
    } catch {
      setError("Unable to create account right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center rounded-[2rem] border border-amber-100/10 bg-stone-950/55 p-6 shadow-2xl shadow-black/30 sm:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200">
          Register
        </p>
        <h2 className="text-2xl font-semibold text-stone-50">
          Create your adventurer
        </h2>
        <p className="text-sm leading-6 text-stone-300">
          Your username becomes the initial player identity until character setup
          is expanded.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-200">
            Username
          </span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            className="w-full rounded-2xl border border-stone-600/70 bg-black/35 px-4 py-3 text-base text-stone-50 outline-none transition focus:border-amber-300/60 focus:bg-black/50"
            placeholder="LostScholar"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-200">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            className="w-full rounded-2xl border border-stone-600/70 bg-black/35 px-4 py-3 text-base text-stone-50 outline-none transition focus:border-amber-300/60 focus:bg-black/50"
            placeholder="At least 8 characters"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-200">
            Confirm Password
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            className="w-full rounded-2xl border border-stone-600/70 bg-black/35 px-4 py-3 text-base text-stone-50 outline-none transition focus:border-amber-300/60 focus:bg-black/50"
            placeholder="Re-enter password"
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl border border-amber-300/35 bg-amber-400/15 px-4 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-amber-100 transition hover:border-amber-200/60 hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Forging..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-stone-300">
        Already registered?{" "}
        <Link href={loginHref} className="font-semibold text-amber-200">
          Log in here
        </Link>
      </p>
    </div>
  );
}
