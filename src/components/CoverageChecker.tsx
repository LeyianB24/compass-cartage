// src/components/CoverageChecker.tsx
"use client";

import { useState } from "react";
import { Search, MapPin, CheckCircle2, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { DETAILED_COVERAGE_ZONES, OUT_OF_PROVINCE_NOTE, type CoverageZoneDetail } from "@/lib/constants";

export default function CoverageChecker() {
  const [query, setQuery] = useState("");
  const [matchedZone, setMatchedZone] = useState<CoverageZoneDetail | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cleaned = query.trim().toUpperCase();
    const found = DETAILED_COVERAGE_ZONES.find((z) => {
      const cityMatch = z.city.toUpperCase().includes(cleaned);
      const regionMatch = z.region.toUpperCase().includes(cleaned);
      const postalMatch = z.postalPrefixes.some((p) => cleaned.startsWith(p));
      return cityMatch || regionMatch || postalMatch;
    });

    setMatchedZone(found || null);
    setHasSearched(true);
  };

  return (
    <div className="mx-auto w-full max-w-6xl rounded-card border border-hairline bg-paper-muted p-6 shadow-md md:p-8 dark:border-white/10 dark:bg-[#0f172a]">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xs bg-gold/15 text-gold mb-3">
          <MapPin size={22} />
        </div>
        <h2 className="font-display text-xl font-semibold text-navy-deep dark:text-white sm:text-2xl">
          Check Your City or Postal Code Coverage
        </h2>
        <p className="mt-1 text-xs text-slate dark:text-gray-300">
          Enter your city name (e.g., Edmonton, St. Albert, Calgary) or first 3 digits of your FSA postal code (e.g., T5A, T8N).
        </p>
      </div>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light dark:text-gray-400" />
          <input
            type="text"
            placeholder="e.g. Edmonton, Sherwood Park, T5A, T8N..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHasSearched(false);
            }}
            className="w-full rounded-xs border border-hairline bg-paper pl-11 pr-4 py-3 text-sm text-navy-deep placeholder:text-slate-light focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-xs bg-navy-deep px-6 py-3 text-sm font-bold text-gold-soft shadow-xs transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
        >
          Check Coverage
        </button>
      </form>

      {/* Search Results Display */}
      {hasSearched && (
        <div className="mt-6 border-t border-hairline pt-6 dark:border-white/10">
          {matchedZone ? (
            <div className="rounded-xs border border-emerald-500/30 bg-emerald-500/10 p-5 dark:border-emerald-500/20 dark:bg-emerald-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={22} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-navy-deep dark:text-white">
                      Full Coverage Confirmed in {matchedZone.city}
                    </h3>
                    <span className="font-mono rounded-xs bg-gold px-2.5 py-1 text-[11px] font-bold text-navy-deep">
                      {matchedZone.travelFeeTier} Tier
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate dark:text-gray-300 leading-relaxed">
                    {matchedZone.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-emerald-500/20 pt-3 text-xs text-navy-deep dark:text-gray-200">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={14} className="text-gold" />
                      <span>Transit: {matchedZone.estTransitTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span>Fully Insured Route</span>
                    </div>
                  </div>

                  {matchedZone.travelFeeTier === "Long Distance" && (
                    <p className="mt-3 border-t border-emerald-500/20 pt-3 text-[11px] text-slate dark:text-gray-400">
                      Long-distance moves are quote-based with flexible scheduling.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xs border border-gold/40 bg-gold/5 p-5 dark:bg-[#0f172a]">
              <div className="flex items-start gap-3">
                <AlertCircle size={22} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-base font-semibold text-navy-deep dark:text-white">
                    Outside Standard Alberta Coverage
                  </h3>
                  <p className="mt-1 text-xs text-slate dark:text-gray-300 leading-relaxed">
                    While &quot;{query}&quot; is outside our standard Alberta zone, {OUT_OF_PROVINCE_NOTE}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}