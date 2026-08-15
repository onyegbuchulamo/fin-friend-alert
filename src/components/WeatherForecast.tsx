import { motion } from "framer-motion";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

import type { ForecastDay, RiskLevel } from "@/hooks/useFarmData";

const icon = (rain: number) => (rain > 75 ? "⛈️" : rain > 45 ? "🌧️" : rain > 20 ? "🌦️" : "☀️");

const tone: Record<RiskLevel, string> = {
  SAFE: "text-safe",
  WARNING: "text-warning",
  DANGER: "text-danger",
};

interface WeatherForecastProps {
  forecast: ForecastDay[];
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  if (forecast.length === 0) return null;

  const peak = forecast.reduce((a, b) => (b.floodProbability > a.floodProbability ? b : a));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.44 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
          🛰️ 7-Day Flood Outlook
        </h2>
        <span className={`text-xs font-semibold ${tone[peak.risk]}`}>
          Peak risk: {peak.day} · {peak.floodProbability}%
        </span>
      </div>

      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="floodFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(192, 82%, 45%)" stopOpacity={0.55} />
                <stop offset="100%" stopColor="hsl(192, 82%, 45%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="day" tick={{ fill: "hsl(210, 15%, 46%)", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(210, 15%, 46%)", fontSize: 11 }} domain={[0, 100]} />
            <Tooltip
              formatter={(v: number, n: string) => [`${v}${n === "Flood probability" ? "%" : "mm"}`, n]}
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", fontSize: "0.8rem", color: "hsl(var(--card-foreground))" }}
            />
            <Area type="monotone" dataKey="floodProbability" name="Flood probability" stroke="hsl(192, 82%, 40%)" strokeWidth={2} fill="url(#floodFill)" />
            <Area type="monotone" dataKey="rain" name="Rainfall" stroke="hsl(38, 92%, 50%)" strokeWidth={1.5} fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {forecast.map((f) => (
          <div key={f.day} className="rounded-md border border-border bg-muted/20 p-2 text-center">
            <p className="text-[11px] font-medium text-muted-foreground">{f.day}</p>
            <p className="text-xl leading-tight">{icon(f.rain)}</p>
            <p className="text-xs font-bold tabular-nums text-card-foreground">{f.rain}mm</p>
            <p className={`text-[10px] font-semibold ${tone[f.risk]}`}>{f.floodProbability}%</p>
            <p className="text-[10px] text-muted-foreground">{f.temp}°C · {f.humidity}%</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Live 7-day rainfall forecast from the Open-Meteo weather model for this farm\u2019s coordinates. Prepare drainage and
        emergency harvest windows ahead of any day above 70% flood probability.
      </p>
    </motion.section>
  );
}
