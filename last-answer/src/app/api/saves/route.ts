import { NextResponse } from "next/server";
import type { Player } from "@/game/core/types";
import { getCurrentSession } from "@/lib/auth";
import { getConfigurationErrorMessage } from "@/lib/config";
import { deletePlayerSave, getPlayerSave, updatePlayerSave } from "@/lib/player-save";
import { isValidSaveId } from "@/lib/save-slots";

export const runtime = "nodejs";

type SaveRequestBody = {
  saveId?: unknown;
  player?: unknown;
};

type DeleteRequestBody = {
  saveId?: unknown;
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

    const { saveList, savedAtList } = await getPlayerSave(session.user.id);

    return NextResponse.json({ saveList, savedAtList });
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

    const { player, savedAt } = await updatePlayerSave(
      session.user.id,
      body.saveId,
      body.player as Player,
    );

    return NextResponse.json({ player, savedAt });
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

export async function DELETE(request: Request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    let body: DeleteRequestBody;

    try {
      body = (await request.json()) as DeleteRequestBody;
    } catch {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 },
      );
    }

    if (!isValidSaveId(body.saveId)) {
      return NextResponse.json(
        { error: "Invalid save slot." },
        { status: 400 },
      );
    }

    await deletePlayerSave(session.user.id, body.saveId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const configurationMessage = getConfigurationErrorMessage(error);

    if (configurationMessage) {
      return NextResponse.json(
        { error: configurationMessage },
        { status: 500 },
      );
    }

    console.error("Save delete failed", error);
    return NextResponse.json(
      { error: "Unable to delete save right now." },
      { status: 500 },
    );
  }
}
