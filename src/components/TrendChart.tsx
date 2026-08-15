import { useMemo } from "react";
import type { Reading } from "@/hooks/useFarmData";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrendChartProps {
  history: Reading[];
}

export function TrendChart({ history }: TrendChartProps) {
  const data = useMemo(
    () =>
      [...history]
        .slice(0, 12)
        .reverse()
        .map((r) => ({
          time: new Date(r.recorded_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          Rainfall: r.rainfall_mm,
          pH: r.ph,
          Turbidity: r.turbidity_ntu,
          Temperature: r.temperature_c,
        })),
    [history],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2 mb-4">
        📈 Sensor Trends (recorded readings)
      </h2>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No readings recorded yet. Refresh to pull live station data.</p>
      ) : (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 70%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(210, 70%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="turbGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="time" className="text-xs" tick={{ fill: "hsl(210, 15%, 46%)", fontSize: 12 }} />
            <YAxis className="text-xs" tick={{ fill: "hsl(210, 15%, 46%)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(200, 20%, 88%)",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
            <Area type="monotone" dataKey="Rainfall" stroke="hsl(210, 70%, 50%)" fill="url(#rainGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="Turbidity" stroke="hsl(38, 92%, 50%)" fill="url(#turbGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="Temperature" stroke="hsl(0, 72%, 51%)" fill="url(#tempGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      )}
    </motion.div>
  );
}
