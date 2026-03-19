import { motion } from "framer-motion";

const steps = [
  {
    icon: "📡",
    title: "Data Collection",
    desc: "IoT sensors continuously monitor rainfall, pH, turbidity, and temperature across all registered fish ponds.",
  },
  {
    icon: "🧠",
    title: "AI Analysis",
    desc: "Our EcoFish-RiskNet model processes multi-parameter data in real-time to classify risk levels with 92% accuracy.",
  },
  {
    icon: "⚡",
    title: "Instant Alerts",
    desc: "Automated SMS and push notifications warn farmers before disasters strike, enabling proactive emergency response.",
  },
  {
    icon: "📊",
    title: "Smart Decisions",
    desc: "AI-generated action plans guide farmers on feeding, harvesting, and barrier deployment to minimize fish loss.",
  },
];

export function HowItWorks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2 mb-5">
        🔬 How EcoFish Sentinel Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="relative p-4 rounded-lg border border-border bg-muted/30 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{step.icon}</span>
              <span className="text-xs font-bold text-primary font-mono">STEP {i + 1}</span>
            </div>
            <h3 className="font-semibold text-card-foreground text-sm mb-1">{step.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-lg">
                →
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
