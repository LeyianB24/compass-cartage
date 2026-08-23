// src/components/AboutAuthority.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, MapPin, Award, ArrowRight, Quote } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export default function AboutAuthority() {
  return (
    <section className="relative border-b border-hairline bg-paper py-20 dark:bg-[#121212] md:py-28">
      <div className="section-padding mx-auto max-w-content">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Authentic Local Imagery & Stats Badge */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-hairline shadow-lg dark:border-white/10">
              <Image
                src={IMAGES.indoorsWithTools.src}
                alt={IMAGES.indoorsWithTools.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent dark:from-[#121212]/80" />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 rounded-card border border-hairline bg-paper-muted p-5 shadow-xl dark:border-white/10 dark:bg-[#1e1e1e] sm:bottom-6 sm:right-6 sm:max-w-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-navy/10 text-navy dark:bg-[#00a3e0]/15 dark:text-[#00a3e0]">
                  <Award size={24} />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-navy-deep dark:text-white">
                    12+ Years
                  </p>
                  <p className="text-xs font-semibold text-slate-light dark:text-slate">
                    Serving Edmonton & Across Alberta
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: About Us & Community Focus */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow text-navy dark:text-[#00a3e0]">About Us</span>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white sm:text-4xl">
              Edmonton&rsquo;s Dependable Relocation Specialists
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate dark:text-slate">
              Founded on the belief that moving should be seamless and honest, {BUSINESS.name} has grown from a single dedicated truck into one of Alberta&rsquo;s most trusted moving teams. We treat every home with utmost care, using top-tier protective equipment and trained full-time staff.
            </p>

            {/* Local Trust Badges Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link
                href="/about"
                className="group flex items-start gap-3 rounded-card border border-hairline bg-paper-muted p-4 transition-all hover:border-navy dark:border-white/10 dark:bg-[#1e1e1e] dark:hover:border-[#00a3e0]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gold-soft/20 text-navy-deep dark:bg-[#00a3e0]/20 dark:text-[#00a3e0]">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-navy-deep group-hover:text-navy dark:text-white dark:group-hover:text-[#00a3e0]">
                    Dedicated Movers
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate dark:text-slate">
                    Background-checked, full-time professionals, never temporary labor.
                  </p>
                </div>
              </Link>

              <Link
                href="/service-area"
                className="group flex items-start gap-3 rounded-card border border-hairline bg-paper-muted p-4 transition-all hover:border-navy dark:border-white/10 dark:bg-[#1e1e1e] dark:hover:border-[#00a3e0]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gold-soft/20 text-navy-deep dark:bg-[#00a3e0]/20 dark:text-[#00a3e0]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-navy-deep group-hover:text-navy dark:text-white dark:group-hover:text-[#00a3e0]">
                    Service Area Map
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate dark:text-slate">
                    Daily routes across Edmonton, St. Albert, Sherwood Park & Red Deer.
                  </p>
                </div>
              </Link>
            </div>

            {/* Testimonial Quote Pill */}
            <div className="mt-6 flex items-center gap-3 rounded-card border border-hairline bg-paper-muted p-4 dark:border-white/10 dark:bg-[#1e1e1e]">
              <Quote size={20} className="shrink-0 text-gold-soft dark:text-[#00a3e0]" />
              <p className="text-xs italic text-slate dark:text-gray-300">
                &ldquo;Arrived right at 8:00 AM, wrapped every piece of oak furniture, and the total was exactly what was quoted.&rdquo;
                <span className="ml-1.5 not-italic font-semibold text-navy-deep dark:text-white">— Sarah M., Edmonton</span>
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-sm bg-navy px-6 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-navy-deep dark:bg-[#00a3e0] dark:text-[#092634] dark:hover:bg-[#38bdf8]"
              >
                <span>Learn More About Us</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/service-area"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:underline dark:text-[#00a3e0]"
              >
                <span>Check Coverage Zones</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
