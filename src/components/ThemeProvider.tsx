// src/components/ThemeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";
type Resolved = "light" | "dark";

type ThemeContextValue = {
  /** The user's explicit choice, or "system" to track the OS preference. */
  theme: Theme | "system";
  /** What's actually rendered after resolving system. */
  resolved: Resolved;
  /** Cycle: system → light → dark → system. */
  setTheme: (t: Theme | "system") => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "cc-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme | "system">("system");
  const [resolved, setResolved] = useState<Resolved>("light");

  // Apply the resolved theme to <html> and persist the explicit choice.
  const apply = useCallback((t: Theme | "system") => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const next: Resolved = t === "system" ? (mq.matches ? "dark" : "light") : t;
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    setResolved(next);
  }, []);

  useEffect(() => {
    let saved: Theme | "system" = "system";
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "light" || v === "dark" || v === "system") saved = v;
    } catch {}
    setThemeState(saved);
    apply(saved);

    // React to OS changes when following the system theme.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (document.documentElement.dataset.theme !== "custom") {
        apply("system");
        setResolved(mq.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [apply]);

  const setTheme = useCallback(
    (t: Theme | "system") => {
      setThemeState(t);
      try {
        localStorage.setItem(STORAGE_KEY, t);
      } catch {}
      document.documentElement.dataset.theme = "custom";
      apply(t);
    },
    [apply]
  );

  const toggle = useCallback(() => {
    // Simple binary toggle between light/dark, remembering the choice.
    setTheme(resolved === "dark" ? "light" : "dark");
  }, [resolved, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
