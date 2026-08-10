import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiskBadge } from "./RiskBadge";
import { Button } from "@/components/ui/button";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface Pond {
  id: number;
  name: string;
  species: string;
  stock: number;
  areaM2: number;
  ph: number;
  turbidity: number;
  temp: number;
  dissolvedOxygen: number;
  stockedOn: string;
}

const SPECIES = ["Catfish", "Tilapia", "Catfish", "Heterotis"];

const pondRisk = (p: Pond): RiskLevel => {
  if (p.dissolvedOxygen < 3.5 || p.turbidity > 70 || p.ph < 5.5 || p.ph > 9.5) return "DANGER";
  if (p.dissolvedOxygen < 5 || p.turbidity > 45 || p.ph < 6.5 || p.ph > 8.5 || p.temp > 31) return "WARNING";
  return "SAFE";
};

const density = (p: Pond) => p.stock / p.areaM2;

const rand = (min: number, max: number, dp = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(dp));

const makePond = (id: number): Pond => ({
  id,
  name: `Pond ${String.fromCharCode(64 + id)}`,
  species: SPECIES[(id - 1) % SPECIES.length],
  stock: Math.round(rand(800, 4200, 0)),
  areaM2: Math.round(rand(120, 480, 0)),
  ph: rand(5.4, 9.6),
  turbidity: Math.round(rand(8, 85, 0)),
  temp: Math.round(rand(24, 34, 0)),
  dissolvedOxygen: rand(2.8, 8.4),
  stockedOn: new Date(Date.now() - Math.random() * 120 * 86400000).toLocaleDateString(),
});

const initialPonds = [1, 2, 3, 4].map(makePond);

const riskRing: Record<RiskLevel, string> = {
  SAFE: "border-safe/30 hover:border-safe/60",
  WARNING: "border-warning/40 hover:border-warning/70",
  DANGER: "border-danger/50 hover:border-danger/80",
};

export function PondManager() {
  const [ponds, setPonds] = useState<Pond[]>(initialPonds);
  const [openId, setOpenId] = useState<number | null>(null);

  const totals = useMemo(() => {
    const stock = ponds.reduce((s, p) => s + p.stock, 0);
    const area = ponds.reduce((s, p) => s + p.areaM2, 0);
    const atRisk = ponds.filter((p) => pondRisk(p) !== "SAFE").length;
    return { stock, area, atRisk };
  }, [ponds]);

  const addPond = () => setPonds((prev) => [...prev, makePond(prev.length + 1)]);
  const resample = () => setPonds((prev) => prev.map((p) => ({ ...makePond(p.id), name: p.name, species: p.species, stock: p.stock, areaM2: p.areaM2, stockedOn: p.stockedOn })));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.42 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">🐟 Pond Manager</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {ponds.length} ponds · {totals.stock.toLocaleString()} fish · {totals.area.toLocaleString()} m² ·{" "}
            <span className={totals.atRisk ? "text-warning font-semibold" : "text-safe font-semibold"}>
              {totals.atRisk} needing attention
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={resample}>🔄 Re-sample</Button>
          <Button size="sm" onClick={addPond} className="ocean-gradient text-primary-foreground border-0 hover:opacity-90">
            + Add pond
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ponds.map((p) => {
          const risk = pondRisk(p);
          const d = density(p);
          const open = openId === p.id;
          return (
            <motion.div
              layout
              key={p.id}
              className={`rounded-md border bg-muted/20 p-4 cursor-pointer transition-colors ${riskRing[risk]}`}
              onClick={() => setOpenId(open ? null : p.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-card-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.species} · stocked {p.stockedOn}</p>
                </div>
                <RiskBadge risk={risk} />
              </div>

              <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                {[
                  { l: "pH", v: p.ph },
                  { l: "NTU", v: p.turbidity },
                  { l: "°C", v: p.temp },
                  { l: "mg/L", v: p.dissolvedOxygen },
                ].map((m) => (
                  <div key={m.l} className="rounded bg-background/60 py-1.5">
                    <p className="text-sm font-bold tabular-nums text-card-foreground">{m.v}</p>
                    <p className="text-[10px] text-muted-foreground">{m.l}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Stocking density</span>
                  <span className={d > 12 ? "text-danger font-semibold" : d > 8 ? "text-warning font-semibold" : "text-safe font-semibold"}>
                    {d.toFixed(1)} fish/m²
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    layout
                    animate={{ width: `${Math.min(100, (d / 15) * 100)}%` }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
                      <p>• Estimated biomass: <span className="text-card-foreground font-medium">{((p.stock * 0.45) / 1000).toFixed(2)} tonnes</span></p>
                      <p>• Daily feed requirement: <span className="text-card-foreground font-medium">{Math.round(p.stock * 0.45 * 0.03)} kg</span></p>
                      <p>• Action: <span className="text-card-foreground font-medium">
                        {risk === "DANGER" ? "Aerate immediately and hold feeding" : risk === "WARNING" ? "Increase aeration, monitor hourly" : "Routine monitoring"}
                      </span></p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
