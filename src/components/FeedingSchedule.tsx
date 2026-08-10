import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface Task {
  id: number;
  time: string;
  title: string;
  detail: string;
  kind: "feed" | "check" | "maintenance";
}

const BASE_TASKS: Task[] = [
  { id: 1, time: "06:30", title: "Morning feed", detail: "3% biomass · floating pellet 4mm", kind: "feed" },
  { id: 2, time: "09:00", title: "Water parameter check", detail: "pH, DO, turbidity across all ponds", kind: "check" },
  { id: 3, time: "12:30", title: "Midday feed", detail: "2% biomass · reduce if temp >31°C", kind: "feed" },
  { id: 4, time: "15:00", title: "Aerator inspection", detail: "Verify paddlewheels and inlet screens", kind: "maintenance" },
  { id: 5, time: "17:30", title: "Evening feed", detail: "3% biomass · observe feeding response", kind: "feed" },
  { id: 6, time: "20:00", title: "Night DO sweep", detail: "Critical window — aerate if DO <4 mg/L", kind: "check" },
];

const kindStyle: Record<Task["kind"], { icon: string; chip: string }> = {
  feed: { icon: "🍚", chip: "bg-primary/10 text-primary" },
  check: { icon: "🔬", chip: "bg-safe/10 text-safe" },
  maintenance: { icon: "🛠️", chip: "bg-warning/10 text-warning" },
};

interface FeedingScheduleProps {
  risk: RiskLevel;
  temp: number;
}

export function FeedingSchedule({ risk, temp }: FeedingScheduleProps) {
  const [done, setDone] = useState<number[]>([1, 2]);

  const advisory = useMemo(() => {
    if (risk === "DANGER") return { text: "Suspend feeding — flood risk. Prioritise aeration and barrier checks.", tone: "text-danger", factor: 0 };
    if (risk === "WARNING" || temp > 31) return { text: "Reduce rations by 40% and feed only at cooler hours.", tone: "text-warning", factor: 0.6 };
    return { text: "Full feeding schedule — conditions favourable.", tone: "text-safe", factor: 1 };
  }, [risk, temp]);

  const toggle = (id: number) =>
    setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const progress = Math.round((done.length / BASE_TASKS.length) * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.46 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">📅 Daily Operations Schedule</h2>
        <span className="text-sm font-bold tabular-nums text-primary">{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-3">
        <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full ocean-gradient" />
      </div>
      <p className={`text-sm font-medium mb-4 ${advisory.tone}`}>AI feeding advisory: {advisory.text}</p>

      <ol className="relative space-y-2 pl-5 border-l border-border">
        {BASE_TASKS.map((task) => {
          const complete = done.includes(task.id);
          const skipped = task.kind === "feed" && advisory.factor === 0;
          return (
            <li key={task.id} className="relative">
              <span className={`absolute -left-[1.42rem] top-3 h-2.5 w-2.5 rounded-full border-2 border-card ${complete ? "bg-safe" : skipped ? "bg-danger" : "bg-muted-foreground/50"}`} />
              <button
                onClick={() => toggle(task.id)}
                className={`w-full text-left rounded-md border border-border bg-muted/20 p-3 transition-colors hover:bg-muted/40 ${complete ? "opacity-60" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span>{kindStyle[task.kind].icon}</span>
                  <span className="text-xs font-mono text-muted-foreground tabular-nums">{task.time}</span>
                  <span className={`text-sm font-semibold text-card-foreground ${complete ? "line-through" : ""}`}>{task.title}</span>
                  <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${kindStyle[task.kind].chip}`}>
                    {skipped ? "hold" : task.kind}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{task.detail}</p>
              </button>
            </li>
          );
        })}
      </ol>
    </motion.section>
  );
}
