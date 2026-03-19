import { motion } from "framer-motion";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface WaterQualityIndexProps {
  ph: number;
  turbidity: number;
  temp: number;
  dissolvedOxygen: number;
  risk: RiskLevel;
}

const getWQI = (ph: number, turbidity: number, temp: number, dissolvedOxygen: number): number => {
  const phScore = ph >= 6.5 && ph <= 8.5 ? 90 : ph >= 6 && ph <= 9 ? 60 : 25;
  const turbScore = turbidity < 30 ? 90 : turbidity < 60 ? 55 : 20;
  const tempScore = temp >= 24 && temp <= 30 ? 90 : temp >= 20 && temp <= 32 ? 60 : 20;
  const doScore = dissolvedOxygen >= 6 ? 95 : dissolvedOxygen >= 4 ? 55 : 15;
  return Math.round(phScore * 0.25 + turbScore * 0.25 + tempScore * 0.25 + doScore * 0.25);
};

const getWQILabel = (wqi: number) => {
  if (wqi >= 80) return { label: "Excellent", color: "text-safe" };
  if (wqi >= 60) return { label: "Good", color: "text-primary" };
  if (wqi >= 40) return { label: "Fair", color: "text-warning" };
  return { label: "Poor", color: "text-danger" };
};

export function WaterQualityIndex({ ph, turbidity, temp, dissolvedOxygen, risk }: WaterQualityIndexProps) {
  const wqi = getWQI(ph, turbidity, temp, dissolvedOxygen);
  const { label, color } = getWQILabel(wqi);

  const parameters = [
    { name: "pH", value: ph, ideal: "6.5–8.5", score: ph >= 6.5 && ph <= 8.5 ? 90 : ph >= 6 && ph <= 9 ? 60 : 25 },
    { name: "Turbidity", value: `${turbidity} NTU`, ideal: "<30 NTU", score: turbidity < 30 ? 90 : turbidity < 60 ? 55 : 20 },
    { name: "Temperature", value: `${temp}°C`, ideal: "24–30°C", score: temp >= 24 && temp <= 30 ? 90 : temp >= 20 && temp <= 32 ? 60 : 20 },
    { name: "Dissolved O₂", value: `${dissolvedOxygen} mg/L`, ideal: "≥6 mg/L", score: dissolvedOxygen >= 6 ? 95 : dissolvedOxygen >= 4 ? 55 : 15 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
          🧪 Water Quality Index (WQI)
        </h2>
        <div className="flex items-center gap-2">
          <span className={`text-3xl font-bold font-mono ${color}`}>{wqi}</span>
          <span className={`text-sm font-semibold ${color}`}>/ 100</span>
        </div>
      </div>

      {/* WQI gauge bar */}
      <div className="relative w-full h-3 rounded-full bg-muted mb-1 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${wqi}%` }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="h-full rounded-full"
          style={{
            background: wqi >= 80
              ? "hsl(152, 60%, 42%)"
              : wqi >= 60
              ? "hsl(192, 82%, 35%)"
              : wqi >= 40
              ? "hsl(38, 92%, 50%)"
              : "hsl(0, 72%, 51%)",
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mb-4">
        <span>Poor</span>
        <span>Fair</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {parameters.map((param, i) => (
          <motion.div
            key={param.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            className="rounded-md border border-border p-3 bg-muted/20"
          >
            <p className="text-xs font-medium text-muted-foreground">{param.name}</p>
            <p className="text-sm font-bold text-card-foreground mt-0.5">{param.value}</p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-muted-foreground">Ideal: {param.ideal}</span>
              <span className={`text-[10px] font-bold ${param.score >= 80 ? "text-safe" : param.score >= 50 ? "text-warning" : "text-danger"}`}>
                {param.score}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-muted mt-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${param.score}%` }}
                transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                className="h-full rounded-full"
                style={{
                  backgroundColor: param.score >= 80 ? "hsl(152, 60%, 42%)" : param.score >= 50 ? "hsl(38, 92%, 50%)" : "hsl(0, 72%, 51%)",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <p className={`text-sm font-semibold mt-4 ${color}`}>
        Overall Assessment: {label} — {wqi >= 60 ? "Water conditions support healthy aquaculture" : "Immediate corrective action recommended"}
      </p>
    </motion.div>
  );
}
