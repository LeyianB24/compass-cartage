// src/components/Hero.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Phone,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Star,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";

interface FleetSlide {
  id: string;
  src: string;
  alt: string;
}

const FLEET_SLIDES: FleetSlide[] = [
  { id: "hero2", src: "/images/hero 2.jpg", alt: "Compass Cartage moving van in Edmonton" },
  { id: "lorry1", src: "/images/lorry1.jpeg", alt: "Compass Cartage 26ft commercial freight moving truck" },
  { id: "lorry2", src: "/images/lorry2.jpeg", alt: "Compass Cartage heavy freight transport truck" },
  { id: "lorry3", src: "/images/lorry3.jpeg", alt: "Compass Cartage Edmonton fleet depot" },
  { id: "hero3", src: "/images/hero 3.jpg", alt: "Compass Cartage tri-axle enclosed moving trailer" },
  { id: "hero8", src: "/images/hero 8.jpg", alt: "Compass Cartage weather-sealed moving trailer" },
  { id: "transitResidentialCurb", src: "/images/transit-van-residential-curb.jpeg", alt: "Compass Cartage residential delivery van" },
  { id: "transitSideLoaded", src: "/images/transit-van-side-loaded.jpeg", alt: "Compass Cartage moving van loaded with furniture" },
];

const STATS = [
  { value: "10+", label: "Years of Expertise" },
  { value: "500+", label: "Moves Completed" },
  { value: "10+", label: "Cities Served" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) setIsPlaying(false);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % FLEET_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + FLEET_SLIDES.length) % FLEET_SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion || isUserInteracting) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, prefersReducedMotion, isUserInteracting, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsUserInteracting(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50) nextSlide();
      else if (deltaX < -50) prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsUserInteracting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); prevSlide(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); nextSlide(); }
    else if (e.key === " " && e.target === heroRef.current) {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  const activeSlide = FLEET_SLIDES[currentSlide];

  return (
    <section
      ref={heroRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsUserInteracting(true)}
      onMouseLeave={() => setIsUserInteracting(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Compass Cartage Hero"
      className="relative isolate overflow-hidden bg-[#070c14] text-white outline-none focus-visible:ring-2 focus-visible:ring-gold"
      style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}
    >
      {/* ── FULL-BLEED BACKGROUND ── */}
      <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden="true">
        {prefersReducedMotion ? (
          <Image
            src={FLEET_SLIDES[0].src}
            alt={FLEET_SLIDES[0].alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.8, ease: "easeInOut" },
                scale: { duration: 7, ease: "linear" },
              }}
              className="absolute inset-0"
            >
              <Image
                src={activeSlide.src}
                alt={activeSlide.alt}
                fill
                priority={currentSlide === 0}
                loading={currentSlide === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Left-heavy overlay — text on left, image bleeds through on right */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(7,12,20,0.97) 0%, rgba(7,12,20,0.88) 35%, rgba(7,12,20,0.55) 60%, rgba(7,12,20,0.20) 100%)",
          }}
        />
        {/* Bottom vignette for stats bar */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(7,12,20,0.97) 0%, rgba(7,12,20,0.4) 18%, transparent 40%)",
          }}
        />
        {/* Top vignette */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(7,12,20,0.65) 0%, transparent 30%)",
          }}
        />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative flex flex-1 flex-col">
        {/* Hero body — vertically centered */}
        <div className="flex flex-1 items-center">
          <div className="section-padding mx-auto w-full max-w-content py-28 lg:py-36">
            <div className="max-w-xl lg:max-w-2xl">

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="mb-5 flex items-center gap-3"
              >
                <span className="h-px w-8 bg-gold" aria-hidden="true" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">
                  Edmonton&apos;s Trusted Movers
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
                className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
              >
                Edmonton Movers —<br />
                <span className="text-gold">One Dedicated</span>
                <br />
                <span className="text-white">Crew.</span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
                className="mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg"
              >
                Upfront pricing, fully insured, and the same vetted crew from
                pickup to delivery — zero brokers, zero surprise fees.
              </motion.p>

              {/* Trust chips */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.26, ease: "easeOut" }}
                className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/65"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-gold shrink-0" />
                  Upfront Price Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-gold shrink-0" />
                  100% Insured &amp; Licensed
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="text-gold shrink-0 fill-gold" />
                  4.9★ Google Rated
                </span>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32, ease: "easeOut" }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/quote"
                  className="btn-shimmer group inline-flex items-center gap-2.5 rounded-sm bg-gold px-7 py-3.5 text-sm font-bold text-navy-deep shadow-[0_0_24px_rgba(197,168,128,0.35)] transition-all hover:bg-gold-soft hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(197,168,128,0.5)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span>Get a Free Quote</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href={BUSINESS.phoneHref}
                  className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <Phone size={15} className="text-gold" />
                  <span>Call Dispatch: {BUSINESS.phone}</span>
                </a>
              </motion.div>

            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR: Stats + Carousel controls ── */}
        <div className="relative border-t border-white/10 bg-[#070c14]/70 backdrop-blur-md">
          <div className="section-padding mx-auto max-w-content">
            <div className="flex flex-wrap items-center justify-between gap-4 py-5">

              {/* Stats with vertical dividers */}
              <div className="flex items-center divide-x divide-white/15">
                {STATS.map((stat) => (
                  <div key={stat.label} className="px-6 first:pl-0 last:pr-0">
                    <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-white/50 whitespace-nowrap">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right: carousel nav + scroll cue */}
              <div className="flex items-center gap-5">
                {/* Carousel nav */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((v) => !v)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/50 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                    aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                  >
                    {isPlaying ? <Pause size={11} /> : <Play size={11} className="ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={prevSlide}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/50 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <div className="flex items-center gap-1" role="tablist" aria-label="Slides">
                    {FLEET_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        role="tab"
                        aria-selected={currentSlide === idx}
                        aria-label={`Slide ${idx + 1}`}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentSlide === idx
                            ? "w-5 bg-gold"
                            : "w-1.5 bg-white/25 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/50 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Scroll cue */}
                <div className="hidden items-center gap-2 text-white/35 sm:flex">
                  <span className="text-[11px] font-medium uppercase tracking-wider">
                    Scroll to explore
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15">
                    <ChevronDown size={12} className="animate-bounce" />
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
