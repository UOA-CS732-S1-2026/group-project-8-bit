"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { validatePassword, validateUsername } from "@/lib/auth-shared";

type AuthResponse = {
  error?: string;
};

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
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

        setError(payload?.error ?? "Unable to log in.");
        return;
      }

      router.push("/game/mainHub");
      router.refresh();
    } catch {
      setError("Unable to log in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center rounded-[2rem] border border-amber-100/10 bg-stone-950/55 p-6 shadow-2xl shadow-black/30 sm:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-200">
          Login
        </p>
        <h2 className="text-2xl font-semibold text-stone-50">
          Continue your run
        </h2>
        <p className="text-sm leading-6 text-stone-300">
          Sign in to resume your saved character, inventory, and battle progress.
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
            autoComplete="current-password"
            className="w-full rounded-2xl border border-stone-600/70 bg-black/35 px-4 py-3 text-base text-stone-50 outline-none transition focus:border-amber-300/60 focus:bg-black/50"
            placeholder="Enter your password"
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
          {isSubmitting ? "Entering..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-sm text-stone-300">
        New here?{" "}
        <Link href="/register" className="font-semibold text-amber-200">
          Create an account
        </Link>
      </p>
    </div>
  );
}
