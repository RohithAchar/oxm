"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
// Dropdown removed to make the button directly toggle theme

export function ModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();

  function handleClick() {
    // Toggle between light and dark; if system, infer current and flip
    const resolved = theme === "system" ? systemTheme : theme;
    setTheme(resolved === "dark" ? "light" : "dark");
  }

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-foreground cursor-pointer relative"
    >
      <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
