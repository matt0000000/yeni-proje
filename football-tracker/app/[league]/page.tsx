import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpDown, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getLeague, LEAGUES } from "@/lib/mock-data";
import { formatValue, getSquadValue, getMostValuablePlayer } from "@/lib/types";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return LEAGUES.map((l) => ({ league: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ league: string }> }): Promise<Metadata> {
  const { league: slug } = await params;
  const league = getLeague(slug);
  return { title: league ? `${league.name} Clubs & Values` : "League Not Found" };
}

export default async function LeaguePage({ params }: { params: Promise<{ league: string }> }) {
  const { league: slug } = await params;
  const league = getLeague(slug);
  if (!league) notFound();

  const clubsWithStats = league.clubs
    .map((club) => ({
      ...club,
      squadValue: getSquadValue(club.players),
      mvp: getMostValuablePlayer(club.players),
      rising: club.players.filter((p) => p.valueTrend === "up").length,
      falling: club.players.filter((p) => p.valueTrend === "down").length,
    }))
    .sort((a, b) => b.squadValue - a.squadValue);

  const totalLeagueValue = clubsWithStats.reduce((s, c) => s + c.squadValue, 0);
  const allPlayers = league.clubs.flatMap((c) => c.players);
  const topPlayer = getMostValuablePlayer(allPlayers);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-600 flex items-center gap-1">
          <ArrowLeft size={14} /> Leagues
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium">{league.name}</span>
      </div>

      {/* League header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
          <Image src={league.logo} alt={league.name} width={48} height={48} className="object-contain p-1" unoptimized />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{league.name}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
            <span>{league.country}</span>
            <span>·</span>
            <span>{league.clubs.length} clubs</span>
            <span>·</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{formatValue(totalLeagueValue)} total</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total League Value", value: formatValue(totalLeagueValue), icon: "💰" },
          { label: "Players Tracked", value: allPlayers.length, icon: "👥" },
          { label: "Top Player", value: topPlayer?.name ?? "—", icon: "⭐" },
          { label: "Top Club Value", value: formatValue(clubsWithStats[0]?.squadValue ?? 0), icon: "🏆" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{s.value}</div>
            <div className="text-xs text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Clubs table header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ArrowUpDown size={16} className="text-slate-400" />
          Clubs — Sorted by Squad Value
        </h2>
      </div>

      <div className="space-y-3">
        {clubsWithStats.map((club, i) => (
          <Link
            key={club.id}
            href={`/${league.slug}/${club.slug}`}
            className="group flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-brand-500 hover:shadow-lg transition-all duration-200"
          >
            {/* Rank */}
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400 shrink-0">
              {i + 1}
            </div>

            {/* Club logo + name */}
            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
              <Image src={club.logo} alt={club.name} width={32} height={32} className="object-contain p-0.5" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {club.name}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1"><Users size={10} /> {club.players.length} players</span>
                {club.mvp && <span className="truncate">⭐ {club.mvp.name}</span>}
              </div>
            </div>

            {/* Trend indicators */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={12} />{club.rising}
              </div>
              <div className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                <TrendingDown size={12} />{club.falling}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Minus size={12} />{club.players.length - club.rising - club.falling}
              </div>
            </div>

            {/* Squad value */}
            <div className="text-right shrink-0">
              <div className="font-bold text-slate-900 dark:text-white">{formatValue(club.squadValue)}</div>
              <div className="text-xs text-slate-400">squad value</div>
            </div>

            {/* Value bar */}
            <div className="hidden md:block w-28 shrink-0">
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (club.squadValue / clubsWithStats[0].squadValue) * 100)}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
