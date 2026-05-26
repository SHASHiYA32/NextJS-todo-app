"use client"

import { useEffect, useState } from "react";
import { Moon, SunMedium, Laptop2, Bell, Globe2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, mobile: false });
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Settings</p>
        <h1 className="text-3xl font-semibold">Personalize your planner</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Change theme preferences, notification controls, and profile settings for a better study experience.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <CardHeader className="p-0">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Profile settings</p>
                <CardTitle className="mt-2 text-xl font-semibold">Account overview</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-6 space-y-6">
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Name</Label>
              <input className="rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none" placeholder="Nim Flow" />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Email</Label>
              <input className="rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none" placeholder="nim@studyflow.com" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <CardHeader className="p-0">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Notifications</p>
                <CardTitle className="mt-2 text-xl font-semibold">Stay informed</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-6 space-y-4 text-sm text-muted-foreground">
            <label className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 px-4 py-3">
              <span>Email alerts</span>
              <input type="checkbox" checked={notifications.email} onChange={() => setNotifications((prev) => ({ ...prev, email: !prev.email }))} className="h-5 w-5 rounded-full border-border text-primary" />
            </label>
            <label className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 px-4 py-3">
              <span>Mobile push</span>
              <input type="checkbox" checked={notifications.mobile} onChange={() => setNotifications((prev) => ({ ...prev, mobile: !prev.mobile }))} className="h-5 w-5 rounded-full border-border text-primary" />
            </label>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <div className="flex items-center gap-3">
            <SunMedium className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Theme</p>
              <h2 className="mt-2 text-xl font-semibold">Appearance mode</h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 px-4 py-3">
              <span>Light</span>
              <input type="radio" name="theme" value="light" checked={theme === "light"} onChange={() => setTheme("light")} className="h-5 w-5" />
            </label>
            <label className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 px-4 py-3">
              <span>Dark</span>
              <input type="radio" name="theme" value="dark" checked={theme === "dark"} onChange={() => setTheme("dark")} className="h-5 w-5" />
            </label>
            <label className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 px-4 py-3">
              <span>System</span>
              <input type="radio" name="theme" value="system" checked={theme === "system"} onChange={() => setTheme("system")} className="h-5 w-5" />
            </label>
            <p className="text-sm text-muted-foreground">Current theme: {mounted ? resolvedTheme : "loading..."}</p>
          </div>
        </Card>

        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <div className="flex items-center gap-3">
            <Globe2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Language</p>
              <h2 className="mt-2 text-xl font-semibold">Default language</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
            <p className="text-sm text-muted-foreground">Choose a display language for your planner interface.</p>
          </div>
        </Card>
      </section>
    </div>
  );
}
