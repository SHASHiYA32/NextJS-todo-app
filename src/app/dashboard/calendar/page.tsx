"use client"

import { useEffect, useMemo, useState, type HTMLAttributes } from "react";
import { DndContext, DragOverlay, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isToday } from "date-fns";
import { CalendarDays, Clock3, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "@/components/task-card";
import { supabase } from "@/lib/supabase";
import { getTasks, updateTask } from "@/lib/db";
import type { Task } from "@/types";

const formatKey = (date: Date) => format(date, "yyyy-MM-dd");

export default function CalendarPage() {
  const [items, setItems] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) return;
      const fetchedTasks = await getTasks(userId);
      setItems(fetchedTasks);
    };

    loadTasks();
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const selectedKey = formatKey(selectedDay);
  const selectedTasks = useMemo(() => items.filter((task) => task.deadline === selectedKey), [items, selectedKey]);
  const upcoming = useMemo(() => items.filter((task) => task.status !== "Completed").slice(0, 5), [items]);
  const activeTask = activeId ? items.find((task) => task.id === activeId) : null;

  const TaskPreview = ({ task }: { task: Task }) => (
    <div className="rounded-3xl border border-border bg-background p-4 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold">{task.title}</p>
          <p className="text-sm text-muted-foreground">Deadline {task.deadline}</p>
        </div>
        <div className="rounded-full bg-muted/80 px-3 py-1 text-xs font-semibold text-muted-foreground">{task.status}</div>
      </div>
    </div>
  );

  const handleDragStart = ({ active }: { active: any }) => setActiveId(active.id);

  const handleDragEnd = async ({ active, over }: { active: any; over: any }) => {
    setActiveId(null);
    if (!over) return;
    const destination = over.id as string;
    if (!destination.startsWith("day-")) return;
    const newDeadline = destination.replace("day-", "");
    setItems((prev) => prev.map((task) => (task.id === active.id ? { ...task, deadline: newDeadline } : task)));
    await updateTask(active.id, { deadline: newDeadline });
  };

  function CustomDay({ day, modifiers, ...props }: { day: { date: Date }; modifiers: any } & HTMLAttributes<HTMLTableCellElement>) {
    const dateId = `day-${formatKey(day.date)}`;
    const { setNodeRef, isOver } = useDroppable({ id: dateId });
    const dayTasks = items.filter((task) => task.deadline === formatKey(day.date));

    return (
      <td
        ref={setNodeRef}
        className={`${props.className ?? ""} align-top p-0 transition ${isOver ? "ring-2 ring-primary/40 bg-primary/10" : ""}`}
        {...props}
      >
        <div className={`flex h-full flex-col justify-between rounded-3xl border border-border/60 p-3 ${isToday(day.date) ? "bg-primary/5" : "bg-background"}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{format(day.date, "d")}</span>
            <span className="text-xs text-muted-foreground">{format(day.date, "EEE")}</span>
          </div>
          <div className="mt-3 space-y-1">
            {dayTasks.slice(0, 2).map((task) => (
              <span key={task.id} className="block rounded-full bg-muted/70 px-2 py-1 text-[11px] text-muted-foreground">
                {task.title}
              </span>
            ))}
            {dayTasks.length > 2 && <span className="text-[11px] text-muted-foreground">+{dayTasks.length - 2} more</span>}
          </div>
        </div>
      </td>
    );
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Calendar</p>
        <h1 className="text-3xl font-semibold">Monthly schedule</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Drag tasks onto dates to reschedule deadlines and keep your agenda up to date.</p>
      </section>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
            <CardHeader className="p-0">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">Drag tasks into the calendar</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="mt-6 space-y-6">
              <div className="rounded-[2rem] border border-border/70 bg-background/80 p-4">
                <DayPicker selected={selectedDay} onSelect={(day) => day && setSelectedDay(day)} mode="single" components={{ Day: CustomDay }} className="rounded-3xl" />
              </div>
              <div className="rounded-[2rem] border border-border/70 bg-background/80 p-4">
                <p className="text-sm font-medium">Selected day tasks</p>
                <div className="mt-4 space-y-3">
                  {selectedTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
                  ) : (
                    selectedTasks.map((task) => <TaskCard key={task.id} task={task} />)
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Deadline board</p>
                <h2 className="mt-2 text-xl font-semibold">Upcoming tasks</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {upcoming.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
            <div className="mt-6 rounded-3xl bg-muted/80 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                Drag a task from the list onto a calendar day to update its deadline.
              </div>
            </div>
          </Card>
        </section>

        <DragOverlay>{activeTask ? <TaskPreview task={activeTask} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
