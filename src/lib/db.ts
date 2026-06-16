import { supabase } from "@/lib/supabase";
import type { Database } from "@/types";
import type { Category, Note, Session, Task } from "@/types";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
type StudySessionRow = Database["public"]["Tables"]["study_sessions"]["Row"];

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export function mapTaskRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    deadline: row.deadline,
    category: row.category_name || "Unsorted",
    priority: row.priority,
    estimatedStudyTime: row.estimated_study_time,
    status: row.status,
    order: row.sort_order,
  };
}

export function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
  };
}

export function mapNoteRow(row: NoteRow): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    tags: row.tags ?? [],
    color: row.color,
    pinned: row.pinned,
    updatedAt: row.updated_at ?? row.created_at,
  };
}

export function mapStudySessionRow(row: StudySessionRow): Session {
  return {
    id: row.id,
    subject: row.subject,
    start: row.start_time,
    end: row.end_time,
    label: row.label,
    completed: row.completed,
  };
}

export function mapProfileRow(row: ProfileRow) {
  return {
    id: row.id,
    name: row.full_name ?? row.id,
    role: row.role ?? "Student Planner",
  };
}

export async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error || !data) return null;
  return mapProfileRow(data);
}

export async function getCategories(userId: string) {
  const { data, error } = await supabase.from("categories").select("*").eq("user_id", userId).order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map(mapCategoryRow);
}

export async function insertCategory(userId: string, name: string, color: string) {
  const payload: Database["public"]["Tables"]["categories"]["Insert"] = {
    user_id: userId,
    name,
    color,
    created_at: new Date().toISOString(),
  };
  // @ts-ignore - supabase types inference mismatch with local Database type
  const { data, error } = await supabase.from("categories").insert([payload] as any).select().single();
  if (error || !data) return null;
  return mapCategoryRow(data);
}

export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return data.map(mapTaskRow);
}

export async function insertTask(
  userId: string,
  task: Omit<Task, "id"> & { categoryId?: string | null }
) {
  // @ts-ignore - supabase types inference mismatch with local Database type
  const { data, error } = await supabase
    .from("tasks")
    .insert([{
      user_id: userId,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      category_id: task.categoryId ?? null,
      category_name: task.category,
      priority: task.priority,
      estimated_study_time: task.estimatedStudyTime,
      status: task.status,
      sort_order: task.order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }] as any)
    .select()
    .single();
  if (error || !data) return null;
  return mapTaskRow(data);
}

export async function deleteTask(taskId: string) {
  await supabase.from("tasks").delete().eq("id", taskId);
}

export async function updateTask(taskId: string, updates: Partial<Omit<Task, "id">>) {
  const payload: Partial<Record<string, unknown>> = {};

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.deadline !== undefined) payload.deadline = updates.deadline;
  if (updates.category !== undefined) payload.category_name = updates.category;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.estimatedStudyTime !== undefined) payload.estimated_study_time = updates.estimatedStudyTime;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.order !== undefined) payload.sort_order = updates.order;

  // @ts-ignore - supabase types inference mismatch with local Database type
  const { data, error } = await supabase.from("tasks").update(payload as any).eq("id", taskId).select().single();
  if (error || !data) return null;
  return mapTaskRow(data);
}

export async function updateTaskOrder(tasks: Task[]) {
  await Promise.all(
    tasks.map((task) =>
      // @ts-ignore - supabase types inference mismatch with local Database type
      supabase.from("tasks").update({ sort_order: task.order } as any).eq("id", task.id)
    )
  );
}

export async function updateStudySession(sessionId: string, updates: Partial<Pick<StudySessionRow, "start_time" | "end_time" | "completed" | "label">>) {
  const payload: Partial<Record<string, unknown>> = {};

  if (updates.start_time !== undefined) payload.start_time = updates.start_time;
  if (updates.end_time !== undefined) payload.end_time = updates.end_time;
  if (updates.completed !== undefined) payload.completed = updates.completed;
  if (updates.label !== undefined) payload.label = updates.label;

  // @ts-ignore - supabase types inference mismatch with local Database type
  await supabase.from("study_sessions").update(payload as any).eq("id", sessionId);
}

export async function getNotes(userId: string) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapNoteRow);
}

export async function insertNote(userId: string, note: Omit<Note, "id">) {
  const { data, error } = await supabase
    // @ts-ignore - supabase types inference mismatch with local Database type
    .from("notes")
    .insert([{
      user_id: userId,
      title: note.title,
      content: note.content,
      tags: note.tags,
      color: note.color,
      pinned: note.pinned,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }] as any)
    .select()
    .single();
  if (error || !data) return null;
  return mapNoteRow(data);
}

export async function updateNote(note: Note) {
  const { data, error } = await supabase
    // @ts-ignore - supabase types inference mismatch with local Database type
    .from("notes")
    // @ts-ignore - supabase types inference mismatch with local Database type
    .update({
      title: note.title,
      content: note.content,
      tags: note.tags,
      color: note.color,
      pinned: note.pinned,
      updated_at: new Date().toISOString(),
    } as any)
    .eq("id", note.id)
    .select()
    .single();
  if (error || !data) return null;
  return mapNoteRow(data);
}

export async function deleteNote(noteId: string) {
  await supabase.from("notes").delete().eq("id", noteId);
}

export async function getStudySessions(userId: string) {
  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapStudySessionRow);
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data;
}
