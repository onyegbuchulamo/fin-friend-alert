import { motion } from "framer-motion";

interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  delay?: number;
}

export function MetricCard({ icon, label, value, unit, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-lg bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
        <span className="text-lg">{icon}</span>
        {label}
      </div>
      <div className="text-2xl font-bold text-card-foreground font-mono">
        {value}
        {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
      </div>
    </motion.div>
  );
}
