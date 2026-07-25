import { faker } from "@faker-js/faker";

const SEED = 42;
function reseed() { faker.seed(SEED); }
reseed();

export type AccountType = "checking" | "savings" | "salary" | "investment" | "credit" | "business";

export interface Account {
  id: string;
  name: string;
  bank: string;
  type: AccountType;
  balance: number;
  available: number;
  currency: string;
  last4: string;
  color: string;
  income: number;
  expenses: number;
  interest: number;
  trend: number[];
}

export interface Transaction {
  id: string;
  accountId: string;
  merchant: string;
  category: string;
  amount: number; // negative = expense
  date: string;
  status: "completed" | "pending";
  recurring: boolean;
  tags: string[];
  logo: string; // emoji
  note?: string;
}

export interface Goal {
  id: string;
  name: string;
  emoji: string;
  target: number;
  saved: number;
  eta: string;
  color: string;
}

export interface BillItem {
  id: string;
  name: string;
  amount: number;
  dueIn: number; // days
  logo: string;
  category: string;
}

export interface SplitGroup {
  id: string;
  name: string;
  emoji: string;
  members: { id: string; name: string; avatar: string; balance: number }[];
  total: number;
  yourShare: number;
}

const BANKS = [
  { name: "Chase", color: "#117ACA" },
  { name: "Revolut", color: "#0075EB" },
  { name: "N26", color: "#26D07C" },
  { name: "Monzo", color: "#FF3464" },
  { name: "Wise", color: "#9FE870" },
  { name: "HSBC", color: "#DB0011" },
  { name: "Barclays", color: "#00AEEF" },
  { name: "Amex", color: "#2E77BB" },
];

const CATEGORIES = [
  { name: "Food", emoji: "🍔", color: "oklch(0.72 0.17 45)" },
  { name: "Rent", emoji: "🏠", color: "oklch(0.66 0.17 245)" },
  { name: "Transport", emoji: "🚗", color: "oklch(0.7 0.15 200)" },
  { name: "Shopping", emoji: "🛍️", color: "oklch(0.7 0.19 350)" },
  { name: "Travel", emoji: "✈️", color: "oklch(0.7 0.16 220)" },
  { name: "Entertainment", emoji: "🎬", color: "oklch(0.62 0.2 300)" },
  { name: "Education", emoji: "📚", color: "oklch(0.68 0.15 140)" },
  { name: "Medical", emoji: "💊", color: "oklch(0.68 0.2 15)" },
  { name: "Emergency", emoji: "🚨", color: "oklch(0.65 0.22 25)" },
  { name: "Savings", emoji: "💰", color: "oklch(0.72 0.17 158)" },
  { name: "Investment", emoji: "📈", color: "oklch(0.7 0.17 190)" },
  { name: "Utilities", emoji: "💡", color: "oklch(0.78 0.16 80)" },
  { name: "Insurance", emoji: "🛡️", color: "oklch(0.6 0.14 260)" },
  { name: "Lifestyle", emoji: "🌿", color: "oklch(0.72 0.16 155)" },
];

export const BUDGET_CATEGORIES = CATEGORIES;

const MERCHANTS: { name: string; emoji: string; category: string }[] = [
  { name: "Whole Foods", emoji: "🥬", category: "Food" },
  { name: "Starbucks", emoji: "☕", category: "Food" },
  { name: "Uber", emoji: "🚕", category: "Transport" },
  { name: "Lyft", emoji: "🚖", category: "Transport" },
  { name: "Shell", emoji: "⛽", category: "Transport" },
  { name: "Amazon", emoji: "📦", category: "Shopping" },
  { name: "Apple", emoji: "🍎", category: "Shopping" },
  { name: "Nike", emoji: "👟", category: "Shopping" },
  { name: "Netflix", emoji: "🎬", category: "Entertainment" },
  { name: "Spotify", emoji: "🎧", category: "Entertainment" },
  { name: "Disney+", emoji: "🏰", category: "Entertainment" },
  { name: "Airbnb", emoji: "🏡", category: "Travel" },
  { name: "Delta", emoji: "✈️", category: "Travel" },
  { name: "Coursera", emoji: "🎓", category: "Education" },
  { name: "CVS", emoji: "💊", category: "Medical" },
  { name: "ConEd", emoji: "💡", category: "Utilities" },
  { name: "Verizon", emoji: "📶", category: "Utilities" },
  { name: "Landlord", emoji: "🏠", category: "Rent" },
  { name: "Vanguard", emoji: "📈", category: "Investment" },
  { name: "Wealthfront", emoji: "💹", category: "Investment" },
  { name: "Employer Inc.", emoji: "💼", category: "Salary" },
  { name: "DoorDash", emoji: "🥡", category: "Food" },
  { name: "Trader Joe's", emoji: "🛒", category: "Food" },
  { name: "IKEA", emoji: "🛋️", category: "Shopping" },
  { name: "Zara", emoji: "👗", category: "Shopping" },
];

