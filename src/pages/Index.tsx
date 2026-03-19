import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import { FarmRegistration } from "@/components/FarmRegistration";
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

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

const calculateRisk = (rain: number, ph: number, turbidity: number, temp: number): RiskLevel => {
  if (rain > 75 && turbidity > 60) return "DANGER";
  if (rain > 50 || ph < 6 || ph > 9 || temp > 32) return "WARNING";
  return "SAFE";
};

const getRecommendation = (risk: RiskLevel): string => {
  if (risk === "DANGER") return "⚠️ Secure pond barriers, prepare emergency harvest immediately.";
  if (risk === "WARNING") return "Monitor pond closely, reduce feeding, inspect water source.";
  return "All conditions normal. Continue routine monitoring.";
};

export default function Index() {
  const navigate = useNavigate();
  const [farm, setFarm] = useState({ name: "", location: "", phone: "" });
  const [risk, setRisk] = useState<RiskLevel>("SAFE");
  const [recommendation, setRecommendation] = useState("");
  const [weather, setWeather] = useState({ rain: 0 });
  const [water, setWater] = useState({ ph: 7, turbidity: 30, temp: 28, dissolvedOxygen: 6.5 });

  const simulate = useCallback(() => {
    const rain = Math.floor(Math.random() * 100);
    const ph = parseFloat((Math.random() * 14).toFixed(1));
    const turbidity = Math.floor(Math.random() * 100);
    const temp = Math.floor(Math.random() * 40);
    const dissolvedOxygen = parseFloat((Math.random() * 10 + 1).toFixed(1));
    setWeather({ rain });
    setWater({ ph, turbidity, temp, dissolvedOxygen });
    const riskLevel = calculateRisk(rain, ph, turbidity, temp);
    setRisk(riskLevel);
    setRecommendation(getRecommendation(riskLevel));
  }, []);

  useEffect(() => { simulate(); }, [simulate]);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="ocean-gradient px-6 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground tracking-tight">
                🌊 EcoFish Sentinel
              </h1>
              <p className="text-primary-foreground/70 mt-1 text-sm sm:text-base">
                AI-powered aquaculture risk monitoring &amp; early warning system
              </p>
            </motion.div>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <Button variant="outline" onClick={() => navigate("/admin")} className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
                🛡️ Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 pb-12 space-y-6">
        {/* Hero Stats */}
        <HeroStats />

        {/* Live Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <LiveStatusBar onRefresh={simulate} intervalSeconds={30} />
        </motion.div>

        {/* Farm Registration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <FarmRegistration farm={farm} onChange={setFarm} />
        </motion.div>

        {/* Metrics */}
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
            📊 Farm Status Dashboard
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard icon="🌧️" label="Rainfall" value={weather.rain} unit="mm" delay={0.15} />
            <MetricCard icon="💧" label="pH Level" value={water.ph} delay={0.2} />
            <MetricCard icon="🌫️" label="Turbidity" value={water.turbidity} unit="NTU" delay={0.25} />
            <MetricCard icon="🌡️" label="Temperature" value={water.temp} unit="°C" delay={0.3} />
            <MetricCard icon="🫧" label="Dissolved O₂" value={water.dissolvedOxygen} unit="mg/L" delay={0.35} />
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
              <Button variant="outline" onClick={simulate}>
                🔄 Refresh
              </Button>
              <Button onClick={sendAlert} className="ocean-gradient text-primary-foreground border-0 hover:opacity-90">
                📩 Send Alert
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Water Quality Index */}
        <WaterQualityIndex
          ph={water.ph}
          turbidity={water.turbidity}
          temp={water.temp}
          dissolvedOxygen={water.dissolvedOxygen}
          risk={risk}
        />

        {/* Trend Chart */}
        <TrendChart rain={weather.rain} ph={water.ph} turbidity={water.turbidity} temp={water.temp} />

        {/* AI Forecast */}
        <AIForecast risk={risk} rain={weather.rain} ph={water.ph} turbidity={water.turbidity} temp={water.temp} />

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
          rain={weather.rain}
          ph={water.ph}
          turbidity={water.turbidity}
          temp={water.temp}
          dissolvedOxygen={water.dissolvedOxygen}
          farmName={farm.name}
        />

        {/* How It Works */}
        <HowItWorks />
      </main>

      <AppFooter />
    </div>
  );
}
