import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Undo2, Redo2, RotateCcw, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/top-bar";
import { useBudgetStore } from "@/lib/budget-store";
import { AnimatedNumber } from "@/components/animated-number";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/app/budget")({
  head: () => ({
    meta: [
      { title: "Budget Builder · FinFlow AI" },
      { name: "description", content: "Drag your income into categories to build a living, visual budget in seconds." },
      { property: "og:title", content: "Visual Budget Builder · FinFlow AI" },
      { property: "og:description", content: "Drag money chips into categories. Watch your plan come alive." },
    ],
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const { chips, categories, income, allocate, reset, undo, redo, past, future, lastConfetti } =
    useBudgetStore();
  const [dragging, setDragging] = useState<string | null>(null);
  const [hoverCat, setHoverCat] = useState<string | null>(null);
  const [confetti, setConfetti] = useState<number>(0);

  useEffect(() => {
    if (lastConfetti && lastConfetti !== confetti) {
      setConfetti(lastConfetti);
      toast.success("Budget complete!", { description: "Every dollar has a job. Nicely done." });
    }
  }, [lastConfetti, confetti]);

  const allocated = categories.reduce((a, c) => a + c.allocated, 0);
  const remaining = income - allocated;
  const pct = Math.min(100, Math.round((allocated / income) * 100));

  return (
    <div>
      <TopBar
        title="Visual Budget Builder"
        subtitle="Drag your income into buckets. Every dollar deserves a job."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button variant="glass" size="sm" onClick={undo} disabled={!past.length} aria-label="Undo">
          <Undo2 className="size-4" /> Undo
        </Button>
        <Button variant="glass" size="sm" onClick={redo} disabled={!future.length} aria-label="Redo">
          <Redo2 className="size-4" /> Redo
        </Button>
        <Button variant="glass" size="sm" onClick={reset} aria-label="Reset">
          <RotateCcw className="size-4" /> Reset
        </Button>
        <div className="ml-auto flex items-center gap-4 rounded-2xl glass px-4 py-2 text-sm">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Income</div>
            <div className="font-bold">{formatCurrency(income)}</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Allocated</div>
            <div className="font-bold text-emerald">
              <AnimatedNumber value={allocated} format={(v) => formatCurrency(v)} />
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Remaining</div>
            <div className={`font-bold ${remaining <= 0 ? "text-emerald" : "text-warning"}`}>
              <AnimatedNumber value={remaining} format={(v) => formatCurrency(v)} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-accent/60">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
          className="h-full gradient-primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* Money chips panel */}
        <section className="glass-strong rounded-3xl p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-xl gradient-brand text-white">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Your income</h2>
              <p className="text-[11px] text-muted-foreground">Drag chips into a bucket →</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {chips.map((c) => (
              <MoneyChip
                key={c.id}
                id={c.id}
                amount={c.amount}
                label={c.label}
                assigned={!!c.categoryId}
                onDragStart={() => setDragging(c.id)}
                onDragEnd={() => setDragging(null)}
              />
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-glass-border p-3 text-center text-[11px] text-muted-foreground">
            Tip: press ⌘Z / ⌘⇧Z to undo & redo.
          </div>
        </section>

        {/* Category buckets */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <CategoryBucket
              key={cat.id}
              cat={cat}
              onDrop={(chipId) => {
                allocate(chipId, cat.id);
                setHoverCat(null);
                setDragging(null);
              }}
              hover={hoverCat === cat.id}
              onHoverChange={(h) => setHoverCat(h ? cat.id : null)}
              draggingId={dragging}
              chips={chips.filter((c) => c.categoryId === cat.id)}
            />
          ))}
        </section>
      </div>

      <AnimatePresence>{confetti > 0 && <Confetti key={confetti} />}</AnimatePresence>
    </div>
  );
}

function MoneyChip({
  id,
  amount,
  label,
  assigned,
  onDragStart,
  onDragEnd,
}: {
  id: string;
  amount: number;
  label: string;
  assigned: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <motion.div
      layout
      layoutId={`chip-${id}`}
      draggable
      onDragStart={(e) => {
        const evt = e as unknown as DragEvent;
        evt.dataTransfer?.setData("text/plain", id);
        if (evt.dataTransfer) evt.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      whileDrag={{ scale: 1.08, rotate: -2, zIndex: 50 }}
      className={`group relative cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl border p-3 shadow-elevated transition ${
        assigned
          ? "border-glass-border bg-accent/40 text-muted-foreground opacity-70"
          : "border-transparent gradient-primary text-primary-foreground"
      }`}
      aria-label={`${label} chip, ${formatCurrency(amount)}`}
    >
      <div className="text-[10px] uppercase tracking-widest opacity-80">{label}</div>
      <div className="mt-0.5 text-lg font-bold">{formatCurrency(amount)}</div>
      {!assigned && (
        <div className="absolute -right-4 -top-4 size-16 rounded-full bg-white/20 blur-2xl" />
      )}
    </motion.div>
  );
}

function CategoryBucket({
  cat,
  onDrop,
  hover,
  onHoverChange,
  draggingId,
  chips,
}: {
  cat: ReturnType<typeof useBudgetStore.getState>["categories"][number];
  onDrop: (chipId: string) => void;
  hover: boolean;
  onHoverChange: (h: boolean) => void;
  draggingId: string | null;
  chips: { id: string; amount: number; label: string }[];
}) {
  const pct = Math.min(100, (cat.allocated / cat.target) * 100);
  const over = cat.allocated > cat.target;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      layout
      onDragOver={(e) => {
        e.preventDefault();
        onHoverChange(true);
      }}
      onDragLeave={() => onHoverChange(false)}
      onDrop={(e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        if (id) onDrop(id);
      }}
      animate={{
        scale: hover ? 1.03 : 1,
        boxShadow: hover ? "0 30px 60px -20px color-mix(in oklab, var(--emerald) 40%, transparent)" : "0 0 0 transparent",
      }}
      className={`glass-strong relative overflow-hidden rounded-3xl p-4 transition ${
        hover ? "ring-2 ring-emerald" : ""
      } ${draggingId ? "ring-1 ring-glass-border" : ""}`}
      style={{ minHeight: 180 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="grid size-9 place-items-center rounded-xl text-lg"
            style={{ background: `color-mix(in oklab, ${cat.color} 22%, transparent)`, color: cat.color }}
          >
            {cat.emoji}
          </div>
          <div>
            <div className="text-sm font-semibold">{cat.name}</div>
            <div className="text-[10px] text-muted-foreground">Target {formatCurrency(cat.target)}</div>
          </div>
        </div>
        {over && (
          <span className="rounded-full bg-warning/20 px-1.5 py-0.5 text-[9px] font-semibold text-warning">
            OVER
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline justify-between">
          <div className="text-xl font-bold">
            <AnimatedNumber value={cat.allocated} format={(v) => formatCurrency(v)} />
          </div>
          <div className="text-[11px] text-muted-foreground">{Math.round(pct)}%</div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-accent/60">
          <motion.div
            animate={{ width: `${Math.min(100, pct)}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="h-full rounded-full"
            style={{ background: cat.color }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        <AnimatePresence>
          {chips.map((c) => (
            <motion.span
              key={c.id}
              layoutId={`chip-${c.id}`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="rounded-full border border-glass-border bg-accent/50 px-2 py-0.5 text-[10px] font-semibold"
            >
              {c.label} · {formatCurrency(c.amount)}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {hover && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0 grid place-items-center rounded-3xl bg-emerald/10"
        >
          <div className="rounded-full bg-emerald px-3 py-1 text-[11px] font-bold text-emerald-foreground">
            Drop to allocate
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 60 });
  const colors = ["var(--emerald)", "var(--brand-blue)", "var(--brand-purple)", "var(--warning)", "var(--brand-pink)"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="absolute left-1/2 top-24 -translate-x-1/2 rounded-2xl glass-strong px-4 py-2 text-sm font-semibold shadow-elevated">
        <Trophy className="mr-2 inline size-4 text-warning" /> Budget complete!
      </div>
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const dur = 1.6 + Math.random() * 1.4;
        const size = 6 + Math.random() * 8;
        const color = colors[i % colors.length];
        return (
          <motion.span
            key={i}
            className="absolute top-0 rounded-sm"
            style={{ left: `${left}%`, width: size, height: size * 1.6, background: color }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{ y: "110vh", rotate: 360 + Math.random() * 360, opacity: [1, 1, 0] }}
            transition={{ duration: dur, delay, ease: "easeIn" }}
          />
        );
      })}
    </div>
  );
}
