import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface ReportExportProps {
  risk: RiskLevel;
  rain: number;
  ph: number;
  turbidity: number;
  temp: number;
  dissolvedOxygen: number;
  farmName: string;
}

export function ReportExport({ risk, rain, ph, turbidity, temp, dissolvedOxygen, farmName }: ReportExportProps) {
  const [generating, setGenerating] = useState(false);

  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      const now = new Date();
      const report = `
══════════════════════════════════════════════════
     ECOFISH SENTINEL — FARM STATUS REPORT
══════════════════════════════════════════════════

Report Generated: ${now.toLocaleString()}
Farm: ${farmName || "Unregistered Farm"}

──────────────────────────────────────────────────
CURRENT RISK LEVEL: ${risk}
──────────────────────────────────────────────────

ENVIRONMENTAL PARAMETERS:
  • Rainfall:          ${rain} mm
  • pH Level:          ${ph}
  • Turbidity:         ${turbidity} NTU
  • Temperature:       ${temp}°C
  • Dissolved Oxygen:  ${dissolvedOxygen} mg/L

RISK ASSESSMENT:
  ${risk === "DANGER" ? "CRITICAL: Immediate action required. Secure pond barriers and prepare emergency harvest." : risk === "WARNING" ? "CAUTION: Monitor closely. Reduce feeding and inspect water sources." : "NORMAL: All conditions within safe parameters. Continue routine monitoring."}

RECOMMENDED ACTIONS:
  ${risk === "DANGER" ? "1. Deploy emergency barriers\n  2. Begin partial harvest\n  3. Activate backup aeration\n  4. Alert downstream farms" : risk === "WARNING" ? "1. Reduce feeding by 50%\n  2. Test water every 2 hours\n  3. Prepare transfer equipment\n  4. Monitor weather radar" : "1. Standard feeding schedule\n  2. Routine water sampling\n  3. Check equipment\n  4. Update growth records"}

──────────────────────────────────────────────────
AI Model: EcoFish-RiskNet v2.1
System: EcoFish Sentinel — Sustainable Aquaculture
══════════════════════════════════════════════════
`.trim();

      const blob = new Blob([report], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ecofish-report-${now.toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      setGenerating(false);
      toast.success("📄 Report downloaded successfully!");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
            📄 Export Report
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generate a detailed farm status report with current readings, risk assessment, and recommended actions.
          </p>
        </div>
        <Button
          onClick={generateReport}
          disabled={generating}
          className="ocean-gradient text-primary-foreground border-0 hover:opacity-90 shrink-0"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
              Generating...
            </span>
          ) : (
            "📥 Download Report"
          )}
        </Button>
      </div>
    </motion.div>
  );
}
