// src/components/QuickEstimateSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calculator,
  ShieldCheck,
  Sparkles,
  MapPin,
  Navigation,
  Truck,
  Users,
  Box,
  CheckCircle2,
} from "lucide-react";
import { MOVE_SIZES } from "@/lib/constants";

export default function QuickEstimateSection() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    moveSize: "1-bedroom",
    pickupArea: "",
    dropoffArea: "",
  });

  const selectedSizeObj = MOVE_SIZES.find((s) => s.id === formData.moveSize) || MOVE_SIZES[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      moveSize: formData.moveSize,
      pickupAddress: formData.pickupArea || "Downtown Edmonton",
      dropoffAddress: formData.dropoffArea || "Edmonton Metro",
    });
    router.push(`/quote?${params.toString()}`);
  };

  return (
    <section className="relative z-10 border-b border-hairline bg-paper-muted py-12 dark:border-white/10 dark:bg-[#0c1626] sm:py-16">
      <div className="section-padding mx-auto max-w-content">
        {/* Section Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-semibold text-gold-soft dark:border-gold/30 dark:bg-gold/15 dark:text-gold">
            <Calculator size={13} />
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Quick Move Estimate & Crew Sizing
            </span>
            <span className="text-white/30">•</span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
              <Sparkles size={10} /> Upfront Rate Calculation
            </span>
          </div>

          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-navy-deep dark:text-white sm:text-3xl lg:text-4xl">
            Estimate Your Move in Under a Minute
          </h2>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate dark:text-gray-300">
            Tell us where you are moving and your residence size. We&apos;ll match the optimal crew size,
            truck class, and transparent upfront pricing with zero surprise fees.
          </p>
        </div>

        {/* Dedicated Full-Width Form Card */}
        <div className="relative overflow-hidden rounded-card border border-hairline bg-paper p-6 shadow-xl dark:border-white/10 dark:bg-[#070c14] sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gold/10 blur-3xl dark:bg-gold/15"
          />

          <form onSubmit={handleSubmit} className="relative space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Pickup Area */}
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-navy-deep dark:text-gray-200">
                  Where you are (Pickup Area or Address)
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oliver, Edmonton or 104 St NW"
                    value={formData.pickupArea}
                    onChange={(e) => setFormData({ ...formData, pickupArea: e.target.value })}
                    className="w-full rounded-xs border border-hairline bg-paper-muted px-4 py-3 pl-10 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#0f172a] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gold"
                  />
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-gold" />
                </div>
              </div>

              {/* Destination Area */}
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-navy-deep dark:text-gray-200">
                  Where you go (Destination Area or City)
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Windermere, St. Albert, or Calgary"
                    value={formData.dropoffArea}
                    onChange={(e) => setFormData({ ...formData, dropoffArea: e.target.value })}
                    className="w-full rounded-xs border border-hairline bg-paper-muted px-4 py-3 pl-10 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-[#0f172a] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-500"
                  />
                  <Navigation size={16} className="absolute left-3.5 top-3.5 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Move Size Selector & Real-Time Manifest Specs */}
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1.8fr] lg:items-center">
              <div>
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-navy-deep dark:text-gray-200">
                  Select Scope / Residence Size
                </label>
                <select
                  value={formData.moveSize}
                  onChange={(e) => setFormData({ ...formData, moveSize: e.target.value })}
                  className="mt-1.5 w-full rounded-xs border border-hairline bg-paper-muted px-4 py-3 text-xs font-semibold text-navy-deep outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#0f172a] dark:text-white dark:focus:border-gold"
                >
                  {MOVE_SIZES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} — {s.sublabel} (Base from ${s.basePrice})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Live Manifest Pill */}
              <div className="grid grid-cols-3 gap-2 rounded-xs border border-hairline bg-paper-muted p-3 dark:border-white/10 dark:bg-[#0f172a]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-gold/15 text-gold">
                    <Box size={16} />
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-light dark:text-gray-400">
                      Estimated Volume
                    </span>
                    <span className="font-mono text-xs font-bold text-navy-deep dark:text-gold-soft">
                      ~{selectedSizeObj.estVolumeCuFt} cu ft
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 border-x border-hairline px-2 dark:border-white/10">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-navy-deep/10 text-navy-deep dark:bg-white/10 dark:text-white">
                    <Users size={16} />
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-light dark:text-gray-400">
                      Dedicated Crew
                    </span>
                    <span className="font-mono text-xs font-bold text-navy-deep dark:text-white">
                      {selectedSizeObj.recommendedCrew} Movers
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Truck size={16} />
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-light dark:text-gray-400">
                      Fleet Class
                    </span>
                    <span className="truncate font-mono text-xs font-bold text-navy-deep dark:text-white">
                      {selectedSizeObj.truckSize.split(" ")[0]} Truck
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar & Trust Assurances */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-hairline pt-5 sm:flex-row dark:border-white/10">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate dark:text-gray-400">
                <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck size={16} />
                  <span>Licensed & Fully Cargo Insured</span>
                </div>
                <span className="hidden sm:inline text-hairline">•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-gold" />
                  <span>Transparent Upfront Price Guarantee</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-shimmer group flex w-full items-center justify-center gap-2 rounded-xs bg-gold px-8 py-3.5 text-xs font-bold text-navy-deep shadow-lg transition-all hover:bg-gold-soft hover:shadow-xl sm:w-auto dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
              >
                <span>Calculate My Move & View Rates</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
