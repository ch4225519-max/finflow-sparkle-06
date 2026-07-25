import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Sparkles,
  Send,
  Wallet,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { AnimatedNumber } from "@/components/animated-number";
import { Button } from "@/components/ui/button";
import {
  generateAccounts,
  generateTransactions,
  generateMonthlyHistory,
  generateCategorySpend,
  GOALS,
  BILLS,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard · FinFlow AI" },
      { name: "description", content: "Your financial cockpit — balances, cashflow, budgets, goals and AI insights." },
      { property: "og:title", content: "Dashboard · FinFlow AI" },
      { property: "og:description", content: "Balances, cashflow, budgets, goals — all in one liquid-glass workspace." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const accounts = useMemo(() => generateAccounts(6), []);
  const txns = useMemo(() => generateTransactions(accounts, 40), [accounts]);
  const history = useMemo(() => generateMonthlyHistory(12), []);
  const categorySpend = useMemo(() => generateCategorySpend(), []);

  const totalBalance = accounts.reduce((a, c) => a + Math.max(0, c.balance), 0);
  const monthlyIncome = 12480;
  const monthlyExpense = 6120;
  const savings = monthlyIncome - monthlyExpense;
  const score = 82;

  return (
    <div>
      <TopBar title="Good morning, Maya" subtitle="Here's how your money is flowing today." />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Balance hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong relative overflow-hidden rounded-3xl p-6 lg:col-span-2"
        >
          <div className="absolute -right-20 -top-20 size-56 rounded-full gradient-brand opacity-30 blur-3xl" />
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Total balance</div>
              <div className="mt-2 text-5xl font-bold tracking-tight sm:text-6xl">
                <AnimatedNumber value={totalBalance} format={(v) => formatCurrency(v)} />
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald/15 px-2 py-0.5 text-emerald">
                  <ArrowUpRight className="size-3" /> +$8,240
                </span>
                <span className="text-muted-foreground">this month · across {accounts.length} accounts</span>
              </div>
            </div>
            <div className="hidden gap-2 sm:flex">
              <Button variant="hero" size="sm">
                <Plus className="size-4" /> Add funds
              </Button>
              <Button variant="glass" size="sm">
                <Send className="size-4" /> Transfer
              </Button>
            </div>
          </div>

          <div className="mt-6 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--emerald)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--emerald)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Area
                  type="monotone"
                  dataKey="net"
                  stroke="var(--emerald)"
                  strokeWidth={2.5}
                  fill="url(#dashArea)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Income", value: monthlyIncome, tone: "text-emerald", icon: ArrowDownRight },
              { label: "Expenses", value: monthlyExpense, tone: "text-danger", icon: ArrowUpRight },
              { label: "Saved", value: savings, tone: "text-brand-blue", icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-glass-border bg-accent/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <s.icon className="size-3" /> {s.label}
                </div>
                <div className={`mt-1 text-lg font-bold ${s.tone}`}>
                  <AnimatedNumber value={s.value} format={(v) => formatCurrency(v)} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Financial score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-strong rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Financial score</div>
            <span className="rounded-full bg-emerald/15 px-2 py-0.5 text-[10px] font-semibold text-emerald">
              GREAT
            </span>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <ScoreRing value={score} />
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Up 6 points this month. Keep savings above 40% to reach <b className="text-foreground">Excellent</b>.
          </p>
          <div className="mt-4 space-y-2 text-xs">
            {[
              { l: "Savings rate", v: "51%", ok: true },
              { l: "Budget adherence", v: "92%", ok: true },
              { l: "Debt / income", v: "18%", ok: true },
            ].map((r) => (
              <div key={r.l} className="flex items-center justify-between">
                <span className="text-muted-foreground">{r.l}</span>
                <span className="font-semibold">{r.v}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.1 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong relative overflow-hidden rounded-3xl p-6 lg:col-span-2"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-xl gradient-brand text-white">
              <Sparkles className="size-4" />
            </div>
            <h2 className="text-base font-semibold">AI insights</h2>
            <span className="ml-auto text-xs text-muted-foreground">Updated 2m ago</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { t: "You spent 22% more on food", d: "Consider batch cooking this weekend to save ~$85.", tag: "Food", tone: "warning" },
              { t: "You could save $412 next month", d: "Trim 3 unused subscriptions and move to savings.", tag: "Savings", tone: "emerald" },
              { t: "Weekend spending is high", d: "Saturday averages 3.2x weekday spend on shopping.", tag: "Pattern", tone: "brand-purple" },
            ].map((i, k) => (
              <motion.div
                key={i.t}
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + k * 0.05 }}
                className="rounded-2xl border border-glass-border bg-accent/30 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold bg-${i.tone}/15 text-${i.tone}`}>
                    {i.tag}
                  </span>
                  <Zap className="size-3.5 text-muted-foreground" />
                </div>
                <div className="mt-3 text-sm font-semibold leading-tight">{i.t}</div>
                <p className="mt-1 text-xs text-muted-foreground">{i.d}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Spending by category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-strong rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Where it went</h2>
            <Link to="/app/analytics" className="text-xs text-primary hover:underline">
              Details →
            </Link>
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categorySpend} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {categorySpend.map((c) => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 12, background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
            {categorySpend.slice(0, 6).map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="size-2 shrink-0 rounded-full" style={{ background: c.color }} />
                <span className="truncate text-muted-foreground">{c.emoji} {c.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Accounts strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-strong rounded-3xl p-6 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Your accounts</h2>
            <Link to="/app/accounts" className="text-xs text-primary hover:underline">See all →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {accounts.slice(0, 4).map((a, i) => (
              <motion.div
                key={a.id}
                whileHover={{ y: -3 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="relative overflow-hidden rounded-2xl p-4 text-white shadow-elevated"
                style={{ background: `linear-gradient(135deg, ${a.color}, color-mix(in oklab, ${a.color} 60%, black))` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest opacity-80">{a.bank}</div>
                    <div className="mt-0.5 text-xs font-medium capitalize opacity-90">{a.type}</div>
                  </div>
                  <Wallet className="size-4 opacity-80" />
                </div>
                <div className="mt-4 text-2xl font-bold tracking-tight">
                  {formatCurrency(a.balance)}
                </div>
                <div className="mt-1 text-[11px] opacity-80">•••• {a.last4}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming bills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-strong rounded-3xl p-6"
        >
          <h2 className="text-base font-semibold">Upcoming bills</h2>
          <div className="mt-4 space-y-2">
            {BILLS.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-xl bg-accent/30 p-2.5">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-background text-base">
                  {b.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{b.name}</div>
                  <div className="text-[11px] text-muted-foreground">Due in {b.dueIn}d</div>
                </div>
                <div className="text-sm font-semibold">{formatCurrency(b.amount)}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-3xl p-6 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent activity</h2>
            <Link to="/app/transactions" className="text-xs text-primary hover:underline">All transactions →</Link>
          </div>
          <div className="space-y-1">
            {txns.slice(0, 7).map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-accent/40">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-base">
                  {t.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{t.merchant}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {t.category} · {new Date(t.date).toLocaleDateString()}
                  </div>
                </div>
                <div className={`text-sm font-semibold ${t.amount > 0 ? "text-emerald" : ""}`}>
                  {t.amount > 0 ? "+" : ""}
                  {formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-strong rounded-3xl p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Goals</h2>
            <Target className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {GOALS.slice(0, 4).map((g) => {
              const pct = Math.round((g.saved / g.target) * 100);
              return (
                <div key={g.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span>{g.emoji} {g.name}</span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-accent">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: g.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative size-36">
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle cx="64" cy="64" r={r} stroke="var(--accent)" strokeWidth="10" fill="none" />
        <motion.circle
          cx="64"
          cy="64"
          r={r}
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--emerald)" />
            <stop offset="100%" stopColor="var(--brand-blue)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-bold">
            <AnimatedNumber value={value} format={(v) => v.toFixed(0)} />
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">/ 100</div>
        </div>
      </div>
    </div>
  );
}
