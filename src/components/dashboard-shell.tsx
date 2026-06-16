"use client"

import Link from "next/link";
import { getActiveAnnouncements, getNotifications, getProfile, markNotificationRead } from "@/lib/db";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  Grid,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  Timer,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tasks", label: "Tasks", icon: ListChecks },
  { href: "/dashboard/study-sessions", label: "Study Sessions", icon: Timer },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard/notes", label: "Notes", icon: MessageSquare },
  { href: "/dashboard/categories", label: "Categories", icon: Grid },
  { href: "/dashboard/progress", label: "Progress", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck },
  { href: "/dashboard/schedule", label: "Schedule", icon: CheckSquare },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [profile, setProfile] = useState<{ name: string; role: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session?.user.id) {
        const profileData = await getProfile(data.session.user.id);
        if (profileData) {
          setProfile({ name: profileData.name, role: profileData.role });
        }
        const [notifData, announcementData] = await Promise.all([
          getNotifications(data.session.user.id),
          getActiveAnnouncements(),
        ]);
        const announcementNotifications = announcementData.map((ann) => ({
          id: `ann-${ann.id}`,
          title: ann.title,
          description: ann.message,
          read: false,
          time: ann.createdAt,
        }));
        setNotifications(
          [...notifData, ...announcementNotifications].sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
          )
        );
      }
    };

    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const userName = profile?.name || session?.user.user_metadata?.full_name || session?.user.email || "StudyFlow";
  const userRole = profile?.role || session?.user.user_metadata?.role || "Student Planner";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSidebarOpen(false);
    router.push(`/dashboard/tasks?search=${encodeURIComponent(query)}`);
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read && typeof notification.id === "string") {
      if (notification.id.startsWith("ann-")) {
        setNotifications((prev) => prev.map((item) => (item.id === notification.id ? { ...item, read: true } : item)));
      } else {
        await markNotificationRead(notification.id);
        setNotifications((prev) => prev.map((item) => (item.id === notification.id ? { ...item, read: true } : item)));
      }
    }
    setShowNotifications(false);
  };

  const filteredNavItems = navItems.filter((item) => item.href !== "/dashboard/admin" || profile?.role?.toLowerCase().includes("admin"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative flex min-h-screen overflow-hidden">
        <div
          className={cn(
            "fixed inset-0 z-20 bg-slate-950/40 transition-opacity duration-300 md:hidden",
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          onClick={() => setSidebarOpen(false)}
        />

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-full max-w-xs sm:max-w-sm md:w-80 lg:w-96 transform border-r border-border/70 bg-card/95 backdrop-blur-xl transition duration-300 ease-in-out md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="flex h-full flex-col overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">StudyFlow</p>
                <h1 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">Smart Planner</h1>
              </div>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
                <ChevronDown className="h-5 w-5" />
              </Button>
            </div>

            <nav className="space-y-1 sm:space-y-2">
              {filteredNavItems.map((item) => {
                const ActiveIcon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-3xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition hover:bg-primary/10 hover:text-primary",
                      active ? "bg-primary/10 text-primary" : "text-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <ActiveIcon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 sm:space-y-4 border-t border-border/70 pt-4 sm:pt-6">
              <div className="rounded-3xl border border-border/70 bg-background/80 p-3 sm:p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Active Profile</p>
                <div className="mt-3 sm:mt-4 flex items-center gap-3 min-w-0">
                  <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary shrink-0">
                    <User className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{userName}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{userRole}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <ThemeToggle />
                {profile && profile.role?.toLowerCase().includes("admin") ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/admin">Admin</Link>
                  </Button>
                ) : null}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col md:pl-80 lg:pl-96 w-full min-w-0">
          <header className="sticky top-0 z-10 border-b border-border/70 bg-background/95 backdrop-blur-xl px-3 sm:px-4 lg:px-8 py-3 sm:py-4 shadow-sm shadow-transparent">
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setSidebarOpen(true)}>
                  <LayoutDashboard className="h-4 sm:h-5 w-4 sm:w-5" />
                </Button>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Welcome back, {userName}</p>
                  <h2 className="text-lg sm:text-xl font-semibold truncate">Your study hub</h2>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-48 sm:min-w-64">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search tasks, notes..."
                    className="w-full rounded-3xl border border-border bg-background/80 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </form>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="inline-flex shrink-0 relative"
                    onClick={() => setShowNotifications((prev) => !prev)}
                  >
                    <Bell className="h-4 w-4" />
                    {notifications.some((notification) => !notification.read) && (
                      <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card" />
                    )}
                  </Button>
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border/80 bg-card/95 shadow-lg z-50 max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">No notifications</div>
                      ) : (
                        <div className="divide-y divide-border/50">
                          {notifications.slice(0, 5).map((notification) => (
                            <button
                              key={notification.id}
                              type="button"
                              className="w-full text-left p-4 hover:bg-muted/50 transition"
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold text-sm">{notification.title}</p>
                                <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${notification.read ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary"}`}>
                                  {notification.read ? "Read" : "New"}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.description}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <ThemeToggle />
                <button className="inline-flex items-center gap-2 rounded-3xl border border-border/70 bg-card px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition hover:border-primary/80 hover:text-primary shrink-0">
                  <div className="flex h-6 sm:h-8 w-6 sm:w-8 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <User className="h-3 sm:h-4 w-3 sm:w-4" />
                  </div>
                  <span className="hidden sm:inline truncate">{userName}</span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-3 sm:px-4 lg:px-8 py-4 sm:py-6 overflow-y-auto w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
