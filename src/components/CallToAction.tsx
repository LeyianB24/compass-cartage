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
    <section className="relative isolate overflow-hidden bg-[#071426] dark:bg-[#030914] text-[#f7f6f2]">
      {/* Full-bleed backdrop photograph with a slow Ken-Burns zoom so the
          band feels alive without pulling focus. */}
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

      {/* Navy wash for legibility — heavier on the left where the text sits,
          lighter on the right so the photograph still breathes. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[1] bg-gradient-to-r from-[#071426]/95 via-[#071426]/85 to-[#071426]/65 dark:from-[#030914]/95 dark:via-[#030914]/85 dark:to-[#030914]/65"
      />

      <div className="section-padding mx-auto flex max-w-content flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
        <div className="max-w-xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-2xl font-semibold text-[#f7f6f2] md:text-3xl"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 text-sm text-[#f7f6f2]/80"
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
            className="group flex shrink-0 items-center gap-2 rounded-sm bg-gold px-7 py-3.5 text-sm font-semibold text-[#071426] transition-colors hover:bg-gold-soft"
          >
            Get a Free Quote
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
