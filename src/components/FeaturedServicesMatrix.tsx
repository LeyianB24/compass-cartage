// src/components/FeaturedServicesMatrix.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Building2, Warehouse, ArrowRight, CheckCircle2 } from "lucide-react";

const FEATURED_SERVICES = [
  {
    id: "residential",
    title: "Residential Moving",
    subtitle: "Apartments, Condos & Houses",
    description:
      "Full-service home relocations. We wrap every piece of furniture, protect floors and doorframes, and unpack in your designated rooms.",
    icon: Home,
    accentColor: "from-rose-500/20 to-pink-500/10 text-rose-600 dark:text-pink-400 dark:border-pink-500/30",
    glowColor: "group-hover:border-rose-400 dark:group-hover:border-pink-500/60 dark:group-hover:shadow-[0_0_25px_rgba(236,72,153,0.2)]",
    tag: "Most Popular",
    features: ["Padded furniture blankets", "Bed disassembly & setup", "No stair surcharges"],
    href: "/services",
  },
  {
    id: "commercial",
    title: "Commercial Moving",
    subtitle: "Offices, Retail & Workstations",
    description:
      "Weekend and after-hours office relocations to eliminate Monday downtime. Secure handling of servers, computers, and heavy equipment.",
    icon: Building2,
    accentColor: "from-cyan-500/20 to-blue-500/10 text-navy dark:text-[#00a3e0] dark:border-[#00a3e0]/30",
    glowColor: "group-hover:border-navy dark:group-hover:border-[#00a3e0] dark:group-hover:shadow-[0_0_25px_rgba(0,163,224,0.25)]",
    tag: "B2B Specialized",
    features: ["Zero business disruption", "Heavy-duty dollies & straps", "Certificate of Insurance (COI)"],
    href: "/services",
  },
  {
    id: "storage",
    title: "Storage Solutions",
    subtitle: "Short & Long-Term Vaults",
    description:
      "Secure, climate-controlled vault storage for furniture between homes, renovations, or downsizing. Loaded directly from your door.",
    icon: Warehouse,
    accentColor: "from-amber-500/20 to-orange-500/10 text-amber-700 dark:text-amber-400 dark:border-amber-500/30",
    glowColor: "group-hover:border-amber-400 dark:group-hover:border-amber-500/60 dark:group-hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]",
    tag: "Flexible Terms",
    features: ["24/7 Security monitored", "Climate-controlled units", "Seamless transfer to new home"],
    href: "/services",
  },
];

export default function FeaturedServicesMatrix() {
  return (
    <section className="relative border-b border-hairline bg-paper py-20 dark:bg-[#121212] md:py-28">
      <div className="section-padding mx-auto max-w-content">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow text-navy dark:text-[#00a3e0]">Services Matrix</span>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white sm:text-4xl">
              Tailored Moving Solutions for Every Journey
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate dark:text-slate">
              Transparent upfront quotes with dedicated moving specialists for homes, businesses, and storage across Edmonton.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-sm border border-hairline bg-paper-muted px-4 py-2 text-xs font-semibold text-navy-deep transition-all hover:border-navy hover:text-navy dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white dark:hover:border-[#00a3e0] dark:hover:text-[#00a3e0]"
          >
            <span>Explore All 10 Services</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3-Column Services Matrix */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {FEATURED_SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className={`group relative flex flex-col justify-between rounded-card border border-hairline bg-paper-muted p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-white/10 dark:bg-[#1e1e1e] ${service.glowColor}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-card border bg-gradient-to-br ${service.accentColor}`}
                    >
                      <Icon size={26} />
                    </div>
                    <span className="rounded-full bg-paper px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate dark:bg-[#121212] dark:text-gray-300">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="font-display mt-6 text-2xl font-semibold tracking-tight text-navy-deep dark:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-navy dark:text-[#38bdf8]">
                    {service.subtitle}
                  </p>

                  <p className="mt-4 text-xs leading-relaxed text-slate dark:text-slate">
                    {service.description}
                  </p>

                  <ul className="mt-6 space-y-2.5 border-t border-hairline pt-5 dark:border-white/10">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-navy-deep dark:text-gray-200">
                        <CheckCircle2 size={14} className="shrink-0 text-emerald-600 dark:text-[#00a3e0]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={`/quote?moveSize=${service.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-sm bg-paper py-3 text-xs font-bold text-navy-deep transition-all hover:bg-navy hover:text-white dark:bg-[#121212] dark:text-white dark:hover:bg-[#00a3e0] dark:hover:text-[#092634]"
                  >
                    <span>Get {service.title} Quote</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
