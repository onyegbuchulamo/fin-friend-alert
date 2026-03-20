import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RiskBadge } from "@/components/RiskBadge";
import { MetricCard } from "@/components/MetricCard";
import { RiskMap } from "@/components/RiskMap";
import { LiveStatusBar } from "@/components/LiveStatusBar";
import { AppFooter } from "@/components/AppFooter";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface FarmEntry {
  id: number;
  name: string;
  location: string;
  risk: RiskLevel;
  rain: number;
  ph: number;
  turbidity: number;
  temp: number;
  lastUpdated: string;
}

interface AlertEntry {
  id: number;
  farmName: string;
  risk: RiskLevel;
  message: string;
  timestamp: string;
}

const calculateRisk = (rain: number, ph: number, turbidity: number, temp: number): RiskLevel => {
  if (rain > 75 && turbidity > 60) return "DANGER";
  if (rain > 50 || ph < 6 || ph > 9 || temp > 32) return "WARNING";
  return "SAFE";
};

const farmData = [
  { name: "Renaissance Farms HQ", location: "Umuahia, Abia State" },
  { name: "Ngwa Aquaculture Centre", location: "Aba, Abia State" },
  { name: "Ohafia Fish Farm", location: "Ohafia, Abia State" },
  { name: "Arochukwu Pond Systems", location: "Arochukwu, Abia State" },
  { name: "Bende Integrated Fishery", location: "Bende, Abia State" },
  { name: "Isiala Ngwa Tilapia Farm", location: "Isiala Ngwa, Abia State" },
  { name: "Ukwa Catfish Estate", location: "Ukwa, Abia State" },
  { name: "Osisioma Aqua Hub", location: "Osisioma, Abia State" },
];

const generateFarms = (): FarmEntry[] => {
  return farmData.map((fd, i) => {
    const rain = Math.floor(Math.random() * 100);
    const ph = parseFloat((Math.random() * 14).toFixed(1));
    const turbidity = Math.floor(Math.random() * 100);
    const temp = Math.floor(Math.random() * 40);
    return {
      id: i + 1, name: fd.name, location: fd.location,
      risk: calculateRisk(rain, ph, turbidity, temp),
      rain, ph, turbidity, temp,
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
    };
  });
};

const generateAlerts = (farms: FarmEntry[]): AlertEntry[] =>
  farms.filter((f) => f.risk !== "SAFE").map((f, i) => ({
    id: i + 1, farmName: f.name, risk: f.risk,
    message: f.risk === "DANGER" ? "Secure pond barriers, prepare emergency harvest." : "Monitor pond closely, reduce feeding.",
    timestamp: new Date(Date.now() - Math.random() * 7200000).toLocaleTimeString(),
  }));

const riskBg: Record<RiskLevel, string> = {
  SAFE: "bg-safe/10 border-safe/30",
  WARNING: "bg-warning/10 border-warning/30",
  DANGER: "bg-danger/10 border-danger/30",
};

const riskText: Record<RiskLevel, string> = {
  SAFE: "text-safe",
  WARNING: "text-warning",
  DANGER: "text-danger",
};

const riskFill: Record<RiskLevel, string> = {
  SAFE: "hsl(152, 60%, 42%)",
  WARNING: "hsl(38, 92%, 50%)",
  DANGER: "hsl(0, 72%, 51%)",
};

