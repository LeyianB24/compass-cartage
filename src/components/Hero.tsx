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
  // Subtle parallax on the backdrop image
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "12%"]);
  const overlayY = useTransform(scrollY, [0, 600], ["0%", "6%"]);

  return (
    <section className="relative isolate overflow-hidden border-b border-hairline bg-[#071426] dark:bg-[#030914] text-[#f7f6f2]">
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

      {/* Legibility overlays */}
      <motion.div
        aria-hidden="true"
        style={{ y: overlayY }}
        className="absolute inset-0 -z-[1] bg-gradient-to-br from-[#071426]/95 via-[#071426]/80 to-[#071426]/60 dark:from-[#030914]/95 dark:via-[#030914]/85 dark:to-[#030914]/65"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-[1] h-24 bg-gradient-to-t from-[#071426] dark:from-[#030914] to-transparent"
      />

      <div className="section-padding mx-auto grid max-w-content gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="eyebrow mb-5 text-[#e4c65c]"
          >
            {BUSINESS.serviceAreaShort}
          </motion.p>

          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-[#f7f6f2] md:text-5xl lg:text-6xl">
            <motion.span custom={1} variants={fadeUp} initial="hidden" animate="show" className="block">
              Moving day,
            </motion.span>
            <motion.span custom={2} variants={fadeUp} initial="hidden" animate="show" className="block text-[#e4c65c]">
              handled with care.
            </motion.span>
          </h1>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-md text-base leading-relaxed text-[#f7f6f2]/80 md:text-lg"
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
              className="group flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-3.5 text-sm font-semibold text-[#071426] transition-colors hover:bg-gold-soft"
            >
              Get a Free Quote
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={BUSINESS.phoneHref}
              className="flex items-center justify-center gap-2 rounded-sm border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-[#f7f6f2] backdrop-blur transition-colors hover:bg-white/10"
            >
              <Phone size={16} className="text-[#e4c65c]" />
              {BUSINESS.phone}
            </a>
          </motion.div>
        </div>

        {/* Right-hand visual */}
        <div className="relative hidden aspect-square items-center justify-center md:flex">
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

          <svg viewBox="0 0 400 400" className="relative h-full w-full" fill="none">
            <motion.circle
              cx="200"
              cy="200"
              r="170"
              stroke="#c9a227"
              strokeWidth="1.2"
              strokeDasharray="3 8"
              strokeOpacity="0.45"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            />
            <path
              d="M 60 260 C 120 120, 260 300, 340 140"
              stroke="#e4c65c"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeLinecap="round"
            />
            <circle cx="60" cy="260" r="5" fill="#c9a227" />
            <circle cx="340" cy="140" r="6" fill="#e4c65c" />
          </svg>
        </div>
      </div>
    </section>
  );
}
