// src/components/ProcessTimeline.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, PackageCheck, Truck, Sparkles, ArrowRight, Shield, Lock } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "Free Upfront Estimate",
    tagline: "Clear Pricing With No Surprises",
    description:
      "We review your rooms, inventory, and move dates in advance. Your rate is quoted clearly before move day with zero hidden fees.",
    icon: Calculator,
    protocol: "Itemized Move Plan",
  },
  {
    number: "02",
    title: "Home & Furniture Prep",
    tagline: "Careful Protection",
    description:
      "Our experienced crew pads furniture with thick quilted blankets and protects doorways and floors before moving a single item.",
    icon: PackageCheck,
    protocol: "Complete Surface Protection",
  },
  {
    number: "03",
    title: "Direct Transit",
    tagline: "One Dedicated Crew",
    description:
      "The same crew that carefully loaded your home drives directly to your destination. Zero transfers, zero broker handoffs.",
    icon: Truck,
    protocol: "Dedicated Moving Truck",
  },
  {
    number: "04",
    title: "Unloading & Room Placement",
    tagline: "Room-by-Room Setup",
    description:
      "We place every piece of furniture and box into its designated room and reassemble beds and tables so you can settle right in.",
    icon: Sparkles,
    protocol: "Final Walkthrough & Sign-Off",
  },
];

export default function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative overflow-hidden bg-[#070c14] py-20 text-white dark:bg-[#070c14] md:py-28 border-y border-hairline/20">
      {/* Background architectural grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[1] bg-[linear-gradient(to_right,rgba(197,168,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"
      />

      <div className="section-padding mx-auto max-w-content">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-gold-soft">
            <Lock size={12} />
            <span>Our Moving Standard</span>
          </div>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            How Your Move Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 dark:text-gray-300 font-normal">
            A straightforward 4-step moving process designed for complete care, clear communication, and a stress-free moving day.
          </p>
        </div>

        {/* Connected Steps Grid */}
        <div className="relative mt-16">
          {/* Connecting route line */}
          <div className="absolute left-[10%] right-[10%] top-1/4 hidden h-[1px] -translate-y-1/2 bg-gradient-to-r from-gold/10 via-gold/40 to-gold/10 lg:block" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  className={`group relative cursor-pointer rounded-xs border p-6 transition-all duration-300 ${
                    isActive
                      ? "border-gold bg-[#0f172a] shadow-2xl ring-1 ring-gold/40"
                      : "border-white/10 bg-[#0a131f]/70 hover:border-gold/40 hover:bg-[#0f172a]"
                  }`}
                >
                  {/* Step Node Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-gold">
                      {step.number}
                    </span>
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xs border transition-all ${
                        isActive
                          ? "border-gold bg-gold/20 text-gold-soft"
                          : "border-white/20 bg-white/5 text-white/70 group-hover:border-gold/50 group-hover:text-gold"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="font-display mt-6 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] font-semibold text-gold-soft">
                    {step.tagline}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-white/75 dark:text-gray-300">
                    {step.description}
                  </p>

                  <div className="mt-5 border-t border-white/10 pt-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-light dark:text-gray-400">
                      Standard: {step.protocol}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Trust & Compliance Banner */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-xs border border-gold/30 bg-[#0f172a] p-6 backdrop-blur sm:flex-row sm:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xs bg-gold/20 text-gold-soft">
              <Shield size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Guaranteed One-Crew Accountability
              </p>
              <p className="text-xs text-white/75 dark:text-gray-300">
                Comprehensive cargo insurance, full liability protection, and zero broker handoffs.
              </p>
            </div>
          </div>

          <Link
            href="/quote"
            className="flex shrink-0 items-center gap-2 rounded-xs bg-gold px-6 py-3 text-xs font-bold text-navy-deep transition-all hover:bg-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span>Get a Free Quote</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
