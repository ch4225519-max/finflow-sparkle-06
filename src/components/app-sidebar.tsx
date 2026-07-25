import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Coins,
  Users,
  BarChart3,
  Target,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/accounts", label: "Accounts", icon: Wallet },
  { to: "/app/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/app/budget", label: "Budget Builder", icon: Coins, badge: "NEW" },
  { to: "/app/split", label: "Bill Splitting", icon: Users },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/goals", label: "Goals", icon: Target },
  { to: "/app/notifications", label: "Notifications", icon: Bell },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="glass-strong sticky top-4 z-30 hidden h-[calc(100dvh-2rem)] w-64 shrink-0 flex-col rounded-3xl p-4 lg:flex">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2">
          <div className="grid size-9 place-items-center rounded-xl gradient-brand text-white shadow-elevated">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">FinFlow</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              AI · v2.6
            </div>
          </div>
        </Link>
        <nav aria-label="Primary" className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 -z-10 rounded-2xl gradient-primary shadow-elevated"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon className="size-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-brand-pink px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 rounded-2xl border border-glass-border bg-accent/40 p-3">
          <div className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl gradient-brand text-white text-xs font-bold">
              MW
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">Maya Winters</div>
              <div className="truncate text-[11px] text-muted-foreground">Pro · $28.4k saved</div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Primary"
        className="glass-strong fixed bottom-3 left-3 right-3 z-40 flex items-center justify-around rounded-2xl p-2 lg:hidden"
      >
        {NAV.slice(0, 5).map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground",
              )}
              aria-label={item.label}
            >
              <item.icon className="size-4" />
              <span className="truncate">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
