// src/components/Hero.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Phone, ShieldCheck, Star, CheckCircle2, Clock, Lock } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

const HERO_SCENES = [
  { id: "lorry1", label: "Moving Fleet", img: IMAGES.lorry1 },
  { id: "lorry3", label: "Our Trucks", img: IMAGES.lorry3 },
  { id: "lorry2", label: "Transit Ready", img: IMAGES.lorry2 },
  { id: "hero1", label: "Expert Crew", img: IMAGES.hero1 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const currentScene = HERO_SCENES[activeSceneIndex];

  // Subtle parallax on the backdrop image
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "10%"]);
  const overlayY = useTransform(scrollY, [0, 600], ["0%", "5%"]);

  return (
    <section className="relative isolate min-h-[90vh] overflow-hidden border-b border-hairline bg-[#070c14] text-white dark:bg-[#070c14]">
      {/* Background Photograph Cross-fade with Parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-[3] scale-105">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={currentScene.img.src}
              alt={currentScene.img.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Multi-layered architectural gradient wash for pristine legibility while letting the fleet shine */}
      <motion.div
        aria-hidden="true"
        style={{ y: overlayY }}
        className="absolute inset-0 -z-[2] bg-gradient-to-r from-[#070c14]/98 via-[#0a131f]/85 to-[#070c14]/50 dark:from-[#070c14]/98 dark:via-[#0a131f]/85 dark:to-[#070c14]/55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[1] bg-radial-at-t from-transparent via-[#070c14]/50 to-[#070c14]/95 dark:via-[#070c14]/60 dark:to-[#070c14]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-[1] h-32 bg-gradient-to-t from-paper dark:from-[#070c14] to-transparent"
      />

      {/* Architectural Drafting Grid Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[1] bg-[linear-gradient(to_right,rgba(197,168,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      <div className="section-padding mx-auto max-w-content py-20 lg:py-28">
        {/* Clean Architectural Hero Presentation */}
        <div className="w-full max-w-4xl text-left">
          {/* Top Authority Pill */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-5 inline-flex flex-wrap items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md dark:border-gold/30 dark:bg-gold/10"
          >
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                24/7 Edmonton Dispatch Active
              </span>
            </div>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-1 text-gold-soft">
              <Star size={12} className="fill-current text-gold-soft" />
              <span>4.9★ Verified Ledger</span>
            </div>
          </motion.div>

          {/* Architectural Display Headline */}
          <h1 className="font-display text-4xl font-semibold leading-[1.06] text-white sm:text-5xl lg:text-6xl tracking-tight">
            <motion.span custom={1} variants={fadeUp} initial="hidden" animate="show" className="block">
              Precision Relocation.
            </motion.span>
            <motion.span
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="block bg-gradient-to-r from-gold-soft via-white to-gold bg-clip-text text-transparent"
            >
              One Trusted Crew.
            </motion.span>
          </h1>

          {/* Subtitle / Plain English Value Proposition */}
          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg dark:text-gray-300 font-normal"
          >
            Professional residential and commercial moving across Edmonton and Alberta. One dedicated crew from pickup to delivery, transparent upfront quotes, and zero surprise fees.
          </motion.p>

          {/* Key Care & Protection Badges */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-medium text-white/90 dark:text-gray-200"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-gold-soft" />
              <span>Careful & Insured Handling</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock size={14} className="text-gold-soft" />
              <span>Upfront Price Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-gold-soft" />
              <span>Floor & Doorway Protection</span>
            </div>
          </motion.div>

          {/* Action Button Row */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/quote"
              className="btn-shimmer group flex items-center gap-2.5 rounded-sm bg-gold px-7 py-3.5 text-xs font-bold text-navy-deep shadow-xl transition-all hover:bg-gold-soft hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span>Get a Free Quote</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href={BUSINESS.phoneHref}
              className="flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold text-white backdrop-blur transition-all hover:bg-white/15 dark:border-white/15 dark:hover:border-gold/50"
            >
              <Phone size={15} className="text-gold-soft" />
              <span>Call Us: {BUSINESS.phone}</span>
            </a>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/15 pt-6 text-xs text-white/70 dark:border-white/10 dark:text-gray-400"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-gold-soft" />
              <span>Fully Licensed & Insured Crew</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-gold-soft" />
              <span>Reliable Arrival Windows</span>
            </div>
          </motion.div>

          {/* Interactive Scene Thumbnail Switcher */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex items-center gap-2.5"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/60 dark:text-gray-400">
              Moving Day Fleet:
            </span>
            <div className="flex items-center gap-1.5">
              {HERO_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`rounded-xs px-3 py-1 text-[11px] font-semibold transition-all ${
                    activeSceneIndex === idx
                      ? "border border-gold bg-gold text-navy-deep font-bold shadow-md"
                      : "border border-white/20 bg-white/5 text-white hover:bg-white/15 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                  }`}
                >
                  {scene.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
