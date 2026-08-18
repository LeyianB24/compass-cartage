// src/components/ThemeToggle.tsx
"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const emptySubscribe = () => () => {};

/**
 * Floating dark-mode toggle. Renders a compact icon button that swaps
 * between Sun (light) and Moon (dark) with a smooth rotation crossfade.
 * Renders an invisible placeholder until mounted to avoid hydration mismatch.
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
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-paper-muted/80 text-navy-deep transition-all duration-200 hover:border-gold hover:text-gold dark:border-gold/30 dark:bg-[#071426] dark:text-[#e4c65c] dark:hover:border-gold dark:hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {mounted ? (
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="block"
        >
          {isDark ? (
            <Moon size={16} className="text-[#e4c65c]" />
          ) : (
            <Sun size={16} className="text-navy-deep" />
          )}
        </motion.span>
      ) : (
        <span className="block h-4 w-4" />
      )}
    </button>
  );
}
