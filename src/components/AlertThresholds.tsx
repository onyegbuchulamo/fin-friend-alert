import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export interface Thresholds {
  rainWarning: number;
  rainDanger: number;
  turbidityDanger: number;
  tempWarning: number;
  channels: { sms: boolean; push: boolean; email: boolean; voice: boolean };
}

export const DEFAULT_THRESHOLDS: Thresholds = {
  rainWarning: 50,
  rainDanger: 75,
  turbidityDanger: 60,
  tempWarning: 32,
  channels: { sms: true, push: true, email: false, voice: false },
};

interface AlertThresholdsProps {
  value: Thresholds;
  onChange: (t: Thresholds) => void;
}

const CHANNELS: { key: keyof Thresholds["channels"]; label: string; icon: string }[] = [
  { key: "sms", label: "SMS", icon: "💬" },
  { key: "push", label: "Push", icon: "🔔" },
  { key: "email", label: "Email", icon: "✉️" },
  { key: "voice", label: "Voice call", icon: "📞" },
];

export function AlertThresholds({ value, onChange }: AlertThresholdsProps) {
  const set = (patch: Partial<Thresholds>) => onChange({ ...value, ...patch });

  const sliders = [
    { key: "rainWarning" as const, label: "Rainfall → Warning", unit: "mm", min: 10, max: 100 },
    { key: "rainDanger" as const, label: "Rainfall → Danger", unit: "mm", min: 20, max: 120 },
    { key: "turbidityDanger" as const, label: "Turbidity → Danger", unit: "NTU", min: 20, max: 100 },
    { key: "tempWarning" as const, label: "Temperature → Warning", unit: "°C", min: 25, max: 40 },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.48 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">⚙️ Alert Rules</h2>
          <p className="text-xs text-muted-foreground mt-1">Tune the risk engine to your ponds — changes apply live.</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => onChange(DEFAULT_THRESHOLDS)}>Reset</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sliders.map((s) => (
          <div key={s.key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-card-foreground">{s.label}</span>
              <span className="text-sm font-bold tabular-nums text-primary">{value[s.key]}{s.unit}</span>
            </div>
            <Slider
              value={[value[s.key]]}
              min={s.min}
              max={s.max}
              step={1}
              onValueChange={([v]) => set({ [s.key]: v } as Partial<Thresholds>)}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-card-foreground mb-2">Notification channels</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CHANNELS.map((c) => (
            <label key={c.key} className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/20 px-3 py-2 cursor-pointer">
              <span className="text-sm text-card-foreground">{c.icon} {c.label}</span>
              <Switch
                checked={value.channels[c.key]}
                onCheckedChange={(checked) => set({ channels: { ...value.channels, [c.key]: checked } })}
              />
            </label>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
