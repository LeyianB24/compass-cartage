// src/components/CoverageChecker.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, MapPin, CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { DETAILED_COVERAGE_ZONES, OUT_OF_PROVINCE_NOTE } from "@/lib/constants";
import { searchAlbertaAddresses, type SearchResult } from "@/lib/mapUtils";

export default function CoverageChecker() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    city: string;
    region: string;
    tier: string;
    transitTime: string;
    isLocal: boolean;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce autocomplete search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const results = await searchAlbertaAddresses(query);
      setSuggestions(results);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSelectResult = (result: SearchResult) => {
    setQuery(result.title);
    setShowDropdown(false);
    setHasSearched(true);

    const detailedMatch = DETAILED_COVERAGE_ZONES.find(
      (z) =>
        result.title.toLowerCase().includes(z.city.toLowerCase()) ||
        z.city.toLowerCase().includes(result.title.toLowerCase())
    );

    if (detailedMatch) {
      setSelectedLocation({
        city: detailedMatch.city,
        region: detailedMatch.region,
        tier: detailedMatch.travelFeeTier,
        transitTime: detailedMatch.estTransitTime,
        isLocal: detailedMatch.travelFeeTier === "Standard",
      });
    } else {
      setSelectedLocation({
        city: result.title,
        region: result.subtitle,
        tier: result.isLocal ? "Local Metro (Included)" : "Regional Alberta",
        transitTime: result.isLocal ? "30–45 mins" : "1–2.5 hours",
        isLocal: result.isLocal,
      });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cleaned = query.trim().toUpperCase();
    const found = DETAILED_COVERAGE_ZONES.find((z) => {
      const cityMatch = z.city.toUpperCase().includes(cleaned);
      const regionMatch = z.region.toUpperCase().includes(cleaned);
      const postalMatch = z.postalPrefixes.some((p) => cleaned.startsWith(p));
      return cityMatch || regionMatch || postalMatch;
    });

    if (found) {
      setSelectedLocation({
        city: found.city,
        region: found.region,
        tier: found.travelFeeTier,
        transitTime: found.estTransitTime,
        isLocal: found.travelFeeTier === "Standard",
      });
    } else {
      const isAlberta = cleaned.includes("EDMONTON") || cleaned.includes("CALGARY") || cleaned.includes("RED DEER") || cleaned.startsWith("T");
      if (isAlberta) {
        setSelectedLocation({
          city: query.trim(),
          region: "Alberta Region",
          tier: "Standard Travel Tier",
          transitTime: "Flexible Transit Window",
          isLocal: cleaned.includes("EDMONTON"),
        });
      } else {
        setSelectedLocation(null);
      }
    }
    setShowDropdown(false);
    setHasSearched(true);
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-card border border-hairline bg-paper-muted p-6 shadow-md md:p-8 dark:border-white/10 dark:bg-[#0c1626]">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xs bg-gold/15 text-gold mb-3">
          <MapPin size={22} />
        </div>
        <h2 className="font-display text-xl font-semibold text-navy-deep dark:text-white sm:text-2xl">
          Search Your Alberta City, Postal Code, or Street
        </h2>
        <p className="mt-1 text-xs text-slate dark:text-gray-300">
          Enter your address, city (e.g., Edmonton, St. Albert, Leduc, Calgary) or postal prefix (e.g., T5A, T8N) to verify instant coverage.
        </p>
      </div>

      <div ref={containerRef} className="relative mt-6">
        <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-light dark:text-gray-400" />
            <input
              type="text"
              placeholder="Type city, street or postal code (e.g. Downtown Edmonton, T5A, St. Albert)..."
              value={query}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                if (!val || val.trim().length < 2) {
                  setSuggestions([]);
                }
                setShowDropdown(true);
                setHasSearched(false);
              }}
              className="w-full rounded-xs border border-hairline bg-paper pl-11 pr-10 py-3.5 text-xs text-navy-deep placeholder:text-slate-light focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500"
            />
            {isLoading && (
              <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold animate-spin" />
            )}
          </div>
          <button
            type="submit"
            className="rounded-xs bg-navy-deep px-8 py-3.5 text-xs font-bold text-gold-soft shadow-sm transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft shrink-0"
          >
            Check Coverage
          </button>
        </form>

        {/* Autocomplete Dropdown Suggestions */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xs border border-gold/40 bg-paper-muted shadow-xl dark:border-gold/30 dark:bg-[#070c14]">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onMouseDown={() => handleSelectResult(item)}
                className="flex cursor-pointer items-center justify-between border-b border-hairline/60 px-4 py-2.5 text-xs transition-colors hover:bg-gold/15 dark:border-white/5"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <MapPin size={15} className="text-gold shrink-0" />
                  <div className="truncate">
                    <p className="font-bold text-navy-deep dark:text-white truncate">{item.title}</p>
                    <p className="text-[10px] text-slate-light dark:text-gray-400 truncate">{item.subtitle}</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-gold font-semibold shrink-0 ml-2">
                  {item.isLocal ? "Metro Edmonton" : "Alberta Corridor"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Results Display */}
      {hasSearched && (
        <div className="mt-6 border-t border-hairline pt-6 dark:border-white/10">
          {selectedLocation ? (
            <div className="rounded-xs border border-emerald-500/30 bg-emerald-500/10 p-5 dark:border-emerald-500/20 dark:bg-emerald-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={22} className="text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-base sm:text-lg font-semibold text-navy-deep dark:text-white">
                      Full Moving Crew Coverage Confirmed in {selectedLocation.city}
                    </h3>
                    <span className="font-mono rounded-xs bg-gold px-2.5 py-1 text-[11px] font-bold text-navy-deep">
                      {selectedLocation.tier}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate dark:text-gray-300 leading-relaxed">
                    Compass Cartage provides dedicated residential and commercial moving crews for {selectedLocation.city} and surrounding areas.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-emerald-500/20 pt-3 text-xs text-navy-deep dark:text-gray-200">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={14} className="text-gold" />
                      <span>Transit Window: {selectedLocation.transitTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span>Fully Insured Route</span>
                    </div>
                  </div>

                  {/* One-Click Action to Prefill Quote */}
                  <div className="mt-4 pt-3 border-t border-emerald-500/20 flex justify-end">
                    <Link
                      href={`/quote?pickupAddress=${encodeURIComponent(selectedLocation.city)}`}
                      className="btn-shimmer inline-flex items-center gap-2 rounded-xs bg-navy-deep px-5 py-2.5 text-xs font-bold text-gold-soft hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
                    >
                      <span>Get Instant Quote for {selectedLocation.city}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xs border border-gold/40 bg-gold/5 p-5 dark:bg-[#070c14]">
              <div className="flex items-start gap-3">
                <AlertCircle size={22} className="text-gold shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-base font-semibold text-navy-deep dark:text-white">
                    Specialty Move Required
                  </h3>
                  <p className="mt-1 text-xs text-slate dark:text-gray-300 leading-relaxed">
                    While &quot;{query}&quot; is outside our standard daily metro schedule, {OUT_OF_PROVINCE_NOTE}
                  </p>
                  <div className="mt-3">
                    <Link
                      href={`/quote?pickupAddress=${encodeURIComponent(query)}`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-gold hover:underline"
                    >
                      <span>Request custom long-distance quote</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}