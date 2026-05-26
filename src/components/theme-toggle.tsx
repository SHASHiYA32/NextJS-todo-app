"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop2 } from "lucide-react";
import { useTheme } from "next-themes";

const iconMap = {
  light: Sun,
  dark: Moon,
  system: Laptop2,
} as const;

const labelMap = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline" size="icon" className="opacity-0" />;
  }

  const activeTheme = theme === "system" ? resolvedTheme : theme;
  const Icon = iconMap[activeTheme as keyof typeof iconMap];

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
        setTheme(nextTheme);
      }}
      aria-label={`Switch theme, currently ${labelMap[activeTheme as keyof typeof labelMap]}`}
      className="transition-all"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
