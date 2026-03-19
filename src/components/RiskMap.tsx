import { motion } from "framer-motion";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface RiskMapProps {
  risk: RiskLevel;
}

const zones = [
  { x: "15%", y: "30%", size: 80 },
  { x: "55%", y: "20%", size: 60 },
  { x: "35%", y: "60%", size: 70 },
  { x: "70%", y: "55%", size: 50 },
  { x: "80%", y: "35%", size: 40 },
];

const riskColors: Record<RiskLevel, string[]> = {
  SAFE: ["#22c55e", "#4ade80", "#86efac", "#34d399", "#6ee7b7"],
  WARNING: ["#f59e0b", "#fbbf24", "#fcd34d", "#f59e0b", "#fbbf24"],
  DANGER: ["#ef4444", "#f87171", "#fca5a5", "#dc2626", "#ef4444"],
};

export function RiskMap({ risk }: RiskMapProps) {
  const colors = riskColors[risk];

  return (
    <div className="rounded-lg bg-card p-6 shadow-card">
      <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2 mb-4">
        🗺️ Risk Map
      </h2>
      <div className="relative w-full h-52 rounded-md bg-muted/50 overflow-hidden border border-border">
        {/* Grid lines */}
        {[...Array(6)].map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full border-t border-border/40" style={{ top: `${(i + 1) * 14.28}%` }} />
        ))}
        {[...Array(8)].map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full border-l border-border/40" style={{ left: `${(i + 1) * 11.11}%` }} />
        ))}

        {/* Risk zones */}
        {zones.map((zone, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.35 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="absolute rounded-full"
            style={{
              left: zone.x,
              top: zone.y,
              width: zone.size,
              height: zone.size,
              backgroundColor: colors[i],
              transform: "translate(-50%, -50%)",
              filter: "blur(8px)",
            }}
          />
        ))}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-muted-foreground bg-card/80 px-3 py-1 rounded-full backdrop-blur-sm">
            Live zone monitoring
          </span>
        </div>
      </div>
    </div>
  );
}
