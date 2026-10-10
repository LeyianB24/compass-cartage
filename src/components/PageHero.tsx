// src/components/PageHero.tsx
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { ImageAsset } from "@/lib/images";
import { BUSINESS } from "@/lib/constants";

export interface PageHeroStat {
  value: string;
  label: string;
}

export interface PageHeroProps {
  image: ImageAsset;
  eyebrow: string;
  title: string;
  lead?: string;
  stats?: PageHeroStat[];
  hideCta?: boolean;
  ctaText?: string;
  ctaHref?: string;
  /** Right-aligned aside content (e.g. contact details on the quote/contact page). */
  children?: React.ReactNode;
}

const DEFAULT_STATS: PageHeroStat[] = [
  { value: "10+", label: "Years of Expertise" },
  { value: "500+", label: "Moves Completed" },
  { value: "10+", label: "Cities Served" },
];

/**
 * Full-bleed inner-page hero matching the signature visual architecture
 * of the main page Hero: cinematic dark obsidian bedrock (#070c14),
 * three-layer gradient legibility vignettes, gold rule eyebrow,
 * trust guarantee chips, high-contrast CTAs, and bottom reassurance stats bar.
 */
export default function PageHero({
  image,
  eyebrow,
  title,
  lead,
  stats = DEFAULT_STATS,
  hideCta = false,
  ctaText = "Get a Free Quote",
  ctaHref = "/quote",
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#070c14] text-white border-b border-hairline/20 dark:border-white/10">
      {/* ── FULL-BLEED PHOTOGRAPHIC BACKDROP & VIGNETTES ── */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* 1. Left-heavy overlay — text legible on left, photo bleeds on right */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(7,12,20,0.97) 0%, rgba(7,12,20,0.88) 35%, rgba(7,12,20,0.55) 60%, rgba(7,12,20,0.20) 100%)",
          }}
        />

        {/* 2. Bottom vignette — seamless transition to bottom stats bar */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(7,12,20,0.97) 0%, rgba(7,12,20,0.4) 18%, transparent 40%)",
          }}
        />

        {/* 3. Top vignette — blends behind the fixed transparent navbar */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(7,12,20,0.65) 0%, transparent 30%)",
          }}
        />

        {/* 4. Subtle architectural brass drafting grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"
        />
      </div>

      {/* ── HERO CONTENT ── */}
      <div className="relative flex flex-1 flex-col">
        <div className="section-padding mx-auto w-full max-w-content pt-28 pb-14 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20">
          <div className={children ? "grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-end" : "max-w-2xl lg:max-w-3xl"}>
            <div>
              {/* Eyebrow badge matching main page Hero */}
              <div className="mb-4 sm:mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-gold" aria-hidden="true" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-soft">
                  {eyebrow}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white">
                {title}
              </h1>

              {/* Sub-headline / lead */}
              {lead && (
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                  {lead}
                </p>
              )}

              {/* Signature Trust Chips */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/65">
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
              </div>

              {/* High-visibility Action CTAs */}
              {!hideCta && (
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={ctaHref}
                    className="btn-shimmer group inline-flex items-center gap-2.5 rounded-sm bg-gold px-7 py-3.5 text-sm font-bold text-navy-deep shadow-[0_0_24px_rgba(197,168,128,0.35)] transition-all hover:bg-gold-soft hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(197,168,128,0.5)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>

                  <a
                    href={BUSINESS.phoneHref}
                    className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-gold/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Phone size={15} className="text-gold" />
                    <span>Call Dispatch: {BUSINESS.phone}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Optional right-aligned aside/children (e.g. quote form contact details) */}
            {children && (
              <div className="lg:pb-2">
                {children}
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM STATS & REASSURANCE BAR ── */}
        <div className="relative border-t border-white/10 bg-[#070c14]/70 backdrop-blur-md">
          <div className="section-padding mx-auto max-w-content">
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 sm:py-5">
              {/* Stats with vertical dividers */}
              <div className="flex items-center divide-x divide-white/15">
                {stats.map((stat) => (
                  <div key={stat.label} className="px-5 sm:px-6 first:pl-0 last:pr-0">
                    <p className="font-display text-xl sm:text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-white/50 whitespace-nowrap">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right: Certified badges */}
              <div className="hidden sm:flex items-center gap-5 text-xs font-medium text-white/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-gold" />
                  Alberta Transit Certified
                </span>
                <span className="h-3 w-px bg-white/15" />
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-gold" />
                  Single Dedicated Crew
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
