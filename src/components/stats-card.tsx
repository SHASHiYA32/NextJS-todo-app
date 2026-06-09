import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  description: string;
  className?: string;
}

export function StatsCard({ icon, title, value, description, className }: StatsCardProps) {
  return (
    <Card className={`rounded-2xl sm:rounded-3xl border border-border/80 bg-linear-to-br from-primary/5 to-muted/50 shadow-lg shadow-black/5 ${className ?? ""}`}>
      <CardHeader className="space-y-1 p-4 sm:p-5">
        <div className="flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 text-primary shadow-sm shadow-primary/10 dark:bg-white/5">
          {icon}
        </div>
        <CardTitle className="text-xs sm:text-sm font-semibold truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
        <div className="text-2xl sm:text-3xl font-semibold tracking-tight">{value}</div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
