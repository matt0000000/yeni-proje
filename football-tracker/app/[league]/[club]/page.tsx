import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Shirt } from "lucide-react";
import { getClub, LEAGUES } from "@/lib/mock-data";
import { formatValue, getSquadValue } from "@/lib/types";
import { ValueBadge } from "@/components/ValueBadge";
import { getFlagEmoji } from "@/lib/flags";
import type { Metadata } from "next";
import type { Player } from "@/lib/types";

export async function generateStaticParams() {
  return LEAGUES.flatMap((l) =>
    l.clubs.map((c) => ({ league: l.slug, club: c.slug }))
  );
}

export async function generateMetadata({
  params,
}: { params: Promise<{ league: string; club: string }> }): Promise<Metadata> {
  const { league, club: clubSlug } = await params;
  const club = getClub(league, clubSlug);
  return { title: club ? `${club.name} — Squad & Values` : "Club Not Found" };
}

const positionGroupOrder = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

const positionColors: Record<string, string> = {
  Goalkeeper: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  Defender:   "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  Midfielder: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  Forward:    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
};

export default async function ClubPage({
  params,
}: { params: Promise<{ league: string; club: string }> }) {
  const { league: leagueSlug, club: clubSlug } = await params;
  const club = getClub(leagueSlug, clubSlug);
  if (!club) notFound();

  const squadValue = getSquadValue(club.players);
  const sortedByValue = [...club.players].sort((a, b) => b.currentValue - a.currentValue);
  const mvp = sortedByValue[0];

  const byGroup: Record<string, Player[]> = {};
  for (const grp of positionGroupOrder) {
    byGroup[grp] = club.players
      .filter((p) => p.positionGroup === grp)
      .sort((a, b) => b.currentValue - a.currentValue);
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-600">Leagues</Link>
        <span>/</span>
        <Link href={`/${leagueSlug}`} className="hover:text-brand-600 flex items-center gap-1">
          <ArrowLeft size={14} />{club.leagueName}
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium">{club.name}</span>
      </div>

      {/* Club header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
            <Image src={club.logo} alt={club.name} width={64} height={64} className="object-contain p-2" unoptimized />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{club.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              {club.stadium && <span>🏟️ {club.stadium}</span>}
              {club.founded && <span>📅 Founded {club.founded}</span>}
              <Link href={`/${leagueSlug}`} className="text-brand-600 dark:text-brand-400 hover:underline">{club.leagueName}</Link>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatValue(squadValue)}</div>
            <div className="text-xs text-slate-400">total squad value</div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
          {[
            { label: "Squad Size", value: club.players.length },
            { label: "Avg. Value", value: formatValue(squadValue / club.players.length) },
            { label: "Rising", value: `${club.players.filter(p => p.valueTrend === "up").length} players`, color: "text-emerald-600" },
            { label: "Top Player", value: mvp?.name ?? "—" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xs text-slate-400">{s.label}</div>
              <div className={`text-sm font-bold text-slate-900 dark:text-white mt-0.5 ${s.color ?? ""}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Squad by position group */}
      {positionGroupOrder.map((group) => {
        const players = byGroup[group];
        if (!players?.length) return null;
        return (
          <div key={group} className="mb-6">
            <h2 className={`inline-flex items-center gap-1.5 text-sm font-bold mb-3 px-3 py-1 rounded-full border ${positionColors[group]}`}>
              {group}s <span className="opacity-60">({players.length})</span>
            </h2>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 text-xs text-slate-400">
                    <th className="text-left px-4 py-2.5 font-medium">#</th>
                    <th className="text-left px-4 py-2.5 font-medium">Player</th>
                    <th className="text-left px-4 py-2.5 font-medium">Nationality</th>
                    <th className="text-left px-4 py-2.5 font-medium">Position</th>
                    <th className="text-left px-4 py-2.5 font-medium">Age</th>
                    <th className="text-left px-4 py-2.5 font-medium">Contract</th>
                    <th className="text-right px-4 py-2.5 font-medium">Market Value</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr
                      key={player.id}
                      className="border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {player.shirtNumber ? (
                          <span className="flex items-center gap-1"><Shirt size={11} />{player.shirtNumber}</span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/players/${player.slug}`} className="font-semibold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400">
                          {player.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <span>{getFlagEmoji(player.nationalityCode)}</span>
                          <span className="hidden lg:inline text-xs">{player.nationality}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{player.position}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{player.age}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {player.contractExpiry ? (
                          <span className="flex items-center gap-1"><Calendar size={10} />{player.contractExpiry}</span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ValueBadge value={player.currentValue} trend={player.valueTrend} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-2">
              {players.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.slug}`}
                  className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3"
                >
                  <span className="text-xl">{getFlagEmoji(player.nationalityCode)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">{player.name}</div>
                    <div className="text-xs text-slate-400">{player.position} · {player.age} yrs</div>
                  </div>
                  <ValueBadge value={player.currentValue} trend={player.valueTrend} size="sm" />
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
