// src/components/Hero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Phone, ShieldCheck, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import HeroQuickQuote from "@/components/HeroQuickQuote";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  // Subtle parallax on the backdrop image
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "12%"]);
  const overlayY = useTransform(scrollY, [0, 600], ["0%", "6%"]);

  return (
    <section className="relative isolate overflow-hidden border-b border-hairline bg-navy-deep dark:bg-[#121212] text-white">
      {/* Backdrop photograph with parallax drift */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-[2] scale-110">
        <Image
          src={IMAGES.truckSunnyDay.src}
          alt={IMAGES.truckSunnyDay.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Legibility overlays tuned for both light and dark modes */}
      <motion.div
        aria-hidden="true"
        style={{ y: overlayY }}
        className="absolute inset-0 -z-[1] bg-gradient-to-r from-[#002d52]/95 via-[#004b87]/85 to-[#002d52]/75 dark:from-[#121212]/98 dark:via-[#121212]/90 dark:to-[#071f36]/75"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-[1] h-24 bg-gradient-to-t from-paper dark:from-[#121212] to-transparent"
      />

      <div className="section-padding mx-auto grid max-w-content gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        {/* Left Column: Core Value Proposition */}
        <div>
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-gold-soft backdrop-blur dark:border-[#00a3e0]/30 dark:bg-[#00a3e0]/10 dark:text-[#38bdf8]"
          >
            <MapPin size={13} className="text-gold-soft dark:text-[#00a3e0]" />
            <span>MOVING EDMONTON & ALBERTA SINCE 2012</span>
          </motion.div>

          <h1 className="font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            <motion.span custom={1} variants={fadeUp} initial="hidden" animate="show" className="block">
              EDMONTON&rsquo;S
            </motion.span>
            <motion.span custom={2} variants={fadeUp} initial="hidden" animate="show" className="block text-gold-soft dark:text-[#00a3e0]">
              PREMIER MOVERS.
            </motion.span>
          </h1>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-5 max-w-lg text-base leading-relaxed text-white/85 md:text-lg"
          >
            Secure, efficient, and friendly relocation services. From downtown condos to full corporate
            relocations across Alberta, our experienced team delivers on time with zero hidden fees.
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/quote"
              className="flex items-center gap-2 rounded-sm bg-white px-7 py-3.5 text-xs font-bold text-navy shadow-lg transition-all hover:bg-gold-soft hover:text-navy-deep dark:bg-[#00a3e0] dark:text-[#092634] dark:shadow-[0_0_20px_rgba(0,163,224,0.4)] dark:hover:bg-[#38bdf8]"
            >
              <span>Get a Free Quote</span>
              <ArrowRight size={15} />
            </Link>

            <a
              href={BUSINESS.phoneHref}
              className="flex items-center gap-2 rounded-sm border border-white/25 bg-white/5 px-6 py-3.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              <Phone size={15} className="text-gold-soft dark:text-[#00a3e0]" />
              <span>{BUSINESS.phone}</span>
            </a>
          </motion.div>

          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-6 text-xs text-white/75"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-gold-soft dark:text-[#00a3e0]" />
              <span>100% Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-gold-soft dark:text-[#00a3e0]" />
              <span>WCB Alberta Certified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-gold-soft dark:text-[#00a3e0]" />
              <span>Transparent Binding Quotes</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Quote Card */}
        <div className="flex justify-center lg:justify-end">
          <HeroQuickQuote />
        </div>
      </div>
    </section>
  );
}
