"use client"

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowUpRight, Clock3, Layers, Tag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types";

const statusColor: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-300",
  "In Progress": "bg-sky-500/10 text-sky-300",
  Completed: "bg-emerald-500/10 text-emerald-300",
};

const priorityColor: Record<string, string> = {
  High: "bg-red-500/10 text-red-300",
  Medium: "bg-orange-500/10 text-orange-300",
  Low: "bg-emerald-500/10 text-emerald-300",
};

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden border border-border bg-background p-4 shadow-sm transition-shadow hover:shadow-lg"
      {...attributes}
      {...listeners}
    >
      <CardHeader className="space-y-3 p-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">{task.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[task.status]}`}>
            {task.status}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 px-0 pt-4 pb-3">
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            <span>{task.deadline}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityColor[task.priority]}`}>{task.priority}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              <Layers className="h-3.5 w-3.5" /> {task.category}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-3 px-0 pt-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
          <Tag className="h-3.5 w-3.5" /> {task.estimatedStudyTime}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit?.(task)} {...listeners}>
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete?.(task)}>
            <span className="text-sm">×</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
