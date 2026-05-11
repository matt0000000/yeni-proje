import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, Users, Trophy } from "lucide-react";
import { LEAGUES } from "@/lib/mock-data";
import { formatValue, getSquadValue, getMostValuablePlayer } from "@/lib/types";
import { getFlagEmoji } from "@/lib/flags";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TransferScope — Football Market Values",
};

const leagueAccents: Record<string, { bg: string; border: string; badge: string }> = {
  "premier-league": { bg: "from-purple-600/10 to-transparent", border: "border-purple-500/30", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  "la-liga":         { bg: "from-red-600/10 to-transparent",    border: "border-red-500/30",    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  "bundesliga":      { bg: "from-red-700/10 to-transparent",    border: "border-red-700/30",    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  "serie-a":         { bg: "from-blue-600/10 to-transparent",   border: "border-blue-500/30",   badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  "ligue-1":         { bg: "from-sky-600/10 to-transparent",    border: "border-sky-500/30",    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" },
  "super-lig":       { bg: "from-red-500/10 to-transparent",    border: "border-red-500/30",    badge: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300" },
};

export default function HomePage() {
  const allPlayers = LEAGUES.flatMap((l) => l.clubs.flatMap((c) => c.players));
  const totalMarketValue = allPlayers.reduce((s, p) => s + p.currentValue, 0);
  const mostValuable = [...allPlayers].sort((a, b) => b.currentValue - a.currentValue)[0];
  const risingCount = allPlayers.filter((p) => p.valueTrend === "up").length;

  return (
    <div>
      {/* Hero */}
      <section className="mb-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <TrendingUp size={12} />
            Live Market Values — Updated Weekly
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
            Football Transfer<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-500">Market Tracker</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
            Track player market values across 6 top leagues. Find rising stars, follow value trends, and compare squads.
          </p>

          {/* Global stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { label: "Total Market Value", value: formatValue(totalMarketValue, "EUR"), icon: "💰" },
              { label: "Rising Players", value: `${risingCount} players`, icon: "📈" },
              { label: "Most Valuable", value: mostValuable?.name ?? "—", icon: "⭐" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leagues grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top Leagues</h2>
          <Link href="/leaderboard" className="flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
            <Trophy size={14} />
            Top 100 Players
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEAGUES.map((league) => {
            const allLeaguePlayers = league.clubs.flatMap((c) => c.players);
            const totalValue = getSquadValue(allLeaguePlayers);
            const mvp = getMostValuablePlayer(allLeaguePlayers);
            const accent = leagueAccents[league.slug] ?? { bg: "from-slate-500/10 to-transparent", border: "border-slate-300/30", badge: "bg-slate-100 text-slate-600" };

            return (
              <Link
                key={league.id}
                href={`/${league.slug}`}
                className={`group relative block bg-white dark:bg-slate-800 border ${accent.border} rounded-2xl p-5 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${accent.bg} pointer-events-none`} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center overflow-hidden">
                        <Image
                          src={league.logo}
                          alt={league.name}
                          width={36}
                          height={36}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {league.name}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${accent.badge}`}>
                          {league.country}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2.5">
                      <div className="text-xs text-slate-400 mb-0.5">Total Value</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{formatValue(totalValue)}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2.5">
                      <div className="text-xs text-slate-400 mb-0.5">Clubs</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{league.clubs.length}</div>
                    </div>
                  </div>

                  {mvp && (
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-sm">⭐</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-slate-400">Top Player</div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{mvp.name}</div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        {formatValue(mvp.currentValue)}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex gap-1.5 flex-wrap">
                    {league.clubs.slice(0, 4).map((club) => (
                      <div key={club.id} className="w-6 h-6 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded overflow-hidden">
                        <Image src={club.logo} alt={club.shortName} width={24} height={24} className="object-contain w-full h-full p-0.5" unoptimized />
                      </div>
                    ))}
                    {league.clubs.length > 4 && (
                      <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-500 flex items-center justify-center font-medium">
                        +{league.clubs.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick stats row */}
      <section className="mt-12">
        <div className="bg-gradient-to-r from-brand-600 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Explore the Top 100 Most Valuable Players</h3>
              <p className="text-blue-200 text-sm">Filter by league, position, nationality, and age group</p>
            </div>
            <Link
              href="/leaderboard"
              className="shrink-0 bg-white text-brand-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Trophy size={15} />
              View Leaderboard
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", label: "Premier League", value: formatValue(LEAGUES[0].clubs.flatMap(c=>c.players).reduce((s,p)=>s+p.currentValue,0)) },
              { flag: "🇪🇸", label: "La Liga", value: formatValue(LEAGUES[1].clubs.flatMap(c=>c.players).reduce((s,p)=>s+p.currentValue,0)) },
              { flag: "🇩🇪", label: "Bundesliga", value: formatValue(LEAGUES[2].clubs.flatMap(c=>c.players).reduce((s,p)=>s+p.currentValue,0)) },
              { flag: "🇮🇹", label: "Serie A", value: formatValue(LEAGUES[3].clubs.flatMap(c=>c.players).reduce((s,p)=>s+p.currentValue,0)) },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-xl p-3">
                <div className="text-lg mb-0.5">{item.flag}</div>
                <div className="text-xs text-blue-200">{item.label}</div>
                <div className="text-sm font-bold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Players section hint */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users size={20} />
            Biggest Rising Stars
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allPlayers
            .filter((p) => p.valueTrend === "up")
            .sort((a, b) => b.currentValue - a.currentValue)
            .slice(0, 4)
            .map((player) => (
              <Link
                key={player.id}
                href={`/players/${player.slug}`}
                className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-emerald-500 hover:shadow-md transition-all"
              >
                <div className="text-2xl">{getFlagEmoji(player.nationalityCode)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{player.name}</div>
                  <div className="text-xs text-slate-400 truncate">{player.clubName}</div>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  {formatValue(player.currentValue)}
                </span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

