// src/components/StatsCounter.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, animate } from "framer-motion";
import { IMAGES } from "@/lib/images";

const STATS = [
  { value: 100, suffix: "%", label: "Insured & Licensed Cargo Protection" },
  { value: 1, suffix: "", label: "Dedicated Moving Crew Per Job" },
  { value: 0, suffix: "", label: "Surprise Fees On Moving Day" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (!inView || value === 0) return;

    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-3xl font-semibold text-white md:text-4xl">
      <span>{displayValue}</span>
      <span className="text-gold-soft dark:text-gold">{suffix}</span>
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep dark:bg-[#070c14] text-white">
      {/* Backdrop photograph & overlay in background layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={IMAGES.packingScene.src}
          alt={IMAGES.packingScene.alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Navy wash layer positioned strictly over the image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-navy-deep/90 dark:bg-[#070c14]/95 backdrop-blur-[1px]"
        />
      </div>

      {/* Content strictly in foreground layer */}
      <div className="relative z-10 section-padding mx-auto grid max-w-content gap-10 py-16 sm:grid-cols-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
            className="flex flex-col"
          >
            <Counter value={stat.value} suffix={stat.suffix} />
            <p className="mt-1 text-sm text-white/85 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
