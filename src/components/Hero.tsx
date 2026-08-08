// src/components/Hero.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone, ShieldCheck, Star } from "lucide-react";
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
  const shouldReduceMotion = useReducedMotion();

  // Disable stagger delays if reduced motion is preferred
  const initial = shouldReduceMotion ? false : "hidden";
  const animate = "show";

  return (
    <section className="relative overflow-hidden border-b border-hairline bg-paper">
      <div className="section-padding mx-auto grid max-w-content gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        {/* Text Content Column */}
        <div>
          <motion.p
            custom={0}
            variants={fadeUp}
            initial={initial}
            animate={animate}
            className="eyebrow mb-5 text-gold-soft"
          >
            {BUSINESS?.serviceAreaShort || "Regional Coverage"}
          </motion.p>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-navy-deep md:text-5xl lg:text-6xl">
            <motion.span
              custom={1}
              variants={fadeUp}
              initial={initial}
              animate={animate}
              className="block"
            >
              Moving day,
            </motion.span>
            <motion.span
              custom={2}
              variants={fadeUp}
              initial={initial}
              animate={animate}
              className="block text-gold"
            >
              handled with care.
            </motion.span>
          </h1>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial={initial}
            animate={animate}
            className="mt-6 max-w-md text-base leading-relaxed text-slate md:text-lg"
          >
            {BUSINESS?.tagline || "Professional local & long-distance moving"}.
            From a single studio to a full office relocation, Compass Cartage
            gets you there on time and in one piece.
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial={initial}
            animate={animate}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row"
          >
            <Link
              href="/quote"
              className="group flex items-center justify-center gap-2 rounded-sm bg-navy-deep px-7 py-3.5 text-sm font-semibold text-paper shadow-xs transition-all hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep focus-visible:ring-offset-2"
            >
              Get a Free Quote
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            {BUSINESS?.phone && (
              <a
                href={BUSINESS.phoneHref || `tel:${BUSINESS.phone}`}
                className="flex items-center justify-center gap-2 rounded-sm border border-hairline bg-white px-7 py-3.5 text-sm font-semibold text-navy-deep shadow-2xs transition-colors hover:border-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep focus-visible:ring-offset-2"
              >
                <Phone size={16} className="text-gold" aria-hidden="true" />
                {BUSINESS.phone}
              </a>
            )}
          </motion.div>
        </div>

        {/* Animated Route Illustration Column */}
        <div className="relative hidden aspect-square items-center justify-center md:flex">
          {/* Floating Metric Badge 1 */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute top-12 left-6 z-10 flex items-center gap-2 rounded-md border border-hairline bg-white/90 px-3.5 py-2 shadow-sm backdrop-blur-xs"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/15 text-gold">
              <Star size={14} className="fill-gold" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-deep">5-Star Rated</p>
              <p className="text-[10px] text-slate">500+ Happy Moves</p>
            </div>
          </motion.div>

          {/* Floating Metric Badge 2 */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute bottom-16 right-6 z-10 flex items-center gap-2 rounded-md border border-hairline bg-white/90 px-3.5 py-2 shadow-sm backdrop-blur-xs"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-deep/10 text-navy-deep">
              <ShieldCheck size={16} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-navy-deep">Fully Insured</p>
              <p className="text-[10px] text-slate">Guaranteed Safety</p>
            </div>
          </motion.div>

          {/* SVG Canvas */}
          <svg
            viewBox="0 0 400 400"
            className="h-full w-full"
            fill="none"
            aria-hidden="true"
          >
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

            {/* Traveling marker — loops along path unless reduced motion is active */}
            {!shouldReduceMotion && (
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
            )}

            {/* Start Pin */}
            <motion.circle
              cx="40"
              cy="320"
              r="5"
              fill="#0b1f3a"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            />

            {/* End Pin */}
            <motion.circle
              cx="360"
              cy="80"
              r="5"
              fill="#c9a227"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.9, duration: 0.3 }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}