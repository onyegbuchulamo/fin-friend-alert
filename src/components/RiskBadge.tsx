import { cn } from "@/lib/utils";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: "sm" | "lg";
}

const config: Record<RiskLevel, { label: string; icon: string; bg: string; text: string; ring: string }> = {
  SAFE: { label: "SAFE", icon: "🟢", bg: "bg-safe/15", text: "text-safe", ring: "ring-safe/30" },
  WARNING: { label: "WARNING", icon: "🟡", bg: "bg-warning/15", text: "text-warning", ring: "ring-warning/30" },
  DANGER: { label: "DANGER", icon: "🔴", bg: "bg-danger/15", text: "text-danger", ring: "ring-danger/30" },
};

export function RiskBadge({ risk, size = "sm" }: RiskBadgeProps) {
  const c = config[risk];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full ring-1 font-semibold",
        c.bg, c.text, c.ring,
        size === "lg" ? "px-4 py-2 text-base" : "px-3 py-1 text-sm"
      )}
    >
      {c.icon} {c.label}
    </span>
  );
}
