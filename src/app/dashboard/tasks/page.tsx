"use client"

import { useEffect, useMemo, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, closestCorners, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Search, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaskCard } from "@/components/task-card";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { getCategories, getTasks, insertTask, deleteTask, updateTask, updateTaskOrder } from "@/lib/db";
import type { Task, TaskPriority, TaskStatus } from "@/types";

const statusOrder: TaskStatus[] = ["Pending", "In Progress", "Completed"];
const priorities: TaskPriority[] = ["High", "Medium", "Low"];

export default function TasksPage() {
  const [items, setItems] = useState<Task[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formTask, setFormTask] = useState<Partial<Task>>({ status: "Pending", priority: "Medium" });

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) return;

      const [taskRows, categoryRows] = await Promise.all([getTasks(userId), getCategories(userId)]);
      setItems(taskRows);
      setCategories(categoryRows.map((category) => ({ id: category.id, name: category.name })));
    };

    loadData();
  }, []);

  useEffect(() => {
    const query = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("search") ?? "" : "";
    if (query) setSearchText(query);
  }, []);

  const filteredTasks = useMemo(() => {
    return items.filter((task) => {
      const search = searchText.toLowerCase();
      const matchesText = task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search);
      const matchesStatus = selectedStatus === "All" || task.status === selectedStatus;
      const matchesPriority = selectedPriority === "All" || task.priority === selectedPriority;
      const matchesCategory = selectedCategory === "All" || task.category === selectedCategory;
      return matchesText && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [items, searchText, selectedStatus, selectedPriority, selectedCategory]);

  const grouped = useMemo(() => {
    return statusOrder.map((status) => ({
      status,
      tasks: filteredTasks
        .filter((task) => task.status === status)
        .sort((a, b) => a.order - b.order),
    }));
  }, [filteredTasks]);

  const activeTask = activeId ? items.find((task) => task.id === activeId) : null;

  const DragPreview = ({ task }: { task: Task }) => (
    <div className="rounded-3xl border border-border bg-background p-4 shadow-2xl shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold">{task.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>
        </div>
        <span className="rounded-full bg-muted/80 px-3 py-1 text-xs font-semibold text-muted-foreground">{task.status}</span>
      </div>
    </div>
  );

  const findTask = (id: string | null) => items.find((task) => task.id === id);

  const getContainerId = (id: string | null) => {
    if (!id) return null;
    if (id.startsWith("container-")) {
      return id.replace("container-", "") as TaskStatus;
    }
    const task = findTask(id);
    return task?.status ?? null;
  };

  const TaskColumn = ({ status, tasks }: { status: TaskStatus; tasks: Task[] }) => {
    const { setNodeRef, isOver } = useDroppable({ id: `container-${status}` });

    return (
      <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{status}</p>
            <p className="mt-1 text-lg font-semibold">{tasks.length} Tasks</p>
          </div>
          <span className="rounded-full bg-muted/80 px-3 py-1 text-xs font-semibold text-muted-foreground">Drop here</span>
        </div>
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className={cn("space-y-3 rounded-3xl p-1 transition", isOver ? "ring-2 ring-primary/40" : "")}>
            {tasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border/60 bg-background/80 p-6 text-center text-sm text-muted-foreground">No tasks in this column</div>
            ) : (
              tasks.map((task) => <TaskCard key={task.id} task={task} onDelete={handleDelete} />)
            )}
          </div>
        </SortableContext>
      </Card>
    );
  };

  const handleDragEnd = async ({ active, over }: { active: any; over: any }) => {
    setActiveId(null);
    if (!over) return;
    const activeTask = findTask(active.id);
    const overId = over.id as string;
    const activeContainer = getContainerId(active.id);
    const overContainer = getContainerId(overId);

    if (!activeTask || !overContainer) return;
    if (activeContainer === overContainer && overId !== `container-${overContainer}`) {
      const statusTasks = items.filter((task) => task.status === overContainer).sort((a, b) => a.order - b.order);
      const oldIndex = statusTasks.findIndex((task) => task.id === active.id);
      const newIndex = statusTasks.findIndex((task) => task.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;
      const updatedTasksForStatus = arrayMove(statusTasks, oldIndex, newIndex).map((task, index) => ({ ...task, order: index }));
      const updatedItems = items.map((task) => updatedTasksForStatus.find((updated) => updated.id === task.id) ?? task);
      setItems(updatedItems);
      await updateTaskOrder(updatedTasksForStatus);
      return;
    }

    if (activeContainer !== overContainer) {
      const destinationTasks = items.filter((task) => task.status === overContainer).sort((a, b) => a.order - b.order);
      const updatedDestination = [...destinationTasks, { ...activeTask, status: overContainer as TaskStatus }].map((task, index) => ({ ...task, order: index }));
      const updatedItems = items.map((task) => {
        if (task.id === activeTask.id) {
          return { ...task, status: overContainer as TaskStatus, order: updatedDestination.length - 1 };
        }
        const updated = updatedDestination.find((item) => item.id === task.id);
        return updated ?? task;
      });
      setItems(updatedItems);
      await Promise.all([
        updateTaskOrder(updatedDestination),
        updateTask(activeTask.id, { status: overContainer as TaskStatus, order: updatedDestination.length - 1 }),
      ]);
    }
  };

  const handleDragStart = ({ active }: { active: any }) => {
    setActiveId(active.id);
  };

  const resetForm = () => {
    setFormTask({ status: "Pending", priority: "Medium" });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formTask.title || !formTask.description) return;
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    const categoryName = formTask.category || "Unsorted";
    const selectedCategory = categories.find((category) => category.name === categoryName);
    const fetchTasksForStatus = items.filter((task) => task.status === formTask.status);
    const deadline = formTask.deadline || new Date().toISOString().split("T")[0];
    const newTask = await insertTask(userId, {
      title: formTask.title,
      description: formTask.description,
      deadline,
      category: categoryName,
      categoryId: selectedCategory?.id ?? null,
      priority: formTask.priority as TaskPriority,
      estimatedStudyTime: formTask.estimatedStudyTime || "1h",
      status: formTask.status as TaskStatus,
      order: fetchTasksForStatus.length,
    });

    if (!newTask) return;
    setItems((prev) => [...prev, newTask]);
    setShowModal(false);
    resetForm();
  };

  const handleDelete = async (task: Task) => {
    await deleteTask(task.id);
    setItems((prev) => prev.filter((item) => item.id !== task.id));
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Tasks</p>
          <h1 className="mt-2 text-3xl font-semibold">Your study tasks</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Drag tasks between status columns or reorder them inside each category to keep your planner updated.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon" variant="outline" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button className="rounded-full px-5 py-3 text-sm font-semibold" onClick={() => setShowModal(true)}>
            Add Task
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">Search</p>
              <div className="mt-3 flex items-center gap-2 rounded-3xl border border-border/80 bg-background px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Find a task" />
              </div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">Filter</p>
              <select className="mt-3 w-full rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                <option>All</option>
                {statusOrder.map((status) => (<option key={status}>{status}</option>))}
              </select>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">Category</p>
              <select className="mt-3 w-full rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                <option>All</option>
                {categories.map((category) => (<option key={category.id}>{category.name}</option>))}
              </select>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">Priority</p>
              <select className="mt-3 w-full rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none" value={selectedPriority} onChange={(event) => setSelectedPriority(event.target.value)}>
                <option>All</option>
                {priorities.map((priority) => (<option key={priority}>{priority}</option>))}
              </select>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
              <p className="text-sm text-muted-foreground">View</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">Kanban Board</Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-sm shadow-black/5">
          <CardHeader className="p-0">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg font-semibold">Task summary</CardTitle>
              <Shuffle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="mt-5 grid gap-4">
            {statusOrder.map((status) => (
              <div key={status} className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/80 p-4">
                <span className="text-sm font-medium">{status}</span>
                <span className="text-sm text-muted-foreground">{filteredTasks.filter((task) => task.status === status).length}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <DndContext sensors={useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))} collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <section className="grid gap-4 lg:grid-cols-3">
          {grouped.map((group) => (
            <TaskColumn key={group.status} status={group.status} tasks={group.tasks} />
          ))}
        </section>

        <DragOverlay>{activeTask ? <DragPreview task={activeTask} /> : null}</DragOverlay>
      </DndContext>

      {items.length === 0 && (
        <EmptyState
          title="No tasks yet"
          description="Create a new task to build your study flow and watch the board refresh instantly."
          actionText="Add first task"
          onAction={() => setShowModal(true)}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-border/80 bg-card/95 p-8 shadow-2xl shadow-black/30">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Create a new task</h2>
                <p className="mt-2 text-sm text-muted-foreground">Fill in the details to schedule a new study item.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={formTask.title ?? ""} onChange={(event) => setFormTask((prev) => ({ ...prev, title: event.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" value={formTask.deadline ?? ""} onChange={(event) => setFormTask((prev) => ({ ...prev, deadline: event.target.value }))} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={4}
                  value={formTask.description ?? ""}
                  onChange={(event) => setFormTask((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select id="category" value={formTask.category ?? ""} onChange={(event) => setFormTask((prev) => ({ ...prev, category: event.target.value }))} className="rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none">
                    <option value="">Select category</option>
                    {categories.map((category) => (<option key={category.id} value={category.name}>{category.name}</option>))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select id="priority" value={formTask.priority ?? "Medium"} onChange={(event) => setFormTask((prev) => ({ ...prev, priority: event.target.value as TaskPriority }))} className="rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none">
                    {priorities.map((priority) => (<option key={priority} value={priority}>{priority}</option>))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <select id="status" value={formTask.status ?? "Pending"} onChange={(event) => setFormTask((prev) => ({ ...prev, status: event.target.value as TaskStatus }))} className="rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none">
                    {statusOrder.map((status) => (<option key={status} value={status}>{status}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estimated">Estimated study time</Label>
                <Input id="estimated" value={formTask.estimatedStudyTime ?? ""} onChange={(event) => setFormTask((prev) => ({ ...prev, estimatedStudyTime: event.target.value }))} placeholder="e.g. 1h 30m" />
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button type="submit" className="rounded-full px-6 py-3 text-sm font-semibold">Save Task</Button>
                <Button variant="outline" className="rounded-full px-6 py-3 text-sm font-semibold" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
