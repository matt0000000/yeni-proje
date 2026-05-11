"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { searchPlayers } from "@/lib/mock-data";
import type { Player } from "@/lib/types";
import { formatValue } from "@/lib/types";
import { useCurrency } from "@/lib/currency-context";
import { getFlagEmoji } from "@/lib/flags";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Player[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { currency } = useCurrency();

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchPlayers(query));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players, clubs, leagues…"
          className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-brand-500 rounded-lg outline-none transition text-slate-900 dark:text-slate-100 placeholder-slate-400"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {results.map((player) => (
            <Link
              key={player.id}
              href={`/players/${player.slug}`}
              onClick={() => { setQuery(""); setOpen(false); }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="text-lg">{getFlagEmoji(player.nationalityCode)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{player.name}</div>
                <div className="text-xs text-slate-500">{player.position} · {player.clubName}</div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                player.valueTrend === "up" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                player.valueTrend === "down" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              }`}>
                {formatValue(player.currentValue, currency)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 px-4 py-3 text-sm text-slate-500">
          No players found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}

export { getFlagEmoji };
