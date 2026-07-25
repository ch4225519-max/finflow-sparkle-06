import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  LineChart,
  Coins,
  Users,
  Bot,
  Check,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/animated-background";
import { AnimatedNumber } from "@/components/animated-number";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinFlow AI — Interactive Personal Finance & Visual Budget Splitter" },
      {
        name: "description",
        content:
          "FinFlow AI blends live budgets, AI insights, drag-and-drop money planning, and effortless bill splitting into one premium personal-finance workspace.",
      },
      { property: "og:title", content: "FinFlow AI — Personal Finance, Reimagined" },
      {
        property: "og:description",
        content:
          "Plan, split, and grow your money with an interactive fintech workspace built for 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <AnimatedBackground />
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <DashboardPreview />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-4 z-40 mx-auto flex w-[min(1200px,calc(100%-1.5rem))] items-center justify-between rounded-2xl glass-strong px-4 py-2.5">
      <Link to="/" className="flex items-center gap-2">
        <div className="grid size-8 place-items-center rounded-xl gradient-brand text-white shadow-elevated">
          <Sparkles className="size-4" />
        </div>
        <span className="font-bold tracking-tight">FinFlow AI</span>
      </Link>
      <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
        <a href="#features" className="hover:text-foreground">Features</a>
        <a href="#preview" className="hover:text-foreground">Product</a>
        <a href="#pricing" className="hover:text-foreground">Pricing</a>
        <a href="#faq" className="hover:text-foreground">FAQ</a>
      </nav>
      <div className="flex items-center gap-2">
        <Link to="/app" className="hidden sm:block">
          <Button variant="ghost" size="sm">Sign in</Button>
        </Link>
        <Link to="/app">
          <Button variant="hero" size="sm">
            Launch app <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <section ref={ref} className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
      <motion.div style={{ y, opacity }} className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          <span className="inline-block size-1.5 rounded-full bg-emerald animate-pulse" />
          New · AI Split Detector & Predictive Budget
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Your money, <span className="gradient-text">visualised</span> and <br className="hidden sm:inline" />
          drag-and-drop simple.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mx-auto mt-6 max-w-xl text-balance text-lg text-muted-foreground"
        >
          FinFlow AI turns income into movable chips, budgets into living dashboards, and shared
          expenses into instant settlements — all in one liquid-glass workspace.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/app/budget">
            <Button variant="hero" size="lg" className="h-12 rounded-xl px-6 text-base">
              Try the budget builder <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link to="/app">
            <Button variant="glass" size="lg" className="h-12 rounded-xl px-6 text-base">
              See the dashboard
            </Button>
          </Link>
        </motion.div>
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> SOC 2 · GDPR</span>
          <span>·</span>
          <span>No credit card</span>
          <span>·</span>
          <span>Free forever tier</span>
        </div>
      </motion.div>

      <FloatingCards />
    </section>
  );
}

function FloatingCards() {
  return (
    <div className="relative mt-16 h-[380px] sm:h-[440px]">
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="glass-strong absolute left-[6%] top-6 w-64 rounded-3xl p-5 shadow-elevated sm:w-72"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="size-2 rounded-full bg-emerald" /> Cash flow this month
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight">
          <AnimatedNumber value={12480} format={(v) => formatCurrency(v)} />
        </div>
        <div className="mt-1 text-xs text-emerald">▲ 18.2% vs. last month</div>
        <MiniBars className="mt-4" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 4 }}
        animate={{ opacity: 1, y: 0, rotate: 4 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="glass-strong absolute right-[6%] top-2 w-64 rounded-3xl p-5 shadow-elevated sm:w-72"
      >
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Balance · Revolut ••4290</div>
          <div className="text-[10px] font-semibold text-emerald">+ $842</div>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight">
          <AnimatedNumber value={28432.5} format={(v) => formatCurrency(v)} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground">
          <div className="rounded-lg bg-accent/60 p-2">
            <div className="font-semibold text-foreground">$4.2k</div>Income
          </div>
          <div className="rounded-lg bg-accent/60 p-2">
            <div className="font-semibold text-foreground">$2.1k</div>Bills
          </div>
          <div className="rounded-lg bg-accent/60 p-2">
            <div className="font-semibold text-foreground">$1.8k</div>Saved
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="glass-strong absolute left-1/2 top-32 w-[86%] -translate-x-1/2 rounded-3xl p-6 shadow-elevated sm:w-[520px]"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">AI Insight</div>
            <div className="mt-1 text-sm font-semibold">
              You could save <span className="gradient-text">$412</span> next month
            </div>
          </div>
          <div className="grid size-9 place-items-center rounded-xl gradient-brand text-white">
            <Bot className="size-4" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Trim 3 unused subscriptions · Move $180 from Shopping to Emergency · Skip 2 delivery orders.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Netflix", "Apple One", "Adobe CC"].map((s) => (
            <span
              key={s}
              className="rounded-full border border-glass-border bg-accent/50 px-2.5 py-1 text-[11px]"
            >
              {s}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MiniBars({ className }: { className?: string }) {
  const bars = [40, 62, 48, 78, 55, 88, 70, 92];
  return (
    <div className={`flex h-16 items-end gap-1.5 ${className ?? ""}`}>
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ delay: 0.6 + i * 0.05, duration: 0.6 }}
          className="flex-1 rounded-md gradient-primary opacity-90"
        />
      ))}
    </div>
  );
}

