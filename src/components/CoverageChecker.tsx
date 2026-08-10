// src/components/CoverageChecker.tsx
"use client";

import { useState } from "react";
import { Search, MapPin, CheckCircle2, AlertCircle, Clock, ShieldCheck } from "lucide-react";
import { DETAILED_COVERAGE_ZONES, type CoverageZoneDetail } from "@/lib/constants";

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
    <div className="mx-auto max-w-4xl rounded-card border border-hairline bg-white p-6 shadow-md md:p-8">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold mb-3">
          <MapPin size={22} />
        </div>
        <h2 className="font-display text-xl font-semibold text-navy-deep sm:text-2xl">
          Check Your City or Postal Code Coverage
        </h2>
        <p className="mt-1 text-xs text-slate">
          Enter your city name (e.g., Calgary, Airdrie, Canmore) or first 3 digits of your FSA postal code (e.g., T2A, T4C).
        </p>
      </div>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light" />
          <input
            type="text"
            placeholder="e.g. Calgary, Airdrie, T2P, T4C..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHasSearched(false);
            }}
            className="w-full rounded-sm border border-hairline bg-paper pl-11 pr-4 py-3 text-sm text-navy-deep placeholder:text-slate-light focus:border-gold focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </div>
        <button
          type="submit"
          className="rounded-sm bg-navy-deep px-6 py-3 text-sm font-semibold text-paper shadow-xs transition-colors hover:bg-navy"
        >
          Check Coverage
        </button>
      </form>

      {/* Search Results Display */}
      {hasSearched && (
        <div className="mt-6 border-t border-hairline pt-6">
          {matchedZone ? (
            <div className="rounded-sm border border-emerald-200 bg-emerald-50/50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-navy-deep">
                      Full Coverage Confirmed in {matchedZone.city}
                    </h3>
                    <span className="rounded-xs bg-gold px-2.5 py-1 text-[11px] font-bold text-navy-deep">
                      {matchedZone.travelFeeTier} Tier
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate leading-relaxed">
                    {matchedZone.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-emerald-200/60 pt-3 text-xs text-navy-deep">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={14} className="text-gold" />
                      <span>Transit: {matchedZone.estTransitTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>Fully Insured Regional Route</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-sm border border-gold/40 bg-gold/5 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle size={22} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-base font-semibold text-navy-deep">
                    Specialty / Extended Route Available
                  </h3>
                  <p className="mt-1 text-xs text-slate leading-relaxed">
                    While &quot;{query}&quot; is outside our standard local zone, Compass Cartage frequently handles long-distance relocations across Alberta and Western Canada. Contact our dispatch team for a custom route estimate!
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
