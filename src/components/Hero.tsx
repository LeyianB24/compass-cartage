// src/components/Hero.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-paper">
      <div className="section-padding mx-auto grid max-w-content gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="eyebrow mb-5"
          >
            {BUSINESS.serviceAreaShort}
          </motion.p>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-navy-deep md:text-5xl lg:text-6xl">
            <motion.span custom={1} variants={fadeUp} initial="hidden" animate="show" className="block">
              Moving day,
            </motion.span>
            <motion.span custom={2} variants={fadeUp} initial="hidden" animate="show" className="block">
              handled with care.
            </motion.span>
          </h1>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-md text-base leading-relaxed text-slate md:text-lg"
          >
            {BUSINESS.tagline}. From a single studio to a full office
            relocation, Compass Cartage gets you there on time and in one
            piece.
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/quote"
              className="group flex items-center justify-center gap-2 rounded-sm bg-navy-deep px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-navy"
            >
              Get a Free Quote
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={BUSINESS.phoneHref}
              className="flex items-center justify-center gap-2 rounded-sm border border-hairline bg-white px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:border-navy-deep"
            >
              <Phone size={16} className="text-gold" />
              {BUSINESS.phone}
            </a>
          </motion.div>
        </div>

        {/* Animated route: path draws itself in, then a marker travels
            along it on a loop — the visual metaphor for "we get you there" */}
        <div className="relative hidden aspect-square items-center justify-center md:flex">
          <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
            <motion.circle
              cx="200"
              cy="200"
              r="170"
              stroke="#e3e1da"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            <motion.path
              d="M40 320 C 120 260, 140 140, 200 200 S 320 100, 360 80"
              stroke="#c9a227"
              strokeWidth="2"
              strokeDasharray="2 12"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.4, ease: "easeInOut" }}
            />

            {/* Traveling marker — loops along the same path indefinitely */}
            <motion.circle
              r="6"
              fill="#0b1f3a"
              stroke="#c9a227"
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                offsetDistance: ["0%", "100%"],
              }}
              transition={{
                opacity: { delay: 2, duration: 0.3 },
                offsetDistance: {
                  delay: 2,
                  duration: 3.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                },
              }}
              style={{
                offsetPath:
                  "path('M40 320 C 120 260, 140 140, 200 200 S 320 100, 360 80')",
              }}
            />

            <motion.circle
              cx="360"
              cy="80"
              r="5"
              fill="#c9a227"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.9, duration: 0.3 }}
            />
            <motion.circle
              cx="40"
              cy="320"
              r="5"
              fill="#0b1f3a"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}