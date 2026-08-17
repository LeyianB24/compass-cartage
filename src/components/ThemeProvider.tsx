// src/components/ThemeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState, useCallback, useSyncExternalStore } from "react";

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

function getStoredTheme(): Theme | "system" {
  if (typeof window === "undefined") return "system";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {}
  return "system";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const storedTheme = useSyncExternalStore<Theme | "system">(
    subscribe,
    getStoredTheme,
    () => "system"
  );
  const [theme, setThemeState] = useState<Theme | "system">("system");
  const [systemDark, setSystemDark] = useState(false);

  const activeTheme: Theme | "system" = theme !== "system" ? theme : storedTheme;
  const resolved: Resolved =
    activeTheme === "system" ? (systemDark ? "dark" : "light") : activeTheme;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystem = () => setSystemDark(mq.matches);
    
    // Initial sync
    updateSystem();

    mq.addEventListener("change", updateSystem);
    return () => mq.removeEventListener("change", updateSystem);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
  }, [resolved]);

  const setTheme = useCallback((t: Theme | "system") => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
    document.documentElement.dataset.theme = "custom";
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolved === "dark" ? "light" : "dark");
  }, [resolved, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, resolved, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

