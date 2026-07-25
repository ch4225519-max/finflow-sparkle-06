import { create } from "zustand";
import { BUDGET_CATEGORIES } from "./mock-data";

export interface MoneyChip {
  id: string;
  amount: number;
  label: string;
  categoryId?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  target: number;
  allocated: number;
}

interface HistoryEntry {
  chips: MoneyChip[];
  categories: BudgetCategory[];
}

interface BudgetState {
  income: number;
  chips: MoneyChip[];
  categories: BudgetCategory[];
  past: HistoryEntry[];
  future: HistoryEntry[];
  lastConfetti: number;
  allocate: (chipId: string, categoryId: string) => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;
}

const initialChips: MoneyChip[] = [
  { id: "c1", amount: 2500, label: "Salary" },
  { id: "c2", amount: 1200, label: "Freelance" },
  { id: "c3", amount: 500, label: "Dividends" },
  { id: "c4", amount: 300, label: "Side hustle" },
  { id: "c5", amount: 800, label: "Bonus" },
  { id: "c6", amount: 200, label: "Interest" },
];

const initialCategories: BudgetCategory[] = BUDGET_CATEGORIES.slice(0, 10).map((c, i) => ({
  id: `cat-${i}`,
  name: c.name,
  emoji: c.emoji,
  color: c.color,
  target: [1800, 1600, 400, 500, 600, 400, 300, 250, 400, 800][i] ?? 500,
  allocated: 0,
}));

function snapshot(s: BudgetState): HistoryEntry {
  return {
    chips: s.chips.map((c) => ({ ...c })),
    categories: s.categories.map((c) => ({ ...c })),
  };
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  income: initialChips.reduce((a, c) => a + c.amount, 0),
  chips: initialChips,
  categories: initialCategories,
  past: [],
  future: [],
  lastConfetti: 0,
  allocate: (chipId, categoryId) => {
    const state = get();
    const chip = state.chips.find((c) => c.id === chipId);
    if (!chip || chip.categoryId === categoryId) return;
    const past = [...state.past, snapshot(state)].slice(-30);
    const categories = state.categories.map((c) => {
      if (c.id === categoryId) return { ...c, allocated: c.allocated + chip.amount };
      if (chip.categoryId && c.id === chip.categoryId)
        return { ...c, allocated: Math.max(0, c.allocated - chip.amount) };
      return c;
    });
    const chips = state.chips.map((c) => (c.id === chipId ? { ...c, categoryId } : c));
    const allDone = chips.every((c) => c.categoryId);
    set({
      past,
      future: [],
      chips,
      categories,
      lastConfetti: allDone ? Date.now() : state.lastConfetti,
    });
  },
  reset: () => {
    const state = get();
    set({
      past: [...state.past, snapshot(state)].slice(-30),
      future: [],
      chips: initialChips.map((c) => ({ ...c })),
      categories: initialCategories.map((c) => ({ ...c })),
    });
  },
  undo: () => {
    const state = get();
    if (!state.past.length) return;
    const prev = state.past[state.past.length - 1];
    set({
      past: state.past.slice(0, -1),
      future: [snapshot(state), ...state.future].slice(0, 30),
      chips: prev.chips,
      categories: prev.categories,
    });
  },
  redo: () => {
    const state = get();
    if (!state.future.length) return;
    const next = state.future[0];
    set({
      past: [...state.past, snapshot(state)].slice(-30),
      future: state.future.slice(1),
      chips: next.chips,
      categories: next.categories,
    });
  },
}));
