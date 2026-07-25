import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { generateAccounts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { TopBar } from "@/components/top-bar";
import { AnimatedNumber } from "@/components/animated-number";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts · FinFlow AI" },
      { name: "description", content: "All your accounts across every bank in one place." },
      { property: "og:title", content: "Accounts · FinFlow AI" },
      { property: "og:description", content: "All your accounts across every bank in one place." },
    ],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  const accounts = useMemo(() => generateAccounts(8), []);
  const total = accounts.reduce((a, c) => a + Math.max(0, c.balance), 0);

  return (
    <div>
      <TopBar title="Accounts" subtitle={`${accounts.length} connected · net worth updating in real time`} />

      <div className="glass-strong mb-6 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Net position</div>
          <div className="mt-1 text-4xl font-bold sm:text-5xl">
            <AnimatedNumber value={total} format={(v) => formatCurrency(v)} />
          </div>
        </div>
        <Button variant="hero">
          <Plus className="size-4" /> Connect an account
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accounts.map((a, i) => (
          <motion.article
            key={a.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="glass-strong relative overflow-hidden rounded-3xl p-5"
          >
            <div
              className="absolute inset-x-0 top-0 h-24 opacity-25"
              style={{ background: `linear-gradient(135deg, ${a.color}, transparent)` }}
            />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {a.bank}
                </div>
                <div className="mt-0.5 text-sm font-semibold capitalize">{a.type}</div>
              </div>
              <div
                className="grid size-9 place-items-center rounded-xl text-white shadow"
                style={{ background: a.color }}
              >
                <Wallet className="size-4" />
              </div>
            </div>
            <div className="relative mt-4 text-3xl font-bold tracking-tight">
              {formatCurrency(a.balance)}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">•••• {a.last4}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <Stat label="Income" v={a.income} tone="text-emerald" />
              <Stat label="Spent" v={a.expenses} tone="text-danger" />
              <Stat label="Interest" v={a.interest} suffix="%" />
            </div>
            <div className="mt-4 h-14">
              <ResponsiveContainer>
                <AreaChart data={a.trend.map((v, idx) => ({ v, idx }))}>
                  <defs>
                    <linearGradient id={`g-${a.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={a.color} stopOpacity={0.55} />
                      <stop offset="100%" stopColor={a.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={a.color}
                    strokeWidth={2}
                    fill={`url(#g-${a.id})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, v, tone, suffix }: { label: string; v: number; tone?: string; suffix?: string }) {
  return (
    <div className="rounded-lg bg-accent/40 p-2">
      <div className="text-[9px] uppercase text-muted-foreground">{label}</div>
      <div className={`font-semibold ${tone ?? ""}`}>
        {suffix ? `${v}${suffix}` : formatCurrency(v)}
      </div>
    </div>
  );
}
