import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import { FarmRegistration } from "@/components/FarmRegistration";
import { RiskMap } from "@/components/RiskMap";

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
  const [farm, setFarm] = useState({ name: "", location: "", phone: "" });
  const [risk, setRisk] = useState<RiskLevel>("SAFE");
  const [recommendation, setRecommendation] = useState("");
  const [weather, setWeather] = useState({ rain: 0 });
  const [water, setWater] = useState({ ph: 7, turbidity: 30, temp: 28 });

  const simulate = useCallback(() => {
    const rain = Math.floor(Math.random() * 100);
    const ph = parseFloat((Math.random() * 14).toFixed(1));
    const turbidity = Math.floor(Math.random() * 100);
    const temp = Math.floor(Math.random() * 40);
    setWeather({ rain });
    setWater({ ph, turbidity, temp });
    const riskLevel = calculateRisk(rain, ph, turbidity, temp);
    setRisk(riskLevel);
    setRecommendation(getRecommendation(riskLevel));
  }, []);

  useEffect(() => { simulate(); }, [simulate]);

  const sendAlert = () => {
    alert(`SMS SENT: ${risk} risk detected. ${recommendation}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="ocean-gradient px-6 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
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
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 pb-12 space-y-6">
        {/* Farm Registration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <FarmRegistration farm={farm} onChange={setFarm} />
        </motion.div>

        {/* Metrics */}
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
            📊 Farm Status Dashboard
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon="🌧️" label="Rainfall" value={weather.rain} unit="mm" delay={0.15} />
            <MetricCard icon="💧" label="pH Level" value={water.ph} delay={0.2} />
            <MetricCard icon="🌫️" label="Turbidity" value={water.turbidity} unit="NTU" delay={0.25} />
            <MetricCard icon="🌡️" label="Temperature" value={water.temp} unit="°C" delay={0.3} />
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
                🔄 Refresh Data
              </Button>
              <Button onClick={sendAlert} className="ocean-gradient text-primary-foreground border-0 hover:opacity-90">
                📩 Send Alert
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Risk Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <RiskMap risk={risk} />
        </motion.div>
      </main>
    </div>
  );
}
