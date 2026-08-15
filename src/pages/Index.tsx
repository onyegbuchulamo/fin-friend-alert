import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import { FarmSelector } from "@/components/FarmSelector";
import { RiskMap } from "@/components/RiskMap";
import { TrendChart } from "@/components/TrendChart";
import { AIForecast } from "@/components/AIForecast";
import { LiveStatusBar } from "@/components/LiveStatusBar";
import { FishStockImpact } from "@/components/FishStockImpact";
import { HowItWorks } from "@/components/HowItWorks";
import { AppFooter } from "@/components/AppFooter";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { WaterQualityIndex } from "@/components/WaterQualityIndex";
import { HeroStats } from "@/components/HeroStats";
import { NotificationLog } from "@/components/NotificationLog";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { ReportExport } from "@/components/ReportExport";
import { PondManager } from "@/components/PondManager";
import { WeatherForecast } from "@/components/WeatherForecast";
import { FeedingSchedule } from "@/components/FeedingSchedule";
import { AlertThresholds, DEFAULT_THRESHOLDS, type Thresholds } from "@/components/AlertThresholds";
import { useFarmData } from "@/hooks/useFarmData";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

const calculateRisk = (rain: number, ph: number, turbidity: number, temp: number, t: Thresholds): RiskLevel => {
  if (rain > t.rainDanger && turbidity > t.turbidityDanger) return "DANGER";
  if (rain > t.rainWarning || ph < 6 || ph > 9 || temp > t.tempWarning) return "WARNING";
  return "SAFE";
};

const getRecommendation = (risk: RiskLevel): string => {
  if (risk === "DANGER") return "⚠️ Secure pond barriers, prepare emergency harvest immediately.";
  if (risk === "WARNING") return "Monitor pond closely, reduce feeding, inspect water source.";
  return "All conditions normal. Continue routine monitoring.";
};


