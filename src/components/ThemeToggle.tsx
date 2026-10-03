/**
 * =============================================================================
 * Theme Toggle Component — Sun & Moon Switch
 * =============================================================================
 *
 * Supports two presentation variants:
 *  - "button": Sleek icon button for the header bar
 *  - "segmented": Two-option pill toggle for the burger menu drawer
 */

"use client";

import { useTheme } from "@/lib/theme-context";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  variant?: "button" | "segmented";
  className?: string;
}

export default function ThemeToggle({ variant = "button", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, setTheme } = useTheme();
  const isLight = theme === "light";

  if (variant === "segmented") {
    return (
      <div
        className={`flex items-center p-1 rounded-xl bg-black/30 light:bg-stone-200/60 border border-white/10 light:border-stone-300/60 theme-segmented-container ${className}`}
        role="group"
        aria-label="Theme selection"
      >
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            !isLight
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm"
              : "text-stone-400 hover:text-stone-200"
          }`}
          aria-pressed={!isLight}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            isLight
              ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 shadow-sm"
              : "text-stone-400 hover:text-stone-200"
          }`}
          aria-pressed={isLight}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>
      </div>
    );
  }

  // Header icon button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl glass-card text-stone-300 hover:text-amber-400 hover:border-amber-500/40 transition-all flex items-center justify-center cursor-pointer group shadow-sm ${className}`}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
      id="theme-toggle-button"
    >
      {isLight ? (
        <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-amber-400 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
