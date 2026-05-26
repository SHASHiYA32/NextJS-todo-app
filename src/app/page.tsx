import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-border/80 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">StudyFlow</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              Smart Study Planner for modern students.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Organize tasks, track sessions, manage notes, and keep your momentum with a polished productivity dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                <Sparkles className="h-4 w-4" /> New productivity workflow
              </span>
              <h2 className="text-3xl font-semibold sm:text-4xl">Build better study habits with personalized planning.</h2>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                StudyFlow brings planner-style dashboards, calendar drag-and-drop, notes, timelines, and performance tracking into one clean student workspace.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard">
                <Button className="rounded-full px-6 py-3 text-sm font-semibold">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="rounded-full px-6 py-3 text-sm font-semibold">
                  Login
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Tasks & Priorities", description: "Organize study items by deadline, category, and priority.", icon: BookOpen },
                { title: "Calendar planning", description: "Drag tasks into dates and reschedule without friction.", icon: CalendarDays },
                { title: "Notes & habits", description: "Keep revision notes and habit streaks in one place.", icon: ShieldCheck },
              ].map((feature) => (
                <Card key={feature.title} className="rounded-3xl border border-border/80 bg-card/80 p-6 shadow-sm">
                  <CardHeader className="p-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="mt-4 text-lg font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 pt-3 text-sm text-muted-foreground">{feature.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-2xl shadow-black/5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Preview</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Live UI</span>
                </div>
                <div className="h-48 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-muted/30 p-4 shadow-inner">
                  <div className="h-full rounded-3xl border border-dashed border-border/60 bg-background/90 p-4 text-sm text-muted-foreground">
                    Screenshot placeholder for dashboard panels and schedule timeline.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border/80 bg-card/80 p-10 shadow-sm shadow-black/5">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Designed for students</p>
              <h3 className="text-2xl font-semibold">Everything you need to stay ahead.</h3>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>StudyFlow helps you structure focus time, track progress, and manage deadlines inside a modern dashboard optimized for both desktop and mobile.</p>
              <p>Move tasks with simple drag gestures, pin notes, and review weekly progress with clean charts and cards.</p>
            </div>
            <div className="grid gap-3">
              <div className="rounded-3xl bg-primary/5 p-4 text-sm font-medium text-primary">Notebook-inspired productivity</div>
              <div className="rounded-3xl bg-secondary/5 p-4 text-sm font-medium text-secondary">Dark mode ready with smooth transitions</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
