"use client"

import { useEffect, useMemo, useState } from "react";
import { Plus, PieChart, Tag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { getCategories, getTasks, insertCategory } from "@/lib/db";
import type { Category, Task } from "@/types";

const defaultColors = [
  "from-sky-500 to-indigo-500",
  "from-emerald-500 to-teal-500",
  "from-fuchsia-500 to-pink-500",
  "from-amber-500 to-orange-500",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState(defaultColors[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) {
        setError("Please sign in to view your categories.");
        setLoading(false);
        return;
      }

      const [fetchedCategories, fetchedTasks] = await Promise.all([getCategories(userId), getTasks(userId)]);
      setCategories(fetchedCategories);
      setTasks(fetchedTasks);
      setLoading(false);
    };

    loadData();
  }, []);

  const categoryCounts = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        taskCount: tasks.filter((task) => task.category === category.name).length,
      })),
    [categories, tasks]
  );

  const handleAddCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryName.trim()) return;

    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    const newCategory = await insertCategory(userId, categoryName.trim(), categoryColor);
    if (!newCategory) {
      setError("Unable to add category. Please try again.");
      return;
    }

    setCategories((prev) => [...prev, newCategory]);
    setCategoryName("");
    setError(null);
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Categories</p>
        <h1 className="text-3xl font-semibold">Your study categories</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Track your subject groups and see how many tasks are assigned to each focus area.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
            <CardHeader className="p-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Add category</p>
                  <CardTitle className="mt-2 text-xl font-semibold">Create a new subject area</CardTitle>
                </div>
                <div className="rounded-3xl bg-primary/10 p-3 text-primary">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-6 grid gap-4">
              <form className="grid gap-4" onSubmit={handleAddCategory}>
                <div className="grid gap-2">
                  <Label htmlFor="categoryName">Category name</Label>
                  <Input id="categoryName" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="e.g. Mathematics" />
                </div>
                <div className="grid gap-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {defaultColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCategoryColor(color)}
                        className={`h-12 rounded-3xl text-white ${color} ${categoryColor === color ? "ring-2 ring-offset-2 ring-primary" : "opacity-90"}`}
                      />
                    ))}
                  </div>
                </div>
                <Button type="submit" className="rounded-full px-6 py-3 text-sm font-semibold">
                  Add category
                </Button>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
              </form>
            </CardContent>
          </Card>

          {loading ? (
            <div className="rounded-[2rem] border border-border/80 bg-card/90 p-6 text-sm text-muted-foreground">Loading your categories…</div>
          ) : (
            <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold">Category distribution</CardTitle>
              </CardHeader>
              <div className="grid gap-3">
                {categoryCounts.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-border/60 bg-background/80 p-6 text-center text-sm text-muted-foreground">Create the first category to track your study tasks.</div>
                ) : (
                  categoryCounts.map((category) => (
                    <div key={category.id} className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 p-4">
                      <span>{category.name}</span>
                      <span className="text-sm text-muted-foreground">{category.taskCount} tasks</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="grid gap-6">
          <section className="grid gap-6">
            <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
              <div className="flex items-center gap-3">
                <PieChart className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Project summary</p>
                  <h2 className="mt-2 text-xl font-semibold">Category distribution</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                {categoryCounts.map((category) => (
                  <div key={category.id} className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 p-4">
                    <span>{category.name}</span>
                    <span className="text-sm text-muted-foreground">{category.taskCount} tasks</span>
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
                <div className="rounded-3xl bg-primary/10 p-4 text-sm font-medium text-primary">Keep categories balanced by adding one task to your least active subject.</div>
                <div className="rounded-3xl bg-muted/70 p-4 text-sm text-muted-foreground">Use category labels to separate study blocks and avoid overload.</div>
              </div>
            </Card>
          </section>
        </div>
      </section>
    </div>
  );
}
