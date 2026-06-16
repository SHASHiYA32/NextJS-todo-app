import type { Category, Note, NotificationItem, ProgressMetric, Session, Task, UserProfile } from "@/types";

export const currentUser: UserProfile = {
  name: "Nim Flow",
  role: "Student Planner",
  email: "nim@studyflow.com",
};

export const categories: Category[] = [
  { id: "math", name: "Math", color: "from-indigo-500 to-violet-500" },
  { id: "code", name: "Programming", color: "from-sky-500 to-cyan-500" },
  { id: "physics", name: "Physics", color: "from-emerald-500 to-lime-500" },
  { id: "writing", name: "Writing", color: "from-rose-500 to-fuchsia-500" },
  { id: "design", name: "Design", color: "from-amber-500 to-orange-500" },
];

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Finish calculus workbook",
    description: "Complete chapter 5 exercises and review formula sheet.",
    deadline: "2026-05-26",
    category: "Math",
    priority: "High",
    estimatedStudyTime: "2h 30m",
    status: "Pending",
    order: 0,
  },
  {
    id: "task-2",
    title: "Build study notes app UI",
    description: "Design interface and wireframe session planner components.",
    deadline: "2026-05-27",
    category: "Programming",
    priority: "Medium",
    estimatedStudyTime: "3h",
    status: "In Progress",
    order: 0,
  },
  {
    id: "task-3",
    title: "Read chapter on thermodynamics",
    description: "Summarize key formulas and complete concept map.",
    deadline: "2026-05-25",
    category: "Physics",
    priority: "High",
    estimatedStudyTime: "1h 45m",
    status: "Pending",
    order: 1,
  },
  {
    id: "task-4",
    title: "Write biology lab report",
    description: "Draft introduction, methods, and initial results.",
    deadline: "2026-05-30",
    category: "Writing",
    priority: "Low",
    estimatedStudyTime: "2h",
    status: "Completed",
    order: 0,
  },
  {
    id: "task-5",
    title: "Practice algorithm quizzes",
    description: "Solve two data-structure problems with time analysis.",
    deadline: "2026-05-29",
    category: "Programming",
    priority: "High",
    estimatedStudyTime: "1h 30m",
    status: "In Progress",
    order: 1,
  },
  {
    id: "task-6",
    title: "Design presentation slides",
    description: "Gather visuals and finalize bullet points.",
    deadline: "2026-06-02",
    category: "Design",
    priority: "Medium",
    estimatedStudyTime: "2h",
    status: "Pending",
    order: 2,
  },
];

export const notes: Note[] = [
  {
    id: "note-1",
    title: "Exam formula cheatsheet",
    content: "Highlight derivatives, integrals and key thermodynamic relations.",
    tags: ["Math", "Review"],
    color: "bg-violet-500/10 text-violet-300 border-violet-300/20",
    pinned: true,
    updatedAt: "May 24, 2026",
  },
  {
    id: "note-2",
    title: "Sprint plan for StudyFlow",
    content: "Build dashboard, tasks, calendar and schedule pages this week.",
    tags: ["Planning", "Productivity"],
    color: "bg-sky-500/10 text-sky-300 border-sky-300/20",
    pinned: false,
    updatedAt: "May 23, 2026",
  },
  {
    id: "note-3",
    title: "Physics test strategy",
    content: "Focus on formulas and practice problems with intensity mapping.",
    tags: ["Physics"],
    color: "bg-emerald-500/10 text-emerald-300 border-emerald-300/20",
    pinned: false,
    updatedAt: "May 22, 2026",
  },
  {
    id: "note-4",
    title: "Weekly revision rhythm",
    content: "Pair review sessions with active recall and spaced repetitions.",
    tags: ["Habits"],
    color: "bg-amber-500/10 text-amber-300 border-amber-300/20",
    pinned: true,
    updatedAt: "May 20, 2026",
  },
];

export const sessions: Session[] = [
  {
    id: "session-1",
    subject: "Math Focus",
    start: "08:00",
    end: "09:00",
    label: "Pomodoro",
    completed: true,
  },
  {
    id: "session-2",
    subject: "Code Review",
    start: "10:00",
    end: "11:30",
    label: "Deep Work",
    completed: false,
  },
  {
    id: "session-3",
    subject: "Physics Notes",
    start: "14:00",
    end: "15:00",
    label: "Revision",
    completed: false,
  },
  {
    id: "session-4",
    subject: "Design Sprint",
    start: "16:00",
    end: "17:00",
    label: "Planning",
    completed: true,
  },
];

export const progressMetrics: ProgressMetric[] = [
  {
    title: "Completion Rate",
    value: "82%",
    description: "Tasks completed this week",
    trend: "+8%",
  },
  {
    title: "Weekly Study",
    value: "18h",
    description: "Total focused sessions",
    trend: "+2h",
  },
  {
    title: "Streak",
    value: "7 days",
    description: "Consistent study routine",
    trend: "+1 day",
  },
  {
    title: "Productivity",
    value: "92",
    description: "Efficiency score based on goals",
    trend: "+12",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Deadline approaching",
    description: "Math workbook is due tomorrow.",
    time: "1h ago",
    read: false,
  },
  {
    id: "notif-2",
    title: "Session reminder",
    description: "Your Pomodoro study block starts at 10:00.",
    time: "3h ago",
    read: true,
  },
];
