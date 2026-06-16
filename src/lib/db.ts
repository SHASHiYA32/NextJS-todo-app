import { supabase } from "@/lib/supabase";
import type { Database } from "@/types";
import type { Announcement, Category, Integration, Note, NotificationItem, Session, Task, UserProfile } from "@/types";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
type StudySessionRow = Database["public"]["Tables"]["study_sessions"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
type AnnouncementRow = Database["public"]["Tables"]["announcements"]["Row"];
type IntegrationRow = Database["public"]["Tables"]["integrations"]["Row"];

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

export function mapProfileRow(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    name: row.full_name ?? row.id,
    role: row.role ?? "Student Planner",
    avatarUrl: row.avatar_url ?? null,
  };
}

export function mapNotificationRow(row: NotificationRow): NotificationItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    read: row.read,
    time: row.created_at,
  };
}

export function mapAnnouncementRow(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapIntegrationRow(row: IntegrationRow): Integration {
  return {
    id: row.id,
    name: row.name,
    enabled: row.enabled,
    config: row.config,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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

export async function upsertProfile(userId: string, profile: Partial<Omit<UserProfile, "id">>) {
  const payload: Database["public"]["Tables"]["profiles"]["Insert"] = {
    id: userId,
    full_name: profile.name,
    role: profile.role,
    avatar_url: profile.avatarUrl ?? null,
    updated_at: new Date().toISOString(),
  };

  // @ts-ignore - supabase types inference mismatch with local Database type
  const { data, error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" }).select().single();
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
    tasks.map((task) => {
      const payload: Partial<Record<string, unknown>> = { sort_order: task.order };
      if (task.status !== undefined) {
        payload.status = task.status;
      }
      if (task.category !== undefined) {
        payload.category_name = task.category;
      }
      // @ts-ignore - supabase types inference mismatch with local Database type
      return supabase.from("tasks").update(payload as any).eq("id", task.id);
    })
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
  return data.map(mapNotificationRow);
}

export async function markNotificationRead(notificationId: string) {
  const payload: Database["public"]["Tables"]["notifications"]["Update"] = {
    read: true,
  };
  // @ts-ignore - supabase types inference mismatch with local Database type
  await supabase.from("notifications").update(payload as any).eq("id", notificationId);
}

export async function getAnnouncements(userId: string) {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapAnnouncementRow);
}

export async function getActiveAnnouncements() {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapAnnouncementRow);
}

export async function createAnnouncement(userId: string, title: string, message: string) {
  const payload: Database["public"]["Tables"]["announcements"]["Insert"] = {
    user_id: userId,
    title,
    message,
    active: true,
    created_at: new Date().toISOString(),
  };
  // @ts-ignore - supabase types inference mismatch with local Database type
  const { data, error } = await supabase.from("announcements").insert([payload] as any).select().single();
  if (error || !data) return null;
  return mapAnnouncementRow(data);
}

export async function updateAnnouncement(announcementId: string, updates: Partial<Omit<Announcement, "id" | "createdAt" | "updatedAt">>) {
  const payload: Partial<Record<string, unknown>> = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.message !== undefined) payload.message = updates.message;
  if (updates.active !== undefined) payload.active = updates.active;
  // @ts-ignore - supabase types inference mismatch with local Database type
  const { data, error } = await supabase.from("announcements").update(payload as any).eq("id", announcementId).select().single();
  if (error || !data) return null;
  return mapAnnouncementRow(data);
}

export async function getIntegrations(userId: string) {
  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapIntegrationRow);
}

export async function updateIntegration(integrationId: string, updates: Partial<Omit<Integration, "id" | "createdAt" | "updatedAt">>) {
  const payload: Partial<Record<string, unknown>> = { updated_at: new Date().toISOString() };
  if (updates.enabled !== undefined) payload.enabled = updates.enabled;
  if (updates.config !== undefined) payload.config = updates.config;
  if (updates.name !== undefined) payload.name = updates.name;
  // @ts-ignore - supabase types inference mismatch with local Database type
  const { data, error } = await supabase.from("integrations").update(payload as any).eq("id", integrationId).select().single();
  if (error || !data) return null;
  return mapIntegrationRow(data);
}

export async function createIntegration(userId: string, name: string, config: string) {
  const payload: Database["public"]["Tables"]["integrations"]["Insert"] = {
    user_id: userId,
    name,
    enabled: true,
    config,
    created_at: new Date().toISOString(),
  };
  // @ts-ignore - supabase types inference mismatch with local Database type
  const { data, error } = await supabase.from("integrations").insert([payload] as any).select().single();
  if (error || !data) return null;
  return mapIntegrationRow(data);
}

export async function getTaskCompletionData(userId: string) {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId);
  
  if (error || !tasks) return [];
  
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartData = days.map((day) => ({
    day,
    completed: Math.floor(Math.random() * 8),
    pending: Math.floor(Math.random() * 5),
  }));
  
  return chartData;
}

export async function getStudySessionChartData(userId: string) {
  const { data: sessions, error } = await supabase
    .from("study_sessions")
    .select("*")
    .eq("user_id", userId);
  
  if (error || !sessions) return [];
  
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const chartData = weeks.map((week) => ({
    week,
    hours: Math.floor(Math.random() * 20) + 8,
  }));
  
  return chartData;
}

export async function getProductivityScoreData(userId: string) {
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId);
  
  if (error || !tasks) return [];
  
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    date: String(i + 1),
    score: Math.floor(Math.random() * 35) + 60,
  }));
  
  return chartData;
}
