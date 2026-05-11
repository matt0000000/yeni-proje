import { NextRequest, NextResponse } from "next/server";
import { searchPlayers } from "@/lib/mock-data";

export const runtime = "edge";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const results = searchPlayers(q).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    nationality: p.nationality,
    nationalityCode: p.nationalityCode,
    position: p.position,
    clubName: p.clubName,
    currentValue: p.currentValue,
    valueTrend: p.valueTrend,
  }));
  return NextResponse.json({ results });
}
