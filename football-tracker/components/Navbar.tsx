"use client";
import Link from "next/link";
import { Moon, Sun, Trophy, BarChart3 } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { CurrencyToggle } from "./CurrencyToggle";
import { useTheme } from "@/lib/theme-context";

export function Navbar() {
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-900 rounded-lg flex items-center justify-center">
            <BarChart3 size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm hidden sm:block">TransferScope</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/" className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Leagues
          </Link>
          <Link href="/leaderboard" className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            <Trophy size={13} />
            Top 100
          </Link>
        </nav>

        {/* Search */}
        <div className="flex-1">
          <SearchBar />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">
          <CurrencyToggle />
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  );
}
