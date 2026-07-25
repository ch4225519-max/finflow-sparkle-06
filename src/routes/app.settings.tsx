import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings · FinFlow AI" },
      { name: "description", content: "Manage your profile, security, notifications and preferences." },
      { property: "og:title", content: "Settings · FinFlow AI" },
      { property: "og:description", content: "Manage your profile, security, notifications and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div>
      <TopBar title="Settings" subtitle="Fine-tune FinFlow to how you like it." />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-strong rounded-3xl p-6">
          <h2 className="text-base font-semibold">Profile</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-2xl gradient-brand text-xl font-bold text-white">
              MW
            </div>
            <div>
              <div className="font-semibold">Maya Winters</div>
              <div className="text-xs text-muted-foreground">Pro plan · joined Feb 2024</div>
            </div>
            <Button variant="glass" className="ml-auto">Change avatar</Button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Full name" defaultValue="Maya Winters" />
            <Field label="Email" defaultValue="maya@finflow.app" />
            <Field label="Currency" defaultValue="USD ($)" />
            <Field label="Language" defaultValue="English (US)" />
          </div>
        </section>

        <section className="glass-strong rounded-3xl p-6">
          <h2 className="text-base font-semibold">Preferences</h2>
          <div className="mt-4 space-y-3">
            <Row label="Dark mode" desc="Follow the vibe of your OS or force it here.">
              <ThemeToggle />
            </Row>
            <Row label="Reduce motion" desc="Respect the OS setting for animations.">
              <Switch defaultChecked />
            </Row>
            <Row label="Weekly AI briefing" desc="Sunday recap of your money moves.">
              <Switch defaultChecked />
            </Row>
            <Row label="Budget alerts" desc="Ping me when a category hits 80%.">
              <Switch defaultChecked />
            </Row>
            <Row label="Biometric unlock" desc="Face ID / Touch ID before opening the app.">
              <Switch />
            </Row>
          </div>
        </section>

        <section className="glass-strong rounded-3xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold">Security</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Field label="Current password" type="password" defaultValue="••••••••" />
            <Field label="New password" type="password" placeholder="At least 12 chars" />
            <Field label="Confirm" type="password" placeholder="Repeat new password" />
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="hero">Update password</Button>
            <Button variant="glass">Enable 2FA</Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <Label className="mb-1 block text-xs text-muted-foreground">{label}</Label>
      <Input {...props} className="h-10 rounded-xl bg-background/60" />
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-accent/30 p-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      {children}
    </div>
  );
}
