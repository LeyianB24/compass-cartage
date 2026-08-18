// src/components/GalleryStrip.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GALLERY } from "@/lib/images";

const AUTO_MS = 4200;

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
    <section className="relative isolate overflow-hidden border-y border-hairline bg-[#071426] dark:bg-[#030914] text-[#f7f6f2]">
      {/* Slideshow frame */}
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
            {/* Bottom legibility wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/90 via-[#071426]/30 dark:from-[#030914]/95 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content overlay */}
        <div className="section-padding absolute inset-x-0 bottom-0 mx-auto flex max-w-content items-end justify-between pb-8">
          <div className="max-w-md">
            <span className="eyebrow text-[#e4c65c]">Moving Day in Action</span>
            <p className="font-display mt-1 text-lg font-semibold text-[#f7f6f2] md:text-xl">
              {img.alt}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous photo"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label="Next photo"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
