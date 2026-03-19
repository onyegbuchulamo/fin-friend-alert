import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiskBadge } from "@/components/RiskBadge";
import { MetricCard } from "@/components/MetricCard";
import { RiskMap } from "@/components/RiskMap";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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

const generateFarms = (): FarmEntry[] => {
  const names = ["Laguna Fish Farm", "Batangas Aqua", "Pangasinan Pond", "Iloilo Marine", "Cebu Fishery", "Davao Aquaculture"];
  const locations = ["Laguna", "Batangas", "Pangasinan", "Iloilo", "Cebu", "Davao"];
  return names.map((name, i) => {
    const rain = Math.floor(Math.random() * 100);
    const ph = parseFloat((Math.random() * 14).toFixed(1));
    const turbidity = Math.floor(Math.random() * 100);
    const temp = Math.floor(Math.random() * 40);
    return {
      id: i + 1,
      name,
      location: locations[i],
      risk: calculateRisk(rain, ph, turbidity, temp),
      rain, ph, turbidity, temp,
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
    };
  });
};

const generateAlerts = (farms: FarmEntry[]): AlertEntry[] => {
  return farms
    .filter((f) => f.risk !== "SAFE")
    .map((f, i) => ({
      id: i + 1,
      farmName: f.name,
      risk: f.risk,
      message: f.risk === "DANGER"
        ? "Secure pond barriers, prepare emergency harvest."
        : "Monitor pond closely, reduce feeding.",
      timestamp: new Date(Date.now() - Math.random() * 7200000).toLocaleTimeString(),
    }));
};

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

export default function AdminDashboard() {
  const [farms, setFarms] = useState<FarmEntry[]>([]);
  const [alerts, setAlerts] = useState<AlertEntry[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | "ALL">("ALL");
  const navigate = useNavigate();

  const refresh = () => {
    const f = generateFarms();
    setFarms(f);
    setAlerts(generateAlerts(f));
  };

  useEffect(() => { refresh(); }, []);

  const counts = {
    SAFE: farms.filter((f) => f.risk === "SAFE").length,
    WARNING: farms.filter((f) => f.risk === "WARNING").length,
    DANGER: farms.filter((f) => f.risk === "DANGER").length,
  };

  const overallRisk: RiskLevel = counts.DANGER > 0 ? "DANGER" : counts.WARNING > 0 ? "WARNING" : "SAFE";

  const filtered = selectedRisk === "ALL" ? farms : farms.filter((f) => f.risk === selectedRisk);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="ocean-gradient px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight">
              🛡️ Admin Dashboard
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm">
              EcoFish Sentinel — System-wide monitoring &amp; management
            </p>
          </motion.div>
          <Button variant="outline" onClick={() => navigate("/")} className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
            ← Back to Monitor
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 pb-12 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon="🏭" label="Total Farms" value={farms.length} delay={0.1} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className={`rounded-lg border p-4 shadow-card ${riskBg.SAFE}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🟢</span>
              <span className="text-sm font-medium text-muted-foreground">Safe Farms</span>
            </div>
            <p className={`text-2xl font-bold ${riskText.SAFE}`}>{counts.SAFE}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`rounded-lg border p-4 shadow-card ${riskBg.WARNING}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🟡</span>
              <span className="text-sm font-medium text-muted-foreground">Warning Farms</span>
            </div>
            <p className={`text-2xl font-bold ${riskText.WARNING}`}>{counts.WARNING}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className={`rounded-lg border p-4 shadow-card ${riskBg.DANGER}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🔴</span>
              <span className="text-sm font-medium text-muted-foreground">Danger Farms</span>
            </div>
            <p className={`text-2xl font-bold ${riskText.DANGER}`}>{counts.DANGER}</p>
          </motion.div>
        </div>

        {/* Color Code Legend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-lg bg-card p-5 shadow-card">
          <h2 className="text-lg font-bold text-card-foreground mb-3">🎨 Risk Color Codes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`rounded-md border p-3 ${riskBg.SAFE}`}>
              <div className="flex items-center gap-2 mb-1">
                <RiskBadge risk="SAFE" />
              </div>
              <p className="text-sm text-muted-foreground">All parameters within normal range. Continue routine monitoring.</p>
            </div>
            <div className={`rounded-md border p-3 ${riskBg.WARNING}`}>
              <div className="flex items-center gap-2 mb-1">
                <RiskBadge risk="WARNING" />
              </div>
              <p className="text-sm text-muted-foreground">Rain &gt;50mm, pH outside 6–9, or temp &gt;32°C. Requires attention.</p>
            </div>
            <div className={`rounded-md border p-3 ${riskBg.DANGER}`}>
              <div className="flex items-center gap-2 mb-1">
                <RiskBadge risk="DANGER" />
              </div>
              <p className="text-sm text-muted-foreground">Rain &gt;75mm AND turbidity &gt;60 NTU. Immediate action required.</p>
            </div>
          </div>
        </motion.div>

        {/* Farm Filter & Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-lg bg-card p-5 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-card-foreground">🏭 Farm Overview</h2>
            <div className="flex items-center gap-2">
              {(["ALL", "SAFE", "WARNING", "DANGER"] as const).map((level) => (
                <Button key={level} size="sm" variant={selectedRisk === level ? "default" : "outline"}
                  onClick={() => setSelectedRisk(level)}
                  className={selectedRisk === level ? "ocean-gradient text-primary-foreground border-0" : ""}>
                  {level === "ALL" ? "All" : level.charAt(0) + level.slice(1).toLowerCase()}
                </Button>
              ))}
              <Button size="sm" variant="outline" onClick={refresh}>🔄</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-semibold text-muted-foreground">Farm</th>
                  <th className="pb-2 font-semibold text-muted-foreground">Location</th>
                  <th className="pb-2 font-semibold text-muted-foreground">Risk</th>
                  <th className="pb-2 font-semibold text-muted-foreground">Rain</th>
                  <th className="pb-2 font-semibold text-muted-foreground">pH</th>
                  <th className="pb-2 font-semibold text-muted-foreground">Turbidity</th>
                  <th className="pb-2 font-semibold text-muted-foreground">Temp</th>
                  <th className="pb-2 font-semibold text-muted-foreground">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((farm) => (
                  <tr key={farm.id} className={`border-b border-border/50 ${riskBg[farm.risk]}`}>
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

        {/* Alerts Log */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-lg bg-card p-5 shadow-card">
          <h2 className="text-lg font-bold text-card-foreground mb-3">🚨 Active Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No active alerts — all farms are operating safely.</p>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id} className={`rounded-md border p-3 flex items-start gap-3 ${riskBg[alert.risk]}`}>
                  <RiskBadge risk={alert.risk} />
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground text-sm">{alert.farmName}</p>
                    <p className="text-muted-foreground text-sm">{alert.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Risk Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <RiskMap risk={overallRisk} />
        </motion.div>
      </main>
    </div>
  );
}
