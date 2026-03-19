import { motion } from "framer-motion";

const stats = [
  { value: "2,450+", label: "Farms Protected", icon: "🏭" },
  { value: "12.3M", label: "Fish Saved", icon: "🐟" },
  { value: "98.7%", label: "Alert Accuracy", icon: "🎯" },
  { value: "<2min", label: "Response Time", icon: "⚡" },
];

export function HeroStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 + i * 0.06, type: "spring", stiffness: 200 }}
          className="rounded-lg ocean-gradient p-4 text-center text-primary-foreground"
        >
          <span className="text-xl block mb-1">{stat.icon}</span>
          <p className="text-xl font-extrabold font-mono">{stat.value}</p>
          <p className="text-[11px] opacity-80 font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
