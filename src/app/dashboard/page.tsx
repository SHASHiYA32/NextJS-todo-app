"use client"

import { useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, CheckCircle2, Clock3, Sparkles, Trophy, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/stats-card";
import { TaskCompletionChart, StudySessionsChart, ProductivityTrendChart } from "@/components/charts";
import { getNotes, getProfile, getTasks, getUserId } from "@/lib/db";
import type { Note, UserProfile, Task } from "@/types";

export default function DashboardPage() {
  const [viewFullReports, setViewFullReports] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const userId = await getUserId();
      if (!userId) return;

      const [profileData, tasksData, notesData] = await Promise.all([getProfile(userId), getTasks(userId), getNotes(userId)]);
      setProfile(profileData);
      setTasks(tasksData);
      setNotes(notesData);
    };

    loadDashboard();
  }, []);

  const completedToday = useMemo(() => tasks.filter((task) => task.status === "Completed").length, [tasks]);
  const pendingTasks = useMemo(() => tasks.filter((task) => task.status !== "Completed").length, [tasks]);
  const upcomingDeadlines = useMemo(() => tasks.filter((task) => task.status !== "Completed").slice(0, 3), [tasks]);
  const completionRate = useMemo(() => (tasks.length ? `${Math.round((completedToday / tasks.length) * 100)}%` : "0%"), [tasks.length, completedToday]);
  const estimatedStudyTime = useMemo(() => tasks.reduce((sum, task) => sum + Number(task.estimatedStudyTime ?? 0), 0), [tasks]);
  const taskStreak = useMemo(() => `${Math.min(7, completedToday)} days`, [completedToday]);

  const progressMetrics = [
    {
      title: "Completion rate",
      value: completionRate,
      trend: `${completedToday} done`,
      description: "Share of tasks completed.",
    },
    {
      title: "Pending tasks",
      value: `${pendingTasks}`,
      trend: `${tasks.length} active`,
      description: "Active items waiting for attention.",
    },
    {
      title: "Study time",
      value: `${estimatedStudyTime} min`,
      trend: "Estimated focus",
      description: "Total estimated study time.",
    },
    {
      title: "Task streak",
      value: taskStreak,
      trend: "Keep momentum",
      description: "Consistent days with completed tasks.",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      {/* Welcome Section with Gradient */}
      <section className="grid gap-4 sm:gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-linear-to-br from-primary/20 via-card/90 to-card/90 p-6 sm:p-8 shadow-xl shadow-black/5 overflow-hidden relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/40 to-transparent"></div>
          </div>
          <CardHeader className="p-0 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Welcome back</p>
                <CardTitle className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">Hello, {profile?.name ?? "Student"}</CardTitle>
                <p className="mt-2 sm:mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground">Your study plan is organized, your deadlines are visible, and your next session is ready.</p>
              </div>
              <div className="rounded-full bg-linear-to-br from-primary/40 to-primary/20 p-3 sm:p-4 text-primary shrink-0">
                <Sparkles className="h-6 sm:h-7 w-6 sm:w-7" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:gap-6 pt-6 sm:pt-8 lg:grid-cols-2 relative z-10">
            <div className="grid gap-3 rounded-xl sm:rounded-[1.75rem] border border-border/70 bg-linear-to-br from-emerald-500/10 to-background/80 p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Today's streak</p>
                  <p className="mt-2 text-2xl sm:text-3xl font-semibold text-emerald-400">7 days</p>
                </div>
                <div className="flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-3xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-6 sm:h-6 w-6 sm:w-6" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Keep the flow going with focused sessions and consistent check-ins.</p>
            </div>
            <div className="grid gap-3 rounded-xl sm:rounded-[1.75rem] border border-border/70 bg-linear-to-br from-sky-500/10 to-background/80 p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Productivity score</p>
                  <p className="mt-2 text-2xl sm:text-3xl font-semibold text-sky-400">92</p>
                </div>
                <div className="flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-3xl bg-sky-500/20 text-sky-400 shrink-0">
                  <TrendingUp className="h-6 sm:h-6 w-6 sm:w-6" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Your study rhythm is strong. Review today's tasks and prepare for the next block.</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6">
          <StatsCard icon={<Zap className="h-6 w-6" />} title="Tasks completed" value={`${completedToday}`} description="Completed during today's session" />
          <StatsCard icon={<CalendarDays className="h-6 w-6" />} title="Pending tasks" value={`${pendingTasks}`} description="Active items waiting for attention" />
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-card/90 p-4 sm:p-8 shadow-lg shadow-black/5">
          <CardHeader className="p-0 mb-4 sm:mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Weekly analytics</p>
                <CardTitle className="mt-2 text-lg sm:text-2xl font-semibold">Task completion</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
              <div className="w-full min-w-full px-4 sm:px-0">
                <TaskCompletionChart />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-card/90 p-4 sm:p-8 shadow-lg shadow-black/5">
          <CardHeader className="p-0 mb-4 sm:mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Study progress</p>
                <CardTitle className="mt-2 text-lg sm:text-2xl font-semibold">Monthly hours</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
              <div className="w-full min-w-full px-4 sm:px-0">
                <StudySessionsChart />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Productivity Trend */}
      <section className="grid gap-4 sm:gap-6">
        <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-card/90 p-4 sm:p-8 shadow-lg shadow-black/5">
          <CardHeader className="p-0 mb-4 sm:mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Performance</p>
                <CardTitle className="mt-2 text-lg sm:text-2xl font-semibold">Productivity trend</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
              <div className="w-full min-w-full px-4 sm:px-0">
                <ProductivityTrendChart />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-card/90 p-4 sm:p-8 shadow-lg shadow-black/5">
          <CardHeader className="p-0 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Weekly progress</p>
                <CardTitle className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold">Progress metrics</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => setViewFullReports(!viewFullReports)}>
                View Reports
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 grid gap-4 sm:gap-6 lg:grid-cols-2">
            {progressMetrics.map((metric) => (
              <div key={metric.title} className="rounded-xl sm:rounded-[1.5rem] border border-border/70 bg-linear-to-br from-primary/5 to-background/80 p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-muted-foreground">{metric.title}</p>
                <div className="mt-2 sm:mt-3 flex items-baseline justify-between gap-3">
                  <p className="text-2xl sm:text-3xl font-semibold">{metric.value}</p>
                  <span className="rounded-full bg-primary/10 px-2 sm:px-3 py-1 text-xs font-medium text-primary">{metric.trend}</span>
                </div>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">{metric.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6">
          {/* Upcoming Deadlines */}
          <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-card/90 p-4 sm:p-6 shadow-lg shadow-black/5">
            <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Upcoming</p>
                <h3 className="mt-1 text-base sm:text-xl font-semibold">Next tasks</h3>
              </div>
              <BookOpen className="h-5 w-5 text-primary shrink-0" />
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map((task) => (
                <div key={task.id} className="rounded-2xl border border-border/70 bg-linear-to-r from-primary/5 to-transparent p-3 sm:p-4 hover:border-primary/50 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base truncate">{task.title}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{task.category}</p>
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground shrink-0">{task.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Notes */}
          <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-card/90 p-4 sm:p-6 shadow-lg shadow-black/5">
            <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Quick notes</p>
                <h3 className="mt-1 text-base sm:text-xl font-semibold">Study notes</h3>
              </div>
            </div>
            <div className="grid gap-3">
              {notes.slice(0, 3).map((note) => (
                <div key={note.id} className="rounded-2xl bg-linear-to-r from-primary/5 to-transparent p-3 sm:p-4 border border-border/50 hover:border-primary/30 transition">
                  <p className="font-semibold text-sm sm:text-base truncate">{note.title}</p>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-linear-to-br from-blue-500/10 to-card/90 p-4 sm:p-6 shadow-lg shadow-black/5 hover:shadow-xl transition group cursor-pointer">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CalendarDays className="h-5 w-5 text-blue-400 mb-3" />
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Planning</p>
              <p className="mt-2 text-base sm:text-lg font-semibold">Weekly schedule</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition shrink-0 mt-1" />
          </div>
        </Card>

        <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-linear-to-br from-purple-500/10 to-card/90 p-4 sm:p-6 shadow-lg shadow-black/5 hover:shadow-xl transition group cursor-pointer">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Trophy className="h-5 w-5 text-purple-400 mb-3" />
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Achievements</p>
              <p className="mt-2 text-base sm:text-lg font-semibold">Tasks rescheduled</p>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-400">4</div>
          </div>
        </Card>

        <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-linear-to-br from-rose-500/10 to-card/90 p-4 sm:p-6 shadow-lg shadow-black/5 hover:shadow-xl transition group cursor-pointer sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Sparkles className="h-5 w-5 text-rose-400 mb-3" />
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Attention</p>
              <p className="mt-2 text-base sm:text-lg font-semibold">Overdue tasks</p>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-rose-400">1</div>
          </div>
        </Card>
      </section>
    </div>
  );
}
