"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Player } from "@/lib/types";
import { ValueBadge } from "@/components/ValueBadge";
import { getFlagEmoji } from "@/lib/flags";
import { MiniSparkline } from "@/components/MiniSparkline";
import { useCurrency } from "@/lib/currency-context";

interface Props {
  players: Player[];
  leagues: { slug: string; name: string }[];
  nationalities: string[];
  positions: string[];
}

const AGE_GROUPS = [
  { label: "U21", min: 0, max: 20 },
  { label: "21-25", min: 21, max: 25 },
  { label: "26-30", min: 26, max: 30 },
  { label: "30+", min: 31, max: 99 },
];

const trendIcons = {
  up: <TrendingUp size={14} className="text-emerald-500" />,
  down: <TrendingDown size={14} className="text-red-500" />,
  stable: <Minus size={14} className="text-slate-400" />,
};

export function LeaderboardClient({ players, leagues, nationalities, positions }: Props) {
  const { currency } = useCurrency();
  const [leagueFilter, setLeagueFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("");
  const [ageGroupFilter, setAgeGroupFilter] = useState("");
  const [trendFilter, setTrendFilter] = useState("");

  const filtered = useMemo(() => {
    return players.filter((p) => {
      if (leagueFilter && p.leagueSlug !== leagueFilter) return false;
      if (positionFilter && p.positionGroup !== positionFilter) return false;
      if (nationalityFilter && p.nationality !== nationalityFilter) return false;
      if (ageGroupFilter) {
        const grp = AGE_GROUPS.find((g) => g.label === ageGroupFilter);
        if (grp && (p.age < grp.min || p.age > grp.max)) return false;
      }
      if (trendFilter && p.valueTrend !== trendFilter) return false;
      return true;
    });
  }, [players, leagueFilter, positionFilter, nationalityFilter, ageGroupFilter, trendFilter]);

  const hasFilters = leagueFilter || positionFilter || nationalityFilter || ageGroupFilter || trendFilter;

  const clearAll = () => {
    setLeagueFilter("");
    setPositionFilter("");
    setNationalityFilter("");
    setAgeGroupFilter("");
    setTrendFilter("");
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-slate-400" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filters</span>
          {hasFilters && (
            <button onClick={clearAll} className="ml-auto text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
              <X size={12} /> Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {/* League */}
          <select
            value={leagueFilter}
            onChange={(e) => setLeagueFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="">All Leagues</option>
            {leagues.map((l) => <option key={l.slug} value={l.slug}>{l.name}</option>)}
          </select>

          {/* Position */}
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="">All Positions</option>
            {positions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          {/* Nationality */}
          <select
            value={nationalityFilter}
            onChange={(e) => setNationalityFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="">All Nationalities</option>
            {nationalities.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>

          {/* Age group */}
          <select
            value={ageGroupFilter}
            onChange={(e) => setAgeGroupFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="">All Ages</option>
            {AGE_GROUPS.map((g) => <option key={g.label} value={g.label}>{g.label}</option>)}
          </select>

          {/* Trend */}
          <select
            value={trendFilter}
            onChange={(e) => setTrendFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="">All Trends</option>
            <option value="up">Rising ↑</option>
            <option value="down">Falling ↓</option>
            <option value="stable">Stable —</option>
          </select>
        </div>

        {hasFilters && (
          <div className="mt-2 text-xs text-slate-400">
            Showing {filtered.length} of {players.length} players
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700 text-xs text-slate-400">
              <th className="text-left px-4 py-3 font-medium w-12">Rank</th>
              <th className="text-left px-4 py-3 font-medium">Player</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Club</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">League</th>
              <th className="text-left px-4 py-3 font-medium">Position</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Age</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Trend</th>
              <th className="text-left px-4 py-3 font-medium hidden xl:table-cell w-24">Chart</th>
              <th className="text-right px-4 py-3 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player, i) => (
              <tr
                key={player.id}
                className="border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                    ${i === 0 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      i === 1 ? "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300" :
                      i === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                      "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}
                  >
                    {i + 1}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/players/${player.slug}`} className="flex items-center gap-2.5 group">
                    <span className="text-lg">{getFlagEmoji(player.nationalityCode)}</span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {player.name}
                      </div>
                      <div className="text-xs text-slate-400">{player.nationality}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Link href={`/${player.leagueSlug}/${player.clubSlug}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden">
                      <Image src={player.clubLogo} alt={player.clubName} width={24} height={24} className="object-contain w-full h-full p-0.5" unoptimized />
                    </div>
                    <span className="text-slate-600 dark:text-slate-300 text-xs">{player.clubName}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500">{player.leagueName}</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-slate-500">{player.position}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-slate-600 dark:text-slate-300 text-sm">{player.age}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {trendIcons[player.valueTrend]}
                </td>
                <td className="px-4 py-3 hidden xl:table-cell w-24">
                  <MiniSparkline data={player.valueHistory} trend={player.valueTrend} currency={currency} height={32} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ValueBadge value={player.currentValue} trend={player.valueTrend} currency={currency} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-400">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-medium">No players match these filters</div>
            <button onClick={clearAll} className="mt-2 text-brand-600 hover:underline text-sm">Clear filters</button>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {filtered.map((player, i) => (
          <Link
            key={player.id}
            href={`/players/${player.slug}`}
            className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
              ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-slate-200 text-slate-700" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"}`}>
              {i + 1}
            </div>
            <span className="text-lg">{getFlagEmoji(player.nationalityCode)}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{player.name}</div>
              <div className="text-xs text-slate-400 truncate">{player.position} · {player.clubName}</div>
            </div>
            <ValueBadge value={player.currentValue} trend={player.valueTrend} currency={currency} size="sm" />
          </Link>
        ))}
      </div>
    </div>
  );
}
