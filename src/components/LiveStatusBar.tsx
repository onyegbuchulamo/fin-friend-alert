import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LiveStatusBarProps {
  onRefresh: () => void;
  intervalSeconds?: number;
}

export function LiveStatusBar({ onRefresh, intervalSeconds = 30 }: LiveStatusBarProps) {
  const [countdown, setCountdown] = useState(intervalSeconds);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onRefresh();
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLive, intervalSeconds, onRefresh]);

  return (
    <div className="flex items-center justify-between rounded-lg bg-card px-4 py-2.5 shadow-card text-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: isLive ? [1, 1.3, 1] : 1, opacity: isLive ? 1 : 0.4 }}
            transition={{ duration: 1.5, repeat: isLive ? Infinity : 0 }}
            className="w-2.5 h-2.5 rounded-full bg-safe"
          />
          <span className="font-medium text-card-foreground">
            {isLive ? "LIVE" : "PAUSED"}
          </span>
        </div>
        <span className="text-muted-foreground hidden sm:inline">|</span>
        <span className="text-muted-foreground hidden sm:inline">
          Auto-refresh in <span className="font-mono text-primary font-semibold">{countdown}s</span>
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="hidden md:inline">Uptime: 99.7%</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">Sensors: 4/4 online</span>
        <span className="hidden lg:inline">•</span>
        <span className="hidden lg:inline">Latency: {Math.floor(12 + Math.random() * 30)}ms</span>
        <button
          onClick={() => setIsLive(!isLive)}
          className="ml-2 px-2.5 py-1 rounded-md border border-border text-xs font-medium text-card-foreground hover:bg-muted transition-colors"
        >
          {isLive ? "⏸ Pause" : "▶ Resume"}
        </button>
      </div>
    </div>
  );
}
