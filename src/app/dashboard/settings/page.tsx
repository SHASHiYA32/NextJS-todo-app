"use client"

import { useEffect, useState } from "react";
import { Bell, Globe2, User, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { getNotifications, getProfile, getUserId, upsertProfile } from "@/lib/db";
import type { NotificationItem, UserProfile } from "@/types";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [language, setLanguage] = useState("English");
  const [preferredEmail, setPreferredEmail] = useState(true);
  const [preferredMobile, setPreferredMobile] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);

    const loadSettings = async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) return;

      setUserEmail(data.session?.user.email ?? null);
      const profileData = await getProfile(userId);
      if (profileData) {
        setProfile(profileData);
      }

      const notificationsData = await getNotifications(userId);
      setNotifications(notificationsData);
    };

    loadSettings();
  }, []);

  const handleSaveProfile = async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId || !profile) return;

    setSaving(true);
    const saved = await upsertProfile(userId, {
      name: profile.name,
      role: profile.role,
      avatarUrl: profile.avatarUrl,
    });
    setSaving(false);

    if (saved) {
      setProfile(saved);
      setSaveStatus("Profile saved.");
      window.setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus("Error saving profile. Try again.");
    }
  };

  const handleToggleNotificationPreference = (type: "email" | "mobile") => {
    if (type === "email") {
      setPreferredEmail((prev) => !prev);
    } else {
      setPreferredMobile((prev) => !prev);
    }
  };

  const formatTime = (time: string) => new Date(time).toLocaleString();


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
            <div className="grid gap-4 sm:grid-cols-[120px_1fr] items-center">
              <div className="rounded-3xl border border-border/80 bg-background/90 p-4 text-center">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Profile avatar" className="mx-auto h-20 w-20 rounded-full object-cover" />
                ) : (
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">A</div>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Avatar URL</Label>
                  <Input value={profile?.avatarUrl ?? ""} onChange={(event) => setProfile((prev) => ({ ...(prev ?? { name: "", role: "Student Planner", email: null, avatarUrl: null }), avatarUrl: event.target.value }))} placeholder="https://example.com/avatar.jpg" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Display name</Label>
                  <Input value={profile?.name ?? ""} onChange={(event) => setProfile((prev) => ({ ...(prev ?? { name: "", role: "Student Planner", email: null, avatarUrl: null }), name: event.target.value }))} placeholder="Nim Flow" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Role</Label>
                  <Input value={profile?.role ?? "Student Planner"} disabled readOnly placeholder="Student Planner" />
                  <p className="text-xs text-muted-foreground">Role is managed by administrators and cannot be changed here.</p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Email</Label>
              <Input value={userEmail ?? ""} readOnly />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleSaveProfile} disabled={saving || !profile} className="rounded-full px-6 py-3 text-sm font-semibold">
                {saving ? "Saving..." : "Save profile"}
              </Button>
              {saveStatus ? <p className="text-sm text-muted-foreground">{saveStatus}</p> : null}
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
            <label className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 px-4 py-3 cursor-pointer">
              <span>Email alerts</span>
              <input type="checkbox" checked={preferredEmail} onChange={() => handleToggleNotificationPreference("email")} className="h-5 w-5 rounded-full border-border text-primary" />
            </label>
            <label className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 px-4 py-3 cursor-pointer">
              <span>Mobile push</span>
              <input type="checkbox" checked={preferredMobile} onChange={() => handleToggleNotificationPreference("mobile")} className="h-5 w-5 rounded-full border-border text-primary" />
            </label>
            {notifications.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-border/60 bg-background/80 p-4 text-sm text-muted-foreground">No notifications yet. New reminders will appear here once they are created.</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="rounded-3xl border border-border/70 bg-background/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{notification.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatTime(notification.time)}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${notification.read ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary"}`}>
                        {notification.read ? "Read" : "New"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                ))}
              </div>
            )}
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