export default function Index() {
  const navigate = useNavigate();
  const { farms, farm, farmId, setFarmId, latest, history, forecast, loading, refreshing, error, refresh } =
    useFarmData();
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS);

  const rain = latest?.rainfall_mm ?? 0;
  const ph = latest?.ph ?? 7;
  const turbidity = latest?.turbidity_ntu ?? 0;
  const temp = latest?.temperature_c ?? 0;
  const dissolvedOxygen = latest?.dissolved_oxygen ?? 0;

  const risk = useMemo(
    () => calculateRisk(rain, ph, turbidity, temp, thresholds),
    [rain, ph, turbidity, temp, thresholds],
  );
  const recommendation = getRecommendation(risk);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const sendAlert = () => {
    if (risk === "DANGER") {
      toast.error(`🔴 DANGER ALERT: ${recommendation}`, { duration: 5000 });
    } else if (risk === "WARNING") {
      toast.warning(`🟡 WARNING: ${recommendation}`, { duration: 4000 });
    } else {
      toast.success(`🟢 All Clear: ${recommendation}`, { duration: 3000 });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background mesh */}
      <div className="pointer-events-none fixed inset-0 mesh-bg opacity-60 dark:opacity-30" />
      <div className="pointer-events-none fixed inset-0 grid-pattern opacity-[0.35] dark:opacity-20" />

      {/* Header */}
      <header className="relative aurora-bg px-6 py-10 sm:py-14 overflow-hidden">
        {/* animated aurora blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-400/30 blur-3xl animate-aurora" />
        <div className="pointer-events-none absolute -bottom-32 right-0 w-[500px] h-[500px] rounded-full bg-teal-400/25 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 min-w-0"
            >
              <div className="inline-flex items-center gap-2 rounded-full glass-dark px-3 py-1 text-xs font-medium text-primary-foreground/90 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Live · IoT Network Online
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-primary-foreground tracking-tight leading-tight">
                🌊 {farm?.name ?? "Renaissance Farms"}
              </h1>
              <p className="text-primary-foreground/80 mt-2 text-sm sm:text-base max-w-2xl">
                EcoFish Sentinel — live aquaculture risk monitoring · {farm?.location ?? "Abia State, Nigeria"}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-primary-foreground/80">
                <span className="rounded-full glass-dark px-2.5 py-1">UN SDG 2 · 9 · 13 · 14</span>
                <span className="rounded-full glass-dark px-2.5 py-1">EcoFish-RiskNet v2.1</span>
                <span className="rounded-full glass-dark px-2.5 py-1">92% Accuracy</span>
              </div>
            </motion.div>
            <div className="flex items-center gap-2 shrink-0">
              <DarkModeToggle />
              <Button
                variant="outline"
                onClick={() => navigate("/admin")}
                className="glass-dark text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/15"
              >
                🛡️ Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 -mt-6 pb-12 space-y-6">

        {/* Hero Stats */}
        <HeroStats />

        {/* Live Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <LiveStatusBar onRefresh={refresh} intervalSeconds={300} />
        </motion.div>

        {/* Farms */}
        <FarmSelector
          farms={farms}
          farmId={farmId}
          onSelect={setFarmId}
          lastUpdated={latest?.recorded_at ?? null}
        />

        {/* Metrics */}
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
            📊 Farm Status Dashboard
            {latest && (
              <span className="text-xs font-normal text-muted-foreground">
                · live data · {new Date(latest.recorded_at).toLocaleString()}
              </span>
            )}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard icon="🌧️" label="Rainfall" value={rain} unit="mm" delay={0.15} />
            <MetricCard icon="💧" label="pH Level" value={ph} delay={0.2} />
            <MetricCard icon="🌫️" label="Turbidity" value={turbidity} unit="NTU" delay={0.25} />
            <MetricCard icon="🌡️" label="Temperature" value={temp} unit="°C" delay={0.3} />
            <MetricCard icon="🫧" label="Dissolved O₂" value={dissolvedOxygen} unit="mg/L" delay={0.35} />
          </div>
        </div>

        {/* Risk & Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-lg bg-card p-6 shadow-card"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-card-foreground mb-2 flex items-center gap-2">
                Risk Assessment <RiskBadge risk={risk} size="lg" />
              </h2>
              <p className="text-muted-foreground">{recommendation}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button variant="outline" onClick={refresh} disabled={refreshing || loading}>
                {refreshing ? "⏳ Fetching…" : "🔄 Refresh live data"}
              </Button>
              <Button onClick={sendAlert} className="ocean-gradient text-primary-foreground border-0 hover:opacity-90">
                📩 Send Alert
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Water Quality Index */}
        <WaterQualityIndex
          ph={ph}
          turbidity={turbidity}
          temp={temp}
          dissolvedOxygen={dissolvedOxygen}
          risk={risk}
        />

        {/* Alert Rules */}
        <AlertThresholds value={thresholds} onChange={setThresholds} />

        {/* Pond Manager */}
        <PondManager />

        {/* 7-Day Flood Outlook */}
        <WeatherForecast forecast={forecast} />

        {/* Daily Operations */}
        <FeedingSchedule risk={risk} temp={temp} />

        {/* Trend Chart */}
        <TrendChart history={history} />

        {/* AI Forecast */}
        <AIForecast risk={risk} rain={rain} ph={ph} turbidity={turbidity} temp={temp} />

        {/* Fish Stock Impact */}
        <FishStockImpact risk={risk} />



        {/* Notification Log */}
        <NotificationLog />

        {/* Risk Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <RiskMap risk={risk} />
        </motion.div>

        {/* Emergency Contacts */}
        <EmergencyContacts />

        {/* Report Export */}
        <ReportExport
          risk={risk}
          rain={rain}
          ph={ph}
          turbidity={turbidity}
          temp={temp}
          dissolvedOxygen={dissolvedOxygen}
          farmName={farm?.name ?? ""}
        />

        {/* How It Works */}
        <HowItWorks />
      </main>

      <AppFooter />
    </div>
  );
}
