// src/components/HeroQuickQuote.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import { MOVE_SIZES } from "@/lib/constants";

export default function HeroQuickQuote() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    moveSize: "1-bedroom",
    pickupArea: "",
  });

  const selectedSizeObj = MOVE_SIZES.find((s) => s.id === formData.moveSize) || MOVE_SIZES[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      name: formData.name,
      phone: formData.phone,
      moveSize: formData.moveSize,
      pickupAddress: formData.pickupArea || "Edmonton Metro",
    });
    router.push(`/quote?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-md overflow-hidden rounded-card border border-white/20 bg-paper-muted/95 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 dark:border-gold/30 dark:bg-[#0f172a]/95 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] sm:p-7"
    >
      {/* Subtle ambient lighting accent */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gold/10 blur-3xl dark:bg-gold/15" />

      {/* Header bar */}
      <div className="relative mb-5 flex items-center justify-between border-b border-hairline pb-4 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-navy-deep text-gold-soft dark:bg-gold/15 dark:text-gold">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight text-navy-deep dark:text-white">
              Volumetric Quick-Scope
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-light dark:text-slate">
              Actuarial Edmonton Move Estimates
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-xs border border-gold/40 bg-gold/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-navy-deep dark:border-gold/40 dark:bg-gold/20 dark:text-gold-soft">
          <Sparkles size={10} /> Fast 60s
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
            Client / Contact Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 w-full rounded-xs border border-hairline bg-paper px-3.5 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gold dark:focus:ring-gold/30"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
            Direct Phone Number *
          </label>
          <input
            type="tel"
            required
            placeholder="(780) 555-0199"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 w-full rounded-xs border border-hairline bg-paper px-3.5 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gold dark:focus:ring-gold/30"
          />
        </div>

        {/* Move Size Selector */}
        <div>
          <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
            Inventory Scope / Property Tier
          </label>
          <div className="relative mt-1">
            <select
              value={formData.moveSize}
              onChange={(e) => setFormData({ ...formData, moveSize: e.target.value })}
              className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2.5 text-xs text-navy-deep outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold dark:focus:ring-gold/30"
            >
              {MOVE_SIZES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} — {s.sublabel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Actuarial Manifest Specs Preview */}
        <div className="grid grid-cols-3 gap-2 rounded-xs border border-hairline bg-paper/60 p-2.5 dark:border-white/10 dark:bg-[#070c14]/80">
          <div className="text-center">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-light dark:text-gray-400">
              Est. Volume
            </span>
            <span className="font-mono text-xs font-bold text-navy-deep dark:text-gold-soft">
              ~{selectedSizeObj.estVolumeCuFt} cu ft
            </span>
          </div>
          <div className="border-x border-hairline px-1 text-center dark:border-white/10">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-light dark:text-gray-400">
              Dedicated Crew
            </span>
            <span className="font-mono text-xs font-bold text-navy-deep dark:text-white">
              {selectedSizeObj.recommendedCrew} Movers
            </span>
          </div>
          <div className="text-center">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-light dark:text-gray-400">
              Truck Class
            </span>
            <span className="truncate font-mono text-[11px] font-bold text-navy-deep dark:text-white">
              {selectedSizeObj.truckSize.split(" ")[0]} Box
            </span>
          </div>
        </div>

        {/* Pickup Area */}
        <div>
          <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
            Pickup City / Neighborhood
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              placeholder="e.g. Downtown Edmonton / Windermere / St. Albert"
              value={formData.pickupArea}
              onChange={(e) => setFormData({ ...formData, pickupArea: e.target.value })}
              className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gold dark:focus:ring-gold/30"
            />
            <MapPin size={14} className="absolute right-3 top-3 text-slate-light dark:text-gray-500" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xs bg-navy-deep py-3.5 text-xs font-bold text-gold-soft shadow-lg transition-all hover:bg-gold hover:text-navy-deep hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
        >
          <span>Generate Binding Scope & Quote</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>

        {/* Security / Assurance Footer */}
        <div className="flex items-center justify-center gap-3 pt-1 font-mono text-[10px] text-slate-light dark:text-slate">
          <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={12} />
            WCB Alberta & Cargo Insured
          </span>
          <span>•</span>
          <span>Zero Obligation Lock</span>
        </div>
      </form>
    </motion.div>
  );
}
