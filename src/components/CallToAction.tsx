// src/components/CallToAction.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "@/lib/images";

type CallToActionProps = {
  heading?: string;
  subtext?: string;
  /** Override the default backdrop photograph. */
  image?: { src: string; alt: string };
};

export default function CallToAction({
  heading = "Ready to book your move?",
  subtext = "Tell us where you're headed and we'll get back to you with a free, no-obligation quote.",
  image = IMAGES.truckSunnyDay,
}: CallToActionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep dark:bg-[#070c14] text-white">
      {/* Full-bleed backdrop photograph with a slow Ken-Burns zoom */}
      <motion.div
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 8, ease: "easeOut" }}
        className="absolute inset-0 -z-[2]"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Navy wash for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[1] bg-gradient-to-r from-navy-deep/95 via-navy/85 to-navy-deep/70 dark:from-[#070c14]/98 dark:via-[#070c14]/90 dark:to-[#0a131f]/80"
      />

      <div className="section-padding mx-auto flex max-w-content flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
        <div className="max-w-xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-2xl font-semibold text-white md:text-3xl"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 text-sm text-white/85 dark:text-gray-300"
          >
            {subtext}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/quote"
            className="group flex shrink-0 items-center gap-2 rounded-xs bg-gold px-7 py-3.5 text-sm font-bold text-navy-deep transition-all hover:bg-gold-soft hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
          >
            <span>Get a Free Quote</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
