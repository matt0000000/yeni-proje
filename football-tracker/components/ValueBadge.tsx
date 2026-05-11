import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ValueTrend, Currency } from "@/lib/types";
import { formatValue } from "@/lib/types";

interface Props {
  value: number;
  trend: ValueTrend;
  currency?: Currency;
  size?: "sm" | "md" | "lg";
}

const trendStyles = {
  up: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  down: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  stable: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export function ValueBadge({ value, trend, currency = "EUR", size = "md" }: Props) {
  const Icon = trendIcons[trend];
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 gap-0.5",
    md: "text-sm px-2 py-1 gap-1",
    lg: "text-base px-3 py-1.5 gap-1.5",
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${trendStyles[trend]} ${sizeClasses[size]}`}>
      <Icon size={size === "lg" ? 16 : 13} strokeWidth={2.5} />
      {formatValue(value, currency)}
    </span>
  );
}
