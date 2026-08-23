// src/components/ProcessTimeline.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, PackageCheck, Truck, Sparkles, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "Instant Quote",
    tagline: "Transparent & Binding",
    description:
      "Tell us your pickup address, destination, and inventory list. Receive a detailed, itemized quote within minutes with zero hidden surcharges.",
    icon: Calculator,
  },
  {
    number: "02",
    title: "Packing & Prep",
    tagline: "White-Glove Protection",
    description:
      "Our uniformed crew arrives on time with thick padded blankets, custom stretch wrapping, doorframe bumpers, and floor runners.",
    icon: PackageCheck,
  },
  {
    number: "03",
    title: "Secure Transit",
    tagline: "Insured Direct Haul",
    description:
      "Belongings are secured with heavy-duty ratchet straps inside our air-ride trucks, driven directly to your destination across Alberta.",
    icon: Truck,
  },
  {
    number: "04",
    title: "Unload & Placement",
    tagline: "Settled In Seamlessly",
    description:
      "We place every box and furniture item directly into its assigned room, assemble bed frames and dining tables, and inspect everything before leaving.",
    icon: Sparkles,
  },
];

export default function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative overflow-hidden bg-navy-deep py-20 text-white dark:bg-[#0c0c0c] md:py-28">
      {/* Background glow & subtle motif */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-navy/20 blur-3xl dark:bg-[#00a3e0]/10" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-gold-soft/10 blur-3xl dark:bg-[#00a3e0]/10" />

      <div className="section-padding mx-auto max-w-content">
        {/* Section Header */}
        <div className="text-center">
          <span className="eyebrow text-gold-soft dark:text-[#00a3e0]">Our Process</span>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            How We Move You — Step by Step
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80 dark:text-gray-400">
            A frictionless relocation experience engineered from first inquiry to final box placement.
          </p>
        </div>

        {/* Desktop Connected Steps */}
        <div className="relative mt-16">
          {/* Connecting dashed route line */}
          <div className="absolute left-[10%] right-[10%] top-1/4 hidden h-0.5 -translate-y-1/2 border-t-2 border-dashed border-white/20 dark:border-[#00a3e0]/30 lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveStep(index)}
                  className={`group relative cursor-pointer rounded-card border p-6 transition-all duration-300 ${
                    isActive
                      ? "border-gold-soft bg-white/10 shadow-xl dark:border-[#00a3e0] dark:bg-[#1e1e1e] dark:shadow-[0_0_25px_rgba(0,163,224,0.2)]"
                      : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10 dark:border-white/5 dark:bg-[#141414] dark:hover:border-[#00a3e0]/40"
                  }`}
                >
                  {/* Step Node Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-gold-soft dark:text-[#00a3e0]">
                      {step.number}
                    </span>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                        isActive
                          ? "border-gold-soft bg-gold-soft/20 text-gold-soft dark:border-[#00a3e0] dark:bg-[#00a3e0]/20 dark:text-[#00a3e0]"
                          : "border-white/20 bg-white/5 text-white/70 dark:border-white/10 dark:text-gray-400"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="font-display mt-6 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-gold-soft dark:text-[#38bdf8]">
                    {step.tagline}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-white/75 dark:text-gray-400">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-card border border-white/15 bg-white/5 p-6 backdrop-blur dark:border-[#00a3e0]/20 dark:bg-[#1a1a1a] sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-soft/20 text-gold-soft dark:bg-[#00a3e0]/20 dark:text-[#00a3e0]">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Guaranteed On-Time Arrival & Upfront Rates
              </p>
              <p className="text-xs text-white/70 dark:text-gray-400">
                Backed by 100% cargo insurance, WCB Alberta coverage, and trained crews.
              </p>
            </div>
          </div>

          <Link
            href="/quote"
            className="flex shrink-0 items-center gap-2 rounded-sm bg-gold-soft px-6 py-3 text-xs font-bold text-navy-deep transition-all hover:bg-white dark:bg-[#00a3e0] dark:text-[#092634] dark:hover:bg-[#38bdf8]"
          >
            <span>Start Your Move Today</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
