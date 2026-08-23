// src/components/HeroQuickQuote.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, ShieldCheck, Sparkles, MapPin, Building, Home } from "lucide-react";
import { MOVE_SIZES } from "@/lib/constants";

export default function HeroQuickQuote() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    moveSize: "1-bedroom",
    pickupArea: "",
  });

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
      className="relative w-full max-w-md overflow-hidden rounded-card border border-white/20 bg-paper-muted/95 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 dark:border-[#00a3e0]/30 dark:bg-[#181818]/95 dark:shadow-[0_0_35px_rgba(0,163,224,0.18)] sm:p-7"
    >
      {/* Decorative ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-navy/15 blur-3xl dark:bg-[#00a3e0]/25" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-gold-soft/15 blur-3xl dark:bg-[#38bdf8]/15" />

      {/* Header bar */}
      <div className="relative mb-5 flex items-center justify-between border-b border-hairline pb-4 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-navy/10 text-navy dark:bg-[#00a3e0]/15 dark:text-[#00a3e0]">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight text-navy-deep dark:text-white">
              Instant Quote
            </h3>
            <p className="text-[11px] text-slate-light dark:text-slate">
              Guaranteed transparent rates
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-gold-soft/40 bg-gold-soft/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy-deep dark:border-[#00a3e0]/40 dark:bg-[#00a3e0]/20 dark:text-[#38bdf8]">
          <Sparkles size={10} /> Fast 60s
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
            Your Name *
          </label>
          <input
            type="text"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 w-full rounded-sm border border-hairline bg-paper px-3.5 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-white/15 dark:bg-[#121212] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#00a3e0] dark:focus:ring-[#00a3e0]/30"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            placeholder="(780) 555-0199"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1 w-full rounded-sm border border-hairline bg-paper px-3.5 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-white/15 dark:bg-[#121212] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#00a3e0] dark:focus:ring-[#00a3e0]/30"
          />
        </div>

        {/* Move Size Selector */}
        <div>
          <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
            Move Size / Type
          </label>
          <div className="relative mt-1">
            <select
              value={formData.moveSize}
              onChange={(e) => setFormData({ ...formData, moveSize: e.target.value })}
              className="w-full rounded-sm border border-hairline bg-paper px-3.5 py-2.5 text-xs text-navy-deep outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-white/15 dark:bg-[#121212] dark:text-white dark:focus:border-[#00a3e0] dark:focus:ring-[#00a3e0]/30"
            >
              {MOVE_SIZES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({s.sublabel})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Moving From/Area */}
        <div>
          <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
            Pickup City / Neighborhood
          </label>
          <div className="relative mt-1">
            <input
              type="text"
              placeholder="e.g. Downtown Edmonton / St. Albert"
              value={formData.pickupArea}
              onChange={(e) => setFormData({ ...formData, pickupArea: e.target.value })}
              className="w-full rounded-sm border border-hairline bg-paper px-3.5 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-white/15 dark:bg-[#121212] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#00a3e0] dark:focus:ring-[#00a3e0]/30"
            />
            <MapPin size={14} className="absolute right-3 top-3 text-slate-light dark:text-gray-500" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="group mt-3 flex w-full items-center justify-center gap-2 rounded-sm bg-navy py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-navy-deep hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy dark:bg-[#00a3e0] dark:text-[#092634] dark:shadow-[0_0_20px_rgba(0,163,224,0.4)] dark:hover:bg-[#38bdf8]"
        >
          <span>Calculate My Free Quote</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>

        {/* Security / Assurance Footer */}
        <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-light dark:text-slate">
          <span className="flex items-center gap-1 font-medium">
            <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
            100% Insured & WCB
          </span>
          <span>•</span>
          <span>Zero Obligation</span>
        </div>
      </form>
    </motion.div>
  );
}
