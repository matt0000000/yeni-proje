"use client";
import Link from "next/link";
import { getFlagEmoji } from "@/lib/flags";
import { ValueBadge } from "./ValueBadge";
import { MiniSparkline } from "./MiniSparkline";
import { useCurrency } from "@/lib/currency-context";
import type { Player } from "@/lib/types";

interface Props {
  player: Player;
  rank?: number;
}

const positionColors: Record<string, string> = {
  Goalkeeper: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Defender: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Midfielder: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Forward: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function PlayerCard({ player, rank }: Props) {
  const { currency } = useCurrency();

  return (
    <Link
      href={`/players/${player.slug}`}
      className="group block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-brand-500 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        {rank && (
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            {rank}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base">{getFlagEmoji(player.nationalityCode)}</span>
            <span className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {player.name}
            </span>
            {player.shirtNumber && (
              <span className="text-xs text-slate-400">#{player.shirtNumber}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className={`px-1.5 py-0.5 rounded font-medium ${positionColors[player.positionGroup]}`}>
              {player.position}
            </span>
            <span>·</span>
            <span>{player.age} yrs</span>
            <span>·</span>
            <span className="truncate">{player.clubName}</span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between mt-3">
        <ValueBadge value={player.currentValue} trend={player.valueTrend} currency={currency} />
        <div className="w-24 h-8">
          <MiniSparkline data={player.valueHistory} trend={player.valueTrend} currency={currency} height={32} />
        </div>
      </div>
    </Link>
  );
}
