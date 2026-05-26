import { BarChart3, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { progressMetrics, tasks } from "@/mock/data";

export default function ProgressPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Progress</p>
        <h1 className="text-3xl font-semibold">Study performance</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Review completion percentages, weekly momentum, and category performance across your study plan.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {progressMetrics.map((metric) => (
          <Card key={metric.title} className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
            <CardHeader className="p-0">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  {metric.title.includes("Completion") ? <CheckCircle2 className="h-5 w-5" /> : metric.title.includes("Weekly") ? <TrendingUp className="h-5 w-5" /> : metric.title.includes("Streak") ? <Sparkles className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{metric.title}</p>
                  <CardTitle className="mt-2 text-2xl font-semibold">{metric.value}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-6 text-sm text-muted-foreground">{metric.description}</CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Completion</p>
              <h2 className="mt-2 text-xl font-semibold">Category performance</h2>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="rounded-3xl border border-border/70 bg-background/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{task.title}</p>
                  <span className="text-sm text-muted-foreground">{task.priority}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted/30">
                  <div className="h-full w-3/4 rounded-full bg-primary" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Milestones</p>
              <h2 className="mt-2 text-xl font-semibold">Weekly goals</h2>
            </div>
          </div>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <p>Finish 5 tasks by Friday to maintain your streak.</p>
            <p>Review the timeline and reschedule any overdue assignments for tomorrow.</p>
          </div>
        </Card>
      </section>
    </div>
  );
}
