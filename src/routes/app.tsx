import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/app-sidebar";
import { AnimatedBackground } from "@/components/animated-background";
import { Toaster } from "sonner";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="relative min-h-dvh">
      <AnimatedBackground />
      <div className="mx-auto flex max-w-[1600px] gap-4 p-4 pb-24 lg:pb-4">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" theme="system" richColors />
    </div>
  );
}
