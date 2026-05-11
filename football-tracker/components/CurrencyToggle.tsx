"use client";
import { useCurrency } from "@/lib/currency-context";
import type { Currency } from "@/lib/types";

const CURRENCIES: Currency[] = ["EUR", "USD", "GBP", "TRY"];

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
            currency === c
              ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
