import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, Plus, QrCode, ArrowRight } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { SPLIT_GROUPS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/app/split")({
  head: () => ({
    meta: [
      { title: "Bill Splitting · FinFlow AI" },
      { name: "description", content: "Split expenses, settle up, and keep group finances effortless." },
      { property: "og:title", content: "Bill Splitting · FinFlow AI" },
      { property: "og:description", content: "Split expenses, settle up, and keep group finances effortless." },
    ],
  }),
  component: SplitPage,
});

function SplitPage() {
  const totalOwed = SPLIT_GROUPS.reduce(
    (a, g) => a + g.members.filter((m) => m.balance > 0 && m.name !== "You").reduce((x, m) => x + m.balance, 0),
    0,
  );
  const totalYouOwe = SPLIT_GROUPS.reduce(
    (a, g) => a + Math.abs(g.members.filter((m) => m.balance < 0 && m.name !== "You").reduce((x, m) => x + m.balance, 0)),
    0,
  );

  return (
    <div>
      <TopBar title="Bill Splitting" subtitle="Share costs, settle up, keep it drama-free." />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Kpi label="You are owed" value={totalOwed} tone="text-emerald" />
        <Kpi label="You owe" value={totalYouOwe} tone="text-danger" />
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <Button variant="hero" className="flex-1">
            <Plus className="size-4" /> New group
          </Button>
          <Button variant="glass" size="icon" aria-label="QR invite" onClick={() => toast("QR invite copied", { description: "Send it to a friend to auto-join." })}>
            <QrCode className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {SPLIT_GROUPS.map((g, i) => (
          <motion.article
            key={g.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-strong rounded-3xl p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-accent text-xl">{g.emoji}</div>
                <div>
                  <h3 className="font-semibold">{g.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Users className="size-3" /> {g.members.length} members · Total {formatCurrency(g.total)}
                  </div>
                </div>
              </div>
              <Button variant="glass" size="sm">
                Open <ArrowRight className="size-3" />
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {g.members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl bg-accent/30 p-2.5">
                  <div className="grid size-9 shrink-0 place-items-center rounded-full bg-background text-base">
                    {m.avatar}
                  </div>
                  <div className="min-w-0 flex-1 text-sm font-medium">{m.name}</div>
                  <div
                    className={`text-sm font-semibold ${
                      m.balance > 0 ? "text-emerald" : m.balance < 0 ? "text-danger" : "text-muted-foreground"
                    }`}
                  >
                    {m.balance === 0
                      ? "settled"
                      : `${m.balance > 0 ? "+" : ""}${formatCurrency(m.balance)}`}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                variant="brand"
                size="sm"
                onClick={() => toast.success("Settled up!", { description: `${g.name} is now balanced.` })}
              >
                Settle up
              </Button>
              <Button variant="glass" size="sm">Add expense</Button>
              <span className="ml-auto text-[11px] text-muted-foreground">
                Your share · {formatCurrency(g.yourShare)}
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${tone}`}>{formatCurrency(value)}</div>
    </div>
  );
}
