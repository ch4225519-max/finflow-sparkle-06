import { Search, Bell, Command } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div className="glass hidden items-center gap-2 rounded-2xl px-3 py-2 text-sm text-muted-foreground md:flex">
          <Search className="size-4" />
          <span>Search transactions, friends…</span>
          <kbd className="ml-6 flex items-center gap-1 rounded-md border border-glass-border bg-background/50 px-1.5 py-0.5 text-[10px]">
            <Command className="size-3" />K
          </kbd>
        </div>
        <Button variant="glass" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
      </div>
    </header>
  );
}
