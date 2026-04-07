import { NextResponse } from "next/server";
import type { Player } from "@/game/core/types";
import { getCurrentSession } from "@/lib/auth";
import { getConfigurationErrorMessage } from "@/lib/config";
import { ensurePlayerSave, updatePlayerSave } from "@/lib/player-save";

export const runtime = "nodejs";

type SaveRequestBody = {
  player?: unknown;
};

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const player = await ensurePlayerSave(session.user.id, session.user.username);

    return NextResponse.json({ player });
  } catch (error) {
    const configurationMessage = getConfigurationErrorMessage(error);

    if (configurationMessage) {
      return NextResponse.json({ error: configurationMessage }, { status: 500 });
    }

    console.error("Save fetch failed", error);
    return NextResponse.json(
      { error: "Unable to load player save right now." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = (await request.json()) as SaveRequestBody;

    if (!body.player || typeof body.player !== "object") {
      return NextResponse.json({ error: "Invalid player payload." }, { status: 400 });
    }

    const player = await updatePlayerSave(
      session.user.id,
      body.player as Player,
    );

    return NextResponse.json({ player });
  } catch (error) {
    const configurationMessage = getConfigurationErrorMessage(error);

    if (configurationMessage) {
      return NextResponse.json({ error: configurationMessage }, { status: 500 });
    }

    console.error("Save update failed", error);
    return NextResponse.json(
      { error: "Unable to save player progress right now." },
      { status: 500 },
    );
  }
}
