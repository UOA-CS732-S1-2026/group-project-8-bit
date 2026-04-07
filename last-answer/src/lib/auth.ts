import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import type { QueryResultRow } from "pg";
import type { AuthUser } from "./auth-shared";
import { query, type Queryable } from "./db";

const scrypt = promisify(scryptCallback);

export const AUTH_COOKIE_NAME = "oracle_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type CookieReader = {
  get: (name: string) => { value: string } | undefined;
};

type UserRow = QueryResultRow & {
  id: string;
  username: string;
  password_hash: string;
};

type SessionRow = QueryResultRow & {
  session_id: string;
  user_id: string;
  username: string;
  expires_at: Date | string;
};

export type SessionLookupResult = {
  sessionId: string;
  user: AuthUser;
  expiresAt: Date;
};

const defaultQueryable: Queryable = { query };

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [salt, expectedHash] = passwordHash.split(":");

  if (!salt || !expectedHash) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (derivedKey.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, expectedBuffer);
}

export async function findUserByUsername(
  username: string,
  db: Queryable = defaultQueryable,
) {
  const result = await db.query<UserRow>(
    `SELECT id, username, password_hash
       FROM users
      WHERE username = $1
      LIMIT 1`,
    [username],
  );

  return result.rows[0] ?? null;
}

export async function createSession(
  userId: string,
  db: Queryable = defaultQueryable,
) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await db.query(
    `INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [randomUUID(), userId, sha256(token), expiresAt],
  );

  return {
    token,
    expiresAt,
  };
}

export async function getSessionByToken(
  token: string,
  db: Queryable = defaultQueryable,
): Promise<SessionLookupResult | null> {
  const result = await db.query<SessionRow>(
    `SELECT
        s.id AS session_id,
        s.user_id,
        s.expires_at,
        u.username
       FROM sessions s
       INNER JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = $1
      LIMIT 1`,
    [sha256(token)],
  );

  const sessionRow = result.rows[0];

  if (!sessionRow) {
    return null;
  }

  const expiresAt = new Date(sessionRow.expires_at);

  if (expiresAt.getTime() <= Date.now()) {
    await db.query("DELETE FROM sessions WHERE id = $1", [sessionRow.session_id]);
    return null;
  }

  return {
    sessionId: sessionRow.session_id,
    user: {
      id: sessionRow.user_id,
      username: sessionRow.username,
    },
    expiresAt,
  };
}

export async function deleteSessionByToken(
  token: string,
  db: Queryable = defaultQueryable,
) {
  await db.query("DELETE FROM sessions WHERE token_hash = $1", [sha256(token)]);
}

export async function getSessionFromCookieStore(cookieStore: CookieReader) {
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return getSessionByToken(token);
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  return getSessionFromCookieStore(cookieStore);
}

export function applySessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date,
) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function isUniqueViolation(error: unknown, constraint?: string) {
  const pgError = error as {
    code?: string;
    constraint?: string;
  };

  return (
    pgError.code === "23505" &&
    (constraint ? pgError.constraint === constraint : true)
  );
}
