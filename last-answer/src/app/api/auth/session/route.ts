import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { getConfigurationErrorMessage } from "@/lib/config";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getCurrentSession();
    return NextResponse.json({
      user: session?.user ?? null,
    });
  } catch (error) {
    const configurationMessage = getConfigurationErrorMessage(error);

    if (configurationMessage) {
      return NextResponse.json({ error: configurationMessage }, { status: 500 });
    }

    console.error("Session lookup failed", error);
    return NextResponse.json(
      { error: "Unable to read session right now." },
      { status: 500 },
    );
  }
}
