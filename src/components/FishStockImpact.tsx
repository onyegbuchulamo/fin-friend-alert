import { motion } from "framer-motion";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface FishStockImpactProps {
  risk: RiskLevel;
}

const stockData: Record<RiskLevel, { survival: number; growth: string; feedEfficiency: string; mortality: string }> = {
  SAFE: { survival: 97, growth: "Normal (2.1g/day)", feedEfficiency: "1.4:1", mortality: "<1%" },
  WARNING: { survival: 89, growth: "Reduced (1.2g/day)", feedEfficiency: "1.8:1", mortality: "3-5%" },
  DANGER: { survival: 72, growth: "Severely Impacted", feedEfficiency: "2.5:1", mortality: "10-25%" },
};

const barColor: Record<RiskLevel, string> = {
  SAFE: "bg-safe",
  WARNING: "bg-warning",
  DANGER: "bg-danger",
};

export function FishStockImpact({ risk }: FishStockImpactProps) {
  const data = stockData[risk];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2 mb-4">
        🐟 Fish Stock Impact Assessment
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Survival Rate", value: `${data.survival}%`, bar: data.survival },
          { label: "Growth Rate", value: data.growth, bar: risk === "SAFE" ? 90 : risk === "WARNING" ? 55 : 20 },
          { label: "Feed Efficiency", value: data.feedEfficiency, bar: risk === "SAFE" ? 85 : risk === "WARNING" ? 60 : 30 },
          { label: "Est. Mortality", value: data.mortality, bar: risk === "SAFE" ? 5 : risk === "WARNING" ? 30 : 75 },
        ].map((item, i) => (
          <div key={i} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            <p className="text-sm font-bold text-card-foreground">{item.value}</p>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.bar}%` }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                className={`h-full rounded-full ${barColor[risk]}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
