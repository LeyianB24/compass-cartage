// src/components/Hero.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  Lock,
  Truck,
  Package,
  Calendar,
  Sparkles,
  ChevronRight,
  Clock,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

const FLEET_DECK = [
  {
    id: "lorry1",
    tag: "Primary Fleet",
    title: "26ft Commercial Freight Truck",
    subtitle: "Ideal for 3–5 bedroom homes & full office relocations",
    specs: ["Hydraulic Liftgate", "Quilted Blankets", "Floor Runners"],
    img: IMAGES.lorry1,
  },
  {
    id: "transitVan",
    tag: "Express Relocation",
    title: "High-Roof Ford Transit Cargo Van",
    subtitle: "Built for Edmonton apartments, condos & urgent single-day moves",
    specs: ["Tight Access Ready", "Padded Tie-Downs", "Rapid Loading"],
    img: IMAGES.transitVanResidentialCurb,
  },
  {
    id: "trailer",
    tag: "Intercity Haul",
    title: "Tri-Axle Enclosed Moving Trailer",
    subtitle: "Weather-sealed protection for Calgary, Red Deer & province-wide transit",
    specs: ["Weather Sealed", "Reinforced Axles", "Climate Shield"],
    img: IMAGES.enclosedTrailerBlue,
  },
  {
    id: "crew",
    tag: "Our People",
    title: "Dedicated Moving Professionals",
    subtitle: "Uniformed, background-checked full-time movers — zero day labor",
    specs: ["One Crew Start to Finish", "Disassembly & Setup", "Direct Cell Contact"],
    img: IMAGES.hero1,
  },
];

const QUICK_ESTIMATE_SIZES = [
  { label: "1-2 Bed Apt", href: "/quote" },
  { label: "3-4 Bed Home", href: "/quote" },
  { label: "5+ Bed Home", href: "/quote" },
  { label: "Commercial", href: "/quote" },
];

export default function Hero() {
  const [selectedDeckIdx, setSelectedDeckIdx] = useState(0);
  const activeDeckItem = FLEET_DECK[selectedDeckIdx];

  return (
    <section className="relative isolate overflow-hidden bg-[#070c14] text-white pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-hairline dark:border-white/10">
      {/* Background Photograph with Sophisticated Cross-Fade & Ambient Wash */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDeckItem.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.75, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeDeckItem.img.src}
              alt={activeDeckItem.img.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center filter saturate-[1.0] contrast-[1.08]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Multi-layered architectural gradient wash for pristine legibility and cinematic depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#070c14] via-[#070c14]/75 to-[#070c14]/25"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#070c14] via-transparent to-[#070c14]/40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_65%_35%,transparent,rgba(7,12,20,0.45))]"
        />
      </div>

      {/* Background Architectural Ambient Glow & Grid Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(197,168,128,0.14),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_60%,transparent_100%)]"
      />

      <div className="section-padding mx-auto max-w-content">
        {/* Main Grid: Left Column Copy & CTAs, Right Column Visual Fleet Deck */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column (7 cols on lg) */}
          <div className="lg:col-span-7">
            {/* Top Live Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-5 inline-flex flex-wrap items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400">
                  Edmonton Dispatch Online
                </span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1 text-gold-soft">
                <Star size={12} className="fill-current text-gold-soft" />
                <span>4.9★ Rated Local Movers</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]"
            >
              <span className="block">Precision Relocation.</span>
              <span className="block bg-gradient-to-r from-gold-soft via-white to-gold bg-clip-text text-transparent">
                One Dedicated Crew.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
            >
              Edmonton&rsquo;s standard for transparent, stress-free moving. The same vetted crew loads your home, drives directly to your new door, and sets everything in place. Zero brokers, zero surprise fees.
            </motion.p>

            {/* Trust Bullet Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-medium text-white/90"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-gold-soft" />
                <span>Upfront Price Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-gold-soft" />
                <span>100% Insured & Licensed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock size={14} className="text-gold-soft" />
                <span>Never Day Labor</span>
              </div>
            </motion.div>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/quote"
                className="btn-shimmer group inline-flex items-center gap-2.5 rounded-xs bg-gold px-7 py-3.5 text-xs font-bold text-navy-deep shadow-xl transition-all hover:bg-gold-soft hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <span>Get Instant Free Quote</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href={BUSINESS.phoneHref}
                className="inline-flex items-center gap-2 rounded-xs border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold text-white backdrop-blur transition-all hover:border-gold/50 hover:bg-white/10"
              >
                <Phone size={15} className="text-gold-soft" />
                <span>Call Dispatch: {BUSINESS.phone}</span>
              </a>
            </motion.div>

            {/* Quick Sizing Jump Chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.34 }}
              className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6"
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-white/50">
                Quick Estimate:
              </span>
              {QUICK_ESTIMATE_SIZES.map((sz) => (
                <Link
                  key={sz.label}
                  href={sz.href}
                  className="rounded-xs border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 transition-all hover:border-gold hover:bg-gold/10 hover:text-gold-soft"
                >
                  {sz.label}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Fleet & Moving Team Interactive Visual Showcase (5 cols on lg) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative rounded-xs border border-white/15 bg-[#0a1320]/80 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10"
            >
              {/* Card Header & Tab Switcher */}
              <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gold" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    Our Dedicated Fleet
                  </span>
                </div>
                <span className="rounded-xs bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-gold-soft">
                  Edmonton Owned
                </span>
              </div>

              {/* Main Visual Image Deck */}
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xs border border-white/10 bg-navy-deep">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDeckItem.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={activeDeckItem.img.src}
                      alt={activeDeckItem.img.alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    {/* Editorial tint overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070c14]/90 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Badge on Image */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div className="rounded-xs border border-white/15 bg-[#070c14]/85 px-3 py-2 backdrop-blur-md">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-gold">
                      {activeDeckItem.tag}
                    </span>
                    <h3 className="font-display text-xs font-bold text-white">
                      {activeDeckItem.title}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-white/75">
                      {activeDeckItem.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deck Tab Buttons */}
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {FLEET_DECK.map((item, idx) => {
                  const isActive = selectedDeckIdx === idx;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedDeckIdx(idx)}
                      className={`relative rounded-xs border py-2 px-1 text-center transition-all ${
                        isActive
                          ? "border-gold bg-gold/15 text-gold-soft font-bold shadow-sm"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="block truncate font-mono text-[10px] uppercase tracking-wider">
                        {item.tag}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Equipment Spec Pills */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-3">
                {activeDeckItem.specs.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1 rounded-xs bg-white/5 px-2 py-1 font-mono text-[10px] text-white/80"
                  >
                    <CheckCircle2 size={11} className="text-gold" />
                    <span>{spec}</span>
                  </span>
                ))}
              </div>

              {/* Floating Guarantee Chip */}
              <div className="mt-3 flex items-center justify-between rounded-xs border border-gold/25 bg-gold/10 px-3 py-2 text-[11px] text-gold-soft">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span className="font-semibold">Direct Route Guarantee</span>
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 font-medium hover:underline text-white"
                >
                  <span>Learn More</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
