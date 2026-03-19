import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiskBadge } from "./RiskBadge";

type RiskLevel = "SAFE" | "WARNING" | "DANGER";

interface Notification {
  id: number;
  risk: RiskLevel;
  message: string;
  timestamp: string;
  channel: string;
}

const generateNotifications = (): Notification[] => {
  const now = Date.now();
  return [
    { id: 1, risk: "DANGER", message: "Flood risk detected — emergency harvest recommended for Laguna Farm", timestamp: new Date(now - 180000).toLocaleTimeString(), channel: "SMS + Push" },
    { id: 2, risk: "WARNING", message: "pH levels rising above threshold at Batangas Aqua pond #3", timestamp: new Date(now - 600000).toLocaleTimeString(), channel: "Push" },
    { id: 3, risk: "SAFE", message: "All sensors restored to normal at Pangasinan Pond", timestamp: new Date(now - 1800000).toLocaleTimeString(), channel: "Email" },
    { id: 4, risk: "WARNING", message: "Temperature spike to 33°C detected at Iloilo Marine", timestamp: new Date(now - 3600000).toLocaleTimeString(), channel: "SMS" },
    { id: 5, risk: "DANGER", message: "Turbidity exceeded 80 NTU during heavy rainfall at Cebu Fishery", timestamp: new Date(now - 5400000).toLocaleTimeString(), channel: "SMS + Push" },
  ];
};

export function NotificationLog() {
  const [notifications] = useState(generateNotifications);
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? notifications : notifications.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.52 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
          🔔 Recent Notifications
          <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {notifications.length} today
          </span>
        </h2>
        {notifications.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-medium text-primary hover:underline"
          >
            {showAll ? "Show less" : "View all"}
          </button>
        )}
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {visible.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-3 rounded-md border border-border p-3"
            >
              <RiskBadge risk={notif.risk} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-card-foreground">{notif.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-muted-foreground">{notif.timestamp}</span>
                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium">{notif.channel}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