function sparkline(points = 12, base = 100) {
  return Array.from({ length: points }, () =>
    Math.round(base + faker.number.float({ min: -30, max: 40 })),
  );
}

export function generateAccounts(count = 6): Account[] { reseed();
  const types: AccountType[] = ["checking", "savings", "salary", "investment", "credit", "business"];
  return Array.from({ length: count }, (_, i) => {
    const bank = faker.helpers.arrayElement(BANKS);
    const type = types[i % types.length];
    const balance = type === "credit"
      ? -faker.number.int({ min: 200, max: 4500 })
      : faker.number.int({ min: 1500, max: 82000 });
    return {
      id: faker.string.uuid(),
      name: `${bank.name} ${type[0].toUpperCase() + type.slice(1)}`,
      bank: bank.name,
      type,
      balance,
      available: balance - faker.number.int({ min: 0, max: 400 }),
      currency: "USD",
      last4: faker.finance.creditCardNumber("####").slice(-4),
      color: bank.color,
      income: faker.number.int({ min: 800, max: 8000 }),
      expenses: faker.number.int({ min: 400, max: 5000 }),
      interest: Number(faker.finance.amount({ min: 0.1, max: 4.5, dec: 2 })),
      trend: sparkline(14, 100 + i * 8),
    };
  });
}

