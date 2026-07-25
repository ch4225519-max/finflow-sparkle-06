import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TopBar } from "@/components/top-bar";
import { generateCategorySpend, generateMonthlyHistory } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import { AnimatedNumber } from "@/components/animated-number";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · FinFlow AI" },
      { name: "description", content: "Interactive financial analytics: cashflow, net worth, category burn, forecasts." },
      { property: "og:title", content: "Analytics · FinFlow AI" },
      { property: "og:description", content: "Living charts for income, expenses, savings and net worth." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const history = useMemo(() => generateMonthlyHistory(12), []);
  const cats = useMemo(() => generateCategorySpend(), []);
  const heat = useMemo(
    () =>
      Array.from({ length: 84 }, (_, i) => ({
        d: i,
        v: Math.round(Math.abs(Math.sin(i / 3) * 60) + Math.abs(Math.cos(i / 2)) * 40),
      })),
    [],
  );

  return (
    <div>
      <TopBar title="Analytics" subtitle="Every trend, breakdown and forecast — updated live." />

      <div className="mb-4 grid gap-3 sm:grid-cols-4">
        <Kpi label="Avg. monthly income" value={5820} tone="text-emerald" />
        <Kpi label="Avg. monthly spend" value={3720} tone="text-danger" />
        <Kpi label="Savings rate" value={36} tone="text-brand-blue" fmt={(v) => `${v.toFixed(0)}%`} />
        <Kpi label="Forecast net (Dec)" value={142000} tone="text-brand-purple" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Cashflow · Income vs Expenses" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={history}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income" name="Income" fill="var(--emerald)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="var(--brand-purple)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Category burn">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={cats} dataKey="value" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {cats.map((c) => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => formatCurrency(v)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Net worth trajectory" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Area type="monotone" dataKey="net" stroke="var(--brand-blue)" strokeWidth={2.5} fill="url(#netGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Savings trend">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={history}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => formatCurrency(v)}
                />
                <Line type="monotone" dataKey="savings" stroke="var(--emerald)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="12-week spending heatmap" className="lg:col-span-3">
          <div className="grid grid-cols-[repeat(28,minmax(0,1fr))] gap-1">
            {heat.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.004, 0.6) }}
                title={`Day ${i + 1}: ${formatCurrency(h.v)}`}
                className="aspect-square rounded-md"
                style={{
                  background: `color-mix(in oklab, var(--emerald) ${Math.min(90, h.v)}%, var(--accent))`,
                }}
              />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  tone,
  fmt,
}: {
  label: string;
  value: number;
  tone: string;
  fmt?: (v: number) => string;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${tone}`}>
        <AnimatedNumber value={value} format={fmt ?? ((v) => formatCurrency(v))} />
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass-strong rounded-3xl p-5 ${className ?? ""}`}>
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}
