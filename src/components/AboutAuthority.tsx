// src/components/AboutAuthority.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, MapPin, Award, ArrowRight, Quote, Lock } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export default function AboutAuthority() {
  return (
    <section className="relative border-b border-hairline bg-paper py-20 dark:bg-[#070c14] md:py-28">
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
            <div className="relative aspect-[4/3] overflow-hidden rounded-xs border border-hairline shadow-xl dark:border-white/10">
              <Image
                src={IMAGES.indoorsWithTools.src}
                alt={IMAGES.indoorsWithTools.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent dark:from-[#070c14]/80" />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 rounded-xs border border-gold/30 bg-paper-muted p-5 shadow-2xl dark:border-gold/30 dark:bg-[#0f172a] sm:bottom-6 sm:right-6 sm:max-w-xs">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xs bg-gold/15 text-gold-soft dark:text-gold">
                  <Award size={24} />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-navy-deep dark:text-white">
                    12+ Years
                  </p>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-light dark:text-slate">
                    Continuous Alberta Operation
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
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
              <Lock size={12} />
              <span>Institutional Relocation Firm</span>
            </div>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white sm:text-4xl lg:text-5xl">
              Edmonton&rsquo;s Standard for Chain-of-Custody Moving
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate dark:text-slate">
              Founded on the principle of actuarial precision and unbroken chain-of-custody, {BUSINESS.name} has eliminated the common failures of broker-driven moving. We deploy dedicated full-time relocation technicians, air-ride transit vehicles, and standardized architectural floor and doorway shielding.
            </p>

            {/* Local Trust Badges Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link
                href="/about"
                className="group flex items-start gap-3 rounded-xs border border-hairline bg-paper-muted p-4 transition-all hover:border-gold dark:border-white/10 dark:bg-[#0f172a] dark:hover:border-gold"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-gold/15 text-gold-soft dark:text-gold">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-navy-deep group-hover:text-gold dark:text-white dark:group-hover:text-gold-soft">
                    Permanent Full-Time Crew
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate dark:text-slate">
                    Vetted relocation specialists. Never day labor or sub-brokered teams.
                  </p>
                </div>
              </Link>

              <Link
                href="/service-area"
                className="group flex items-start gap-3 rounded-xs border border-hairline bg-paper-muted p-4 transition-all hover:border-gold dark:border-white/10 dark:bg-[#0f172a] dark:hover:border-gold"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-gold/15 text-gold-soft dark:text-gold">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-navy-deep group-hover:text-gold dark:text-white dark:group-hover:text-gold-soft">
                    Capital Region Dispatch
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate dark:text-slate">
                    Daily routes across Edmonton, St. Albert, Sherwood Park, Leduc & Red Deer.
                  </p>
                </div>
              </Link>
            </div>

            {/* Testimonial Quote Pill */}
            <div className="mt-6 flex items-center gap-3 rounded-xs border border-hairline bg-paper-muted p-4 dark:border-white/10 dark:bg-[#0f172a]">
              <Quote size={20} className="shrink-0 text-gold" />
              <p className="text-xs italic text-slate dark:text-gray-300">
                &ldquo;Arrived precisely at 8:00 AM, sealed every doorway jamb, and the final invoice matched the binding quote to the cent.&rdquo;
                <span className="ml-1.5 not-italic font-semibold text-navy-deep dark:text-white">— Sarah M., Windermere Edmonton</span>
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xs bg-navy-deep px-6 py-3 text-xs font-bold text-gold-soft shadow-sm transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
              >
                <span>Read Institutional Overview</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/service-area"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-deep hover:text-gold dark:text-gold-soft dark:hover:underline"
              >
                <span>View Service Coverage Zones</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
