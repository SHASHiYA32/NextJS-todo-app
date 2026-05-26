"use client"

import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { Clock3, GripVertical, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sessions as sessionSeed } from "@/mock/data";
import type { Session } from "@/types";

const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

function getEndTime(start: string) {
  const [hours, minutes] = start.split(":").map(Number);
  const next = new Date();
  next.setHours(hours + 1, minutes, 0, 0);
  return next.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function SessionCard({ session }: { session: Session }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: session.id });
  const style = {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="rounded-2xl sm:rounded-3xl border border-border/70 bg-gradient-to-br from-primary/10 to-background/90 p-3 sm:p-4 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm sm:text-base truncate">{session.subject}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">{session.start} - {session.end}</p>
        </div>
        <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      </div>
    </div>
  );
}

function TimeSlot({ time, children }: { time: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${time}` });

  return (
    <div ref={setNodeRef} className={`rounded-xl sm:rounded-[2rem] border border-border/70 p-3 sm:p-4 transition ${isOver ? "ring-2 ring-primary/40 bg-primary/10" : "bg-card/90"}`}>
      <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
        <Clock3 className="h-4 sm:h-5 w-4 sm:w-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">{time}</p>
          <p className="text-sm sm:text-lg font-semibold">Hour block</p>
        </div>
      </div>
      <div className="space-y-2 sm:space-y-3">{children}</div>
    </div>
  );
}

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>(sessionSeed);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = ({ active }: { active: any }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }: { active: any; over: any }) => {
    setActiveId(null);
    if (!over) return;
    const activeSession = sessions.find((session) => session.id === active.id);
    if (!activeSession) return;
    const destination = over.id as string;
    if (!destination.startsWith("slot-")) return;
    const newStart = destination.replace("slot-", "");
    setSessions((prev) => prev.map((session) => (session.id === activeSession.id ? { ...session, start: newStart, end: getEndTime(newStart) } : session)));
  };

  const activeSession = activeId ? sessions.find((session) => session.id === activeId) : null;

  const SessionPreview = ({ session }: { session: Session }) => (
    <div className="rounded-2xl sm:rounded-3xl border border-border bg-background p-3 sm:p-4 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm sm:text-base truncate">{session.subject}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">{session.start} - {session.end}</p>
        </div>
        <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-8">
      <section className="space-y-2 sm:space-y-3">
        <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">Schedule</p>
        <h1 className="text-2xl sm:text-3xl font-semibold">Weekly planner</h1>
        <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground">Drag sessions between hour blocks to reschedule your study timeline visually.</p>
      </section>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <section className="grid gap-4 sm:gap-6 lg:grid-cols-[1.5fr_0.5fr]">
          <div className="grid gap-3 sm:gap-4 w-full">
            {timeSlots.map((time) => (
              <TimeSlot key={time} time={time}>
                {sessions.filter((session) => session.start === time).map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </TimeSlot>
            ))}
          </div>
          <Card className="rounded-2xl sm:rounded-[2rem] border border-border/80 bg-gradient-to-br from-primary/5 to-card/90 p-4 sm:p-6 shadow-sm shadow-black/5 h-fit sticky top-20">
            <CardHeader className="p-0 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <ListChecks className="h-5 w-5 text-primary flex-shrink-0" />
                <CardTitle className="text-base sm:text-xl font-semibold">Ready sessions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-2 sm:space-y-4 max-h-96 overflow-y-auto">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">No sessions ready</p>
              )}
            </CardContent>
          </Card>
        </section>

        <DragOverlay>{activeSession ? <SessionPreview session={activeSession} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
