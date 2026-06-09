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

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          role?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          full_name?: string | null;
          role?: string | null;
          avatar_url?: string | null;
          updated_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          name?: string;
          color?: string;
          updated_at?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          deadline: string;
          category_id: string | null;
          category_name: string;
          priority: TaskPriority;
          estimated_study_time: string;
          status: TaskStatus;
          sort_order: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          deadline: string;
          category_id?: string | null;
          category_name: string;
          priority: TaskPriority;
          estimated_study_time: string;
          status: TaskStatus;
          sort_order?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          deadline?: string;
          category_id?: string | null;
          category_name?: string;
          priority?: TaskPriority;
          estimated_study_time?: string;
          status?: TaskStatus;
          sort_order?: number;
          updated_at?: string | null;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          tags: string[];
          color: string;
          pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          tags: string[];
          color: string;
          pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          tags?: string[];
          color?: string;
          pinned?: boolean;
          updated_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          start_time: string;
          end_time: string;
          label: string;
          completed: boolean;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          start_time: string;
          end_time: string;
          label: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          subject?: string;
          start_time?: string;
          end_time?: string;
          label?: string;
          completed?: boolean;
          updated_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          read?: boolean;
        };
      };
    };
    Views: {
      [_: string]: never;
    };
    Functions: {
      [_: string]: {
        Args: unknown;
        Returns: unknown;
      };
    };
    Enums: {
      task_status: TaskStatus;
      task_priority: TaskPriority;
    };
  };
}
