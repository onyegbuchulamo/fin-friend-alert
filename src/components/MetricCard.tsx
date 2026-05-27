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
      whileHover={{ y: -4 }}
      className="group relative rounded-xl bg-card p-5 shadow-card hover:shadow-card-hover transition-all overflow-hidden border border-border/50"
    >
      {/* gradient sweep on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      {/* top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase tracking-wider mb-2">
        <span className="text-lg">{icon}</span>
        {label}
      </div>
      <div className="relative text-2xl font-bold text-card-foreground font-mono tabular-nums">
        {value}
        {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
      </div>
    </motion.div>
  );
}
