// src/components/Hero.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Users,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Truck,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";

interface FleetSlide {
  id: string;
  src: string;
  alt: string;
  vehicleName: string;
  capacityFit: string;
  moveSizeId: string;
}

const FLEET_SLIDES: FleetSlide[] = [
  {
    id: "transitVanMain",
    src: "/images/hero 2.jpg",
    alt: "Compass Cartage high-roof Ford Transit commercial moving van on location in Edmonton",
    vehicleName: "High-Roof Ford Transit Van",
    capacityFit: "1–2 Bedrooms / Condos",
    moveSizeId: "1-bedroom",
  },
  {
    id: "lorry1",
    src: "/images/lorry1.jpeg",
    alt: "Compass Cartage 26ft commercial freight moving truck with hydraulic tailgate lift",
    vehicleName: "26ft Commercial Freight Truck",
    capacityFit: "3–5 Bedrooms & Estates",
    moveSizeId: "3-bedroom",
  },
  {
    id: "lorry2",
    src: "/images/lorry2.jpeg",
    alt: "Compass Cartage heavy freight transport truck and chassis loading bay",
    vehicleName: "Commercial Heavy Transport",
    capacityFit: "Large Homes & Intercity",
    moveSizeId: "4-plus-bedroom",
  },
  {
    id: "lorry3",
    src: "/images/lorry3.jpeg",
    alt: "Compass Cartage Edmonton fleet depot and commercial transport trucks",
    vehicleName: "Edmonton Commercial Dispatch",
    capacityFit: "Offices & Corporate Floors",
    moveSizeId: "office-large",
  },
  {
    id: "hero3",
    src: "/images/hero 3.jpg",
    alt: "Compass Cartage heavy-duty tri-axle enclosed moving trailer for Alberta moves",
    vehicleName: "Tri-Axle Enclosed Cargo Trailer",
    capacityFit: "Intercity & Alberta Hauls",
    moveSizeId: "3-bedroom",
  },
  {
    id: "hero8",
    src: "/images/hero 8.jpg",
    alt: "Compass Cartage weather-sealed tri-axle moving trailer stationed at Edmonton hub",
    vehicleName: "Weather-Sealed Moving Trailer",
    capacityFit: "Multi-Room & Long-Distance",
    moveSizeId: "4-plus-bedroom",
  },
  {
    id: "transitResidentialCurb",
    src: "/images/transit-van-residential-curb.jpeg",
    alt: "Compass Cartage high-roof white Transit van on a residential Edmonton street",
    vehicleName: "Residential Delivery Van",
    capacityFit: "Townhomes & Suites",
    moveSizeId: "2-bedroom",
  },
  {
    id: "transitSideLoaded",
    src: "/images/transit-van-side-loaded.jpeg",
    alt: "Compass Cartage moving van side bay loaded with padded furniture and sofa",
    vehicleName: "Padded High-Roof Van Bay",
    capacityFit: "Studio & Fragile Furniture",
    moveSizeId: "studio",
  },
  {
    id: "transitInteriorCargo",
    src: "/images/transit-van-interior-cargo.jpeg",
    alt: "Interior cargo bay perspective showing ceiling clearance, safety partition and padded furniture",
    vehicleName: "Secured Interior Cargo Vault",
    capacityFit: "1–2 Bedrooms / Express Moves",
    moveSizeId: "1-bedroom",
  },
];

