"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { ValuePoint, Currency } from "@/lib/types";
import { formatValue } from "@/lib/types";

interface Props {
  data: ValuePoint[];
  trend: "up" | "down" | "stable";
  currency?: Currency;
}

const trendColor = { up: "#10b981", down: "#ef4444", stable: "#64748b" };

export function ValueHistoryChart({ data, trend, currency = "EUR" }: Props) {
  const color = trendColor[trend];
  const chartData = data.map((d) => ({ ...d, value: d.value }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatValue(v, currency)}
          width={70}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const pt = payload[0].payload as ValuePoint;
            return (
              <div className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-3 py-2 shadow-xl">
                <div className="font-bold text-base" style={{ color }}>{formatValue(pt.value, currency)}</div>
                <div className="text-slate-400 text-xs mt-0.5">{pt.date}</div>
              </div>
            );
          }}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill="url(#valGrad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
