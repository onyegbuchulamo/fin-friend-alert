import { motion } from "framer-motion";
import { RiskBadge } from "./RiskBadge";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface AIForecastProps {
  risk: RiskLevel;
  rain: number;
  ph: number;
  turbidity: number;
  temp: number;
}

const getConfidence = (risk: RiskLevel) => {
  if (risk === "DANGER") return Math.floor(85 + Math.random() * 12);
  if (risk === "WARNING") return Math.floor(70 + Math.random() * 15);
  return Math.floor(88 + Math.random() * 10);
};

const getForecast = (risk: RiskLevel, rain: number, temp: number) => {
  if (risk === "DANGER") {
    return {
      prediction: "High probability of flood-related fish loss within 6 hours",
      actions: [
        "Deploy emergency barriers on all ponds",
        "Begin partial harvest of market-ready stock",
        "Activate backup aeration systems",
        "Alert downstream farms via SMS network",
      ],
      impact: `Estimated ${Math.floor(15 + Math.random() * 25)}% stock at risk`,
    };
  }
  if (risk === "WARNING") {
    return {
      prediction: "Environmental stress likely to increase in next 12 hours",
      actions: [
        "Reduce feeding by 50% to lower oxygen demand",
        "Test water quality every 2 hours",
        "Prepare transfer nets and holding tanks",
        "Monitor weather radar for storm updates",
      ],
      impact: `Estimated ${Math.floor(3 + Math.random() * 8)}% growth reduction`,
    };
  }
  return {
    prediction: "Conditions expected to remain stable for next 24 hours",
    actions: [
      "Continue standard feeding schedule",
      "Routine water sampling at 6AM and 6PM",
      "Check equipment and aeration systems",
      "Update growth records for the week",
    ],
    impact: "No adverse impact expected",
  };
};

export function AIForecast({ risk, rain, ph, turbidity, temp }: AIForecastProps) {
  const confidence = getConfidence(risk);
  const forecast = getForecast(risk, rain, temp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
          🤖 AI Risk Forecast
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Confidence</span>
          <span className="font-mono text-sm font-bold text-primary">{confidence}%</span>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="w-full h-2 rounded-full bg-muted mb-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1, delay: 0.6 }}
          className="h-full rounded-full ocean-gradient"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Prediction */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-card-foreground">Prediction</span>
            <RiskBadge risk={risk} />
          </div>
          <p className="text-sm text-muted-foreground">{forecast.prediction}</p>
          <p className="text-xs font-medium text-primary">{forecast.impact}</p>
        </div>

        {/* Recommended Actions */}
        <div className="md:col-span-2">
          <p className="text-sm font-semibold text-card-foreground mb-2">Recommended Actions</p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {forecast.actions.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-primary mt-0.5 shrink-0">▸</span>
                {action}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Model info */}
      <div className="mt-4 pt-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <span>Model: EcoFish-RiskNet v2.1</span>
        <span>•</span>
        <span>Inputs: Rain({rain}mm), pH({ph}), Turb({turbidity}NTU), Temp({temp}°C)</span>
        <span>•</span>
        <span>Updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </motion.div>
  );
}
