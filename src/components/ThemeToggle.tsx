// src/components/ThemeToggle.tsx
"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const emptySubscribe = () => () => {};

/**
 * Floating dark-mode toggle. Renders a compact icon button that swaps
 * between Sun (light) and Moon (dark) with a tiny rotation crossfade.
 * Renders an invisible placeholder until mounted to avoid hydration
 * mismatch (the resolved theme isn't known on the server).
 */
export default function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = resolved === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-paper-muted/60 text-navy-deep transition-colors hover:border-gold hover:text-gold dark:border-paper/15 dark:bg-paper-muted/5 dark:text-paper dark:hover:border-gold-soft dark:hover:text-gold-soft"
    >
      {mounted ? (
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="block"
        >
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      ) : (
        <span className="block h-4 w-4" />
      )}
    </button>
  );
}

