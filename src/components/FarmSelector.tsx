import { motion } from "framer-motion";
import type { Farm } from "@/hooks/useFarmData";

interface FarmSelectorProps {
  farms: Farm[];
  farmId: string | null;
  onSelect: (id: string) => void;
  lastUpdated?: string | null;
}

export function FarmSelector({ farms, farmId, onSelect, lastUpdated }: FarmSelectorProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">🏞️ Monitored Farms</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Live station data from registered aquaculture sites in Abia State.
          </p>
        </div>
        {lastUpdated && (
          <span className="text-xs text-muted-foreground shrink-0">
            Updated {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {farms.map((f) => {
          const active = f.id === farmId;
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className={`text-left rounded-lg border p-3 transition-all ${
                active
                  ? "border-primary bg-primary/10 shadow-card"
                  : "border-border bg-muted/20 hover:border-primary/50"
              }`}
            >
              <p className="font-semibold text-sm text-card-foreground">{f.name}</p>
              <p className="text-xs text-muted-foreground">{f.location}</p>
              <p className="text-[11px] text-muted-foreground font-mono mt-1">
                {f.latitude.toFixed(3)}°N, {f.longitude.toFixed(3)}°E
              </p>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
