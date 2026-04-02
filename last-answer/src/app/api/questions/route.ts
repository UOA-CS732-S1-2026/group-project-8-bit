import { NextResponse } from "next/server";
import { defaultBattleQuestions } from "@/game/core/questions";

export async function GET() {
  return NextResponse.json({ questions: defaultBattleQuestions });
}
