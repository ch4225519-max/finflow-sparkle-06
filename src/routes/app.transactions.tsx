import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateAccounts, generateTransactions } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/app/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions · FinFlow AI" },
      { name: "description", content: "Search, filter, and drill into every transaction across all your accounts." },
      { property: "og:title", content: "Transactions · FinFlow AI" },
      { property: "og:description", content: "Every payment, refund, and paycheck — organised and searchable." },
    ],
  }),
  component: TransactionsPage,
});

const CATS = ["All", "Food", "Rent", "Transport", "Shopping", "Entertainment", "Salary", "Utilities", "Travel"];
const STATUS = ["All", "completed", "pending"] as const;

function TransactionsPage() {
  const accounts = useMemo(() => generateAccounts(6), []);
  const txns = useMemo(() => generateTransactions(accounts, 500), [accounts]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState<(typeof STATUS)[number]>("All");

  const filtered = useMemo(
    () =>
      txns.filter((t) => {
        if (cat !== "All" && t.category !== cat) return false;
        if (status !== "All" && t.status !== status) return false;
        if (q && !t.merchant.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [txns, cat, status, q],
  );

  const income = filtered.filter((t) => t.amount > 0).reduce((a, b) => a + b.amount, 0);
  const expenses = filtered.filter((t) => t.amount < 0).reduce((a, b) => a + b.amount, 0);

  return (
    <div>
      <TopBar title="Transactions" subtitle={`${filtered.length.toLocaleString()} of ${txns.length.toLocaleString()} shown`} />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Inflow" value={income} tone="text-emerald" />
        <StatCard label="Outflow" value={Math.abs(expenses)} tone="text-danger" />
        <StatCard label="Net" value={income + expenses} tone="text-brand-blue" />
      </div>

      <div className="glass-strong rounded-3xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search merchant…"
              className="h-10 rounded-xl bg-background/60 pl-9"
              aria-label="Search transactions"
            />
          </div>
          <div className="hidden gap-1 md:flex" role="tablist" aria-label="Category filter">
            {CATS.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  cat === c ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1">
            {STATUS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize transition ${
                  status === s ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50"
                }`}
              >
                {s}
              </button>
            ))}
            <Button variant="glass" size="sm" aria-label="More filters">
              <Filter className="size-4" />
            </Button>
            <Button variant="glass" size="sm" aria-label="Export">
              <Download className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 divide-y divide-border/60">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-2 py-2 text-[10px] uppercase tracking-widest text-muted-foreground sm:grid-cols-[1fr_120px_120px_120px]">
            <div>Merchant</div>
            <div className="hidden sm:block">Category</div>
            <div className="hidden sm:block">Date</div>
            <div className="text-right">Amount</div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {filtered.slice(0, 200).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.005, 0.4) }}
                className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-xl px-2 py-2 hover:bg-accent/40 sm:grid-cols-[1fr_120px_120px_120px]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-base">
                    {t.logo}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{t.merchant}</span>
                      {t.recurring && (
                        <span className="rounded-full bg-brand-blue/15 px-1.5 py-0.5 text-[9px] font-semibold text-brand-blue">
                          RECURRING
                        </span>
                      )}
                      {t.status === "pending" && (
                        <span className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[9px] font-semibold text-warning">
                          PENDING
                        </span>
                      )}
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground sm:hidden">
                      {t.category} · {new Date(t.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="hidden text-xs text-muted-foreground sm:block">{t.category}</div>
                <div className="hidden text-xs text-muted-foreground sm:block">
                  {new Date(t.date).toLocaleDateString()}
                </div>
                <div className={`text-right text-sm font-semibold ${t.amount > 0 ? "text-emerald" : ""}`}>
                  {t.amount > 0 ? "+" : ""}
                  {formatCurrency(t.amount)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${tone}`}>{formatCurrency(value)}</div>
    </div>
  );
}
