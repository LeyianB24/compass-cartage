// src/components/Hero.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Phone, ShieldCheck, MapPin, Star, CheckCircle2, Clock } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import HeroQuickQuote from "@/components/HeroQuickQuote";

const HERO_SCENES = [
  { id: "hero2", label: "Fleet Ready", img: IMAGES.hero2 },
  { id: "hero1", label: "Expert Crew", img: IMAGES.hero1 },
  { id: "hero3", label: "Careful Loading", img: IMAGES.hero3 },
  { id: "hero4", label: "Home Delivery", img: IMAGES.hero4 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
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
    <section className="relative isolate min-h-[90vh] overflow-hidden border-b border-hairline bg-[#071f36] text-white dark:bg-[#0c0c0c]">
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

      {/* Multi-layered cinematic gradient wash for absolute text legibility in Light and Dark mode */}
      <motion.div
        aria-hidden="true"
        style={{ y: overlayY }}
        className="absolute inset-0 -z-[2] bg-gradient-to-r from-[#071f36]/98 via-[#004b87]/85 to-[#071f36]/70 dark:from-[#0c0c0c]/98 dark:via-[#121212]/92 dark:to-[#071f36]/80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[1] bg-radial-at-t from-transparent via-[#071f36]/40 to-[#071f36]/90 dark:via-[#0c0c0c]/50 dark:to-[#0c0c0c]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-[1] h-32 bg-gradient-to-t from-paper dark:from-[#121212] to-transparent"
      />

      {/* Main Grid Hero Content */}
      <div className="section-padding mx-auto grid max-w-content gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        {/* Left Column: Premium Value Proposition */}
        <div>
          {/* Top Pill: Rating & Location Authority */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-5 inline-flex flex-wrap items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md dark:border-[#00a3e0]/30 dark:bg-[#00a3e0]/10"
          >
            <div className="flex items-center gap-1 text-gold-soft dark:text-[#38bdf8]">
              <Star size={13} className="fill-current text-gold-soft dark:text-[#38bdf8]" />
              <span>4.9/5 Rating</span>
            </div>
            <span className="text-white/40">•</span>
            <div className="flex items-center gap-1 text-white/90 dark:text-gray-200">
              <MapPin size={13} className="text-gold-soft dark:text-[#00a3e0]" />
              <span>Serving Edmonton & Across Alberta</span>
            </div>
          </motion.div>

          {/* Premium Headline */}
          <h1 className="font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            <motion.span custom={1} variants={fadeUp} initial="hidden" animate="show" className="block">
              Precision Moving.
            </motion.span>
            <motion.span
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="block bg-gradient-to-r from-gold-soft via-white to-gold-soft bg-clip-text text-transparent dark:from-[#00a3e0] dark:via-[#38bdf8] dark:to-[#00a3e0]"
            >
              Absolute Peace of Mind.
            </motion.span>
          </h1>

          {/* Subtitle / Value description */}
          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg dark:text-gray-300"
          >
            Edmonton&rsquo;s trusted full-service moving specialists. We provide dedicated single-crew continuity, guaranteed binding quotes, and white-glove furniture protection for homes and businesses.
          </motion.p>

          {/* Key Feature Badges */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-white/90 dark:text-gray-200"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400 dark:text-[#00a3e0]" />
              <span>One Dedicated Crew</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400 dark:text-[#00a3e0]" />
              <span>Zero Surprise Fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400 dark:text-[#00a3e0]" />
              <span>Full Cargo Insurance</span>
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
              className="group flex items-center gap-2.5 rounded-sm bg-white px-7 py-3.5 text-xs font-bold text-navy shadow-xl transition-all hover:bg-gold-soft hover:text-navy-deep dark:bg-[#00a3e0] dark:text-[#092634] dark:shadow-[0_0_25px_rgba(0,163,224,0.4)] dark:hover:bg-[#38bdf8]"
            >
              <span>Request Free Moving Quote</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href={BUSINESS.phoneHref}
              className="flex items-center gap-2 rounded-sm border border-white/25 bg-white/10 px-6 py-3.5 text-xs font-semibold text-white backdrop-blur transition-all hover:bg-white/20 dark:border-white/15 dark:hover:border-[#00a3e0]/50"
            >
              <Phone size={15} className="text-gold-soft dark:text-[#00a3e0]" />
              <span>{BUSINESS.phone}</span>
            </a>
          </motion.div>

          {/* Trust Guarantees */}
          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/15 pt-6 text-xs text-white/75 dark:border-white/10 dark:text-gray-400"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-gold-soft dark:text-[#00a3e0]" />
              <span>WCB Alberta Certified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-gold-soft dark:text-[#00a3e0]" />
              <span>On-Time Arrival Guarantee</span>
            </div>
          </motion.div>

          {/* Interactive Scene Thumbnail Switcher */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex items-center gap-2"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60 dark:text-gray-400">
              Explore Fleet & Crew:
            </span>
            <div className="flex items-center gap-1.5">
              {HERO_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`rounded-full px-3 py-1 text-[10px] font-bold transition-all ${
                    activeSceneIndex === idx
                      ? "bg-white text-navy shadow-md dark:bg-[#00a3e0] dark:text-[#092634]"
                      : "border border-white/20 bg-white/10 text-white hover:bg-white/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
                  }`}
                >
                  {scene.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Sleek Glassmorphism Quote Card */}
        <div className="flex justify-center lg:justify-end">
          <HeroQuickQuote />
        </div>
      </div>
    </section>
  );
}
