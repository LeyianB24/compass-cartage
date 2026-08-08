// src/components/StatsCounter.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

const STATS = [
  { value: 500, suffix: "+", label: "Moves Completed" },
  { value: 100, suffix: "%", label: "Insured & Covered" },
  { value: 24, suffix: "hr", label: "Average Quote Turnaround" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 1400, bounce: 0 });

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toString();
    });
  }, [spring]);

  return (
    <span className="font-display text-3xl font-semibold text-navy-deep md:text-4xl">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section className="border-y border-hairline bg-white">
      <div className="section-padding mx-auto grid max-w-content gap-10 py-16 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            <Counter value={stat.value} suffix={stat.suffix} />
            <p className="mt-1 text-sm text-slate">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}