"use client"

import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const defaultTaskCompletionData = [
  { day: "Mon", completed: 4, pending: 2 },
  { day: "Tue", completed: 5, pending: 1 },
  { day: "Wed", completed: 3, pending: 3 },
  { day: "Thu", completed: 6, pending: 1 },
  { day: "Fri", completed: 5, pending: 2 },
  { day: "Sat", completed: 2, pending: 4 },
  { day: "Sun", completed: 7, pending: 0 },
];

const defaultStudySessionData = [
  { week: "Week 1", hours: 12 },
  { week: "Week 2", hours: 15 },
  { week: "Week 3", hours: 18 },
  { week: "Week 4", hours: 16 },
];

const defaultProductivityTrendData = [
  { date: "1", score: 65 },
  { date: "2", score: 72 },
  { date: "3", score: 68 },
  { date: "4", score: 79 },
  { date: "5", score: 85 },
  { date: "6", score: 90 },
  { date: "7", score: 92 },
];

export interface TaskCompletionChartProps {
  data?: Array<{ day: string; completed: number; pending: number }>;
}

export interface StudySessionChartProps {
  data?: Array<{ week: string; hours: number }>;
}

export interface ProductivityTrendChartProps {
  data?: Array<{ date: string; score: number }>;
}

export function TaskCompletionChart({ data = defaultTaskCompletionData }: TaskCompletionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
        <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
        <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} />
        <Legend />
        <Bar dataKey="completed" fill="url(#colorCompleted)" name="Completed" radius={[8, 8, 0, 0]} />
        <Bar dataKey="pending" fill="url(#colorPending)" name="Pending" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StudySessionsChart({ data = defaultStudySessionData }: StudySessionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
        <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
        <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} />
        <Area type="monotone" dataKey="hours" stroke="#3b82f6" fill="url(#colorHours)" name="Study Hours" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ProductivityTrendChart({ data = defaultProductivityTrendData }: ProductivityTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} />
        <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: "12px" }} domain={[0, 100]} />
        <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} />
        <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} dot={{ fill: "#a855f7", r: 5 }} activeDot={{ r: 7 }} name="Productivity Score" />
      </LineChart>
    </ResponsiveContainer>
  );
}
