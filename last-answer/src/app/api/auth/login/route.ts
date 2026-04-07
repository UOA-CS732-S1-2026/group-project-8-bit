import { NextResponse } from "next/server";
import {
  applySessionCookie,
  createSession,
  findUserByUsername,
  verifyPassword,
} from "@/lib/auth";
import { validatePassword, validateUsername } from "@/lib/auth-shared";
import { getConfigurationErrorMessage } from "@/lib/config";
import { ensurePlayerSave } from "@/lib/player-save";

export const runtime = "nodejs";

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);

  if (usernameError) {
    return NextResponse.json({ error: usernameError }, { status: 400 });
  }

  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  try {
    const user = await findUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const passwordMatches = await verifyPassword(password, user.password_hash);

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const session = await createSession(user.id);
    const player = await ensurePlayerSave(user.id, user.username);
    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
      },
      player,
    });

    applySessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch (error) {
    const configurationMessage = getConfigurationErrorMessage(error);

    if (configurationMessage) {
      return NextResponse.json({ error: configurationMessage }, { status: 500 });
    }

    console.error("Login failed", error);
    return NextResponse.json(
      { error: "Unable to log in right now." },
      { status: 500 },
    );
  }
}
