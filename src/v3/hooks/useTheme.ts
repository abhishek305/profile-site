import { useEffect, useState } from "react";
import type { ThemeName } from "../types";

const STORAGE_KEY = "portfolio-v3-theme";

const readStoredTheme = (): ThemeName | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    // Storage can be unavailable in private modes; fall back to the OS setting.
    return null;
  }
};

const systemTheme = (): ThemeName =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

/**
 * Light/dark theme, seeded from localStorage and then the OS preference, and
 * persisted on every change. Also reflects the `data-theme` attribute the
 * stylesheet keys off and keeps it in sync with OS changes while the user has
 * not made an explicit choice.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeName>(() => readStoredTheme() ?? systemTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Persisting is best-effort.
    }
  }, [theme]);

  useEffect(() => {
    if (readStoredTheme()) return;
    const query = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!query) return;
    const onChange = (event: MediaQueryListEvent) => setTheme(event.matches ? "dark" : "light");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggleTheme };
};
