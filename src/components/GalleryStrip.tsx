// src/components/GalleryStrip.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GALLERY } from "@/lib/images";

/**
 * "A look at moving day" — a horizontally-scrolling strip of photographs
 * shown on the home page between Testimonials and the CTA. Gives the
 * many scene-variety images a real home without forcing each one into a
 * dated section. Decorative route line threads along the lower edge to
 * stay on-brand with the rest of the site.
 *
 * Layout: a CSS columns masonry column (avoids JS layout). The strip is
 * horizontally scrollable on small screens and expands into a wide
 * multi-column wall on large screens.
 */
export default function GalleryStrip() {
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-white">
      {/* Section heading */}
      <div className="section-padding mx-auto max-w-content pt-16">
        <p className="eyebrow mb-3">A look at moving day</p>
        <h2 className="font-display text-3xl font-semibold text-navy-deep md:text-4xl">
          Real crews, real homes, real care
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate">
          A few moments from the job — packing, loading, and the moment
          everything lands where it should.
        </p>
      </div>

      {/* Masonry-style wall using CSS columns. Horizontal scroll on small
          screens keeps the strip navigable without a heavy lightbox. */}
      <div className="section-padding mx-auto max-w-content pb-16 pt-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4"
        >
          {GALLERY.map((img, i) => (
            <motion.figure
              key={img.src + i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: (i % 5) * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative w-full overflow-hidden rounded-sm ring-1 ring-hairline"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Subtle navy wash on hover — ties the photo to brand */}
                <div className="absolute inset-0 bg-navy-deep/0 transition-colors duration-500 group-hover:bg-navy-deep/15" />
              </div>
            </motion.figure>
          ))}
        </motion.div>
      </div>

      {/* Signature route-line motif along the lower edge */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-10 w-full opacity-50"
        viewBox="0 0 1200 50"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 38 C 200 8, 400 48, 600 22 S 1000 8, 1200 34"
          stroke="#c9a227"
          strokeWidth="1.1"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
      </svg>
    </section>
  );
}
