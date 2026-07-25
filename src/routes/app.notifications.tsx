import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bell, DollarSign, AlertTriangle, Trophy, Users, Calendar } from "lucide-react";
import { TopBar } from "@/components/top-bar";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · FinFlow AI" },
      { name: "description", content: "Every important money moment, curated for you." },
      { property: "og:title", content: "Notifications · FinFlow AI" },
      { property: "og:description", content: "Every important money moment, curated for you." },
    ],
  }),
  component: Notifications,
});

const items = [
  { icon: DollarSign, title: "Salary received", desc: "$4,820.00 from Employer Inc. deposited to Revolut ••4290.", time: "2m ago", tone: "emerald" },
  { icon: AlertTriangle, title: "Budget warning · Food", desc: "You've spent 88% of your $600 Food budget with 12 days left.", time: "1h ago", tone: "warning" },
  { icon: Users, title: "Ana paid you $120", desc: "For 'Bali Trip 2026' · Weekend groceries.", time: "3h ago", tone: "brand-blue" },
  { icon: Calendar, title: "Rent due in 3 days", desc: "$1,850 to Landlord. Auto-pay is on.", time: "6h ago", tone: "brand-purple" },
  { icon: Trophy, title: "Goal reached: Gaming Rig", desc: "You saved $3,800 — 5 weeks ahead of schedule 🎉", time: "yesterday", tone: "emerald" },
  { icon: Bell, title: "AI insight ready", desc: "Weekly report is available in Analytics.", time: "yesterday", tone: "brand-pink" },
];

function Notifications() {
  return (
    <div>
      <TopBar title="Notifications" subtitle="6 new · your money, briefed." />
      <div className="space-y-2">
        {items.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-strong flex items-start gap-3 rounded-2xl p-4"
          >
            <div
              className="grid size-10 shrink-0 place-items-center rounded-xl"
              style={{ background: `color-mix(in oklab, var(--${n.tone}) 22%, transparent)`, color: `var(--${n.tone})` }}
            >
              <n.icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate font-semibold">{n.title}</div>
                <div className="shrink-0 text-[11px] text-muted-foreground">{n.time}</div>
              </div>
              <div className="text-sm text-muted-foreground">{n.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
