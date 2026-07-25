import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GOALS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { TopBar } from "@/components/top-bar";
import { Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/goals")({
  head: () => ({
    meta: [
      { title: "Goals · FinFlow AI" },
      { name: "description", content: "Set money goals, track progress, and celebrate every milestone." },
      { property: "og:title", content: "Goals · FinFlow AI" },
      { property: "og:description", content: "Emergency funds, vacations, houses — every goal, one workspace." },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  return (
    <div>
      <TopBar title="Goals" subtitle="Small consistent moves beat big rare ones." />

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{GOALS.length} active goals</div>
        <Button variant="hero"><Plus className="size-4" /> New goal</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {GOALS.map((g, i) => {
          const pct = Math.min(100, (g.saved / g.target) * 100);
          return (
            <motion.article
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="glass-strong relative overflow-hidden rounded-3xl p-5"
            >
              <div
                className="absolute inset-x-0 top-0 h-24 opacity-20"
                style={{ background: `linear-gradient(135deg, ${g.color}, transparent)` }}
              />
              <div className="relative flex items-center gap-3">
                <div
                  className="grid size-12 place-items-center rounded-2xl text-2xl"
                  style={{ background: `color-mix(in oklab, ${g.color} 20%, transparent)` }}
                >
                  {g.emoji}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{g.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Target className="size-3" /> ETA {g.eta}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(g.saved)}</div>
                  <div className="text-[11px] text-muted-foreground">of {formatCurrency(g.target)}</div>
                </div>
                <div className="text-sm font-semibold">{Math.round(pct)}%</div>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-accent/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: g.color }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                {[25, 50, 75, 100].map((m) => (
                  <div
                    key={m}
                    className={`hidden rounded-lg py-1 text-[10px] font-semibold sm:block ${
                      pct >= m ? "bg-emerald/15 text-emerald" : "bg-accent/40 text-muted-foreground"
                    }`}
                  >
                    {m}%
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="hero" size="sm" className="flex-1">Add funds</Button>
                <Button variant="glass" size="sm">Edit</Button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
