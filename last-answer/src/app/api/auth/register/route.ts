import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  applySessionCookie,
  createSession,
  findUserByUsername,
  hashPassword,
  isUniqueViolation,
} from "@/lib/auth";
import { validatePassword, validateUsername } from "@/lib/auth-shared";
import { getConfigurationErrorMessage } from "@/lib/config";
import { withTransaction } from "@/lib/db";

export const runtime = "nodejs";

type RegisterBody = {
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = (await request.json()) as RegisterBody;
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
    const existingUser = await findUserByUsername(username);

    if (existingUser) {
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const result = await withTransaction(async (client) => {
      const userId = randomUUID();

      await client.query(
        `INSERT INTO users (id, username, password_hash, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [userId, username, passwordHash],
      );

      const session = await createSession(userId, client);

      return {
        user: {
          id: userId,
          username,
        },
        session,
      };
    });

    const response = NextResponse.json(
      {
        user: result.user,
      },
      { status: 201 },
    );

    applySessionCookie(response, result.session.token, result.session.expiresAt);
    return response;
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "That username is already taken." },
        { status: 409 },
      );
    }

    const configurationMessage = getConfigurationErrorMessage(error);

    if (configurationMessage) {
      return NextResponse.json({ error: configurationMessage }, { status: 500 });
    }

    console.error("Registration failed", error);
    return NextResponse.json(
      { error: "Unable to create account right now." },
      { status: 500 },
    );
  }
}
