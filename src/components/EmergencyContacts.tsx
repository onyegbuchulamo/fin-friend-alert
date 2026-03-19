import { motion } from "framer-motion";

const contacts = [
  { role: "Farm Manager", name: "Juan dela Cruz", phone: "+63 917 123 4567", icon: "👨‍🌾", available: true },
  { role: "Water Quality Officer", name: "Maria Santos", phone: "+63 918 234 5678", icon: "🧑‍🔬", available: true },
  { role: "Emergency Response", name: "BFAR Hotline", phone: "02-929-8183", icon: "🚨", available: true },
  { role: "Veterinary Expert", name: "Dr. Reyes", phone: "+63 919 345 6789", icon: "🩺", available: false },
];

export function EmergencyContacts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.58 }}
      className="rounded-lg bg-card p-6 shadow-card"
    >
      <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2 mb-4">
        📞 Emergency Contacts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {contacts.map((contact, i) => (
          <motion.div
            key={contact.role}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 + i * 0.08 }}
            className="flex items-center gap-3 rounded-md border border-border p-3 hover:shadow-card transition-shadow"
          >
            <span className="text-2xl">{contact.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-card-foreground truncate">{contact.name}</p>
                <span className={`w-2 h-2 rounded-full shrink-0 ${contact.available ? "bg-safe" : "bg-muted-foreground/40"}`} />
              </div>
              <p className="text-xs text-muted-foreground">{contact.role}</p>
              <p className="text-xs font-mono text-primary">{contact.phone}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