export function generateTransactions(accounts: Account[], count = 500): Transaction[] { reseed();
  return Array.from({ length: count }, () => {
    const m = faker.helpers.arrayElement(MERCHANTS);
    const isIncome = m.category === "Salary" || faker.number.int({ min: 0, max: 20 }) === 0;
    const amount = isIncome
      ? faker.number.int({ min: 800, max: 6500 })
      : -faker.number.int({ min: 5, max: 480 });
    return {
      id: faker.string.uuid(),
      accountId: faker.helpers.arrayElement(accounts).id,
      merchant: m.name,
      category: m.category,
      amount,
      date: faker.date.recent({ days: 90 }).toISOString(),
      status: faker.helpers.weightedArrayElement([
        { value: "completed", weight: 9 },
        { value: "pending", weight: 1 },
      ]),
      recurring: faker.datatype.boolean(0.15),
      tags: faker.helpers.arrayElements(["business", "personal", "family", "trip"], { min: 0, max: 2 }),
      logo: m.emoji,
    };
  }).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const GOALS: Goal[] = [
  { id: "g1", name: "Emergency Fund", emoji: "🚨", target: 15000, saved: 9820, eta: "Aug 2026", color: "oklch(0.65 0.22 25)" },
  { id: "g2", name: "Bali Vacation", emoji: "🏝️", target: 6000, saved: 3450, eta: "Dec 2026", color: "oklch(0.7 0.16 220)" },
  { id: "g3", name: "M4 MacBook", emoji: "💻", target: 3200, saved: 2100, eta: "Mar 2026", color: "oklch(0.66 0.17 245)" },
  { id: "g4", name: "Road Bike", emoji: "🚴", target: 2400, saved: 780, eta: "Jun 2026", color: "oklch(0.68 0.17 158)" },
  { id: "g5", name: "Tesla Model 3", emoji: "🚗", target: 42000, saved: 12400, eta: "2028", color: "oklch(0.62 0.2 300)" },
  { id: "g6", name: "House Down Payment", emoji: "🏡", target: 80000, saved: 22300, eta: "2029", color: "oklch(0.7 0.19 350)" },
  { id: "g7", name: "Gaming Rig", emoji: "🎮", target: 3800, saved: 2950, eta: "Feb 2026", color: "oklch(0.78 0.16 80)" },
];

export const BILLS: BillItem[] = [
  { id: "b1", name: "Rent", amount: 1850, dueIn: 3, logo: "🏠", category: "Rent" },
  { id: "b2", name: "Netflix", amount: 15.49, dueIn: 5, logo: "🎬", category: "Entertainment" },
  { id: "b3", name: "Spotify Family", amount: 16.99, dueIn: 6, logo: "🎧", category: "Entertainment" },
  { id: "b4", name: "ConEd Electric", amount: 84.2, dueIn: 8, logo: "💡", category: "Utilities" },
  { id: "b5", name: "Verizon Fiber", amount: 79.99, dueIn: 11, logo: "📶", category: "Utilities" },
  { id: "b6", name: "Apple One", amount: 34.95, dueIn: 12, logo: "🍎", category: "Entertainment" },
  { id: "b7", name: "Health Insurance", amount: 312, dueIn: 15, logo: "🛡️", category: "Insurance" },
];

export const SPLIT_GROUPS: SplitGroup[] = [
  {
    id: "sg1",
    name: "Bali Trip 2026",
    emoji: "🏝️",
    total: 4820,
    yourShare: 1205,
    members: [
      { id: "m1", name: "You", avatar: "🧑", balance: 0 },
      { id: "m2", name: "Ana", avatar: "👩", balance: -230 },
      { id: "m3", name: "Ken", avatar: "🧑‍🦱", balance: 180 },
      { id: "m4", name: "Priya", avatar: "👩‍🦰", balance: 50 },
    ],
  },
  {
    id: "sg2",
    name: "Apartment 4B",
    emoji: "🏠",
    total: 2140,
    yourShare: 535,
    members: [
      { id: "m1", name: "You", avatar: "🧑", balance: 0 },
      { id: "m5", name: "Marcus", avatar: "🧑‍🦲", balance: 120 },
      { id: "m6", name: "Lena", avatar: "👱‍♀️", balance: -60 },
      { id: "m7", name: "Josh", avatar: "🧔", balance: -60 },
    ],
  },
  {
    id: "sg3",
    name: "Weekend BBQ",
    emoji: "🍖",
    total: 320,
    yourShare: 80,
    members: [
      { id: "m1", name: "You", avatar: "🧑", balance: 40 },
      { id: "m8", name: "Sofia", avatar: "👩‍🦱", balance: -20 },
      { id: "m9", name: "Ravi", avatar: "🧑‍🦰", balance: -20 },
    ],
  },
];

export function generateMonthlyHistory(months = 12) {
  return Array.from({ length: months }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (months - 1 - i));
    const income = 5200 + Math.round(Math.sin(i / 2) * 800 + Math.random() * 600);
    const expenses = 3400 + Math.round(Math.cos(i / 3) * 500 + Math.random() * 700);
    return {
      month: d.toLocaleString("en", { month: "short" }),
      income,
      expenses,
      savings: income - expenses,
      net: 22000 + i * 900 + Math.round(Math.random() * 1200),
    };
  });
}

export function generateCategorySpend() { reseed();
  return BUDGET_CATEGORIES.slice(0, 8).map((c) => ({
    name: c.name,
    value: Math.round(faker.number.int({ min: 80, max: 900 })),
    color: c.color,
    emoji: c.emoji,
  }));
}

export function generateHeatmap(days = 90) { reseed();
  return Array.from({ length: days }, (_, i) => ({
    day: i,
    value: Math.max(0, Math.round(Math.sin(i / 5) * 40 + faker.number.int({ min: 0, max: 90 }))),
  }));
}
