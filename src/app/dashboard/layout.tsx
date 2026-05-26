import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard-shell";

export const metadata: Metadata = {
  title: "StudyFlow Dashboard",
  description: "Your study productivity dashboard for tasks, calendar, notes and progress.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
