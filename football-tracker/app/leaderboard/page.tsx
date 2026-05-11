import type { Metadata } from "next";
import { LeaderboardClient } from "./LeaderboardClient";
import { getTop100, LEAGUES } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Top 100 Most Valuable Players" };

export default function LeaderboardPage() {
  const players = getTop100();
  const leagues = LEAGUES.map((l) => ({ slug: l.slug, name: l.name }));
  const nationalities = [...new Set(players.map((p) => p.nationality))].sort();
  const positions = [...new Set(players.map((p) => p.positionGroup))];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          🏆 Top 100 Most Valuable Players
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Ranked by current market value across all 6 leagues. Filter by league, position, nationality, or age group.
        </p>
      </div>
      <LeaderboardClient players={players} leagues={leagues} nationalities={nationalities} positions={positions} />
    </div>
  );
}
