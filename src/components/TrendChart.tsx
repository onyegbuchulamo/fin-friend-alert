import { useMemo } from "react";
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
  rain: number;
  ph: number;
  turbidity: number;
  temp: number;
}

export function TrendChart({ rain, ph, turbidity, temp }: TrendChartProps) {
  const data = useMemo(() => {
    const hours = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "Now"];
    return hours.map((time, i) => {
      const factor = i / (hours.length - 1);
      const jitter = () => (Math.random() - 0.5) * 10;
      return {
        time,
        Rainfall: Math.max(0, Math.round(rain * 0.3 + (rain * 0.7 * factor) + jitter())),
        pH: parseFloat((7 + (ph - 7) * factor + (Math.random() - 0.5) * 0.5).toFixed(1)),
        Turbidity: Math.max(0, Math.round(turbidity * 0.4 + (turbidity * 0.6 * factor) + jitter())),
        Temperature: Math.max(0, Math.round(temp * 0.8 + (temp * 0.2 * factor) + jitter() * 0.5)),
      };
    });
  }, [rain, ph, turbidity, temp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2 mb-4">
        📈 Sensor Trends (Today)
      </h2>
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
    </motion.div>
  );
}