function Stats() {
  const items = [
    { v: 128000, l: "Users planning smarter", f: (v: number) => `${Math.round(v / 1000)}k+` },
    { v: 4.9, l: "Avg. store rating", f: (v: number) => v.toFixed(1) + "★" },
    { v: 320, l: "Million tracked", f: (v: number) => `$${Math.round(v)}M` },
    { v: 62, l: "Avg. monthly savings", f: (v: number) => `+${Math.round(v)}%` },
  ];
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-6 py-8 sm:grid-cols-4">
      {items.map((s) => (
        <div key={s.l} className="glass rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold tracking-tight">
            <AnimatedNumber value={s.v} format={s.f} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
        </div>
      ))}
    </section>
  );
}

const FEATURES = [
  {
    icon: Coins,
    title: "Drag-and-drop budgeting",
    desc: "Grab your income as movable chips and drop them into categories. Watch your plan build itself in real time.",
  },
  {
    icon: LineChart,
    title: "Analytics that breathe",
    desc: "Living charts for cashflow, net worth, category burn, and forecasted savings — updated as you edit.",
  },
  {
    icon: Users,
    title: "Effortless bill splitting",
    desc: "Group expenses, tax, tips, custom splits, QR invites, and one-tap settlement. Debt graph included.",
  },
  {
    icon: Bot,
    title: "AI insights & alerts",
    desc: "Personal money coach that spots leaks, forecasts overspend, and celebrates milestones.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade security",
    desc: "SOC 2 Type II, end-to-end encryption, biometric unlock, and read-only bank connections.",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    desc: "Built with an offline-first architecture. Every screen animates at 120fps on modern devices.",
  },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Everything money should be, <span className="gradient-text">visible</span>.
        </h2>
        <p className="mt-4 text-muted-foreground">
          A calm, tactile workspace that replaces spreadsheets, splitwise, and your budgeting app.
        </p>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="glass-strong group relative overflow-hidden rounded-3xl p-6"
          >
            <div className="mb-4 grid size-11 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elevated">
              <f.icon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40 gradient-brand" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section id="preview" className="mx-auto max-w-6xl px-6 py-16">
      <div className="glass-strong overflow-hidden rounded-[2rem] p-1">
        <div className="rounded-[1.7rem] border border-glass-border bg-background/60 p-6 sm:p-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Live preview</div>
              <div className="mt-1 text-2xl font-bold">Your money · at a glance</div>
            </div>
            <Link to="/app">
              <Button variant="brand" size="sm">
                Open dashboard <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 glass rounded-2xl p-5">
              <div className="text-xs text-muted-foreground">Net worth</div>
              <div className="mt-1 text-4xl font-bold tracking-tight">
                <AnimatedNumber value={128420} format={(v) => formatCurrency(v)} />
              </div>
              <div className="text-xs text-emerald">▲ $8,240 this month</div>
              <MiniArea className="mt-6 h-32 w-full" />
            </div>
            <div className="grid gap-4">
              {[
                { label: "Income", value: 12480, tone: "text-emerald" },
                { label: "Expenses", value: 6120, tone: "text-danger" },
                { label: "Savings rate", value: 51, tone: "text-brand-blue", fmt: (v: number) => `${v.toFixed(0)}%` },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-4">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className={`mt-1 text-2xl font-bold ${s.tone}`}>
                    <AnimatedNumber value={s.value} format={s.fmt ?? ((v) => formatCurrency(v))} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniArea({ className }: { className?: string }) {
  const path = "M0,80 C60,60 120,90 180,55 C240,20 300,50 360,35 C420,20 480,55 540,30 L540,120 L0,120 Z";
  const line = "M0,80 C60,60 120,90 180,55 C240,20 300,50 360,35 C420,20 480,55 540,30";
  return (
    <svg viewBox="0 0 540 120" className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--emerald)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--emerald)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={path}
        fill="url(#g1)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />
      <motion.path
        d={line}
        stroke="var(--emerald)"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

const TESTIMONIALS = [
  { q: "The drag-and-drop budget is the first time budgeting has felt fun.", n: "Ana Kovács", r: "Product designer" },
  { q: "Bill splitting used to be a group-chat nightmare. Now it's one tap.", n: "Marcus Lee", r: "Software engineer" },
  { q: "The AI insights caught $180/mo of subscriptions I had forgotten about.", n: "Priya Shah", r: "Freelance writer" },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.figure
            key={t.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-strong rounded-3xl p-6"
          >
            <div className="flex gap-0.5 text-warning">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="size-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed">"{t.q}"</blockquote>
            <figcaption className="mt-4 text-xs">
              <div className="font-semibold">{t.n}</div>
              <div className="text-muted-foreground">{t.r}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

const PLANS = [
  {
    name: "Starter",
    price: 0,
    tag: "Forever free",
    features: ["1 account", "Basic budgeting", "Bill splitting up to 3 groups", "Community support"],
  },
  {
    name: "Pro",
    price: 9,
    tag: "Most popular",
    highlight: true,
    features: [
      "Unlimited accounts & transactions",
      "AI insights & forecasting",
      "Advanced analytics + exports",
      "Priority support",
    ],
  },
  {
    name: "Family",
    price: 19,
    tag: "Up to 5 members",
    features: ["Everything in Pro", "Shared budgets & goals", "Kid-safe cards", "Financial planner chat"],
  },
];

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, honest pricing</h2>
        <p className="mt-4 text-muted-foreground">Cancel anytime. Upgrade or downgrade whenever.</p>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`glass-strong relative flex flex-col rounded-3xl p-6 ${
              p.highlight ? "ring-2 ring-primary shadow-elevated" : ""
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 right-6 rounded-full gradient-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {p.tag}
              </span>
            )}
            <div className="text-sm uppercase tracking-widest text-muted-foreground">{p.name}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight">${p.price}</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            {!p.highlight && <div className="mt-1 text-xs text-muted-foreground">{p.tag}</div>}
            <ul className="mt-6 space-y-2.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/app" className="mt-6">
              <Button variant={p.highlight ? "hero" : "glass"} className="w-full">
                Get started
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

const FAQS = [
  { q: "Is my banking data safe?", a: "Yes. FinFlow uses read-only bank links, AES-256 encryption at rest, and SOC 2 Type II controls. Nothing leaves your device without you." },
  { q: "Do you support joint accounts and families?", a: "Absolutely — the Family plan lets up to 5 members share budgets, split bills, and set joint goals with role-based permissions." },
  { q: "Can I export my data?", a: "Yes — CSV, Excel, and PDF exports are one click away from any report page." },
  { q: "How does the AI work?", a: "FinFlow's models run privately over your anonymised transactions to surface trends, forecasts and personalised savings tips." },
];

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-center text-4xl font-bold tracking-tight sm:text-5xl">Questions?</h2>
      <div className="mt-10 space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="glass-strong group rounded-2xl px-5 py-4 open:pb-5 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold">
              {f.q}
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-xs transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto mt-20 max-w-6xl px-6 pb-16 pt-6">
      <div className="glass-strong flex flex-col items-center justify-between gap-6 rounded-3xl p-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-xl gradient-brand text-white">
            <Sparkles className="size-4" />
          </div>
          <span className="text-sm font-semibold">FinFlow AI</span>
          <span className="text-xs text-muted-foreground">© 2026</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Security</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
