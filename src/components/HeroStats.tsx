import { motion } from "framer-motion";

const stats = [
  { value: "2,450+", label: "Farms Protected", icon: "🏭", accent: "from-primary to-cyan-500" },
  { value: "12.3M", label: "Fish Saved", icon: "🐟", accent: "from-teal-500 to-emerald-500" },
  { value: "98.7%", label: "Alert Accuracy", icon: "🎯", accent: "from-blue-500 to-indigo-500" },
  { value: "<2min", label: "Response Time", icon: "⚡", accent: "from-amber-500 to-orange-500" },
];

export function HeroStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.08 + i * 0.06, type: "spring", stiffness: 180, damping: 18 }}
          whileHover={{ y: -3 }}
          className="group relative rounded-xl glass p-4 text-center overflow-hidden shadow-card hover:shadow-card-hover transition-all"
        >
          <div
            className={`pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
          />
          <div className="relative">
            <span className="text-xl block mb-1">{stat.icon}</span>
            <p className="text-xl font-extrabold font-mono text-gradient tabular-nums">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
