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

type RegisterFormProps = {
  returnTo?: string | null;
  panel?: string | null;
};

const DEFAULT_AUTH_REDIRECT = "/";
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

export function RegisterForm({
  returnTo = null,
  panel = null,
}: RegisterFormProps) {
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
        const payload = (await response
          .json()
          .catch(() => null)) as AuthResponse | null;

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
    <AuthPanel>
      <AuthFormHeader
        eyebrow="Register"
        title="Create Your Adventurer"
        description="Create a persistent account so your player identity and progress survive the session."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-[clamp(0.58rem,1.5cqh,0.9rem)]"
      >
        <AuthTextField
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          placeholder="Username"
        />

        <AuthTextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />

        <AuthTextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          placeholder="Re-enter password"
        />

        {error ? <AuthError>{error}</AuthError> : null}

        <AuthSubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Forging..." : "Create Account"}
        </AuthSubmitButton>
      </form>

      <AuthFooterLink prompt="Already registered?" href={loginHref}>
        Log in here
      </AuthFooterLink>
    </AuthPanel>
  );
}
