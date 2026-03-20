import { motion } from "framer-motion";

const contacts = [
  { role: "Farm Director", name: "Engr. Chukwuemeka Okafor", phone: "+234 704 217 6940", icon: "👨‍🌾", available: true },
  { role: "Water Quality Analyst", name: "Dr. Adaeze Nwosu", phone: "+234 909 082 2825", icon: "🧑‍🔬", available: true },
  { role: "Emergency Response Lead", name: "Obiora Eze", phone: "+234 704 217 6940", icon: "🚨", available: true },
  { role: "Aquaculture Veterinarian", name: "Dr. Chidinma Uche", phone: "+234 909 082 2825", icon: "🩺", available: true },
  { role: "IoT Systems Engineer", name: "Ikechukwu Nwankwo", phone: "+234 704 217 6940", icon: "⚙️", available: true },
  { role: "Community Liaison Officer", name: "Ngozi Amanke", phone: "+234 909 082 2825", icon: "🤝", available: false },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
