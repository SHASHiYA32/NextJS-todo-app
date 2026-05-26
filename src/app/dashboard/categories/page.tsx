import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories, tasks } from "@/mock/data";
import { PieChart, Tag, BookOpen } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Categories</p>
        <h1 className="text-3xl font-semibold">Your study categories</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Track your subject groups and see how many tasks are assigned to each focus area.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {categories.map((category) => {
          const count = tasks.filter((task) => task.category === category.name).length;
          return (
            <Card key={category.id} className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
              <CardHeader className="p-0">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{category.name}</p>
                    <CardTitle className="mt-2 text-xl font-semibold">{count} Tasks</CardTitle>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${category.color} text-white`}>
                    <Tag className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-6 text-sm text-muted-foreground">Keep your progress inside this category moving by scheduling study sessions and checking deadlines regularly.</CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <div className="flex items-center gap-3">
            <PieChart className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Project summary</p>
              <h2 className="mt-2 text-xl font-semibold">Category distribution</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 p-4">
                <span>{category.name}</span>
                <span className="text-sm text-muted-foreground">{tasks.filter((task) => task.category === category.name).length} tasks</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Focus area</p>
              <h2 className="mt-2 text-xl font-semibold">Top priority categories</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <div className="rounded-3xl bg-primary/10 p-4 text-sm font-medium text-primary">Programming & Math are receiving the most task time this week.</div>
            <div className="rounded-3xl bg-muted/70 p-4 text-sm text-muted-foreground">Add a task to low-priority categories to balance your schedule.</div>
          </div>
        </Card>
      </section>
    </div>
  );
}
