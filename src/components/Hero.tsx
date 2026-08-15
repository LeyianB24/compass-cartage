// src/components/Hero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  // Subtle parallax on the backdrop image — drifts down slower than the
  // page as the user scrolls, giving the hero quiet depth without
  // distracting motion. (Reduced-motion is honored via globals.css.)
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "12%"]);
  const overlayY = useTransform(scrollY, [0, 600], ["0%", "6%"]);

  return (
    <section className="relative isolate overflow-hidden border-b border-hairline bg-navy-deep text-paper">
      {/* Backdrop photograph with parallax drift */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-[2] scale-110">
        <Image
          src={IMAGES.heroMovers.src}
          alt={IMAGES.heroMovers.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Legibility overlays:
          - left-weighted navy wash so the headline reads clearly,
          - subtle vignette top + bottom to anchor the content. */}
      <motion.div
        aria-hidden="true"
        style={{ y: overlayY }}
        className="absolute inset-0 -z-[1] bg-gradient-to-br from-navy-deep/92 via-navy-deep/75 to-navy-deep/55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-[1] h-24 bg-gradient-to-t from-navy-deep to-transparent"
      />

      <div className="section-padding mx-auto grid max-w-content gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="eyebrow mb-5 text-gold-soft"
          >
            {BUSINESS.serviceAreaShort}
          </motion.p>

          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-paper md:text-5xl lg:text-6xl">
            <motion.span custom={1} variants={fadeUp} initial="hidden" animate="show" className="block">
              Moving day,
            </motion.span>
            <motion.span custom={2} variants={fadeUp} initial="hidden" animate="show" className="block text-gold-soft">
              handled with care.
            </motion.span>
          </h1>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-md text-base leading-relaxed text-paper/80 md:text-lg"
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
              className="group flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-soft"
            >
              Get a Free Quote
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={BUSINESS.phoneHref}
              className="flex items-center justify-center gap-2 rounded-sm border border-paper/25 bg-paper-muted/5 px-7 py-3.5 text-sm font-semibold text-paper backdrop-blur transition-colors hover:bg-paper-muted/10"
            >
              <Phone size={16} className="text-gold-soft" />
              {BUSINESS.phone}
            </a>
          </motion.div>
        </div>

        {/* Right-hand visual: a framed photograph layered above the
            animated route SVG. The photo grounds the abstract route
            metaphor in a real moment — movers at work — while the SVG
            keeps the brand's "we get you there" signature motif. */}
        <div className="relative hidden aspect-square items-center justify-center md:flex">
          {/* Framed photograph — sits behind the SVG, slightly rotated
              like a stacked editorial print. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-2 top-4 h-56 w-44 overflow-hidden rounded-sm shadow-2xl ring-1 ring-gold/30"
          >
            <Image
              src={IMAGES.indoorsWithTools.src}
              alt={IMAGES.indoorsWithTools.alt}
              fill
              sizes="180px"
              className="object-cover"
            />
          </motion.div>

          {/* Animated route: path draws itself in, then a marker travels
              along it on a loop — the visual metaphor for "we get you there". */}
          <svg viewBox="0 0 400 400" className="relative h-full w-full" fill="none">
            <motion.circle
              cx="200"
              cy="200"
              r="170"
              stroke="#e4c65c"
              strokeOpacity="0.35"
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
              fill="#e4c65c"
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
              fill="#e4c65c"
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