export default function AdminDashboard() {
  const [farms, setFarms] = useState<FarmEntry[]>([]);
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | "ALL">("ALL");
  const navigate = useNavigate();

  const refresh = useCallback(() => {
    const f = generateFarms();
    setFarms(f);
    setAlerts(generateAlerts(f));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const counts = {
    SAFE: farms.filter((f) => f.risk === "SAFE").length,
    WARNING: farms.filter((f) => f.risk === "WARNING").length,
    DANGER: farms.filter((f) => f.risk === "DANGER").length,
  };

  const overallRisk: RiskLevel = counts.DANGER > 0 ? "DANGER" : counts.WARNING > 0 ? "WARNING" : "SAFE";
  const filtered = selectedRisk === "ALL" ? farms : farms.filter((f) => f.risk === selectedRisk);

  const chartData = farms.map((f) => ({ name: f.name.split(" ")[0], risk: f.risk === "DANGER" ? 3 : f.risk === "WARNING" ? 2 : 1, riskLevel: f.risk }));

  return (
    <div className="min-h-screen bg-background">
      <header className="ocean-gradient px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight">
              🛡️ Admin Dashboard
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm">
              Renaissance Farms — System-wide monitoring &amp; management · South East, Nigeria
            </p>
          </motion.div>
          <div className="flex items-center gap-2">
            <DarkModeToggle />
            <Button variant="outline" onClick={() => navigate("/")} className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
              ← Monitor
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 pb-12 space-y-6">
        <LiveStatusBar onRefresh={refresh} intervalSeconds={30} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon="🏭" label="Total Farms" value={farms.length} delay={0.1} />
          {(["SAFE", "WARNING", "DANGER"] as RiskLevel[]).map((level, i) => (
            <motion.div key={level} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
              className={`rounded-lg border p-4 shadow-card cursor-pointer transition-shadow hover:shadow-card-hover ${riskBg[level]} ${selectedRisk === level ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedRisk(selectedRisk === level ? "ALL" : level)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{level === "SAFE" ? "🟢" : level === "WARNING" ? "🟡" : "🔴"}</span>
                <span className="text-sm font-medium text-muted-foreground">{level.charAt(0) + level.slice(1).toLowerCase()}</span>
              </div>
              <p className={`text-2xl font-bold ${riskText[level]}`}>{counts[level]}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-lg bg-card p-5 shadow-card">
          <h2 className="text-lg font-bold text-card-foreground mb-3">📊 Risk Distribution by Farm</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fill: "hsl(210, 15%, 46%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(210, 15%, 46%)", fontSize: 11 }} domain={[0, 3]} ticks={[1, 2, 3]}
                  tickFormatter={(v) => v === 1 ? "Safe" : v === 2 ? "Warn" : "Danger"} />
                <Tooltip formatter={(value: number) => value === 1 ? "Safe" : value === 2 ? "Warning" : "Danger"}
                  contentStyle={{ backgroundColor: "hsl(0,0%,100%)", border: "1px solid hsl(200,20%,88%)", borderRadius: "0.5rem", fontSize: "0.8rem" }} />
                <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={riskFill[entry.riskLevel]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-lg bg-card p-5 shadow-card">
          <h2 className="text-lg font-bold text-card-foreground mb-3">🎨 Risk Color Codes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`rounded-md border p-3 ${riskBg.SAFE}`}>
              <RiskBadge risk="SAFE" />
              <p className="text-sm text-muted-foreground mt-2">All parameters normal. Routine monitoring.</p>
            </div>
            <div className={`rounded-md border p-3 ${riskBg.WARNING}`}>
              <RiskBadge risk="WARNING" />
              <p className="text-sm text-muted-foreground mt-2">Rain &gt;50mm, pH outside 6–9, or temp &gt;32°C.</p>
            </div>
            <div className={`rounded-md border p-3 ${riskBg.DANGER}`}>
              <RiskBadge risk="DANGER" />
              <p className="text-sm text-muted-foreground mt-2">Rain &gt;75mm AND turbidity &gt;60 NTU. Act now.</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-lg bg-card p-5 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-card-foreground">🏭 Farm Overview — Abia State</h2>
            <div className="flex items-center gap-2">
              {(["ALL", "SAFE", "WARNING", "DANGER"] as const).map((level) => (
                <Button key={level} size="sm" variant={selectedRisk === level ? "default" : "outline"}
                  onClick={() => setSelectedRisk(level)}
                  className={selectedRisk === level ? "ocean-gradient text-primary-foreground border-0" : ""}>
                  {level === "ALL" ? "All" : level.charAt(0) + level.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Farm", "Location", "Risk", "Rain", "pH", "Turbidity", "Temp", "Updated"].map((h) => (
                    <th key={h} className="pb-2 font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((farm) => (
                  <tr key={farm.id} className={`border-b border-border/50 ${riskBg[farm.risk]} transition-colors`}>
                    <td className="py-3 font-medium text-card-foreground">{farm.name}</td>
                    <td className="py-3 text-muted-foreground">{farm.location}</td>
                    <td className="py-3"><RiskBadge risk={farm.risk} /></td>
                    <td className="py-3 text-card-foreground">{farm.rain}mm</td>
                    <td className="py-3 text-card-foreground">{farm.ph}</td>
                    <td className="py-3 text-card-foreground">{farm.turbidity} NTU</td>
                    <td className="py-3 text-card-foreground">{farm.temp}°C</td>
                    <td className="py-3 text-muted-foreground">{farm.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="rounded-lg bg-card p-5 shadow-card">
          <h2 className="text-lg font-bold text-card-foreground mb-3">
            🚨 Active Alerts <span className="text-sm font-normal text-muted-foreground ml-2">({alerts.length})</span>
          </h2>
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <span className="text-3xl block mb-2">✅</span>
              <p className="text-sm">All farms operating safely — no active alerts.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <motion.div key={alert.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={`rounded-md border p-3 flex items-start gap-3 ${riskBg[alert.risk]}`}>
                  <RiskBadge risk={alert.risk} />
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground text-sm">{alert.farmName}</p>
                    <p className="text-muted-foreground text-sm">{alert.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.timestamp}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <RiskMap risk={overallRisk} />
        </motion.div>
      </main>

      <AppFooter />
    </div>
  );
}
