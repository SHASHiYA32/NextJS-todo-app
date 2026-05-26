export type ThemeOption = "light" | "dark" | "system";

export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskPriority = "High" | "Medium" | "Low";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  category: string;
  priority: TaskPriority;
  estimatedStudyTime: string;
  status: TaskStatus;
  order: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  pinned: boolean;
  updatedAt: string;
}

export interface Session {
  id: string;
  subject: string;
  start: string;
  end: string;
  label: string;
  completed: boolean;
}

export interface ProgressMetric {
  title: string;
  value: string;
  description: string;
  trend: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface UserProfile {
  name: string;
  role: string;
  email: string;
}
