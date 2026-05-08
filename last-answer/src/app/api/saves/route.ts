import { NextResponse } from "next/server";
import type { Player } from "@/game/core/types";
import { getCurrentSession } from "@/lib/auth";
import { getConfigurationErrorMessage } from "@/lib/config";
import { getPlayerSave, updatePlayerSave } from "@/lib/player-save";
import { isValidSaveId } from "@/lib/save-slots";

export const runtime = "nodejs";

type SaveRequestBody = {
  saveId?: unknown;
  player?: unknown;
};

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const saveList = await getPlayerSave(session.user.id);

    return NextResponse.json({ saveList });
  } catch (error) {
    const configurationMessage = getConfigurationErrorMessage(error);

    if (configurationMessage) {
      return NextResponse.json(
        { error: configurationMessage },
        { status: 500 },
      );
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
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    let body: SaveRequestBody;

    try {
      body = (await request.json()) as SaveRequestBody;
    } catch {
      return NextResponse.json(
        { error: "Invalid save payload." },
        { status: 400 },
      );
    }

    if (!isValidSaveId(body.saveId)) {
      return NextResponse.json(
        { error: "Invalid save slot." },
        { status: 400 },
      );
    }

    if (!body.player || typeof body.player !== "object") {
      return NextResponse.json(
        { error: "Invalid player payload." },
        { status: 400 },
      );
    }

    const player = await updatePlayerSave(
      session.user.id,
      body.saveId,
      body.player as Player,
    );

    return NextResponse.json({ player });
  } catch (error) {
    const configurationMessage = getConfigurationErrorMessage(error);

    if (configurationMessage) {
      return NextResponse.json(
        { error: configurationMessage },
        { status: 500 },
      );
    }

    console.error("Save update failed", error);
    return NextResponse.json(
      { error: "Unable to save player progress right now." },
      { status: 500 },
    );
  }
}
