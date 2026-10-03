/**
 * =============================================================================
 * Theme Context — Light and Dark Mode Provider
 * =============================================================================
 *
 * Provides instant theme switching between Dark (Cinematic Theater) and
 * Light (Warm Daylight Editorial) with localStorage persistence and zero flicker.
 */

"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t);
    if (t === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("couch_critics_theme") as Theme | null;
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        applyTheme(stored);
      } else {
        setThemeState("dark");
        applyTheme("dark");
      }
    } catch {
      // localStorage may fail in restricted iframes
    }
  }, [applyTheme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      applyTheme(newTheme);
      try {
        localStorage.setItem("couch_critics_theme", newTheme);
      } catch {
        // ignore
      }
    },
    [applyTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
