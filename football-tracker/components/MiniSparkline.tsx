"use client";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import type { ValuePoint, Currency } from "@/lib/types";
import { formatValue } from "@/lib/types";

interface Props {
  data: ValuePoint[];
  trend: "up" | "down" | "stable";
  currency?: Currency;
  height?: number;
}

const trendColor = { up: "#10b981", down: "#ef4444", stable: "#94a3b8" };

export function MiniSparkline({ data, trend, currency = "EUR", height = 40 }: Props) {
  const color = trendColor[trend];
  const chartData = data.map((d) => ({ ...d, v: d.value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const pt = payload[0].payload as ValuePoint;
            return (
              <div className="bg-slate-900 text-white text-xs rounded px-2 py-1">
                <div className="font-semibold">{formatValue(pt.value, currency)}</div>
                <div className="text-slate-400">{pt.date}</div>
              </div>
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
