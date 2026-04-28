"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { validatePassword, validateUsername } from "@/lib/auth-shared";
import {
  AuthError,
  AuthFooterLink,
  AuthFormHeader,
  AuthPanel,
  AuthSubmitButton,
  AuthTextField,
} from "./AuthUi";

type AuthResponse = {
  error?: string;
};

type LoginFormProps = {
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
  const redirectUrl = new URL(
    getSafeReturnTo(returnTo),
    "https://last-answer.local",
  );
  console.log("Redirecting to:", redirectUrl);
  if (panel === CLOUD_SAVE_PANEL_PARAM) {
    redirectUrl.searchParams.set("panel", CLOUD_SAVE_PANEL_PARAM);
  }

  return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
}

function buildAuthLink(
  pathname: string,
  returnTo: string | null,
  panel: string | null,
) {
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

export function LoginForm({ returnTo = null, panel = null }: LoginFormProps) {
  const router = useRouter();
  const registerHref = buildAuthLink("/register", returnTo, panel);
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
        const payload = (await response
          .json()
          .catch(() => null)) as AuthResponse | null;

        setError(payload?.error ?? "Unable to log in.");
        return;
      }

      router.push(buildPostAuthRedirect(returnTo, panel));
      router.refresh();
    } catch {
      setError("Unable to log in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPanel>
      <AuthFormHeader
        eyebrow="Login"
        title="Continue Your Run"
        description="Sign in to restore your saved character, inventory, and battle progress."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-[clamp(0.65rem,1.8cqh,1rem)]"
      >
        <AuthTextField
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          placeholder="Enter your username"
        />

        <AuthTextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        {error ? <AuthError>{error}</AuthError> : null}

        <AuthSubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Entering..." : "Login"}
        </AuthSubmitButton>
      </form>

      <AuthFooterLink prompt="New here?" href={registerHref}>
        Create an account
      </AuthFooterLink>
    </AuthPanel>
  );
}