const QUICK_ESTIMATE_SIZES = [
  { label: "1-2 Bed Apt", size: "1-bedroom" },
  { label: "3-4 Bed Home", size: "3-bedroom" },
  { label: "5+ Bed Home", size: "4-plus-bedroom" },
  { label: "Commercial", size: "office-large" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Swipe detection ref
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setIsPlaying(false);
    }

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

  // Autoplay timer (5s interval, pauses when reduced motion, hovered, focused, or explicitly paused)
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion || isUserInteracting) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPlaying, prefersReducedMotion, isUserInteracting, nextSlide]);

  // Touch Swipe handlers
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
      const minSwipeDistance = 50;
      if (deltaX > minSwipeDistance) {
        nextSlide();
      } else if (deltaX < -minSwipeDistance) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsUserInteracting(false);
  };

  // Keyboard navigation when focused inside carousel container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    } else if (e.key === " " && e.target === heroRef.current) {
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
      aria-label="Compass Cartage Fleet Showcase"
      className="relative isolate overflow-hidden bg-[#070c14] text-white pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-hairline dark:border-white/10 outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {/* FULL-BLEED BACKGROUND CAROUSEL */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
        {/* Render slide 1 statically for no-JS and initial SSR hydration */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            prefersReducedMotion ? "opacity-100" : ""
          }`}
        >
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
                  opacity: { duration: 0.7, ease: "easeInOut" },
                  scale: { duration: 6, ease: "linear" },
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
                  className="object-cover object-center filter saturate-[1.05] contrast-[1.06]"
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* DARK ARCHITECTURAL GRADIENT OVERLAY (WCAG AA Contrast >= 4.5:1) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#070c14]/95 via-[#070c14]/85 to-[#070c14]/65"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#070c14] via-transparent to-[#070c14]/60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_45%_35%,transparent,rgba(7,12,20,0.55))]"
        />
      </div>

      {/* BACKGROUND AMBIENT GLOW & ACCENT GRID */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(197,168,128,0.14),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_60%,transparent_100%)]"
      />

      <div className="section-padding mx-auto max-w-content">
        <div className="max-w-3xl">
          {/* Top Dispatch Status Pill */}
          <div className="mb-5 inline-flex flex-wrap items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
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
            <a
              href="https://maps.google.com/?q=Compass+Cartage+Edmonton"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gold-soft hover:underline"
            >
              <span>4.9★ Rated Local Movers</span>
            </a>
          </div>

          {/* MAIN H1 HEADLINE: Exactly as required */}
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
            <span className="block text-white">Edmonton Movers —</span>
            <span className="block bg-gradient-to-r from-gold-soft via-white to-gold bg-clip-text text-transparent">
              One Dedicated Crew, Upfront Pricing
            </span>
          </h1>

          {/* SUBHEAD: Precision Relocation line */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            <strong className="text-white font-semibold">Precision Relocation.</strong> The same vetted, full-time crew loads your home, drives directly to your destination, and sets everything in place. Zero brokers, zero day labor, zero surprise fees.
          </p>

          {/* EXACTLY THREE TRUST CHIPS */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs font-medium text-white/90">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-gold-soft shrink-0" />
              <span>Upfront Price Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-gold-soft shrink-0" />
              <span>100% Insured & Licensed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-gold-soft shrink-0" />
              <span>Dedicated Single Crew</span>
            </div>
          </div>

          {/* EXACTLY TWO CALL-TO-ACTIONS */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* Primary CTA: Get a Free Quote */}
            <Link
              href="/quote"
              className="btn-shimmer group inline-flex items-center gap-2.5 rounded-xs bg-gold px-7 py-3.5 text-xs sm:text-sm font-bold text-navy-deep shadow-xl transition-all hover:bg-gold-soft hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span>Get a Free Quote</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Secondary CTA: Tap-to-Call */}
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center gap-2 rounded-xs border border-white/25 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white backdrop-blur transition-all hover:border-gold/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Phone size={16} className="text-gold-soft" />
              <span>Call Dispatch: {BUSINESS.phone}</span>
            </a>
          </div>

          {/* QUICK ESTIMATE CHIPS (pre-fill /quote via ?size=) */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/15 pt-6">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft">
              Quick Estimate:
            </span>
            {QUICK_ESTIMATE_SIZES.map((sz) => (
              <Link
                key={sz.label}
                href={`/quote?size=${sz.size}`}
                className="rounded-xs border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 transition-all hover:border-gold hover:bg-gold/15 hover:text-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {sz.label}
              </Link>
            ))}
          </div>
        </div>

        {/* BOTTOM FLEET CAROUSEL CONTROLS & VEHICLE CAPTION CHIP */}
        <div className="mt-12 lg:mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10 pt-6">
          {/* Active Vehicle Caption Chip: vehicle name + what it fits -> /quote?moveSize=<id> */}
          <Link
            href={`/quote?moveSize=${activeSlide.moveSizeId}`}
            title={`Get quote for ${activeSlide.vehicleName}`}
            className="group inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-[#0a1320]/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:border-gold hover:bg-gold/15"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-gold">
              <Truck size={12} />
            </div>
            <span>
              <strong className="text-gold-soft font-bold">{activeSlide.vehicleName}</strong>
              <span className="text-white/60 mx-1.5">·</span>
              <span className="text-white/90">{activeSlide.capacityFit}</span>
            </span>
            <span className="font-mono text-[10px] text-gold group-hover:translate-x-0.5 transition-transform">
              Quote →
            </span>
          </Link>

          {/* Carousel Interactive Controls (Arrows, Dots, Play/Pause) */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
              aria-label={isPlaying ? "Pause background slideshow" : "Play background slideshow"}
              title={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
            </button>

            {/* Prev Arrow */}
            <button
              type="button"
              onClick={prevSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
              aria-label="Previous fleet slide"
              title="Previous fleet slide"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Slide Dot Indicators */}
            <div className="flex items-center gap-1.5 px-1" role="tablist" aria-label="Slides">
              {FLEET_SLIDES.map((slide, idx) => {
                const isActive = currentSlide === idx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Slide ${idx + 1}: ${slide.vehicleName}`}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isActive ? "w-6 bg-gold" : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                );
              })}
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={nextSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
              aria-label="Next fleet slide"
              title="Next fleet slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
