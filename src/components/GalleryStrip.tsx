// src/components/GalleryStrip.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GALLERY } from "@/lib/images";

const AUTO_MS = 4200;

/**
 * "A look at moving day" — a full-bleed auto-advancing slideshow of the
 * moving-day photographs. Crossfades between frames, with prev/next
 * controls and dot indicators. Pauses on hover so users can dwell on a
 * frame. Respects reduced-motion via globals.css (animations short-circuit).
 */
export default function GalleryStrip() {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);

  const paginate = useCallback((d: number) => {
    setState(([i]) => {
      const next = (i + d + GALLERY.length) % GALLERY.length;
      return [next, d];
    });
  }, []);

  // Auto-advance loop
  useEffect(() => {
    const id = setInterval(() => setState(([i]) => [(i + 1) % GALLERY.length, 1]), AUTO_MS);
    return () => clearInterval(id);
  }, []);

  const img = GALLERY[index];

  return (
    <section className="relative isolate overflow-hidden border-y border-hairline bg-navy-deep">
      {/* Slideshow frame — fixed aspect, crossfades between photos */}
      <div className="relative h-[60vh] min-h-[420px] w-full md:h-[68vh]">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
            {/* Bottom legibility wash so controls + caption stay readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/20 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption + controls docked at the base */}
      <div className="section-padding absolute inset-x-0 bottom-0 mx-auto flex max-w-content items-end justify-between pb-6">
        <div className="max-w-lg">
          <p className="eyebrow mb-2 text-gold-soft">A look at moving day</p>
          <h2 className="font-display text-2xl font-semibold text-paper md:text-3xl">
            Real crews, real homes, real care
          </h2>
          <p className="mt-2 text-xs text-paper/70">
            {img.alt || "A moment from the job."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Dot indicators */}
          <div className="hidden items-center gap-1.5 sm:flex">
            {GALLERY.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setState([i, i > index ? 1 : -1])}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-gold" : "w-1.5 bg-paper/40 hover:bg-paper/70"
                }`}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous slide"
              onClick={() => paginate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-paper/25 bg-paper-muted/5 text-paper backdrop-blur transition-colors hover:bg-paper-muted/15"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => paginate(1)}
              className="flex h-10 w-10 items-center justify-center rounded-sm border border-paper/25 bg-paper-muted/5 text-paper backdrop-blur transition-colors hover:bg-paper-muted/15"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
