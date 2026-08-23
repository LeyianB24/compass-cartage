// src/components/FeaturedServicesMatrix.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Building2, Warehouse, ArrowRight, CheckCircle2, Lock } from "lucide-react";

const FEATURED_SERVICES = [
  {
    id: "residential",
    title: "Residential Relocation",
    subtitle: "High-Rise, Condominium & Estate Moves",
    description:
      "Full-service residential logistics. We shield doorways and flooring, dismantle/reassemble complex furniture, and position assets directly to floorplans.",
    icon: Home,
    tag: "Single-Crew Custody",
    features: [
      "Microfiber quilted blanket shielding",
      "Pneumatic floor runners & jamb guards",
      "Full furniture disassembly & setup",
    ],
    href: "/services/residential",
  },
  {
    id: "commercial",
    title: "Corporate & Office Logistics",
    subtitle: "Zero-Downtime Weekend Relocations",
    description:
      "Engineered office relocations to eliminate workday interruption. Specialized containment for workstations, servers, conference suites, and confidential archives.",
    icon: Building2,
    tag: "Commercial Continuity",
    features: [
      "After-hours & weekend transition schedules",
      "Heavy-duty crate dollies & secure strapping",
      "Certificate of Insurance (COI) issuing",
    ],
    href: "/services/commercial",
  },
  {
    id: "storage",
    title: "Climate-Monitored Vault Storage",
    subtitle: "Short & Long-Term Sealed Security",
    description:
      "Secure, temperature-regulated vault storage for furniture, fine art, and commercial inventory between moves, renovations, or corporate restructuring.",
    icon: Warehouse,
    tag: "24/7 Monitored Vaults",
    features: [
      "Continuous climate & humidity monitoring",
      "Sealed wooden palletized containers",
      "Door-to-vault direct inventory logistics",
    ],
    href: "/services/storage",
  },
];

export default function FeaturedServicesMatrix() {
  return (
    <section className="relative border-b border-hairline bg-paper py-20 dark:bg-[#070c14] md:py-28">
      <div className="section-padding mx-auto max-w-content">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
              <Lock size={12} />
              <span>Core Operational Capabilities</span>
            </div>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white sm:text-4xl lg:text-5xl">
              Architectural Precision for Every Relocation
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate dark:text-slate">
              Itemized actuarial estimates with dedicated single-crew accountability across Edmonton, Calgary, and all Alberta municipalities.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-xs border border-hairline bg-paper-muted px-5 py-2.5 text-xs font-bold text-navy-deep transition-all hover:border-gold hover:text-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-white dark:hover:border-gold dark:hover:text-gold-soft"
          >
            <span>View All Operational Services</span>
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
                className="group relative flex flex-col justify-between rounded-xs border border-hairline bg-paper-muted p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-xl dark:border-white/10 dark:bg-[#0f172a] dark:hover:border-gold/50"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-13 w-13 items-center justify-center rounded-xs border border-gold/30 bg-gold/10 text-gold-soft dark:bg-gold/15 dark:text-gold">
                      <Icon size={24} />
                    </div>
                    <span className="font-mono rounded-xs border border-hairline bg-paper px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-light dark:border-white/10 dark:bg-[#070c14] dark:text-gray-300">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="font-display mt-6 text-2xl font-semibold tracking-tight text-navy-deep dark:text-white">
                    {service.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] font-semibold text-gold-soft dark:text-gold">
                    {service.subtitle}
                  </p>

                  <p className="mt-4 text-xs leading-relaxed text-slate dark:text-slate">
                    {service.description}
                  </p>

                  <ul className="mt-6 space-y-2.5 border-t border-hairline pt-5 dark:border-white/10">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-navy-deep dark:text-gray-200">
                        <CheckCircle2 size={14} className="shrink-0 text-gold dark:text-gold-soft" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={service.href}
                    className="flex w-full items-center justify-center gap-2 rounded-xs border border-hairline bg-paper py-3 text-xs font-bold text-navy-deep transition-all hover:bg-navy-deep hover:text-white dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:hover:bg-gold dark:hover:text-navy-deep"
                  >
                    <span>Scope {service.title}</span>
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
