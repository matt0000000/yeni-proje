import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import { getPlayer, ALL_PLAYERS } from "@/lib/mock-data";
import { formatValue } from "@/lib/types";
import { ValueBadge } from "@/components/ValueBadge";
import { getFlagEmoji } from "@/lib/flags";
import { ValueHistoryChart } from "@/components/ValueHistoryChart";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return ALL_PLAYERS.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const player = getPlayer(id);
  return { title: player ? `${player.name} — Market Value & Profile` : "Player Not Found" };
}

const positionColors: Record<string, string> = {
  Goalkeeper: "bg-yellow-500",
  Defender:   "bg-blue-500",
  Midfielder: "bg-purple-500",
  Forward:    "bg-orange-500",
};

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = getPlayer(id);
  if (!player) notFound();

  const peakValue = Math.max(...player.valueHistory.map((v) => v.value));
  const peakDate = player.valueHistory.find((v) => v.value === peakValue)?.date;
  const valueChange = player.currentValue - player.valueHistory[0]?.value;
  const valueChangePct = ((valueChange / player.valueHistory[0]?.value) * 100).toFixed(1);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-600">Leagues</Link>
        <span>/</span>
        <Link href={`/${player.leagueSlug}`} className="hover:text-brand-600">{player.leagueName}</Link>
        <span>/</span>
        <Link href={`/${player.leagueSlug}/${player.clubSlug}`} className="hover:text-brand-600 flex items-center gap-1">
          <ArrowLeft size={14} />{player.clubName}
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium">{player.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — profile */}
        <div className="lg:col-span-1 space-y-4">
          {/* Player card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <div className={`h-3 ${positionColors[player.positionGroup] ?? "bg-brand-500"}`} />
            <div className="p-6">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-4xl shrink-0">
                  {getFlagEmoji(player.nationalityCode)}
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">{player.name}</h1>
                  {player.fullName && player.fullName !== player.name && (
                    <div className="text-xs text-slate-400 mt-0.5">{player.fullName}</div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${positionColors[player.positionGroup]}`}>
                      {player.position}
                    </span>
                    {player.shirtNumber && (
                      <span className="text-xs text-slate-400">#{player.shirtNumber}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio grid */}
              <div className="space-y-2 text-sm">
                {[
                  { icon: "🏳️", label: "Nationality", value: player.nationality },
                  { icon: "🎂", label: "Age", value: `${player.age} years old` },
                  { icon: "📏", label: "Height", value: player.height },
                  { icon: "⚽", label: "Preferred Foot", value: player.foot },
                  { icon: "📅", label: "Contract Until", value: player.contractExpiry ?? "Unknown" },
                ].map((item) => item.value ? (
                  <div key={item.label} className="flex items-center gap-3 py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                    <span>{item.icon}</span>
                    <span className="text-slate-500 flex-1">{item.label}</span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">{item.value}</span>
                  </div>
                ) : null)}
              </div>
            </div>
          </div>

          {/* Club card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <h3 className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">Current Club</h3>
            <Link href={`/${player.leagueSlug}/${player.clubSlug}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                <Image src={player.clubLogo} alt={player.clubName} width={36} height={36} className="object-contain p-1" unoptimized />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{player.clubName}</div>
                <div className="text-xs text-slate-400">{player.leagueName}</div>
              </div>
            </Link>
          </div>

          {/* Value summary */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs text-slate-400 font-medium uppercase tracking-wide">Value Summary</h3>
            <div className="text-center py-2">
              <ValueBadge value={player.currentValue} trend={player.valueTrend} size="lg" />
              <div className="text-xs text-slate-400 mt-1">Current Market Value</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400">Peak Value</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{formatValue(peakValue)}</div>
                {peakDate && <div className="text-xs text-slate-400">{peakDate}</div>}
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="text-xs text-slate-400">Since 2023</div>
                <div className={`text-sm font-bold mt-0.5 ${valueChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {valueChange >= 0 ? "+" : ""}{Number(valueChangePct)}%
                </div>
                <div className="text-xs text-slate-400">{formatValue(Math.abs(valueChange))}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — chart + history */}
        <div className="lg:col-span-2 space-y-4">
          {/* Value chart */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Value History</h2>
            <p className="text-xs text-slate-400 mb-4">Market value progression since June 2023</p>
            <ValueHistoryChart data={player.valueHistory} trend={player.valueTrend} />
          </div>

          {/* Value history table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Value Timeline</h2>
            <div className="space-y-1">
              {[...player.valueHistory].reverse().map((point, i, arr) => {
                const prev = arr[i + 1];
                const diff = prev ? point.value - prev.value : 0;
                const pct = prev ? ((diff / prev.value) * 100).toFixed(1) : null;
                return (
                  <div key={point.date} className="flex items-center gap-4 py-2 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                    <span className="text-xs text-slate-400 w-16 shrink-0">{point.date}</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">{formatValue(point.value)}</span>
                    {pct && (
                      <span className={`text-xs font-medium ml-auto ${diff >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {diff >= 0 ? "▲" : "▼"} {Math.abs(Number(pct))}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Similar players */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy size={16} />
              Similar Value Players
            </h2>
            <div className="space-y-2">
              {ALL_PLAYERS
                .filter((p) => p.id !== player.id && p.positionGroup === player.positionGroup)
                .sort((a, b) => Math.abs(a.currentValue - player.currentValue) - Math.abs(b.currentValue - player.currentValue))
                .slice(0, 4)
                .map((p) => (
                  <Link key={p.id} href={`/players/${p.slug}`} className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg p-2 transition-colors">
                    <span className="text-lg">{getFlagEmoji(p.nationalityCode)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.clubName} · {p.leagueName}</div>
                    </div>
                    <ValueBadge value={p.currentValue} trend={p.valueTrend} size="sm" />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
