import { cn } from "@/lib/utils";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: "sm" | "lg";
}

const config: Record<
  RiskLevel,
  { label: string; dot: string; bg: string; text: string; ring: string; glow: string; pulse: boolean }
> = {
  SAFE: {
    label: "SAFE",
    dot: "bg-safe",
    bg: "bg-safe/10",
    text: "text-safe",
    ring: "ring-safe/30",
    glow: "",
    pulse: false,
  },
  WARNING: {
    label: "WARNING",
    dot: "bg-warning",
    bg: "bg-warning/10",
    text: "text-warning",
    ring: "ring-warning/40",
    glow: "glow-warning",
    pulse: true,
  },
  DANGER: {
    label: "DANGER",
    dot: "bg-danger",
    bg: "bg-danger/10",
    text: "text-danger",
    ring: "ring-danger/50",
    glow: "glow-danger",
    pulse: true,
  },
};

export function RiskBadge({ risk, size = "sm" }: RiskBadgeProps) {
  const c = config[risk];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full ring-1 font-semibold tracking-wide",
        c.bg,
        c.text,
        c.ring,
        c.glow,
        size === "lg" ? "px-4 py-2 text-base" : "px-3 py-1 text-xs"
      )}
    >
      <span className="relative inline-flex">
        <span className={cn("inline-block rounded-full", c.dot, size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2")} />
        {c.pulse && (
          <span
            className={cn(
              "absolute inset-0 rounded-full animate-pulse-ring",
              c.dot,
              "opacity-60"
            )}
          />
        )}
      </span>
      {c.label}
    </span>
  );
}
