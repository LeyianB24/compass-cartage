// src/components/StatsCounter.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export type StatItem = {
  value: number;
  suffix: string;
  label: string;
  description?: string;
};

const DEFAULT_STATS: StatItem[] = [
  { value: 500, suffix: "+", label: "Moves Completed", description: "Across households & offices" },
  { value: 100, suffix: "%", label: "Insured & Covered", description: "Full peace-of-mind service" },
  { value: 24, suffix: "hr", label: "Average Quote Turnaround", description: "Fast, transparent estimates" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 1400, bounce: 0 });

  useEffect(() => {
    if (inView) {
      motionVal.set(value);
    }
  }, [inView, value, motionVal]);

  useEffect(() => {
    // If user prefers reduced motion, set value directly without spring ticks
    if (shouldReduceMotion) {
      if (ref.current) ref.current.textContent = value.toString();
      return;
    }

    const unsubscribe = spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = Math.round(v).toString();
      }
    });

    return () => unsubscribe();
  }, [spring, value, shouldReduceMotion]);

  return (
    <div className="flex items-baseline gap-0.5">
      <span
        ref={ref}
        className="font-display text-4xl font-semibold tracking-tight text-navy-deep md:text-5xl"
      >
        0
      </span>
      <span className="font-display text-2xl font-semibold text-gold md:text-3xl">
        {suffix}
      </span>
    </div>
  );
}

export default function StatsCounter({ stats = DEFAULT_STATS }: { stats?: StatItem[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Key Performance Statistics"
      className="border-y border-hairline bg-white py-12 md:py-16"
    >
      <div className="section-padding mx-auto grid max-w-content gap-8 sm:grid-cols-3 md:gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: shouldReduceMotion ? 0 : i * 0.12, duration: 0.5 }}
            className="relative flex flex-col justify-between border-l-2 border-hairline pl-6 transition-colors duration-300 hover:border-gold"
          >
            <div>
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-base font-semibold text-navy-deep">{stat.label}</p>
            </div>
            {stat.description && (
              <p className="mt-1 text-xs leading-relaxed text-slate">{stat.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}