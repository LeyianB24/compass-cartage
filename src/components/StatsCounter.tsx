// src/components/StatsCounter.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { IMAGES } from "@/lib/images";

const STATS = [
  { value: 100, suffix: "%", label: "Insured & Licensed Cargo Protection" },
  { value: 1, suffix: "", label: "Dedicated Moving Crew Per Job" },
  { value: 0, suffix: "", label: "Surprise Fees On Moving Day" },
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
    <span className="font-display text-3xl font-semibold text-white md:text-4xl">
      <span ref={ref}>{value}</span>
      <span className="text-gold-soft dark:text-gold">{suffix}</span>
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep dark:bg-[#070c14] text-white">
      {/* Backdrop photograph */}
      <Image
        src={IMAGES.packingScene.src}
        alt={IMAGES.packingScene.alt}
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Heavy navy wash so numbers stay crisp and readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[1] bg-navy-deep/90 dark:bg-[#070c14]/95"
      />

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
            <p className="mt-1 text-sm text-white/85">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
