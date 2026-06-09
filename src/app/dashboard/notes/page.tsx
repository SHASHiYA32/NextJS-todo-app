"use client"

import { useEffect, useMemo, useState } from "react";
import { Plus, Pin, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NoteCard } from "@/components/note-card";
import { supabase } from "@/lib/supabase";
import { getNotes, insertNote, updateNote, deleteNote } from "@/lib/db";
import type { Note } from "@/types";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formNote, setFormNote] = useState<Partial<Note>>({ tags: [], color: "bg-amber-500/10 text-amber-300 border-amber-300/20" });

  useEffect(() => {
    const loadNotes = async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) return;

      const fetchedNotes = await getNotes(userId);
      setNotes(fetchedNotes);
    };

    loadNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => note.title.toLowerCase().includes(searchText.toLowerCase()) || note.content.toLowerCase().includes(searchText.toLowerCase()));
  }, [notes, searchText]);

  const togglePin = async (note: Note) => {
    const updated = await updateNote({ ...note, pinned: !note.pinned });
    if (!updated) return;
    setNotes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleDelete = async (note: Note) => {
    await deleteNote(note.id);
    setNotes((prev) => prev.filter((item) => item.id !== note.id));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formNote.title || !formNote.content) return;

    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    if (formNote.id) {
      const updated = await updateNote({
        id: formNote.id,
        title: formNote.title,
        content: formNote.content,
        tags: (formNote.tags ?? []).map((tag) => String(tag)),
        color: formNote.color ?? "bg-amber-500/10 text-amber-300 border-amber-300/20",
        pinned: formNote.pinned ?? false,
        updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      } as Note);
      if (!updated) return;
      setNotes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } else {
      const newNote = await insertNote(userId, {
        title: formNote.title,
        content: formNote.content,
        tags: (formNote.tags ?? []).map((tag) => String(tag)),
        color: formNote.color ?? "bg-amber-500/10 text-amber-300 border-amber-300/20",
        pinned: false,
        updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      } as Omit<Note, "id">);
      if (!newNote) return;
      setNotes((prev) => [newNote, ...prev]);
    }

    setShowModal(false);
    setFormNote({ tags: [], color: "bg-amber-500/10 text-amber-300 border-amber-300/20" });
  };

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Notes</p>
          <h1 className="mt-2 text-3xl font-semibold">Study notes board</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Organize your key ideas, pin important notes, and keep quick revision cards handy.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search notes" className="max-w-sm" />
          <Button className="rounded-full px-5 py-3 text-sm font-semibold" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" /> New note
          </Button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredNotes.length === 0 ? (
          <div className="rounded-[2rem] border border-border/80 bg-card/90 p-10 text-center text-muted-foreground">
            No notes found. Create one to capture your study ideas.
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPin={togglePin}
              onDelete={handleDelete}
              onEdit={() => {
                setFormNote(note);
                setShowModal(true);
              }}
            />
          ))
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[2rem] border border-border/80 bg-card/95 p-8 shadow-2xl shadow-black/30">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Create a new note</h2>
                <p className="mt-2 text-sm text-muted-foreground">Capture a quick reminder or concept summary.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formNote.title ?? ""} onChange={(event) => setFormNote((prev) => ({ ...prev, title: event.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <textarea id="content" rows={5} value={formNote.content ?? ""} onChange={(event) => setFormNote((prev) => ({ ...prev, content: event.target.value }))} className="w-full rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" value={(formNote.tags ?? []).join(", ")} onChange={(event) => setFormNote((prev) => ({ ...prev, tags: event.target.value.split(",").map((tag) => tag.trim()) }))} placeholder="e.g. Review, Physics" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Color theme</Label>
                  <select id="color" value={formNote.color} onChange={(event) => setFormNote((prev) => ({ ...prev, color: event.target.value }))} className="rounded-3xl border border-border/80 bg-background px-4 py-3 text-sm outline-none">
                    <option value="bg-amber-500/10 text-amber-300 border-amber-300/20">Amber highlight</option>
                    <option value="bg-sky-500/10 text-sky-300 border-sky-300/20">Sky highlight</option>
                    <option value="bg-emerald-500/10 text-emerald-300 border-emerald-300/20">Emerald highlight</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button type="submit" className="rounded-full px-6 py-3 text-sm font-semibold">Save note</Button>
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
