// src/components/HeroQuickQuote.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, ShieldCheck, Sparkles } from "lucide-react";
import { MOVE_SIZES } from "@/lib/constants";

export default function HeroQuickQuote() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    moveSize: "1-bedroom",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      email: formData.email,
      moveSize: formData.moveSize,
    });
    router.push(`/quote?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden rounded-card border border-hairline/80 bg-paper-muted/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-[#00a3e0]/40 dark:bg-[#1e1e1e]/90 dark:shadow-[0_0_30px_rgba(0,163,224,0.15)] sm:p-8"
    >
      {/* Glow accent for dark mode */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-navy/10 blur-3xl dark:bg-[#00a3e0]/20" />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-4 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-navy/10 text-navy dark:bg-[#00a3e0]/15 dark:text-[#00a3e0]">
            <Calculator size={18} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight text-navy-deep dark:text-white">
              Interactive Quote
            </h3>
            <p className="text-[11px] text-slate-light dark:text-slate">
              Fast, transparent Edmonton moving estimates
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy-deep dark:bg-[#00a3e0]/20 dark:text-[#38bdf8]">
          <Sparkles size={10} /> Instant Estimate
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
              First Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="mt-1 w-full rounded-sm border border-hairline bg-paper px-3 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-white/15 dark:bg-[#121212] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#00a3e0] dark:focus:ring-[#00a3e0]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
              Last Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Smith"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="mt-1 w-full rounded-sm border border-hairline bg-paper px-3 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-white/15 dark:bg-[#121212] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#00a3e0] dark:focus:ring-[#00a3e0]/30"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
              Move Size
            </label>
            <select
              value={formData.moveSize}
              onChange={(e) => setFormData({ ...formData, moveSize: e.target.value })}
              className="mt-1 w-full rounded-sm border border-hairline bg-paper px-3 py-2.5 text-xs text-navy-deep outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-white/15 dark:bg-[#121212] dark:text-white dark:focus:border-[#00a3e0] dark:focus:ring-[#00a3e0]/30"
            >
              {MOVE_SIZES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="(780) 555-0199"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 w-full rounded-sm border border-hairline bg-paper px-3 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-navy focus:ring-2 focus:ring-navy/20 dark:border-white/15 dark:bg-[#121212] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#00a3e0] dark:focus:ring-[#00a3e0]/30"
            />
          </div>
        </div>

        <button
          type="submit"
          className="group mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-navy py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-navy-deep hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy dark:bg-[#00a3e0] dark:text-[#092634] dark:shadow-[0_0_15px_rgba(0,163,224,0.4)] dark:hover:bg-[#38bdf8]"
        >
          <span>Get a Free Quote</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>

        <div className="flex items-center justify-center gap-4 pt-1 text-[11px] text-slate-light dark:text-slate">
          <span className="flex items-center gap-1">
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
