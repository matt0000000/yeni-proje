import { NextRequest, NextResponse } from "next/server";

// Weekly cron job — runs every Monday at 03:00 UTC (see vercel.json)
// When a real database and API-Football integration is wired up,
// this endpoint fetches fresh market values and upserts them.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Fetch from API-Football / Transfermarkt scraper
  // const data = await fetchLatestValues();
  // await upsertPlayers(data);

  return NextResponse.json({ ok: true, message: "Refresh triggered (stub)" });
}
