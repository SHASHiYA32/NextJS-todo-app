import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pin, Trash2, Edit3 } from "lucide-react";
import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  onPin?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onEdit?: (note: Note) => void;
}

export function NoteCard({ note, onPin, onDelete, onEdit }: NoteCardProps) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border border-border bg-card/80 shadow-sm transition hover:shadow-lg">
      <div className={`p-5 ${note.color} border border-transparent`}> 
        <CardHeader className="p-0">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base font-semibold">{note.title}</CardTitle>
            <button onClick={() => onPin?.(note)} className="rounded-full border border-border/50 bg-white/70 p-2 text-sm transition hover:bg-white dark:bg-white/10">
              <Pin className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-3 pb-0">
          <p className="text-sm leading-relaxed text-muted-foreground">{note.content}</p>
        </CardContent>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4 text-xs text-muted-foreground">
        <span>{note.updatedAt}</span>
        <div className="flex gap-2">
          <button onClick={() => onEdit?.(note)} className="rounded-full bg-muted px-3 py-1 transition hover:bg-muted/80">
            <Edit3 className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete?.(note)} className="rounded-full bg-muted px-3 py-1 transition hover:bg-muted/80">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
