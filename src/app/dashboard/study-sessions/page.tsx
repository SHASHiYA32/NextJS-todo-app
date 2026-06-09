"use client"

import { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw, Clock3, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudySessions, getUserId } from "@/lib/db";
import type { Session } from "@/types";

export default function StudySessionsPage() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const userId = await getUserId();
      if (!userId) return;
      const data = await getStudySessions(userId);
      setSessions(data);
    };

    loadSessions();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((prev) => Math.max(prev - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (seconds === 0 && running) {
      setRunning(false);
    }
  }, [seconds, running]);

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  const totalStudyTime = useMemo(() => sessions.reduce((sum, session) => sum + (session.completed ? 60 : 0), 0), [sessions]);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Study Sessions</p>
        <h1 className="text-3xl font-semibold">Pomodoro productivity</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Use the timer to focus on single study blocks, then review your session history for momentum.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-8 shadow-sm shadow-black/5">
          <CardHeader className="p-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Timer</p>
                <CardTitle className="mt-2 text-4xl font-semibold">{minutes.toString().padStart(2, "0")}:{remainder.toString().padStart(2, "0")}</CardTitle>
              </div>
              <div className="flex items-center gap-2 rounded-3xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4" /> Focus mode
              </div>
            </div>
          </CardHeader>
          <CardContent className="mt-8 space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <Button className="rounded-full px-5 py-3 text-sm font-semibold" onClick={() => setRunning(true)}>
                <Play className="mr-2 h-4 w-4" /> Start
              </Button>
              <Button variant="outline" className="rounded-full px-5 py-3 text-sm font-semibold" onClick={() => setRunning(false)}>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </Button>
              <Button variant="ghost" className="rounded-full px-5 py-3 text-sm font-semibold" onClick={() => { setRunning(false); setSeconds(25 * 60); }}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
            <div className="grid gap-4 rounded-[2rem] border border-border/70 bg-background/80 p-6">
              <p className="text-sm text-muted-foreground">Today’s study time</p>
              <p className="text-3xl font-semibold">{totalStudyTime} min</p>
              <p className="text-sm text-muted-foreground">Keep focusing and your total study time will grow with each completed session.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <div className="flex items-center gap-3">
            <ListChecks className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Session history</p>
              <h2 className="mt-2 text-xl font-semibold">Recent blocks</h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-3xl border border-border/70 bg-background/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{session.subject}</p>
                    <p className="text-sm text-muted-foreground">{session.start} – {session.end}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${session.completed ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"}`}>
                    {session.completed ? "Complete" : "In progress"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
