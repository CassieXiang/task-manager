"use client";

import { useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "light" | "dark";

const STORAGE_KEY = "task-manager-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/**
 * Manages light/dark theme with localStorage persistence.
 * Composes useLocalStorage for storage; adds DOM side-effect.
 * Defaults to the user's OS preference on first visit.
 */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEY, "light", isTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = theme;
    if (stored === "light" && !isTheme(localStorage.getItem(STORAGE_KEY))) {
      const system = getSystemTheme();
      setTheme(system);
      applyTheme(system);
    } else {
      applyTheme(stored);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  return { theme, toggleTheme };
}
