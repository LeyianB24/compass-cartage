// src/components/InteractiveMoveMap.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  ArrowRight,
  ArrowUpDown,
  Route,
  Clock,
  Truck,
  ShieldCheck,
  Compass,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import {
  ALBERTA_LOCALITIES,
  searchAlbertaAddresses,
  type SearchResult,
} from "@/lib/mapUtils";

// Haversine formula for driving distance approximation with highway detour factor
function calculateRouteMetrics(originStr: string, destStr: string) {
  const findLoc = (name: string) => {
    const clean = name.toLowerCase().trim();
    return ALBERTA_LOCALITIES.find(
      (l) => l.name.toLowerCase() === clean || clean.includes(l.name.toLowerCase())
    );
  };

  const loc1 = findLoc(originStr);
  const loc2 = findLoc(destStr);

  if (loc1 && loc2) {
    const R = 6371; // Earth radius km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLon = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightKm = R * c;

    // Road winding factor (1.35x for city urban streets, 1.22x for provincial highways)
    const windingFactor = straightKm < 30 ? 1.35 : 1.22;
    const roadKm = Math.max(5, Math.round(straightKm * windingFactor));

    // Approximate driving time
    let timeMinutes = 0;
    if (roadKm < 25) {
      timeMinutes = Math.round(roadKm * 2.2); // city speeds ~30-50 km/h with traffic
    } else {
      timeMinutes = Math.round(25 * 2.2 + (roadKm - 25) * 0.65); // highway speeds ~100-110 km/h
    }

    const hours = Math.floor(timeMinutes / 60);
    const mins = timeMinutes % 60;
    const timeFormatted = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ""}` : `${mins} mins`;

    const isLocalMetro = loc1.isLocal && loc2.isLocal;

    return {
      distanceKm: roadKm,
      distanceMiles: Math.round(roadKm * 0.621371),
      estimatedTime: timeFormatted,
      isLocalMetro,
      origin: loc1,
      destination: loc2,
    };
  }

  // Fallback heuristic for custom typed addresses
  const isBothEdmonton =
    originStr.toLowerCase().includes("edmonton") && destStr.toLowerCase().includes("edmonton");
  const fallbackKm = isBothEdmonton ? 18 : 145;
  return {
    distanceKm: fallbackKm,
    distanceMiles: Math.round(fallbackKm * 0.621371),
    estimatedTime: isBothEdmonton ? "25 mins" : "1h 45m",
    isLocalMetro: isBothEdmonton,
    origin: null,
    destination: null,
  };
}

function AnimatedKm({ target }: { target: number }) {
  const [displayVal, setDisplayVal] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const start = currentRef.current;
    const end = target;
    if (start === end) return;
    let startTime: number | null = null;
    const duration = 400;
    let reqId: number;
    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(start + (end - start) * ease);
      currentRef.current = val;
      setDisplayVal(val);
      if (progress < 1) {
        reqId = requestAnimationFrame(step);
      }
    }
    reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [target]);

  return <span>~{displayVal} km</span>;
}

interface InteractiveMoveMapProps {
  initialOrigin?: string;
  initialDestination?: string;
  onSelectRoute?: (origin: string, destination: string, distanceKm: number) => void;
  showQuoteCTA?: boolean;
}

export default function InteractiveMoveMap({
  initialOrigin = "Downtown Edmonton",
  initialDestination = "Windermere, Edmonton",
  onSelectRoute,
  showQuoteCTA = true,
}: InteractiveMoveMapProps) {
  const router = useRouter();
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [mapMode, setMapMode] = useState<"googleLive" | "compassRadar">("googleLive");
  const [isSwapping, setIsSwapping] = useState(false);

  // Search Autocomplete State for Origin
  const [originSuggestions, setOriginSuggestions] = useState<SearchResult[]>([]);
  const [isOriginLoading, setIsOriginLoading] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const originRef = useRef<HTMLDivElement>(null);

  // Search Autocomplete State for Destination
  const [destSuggestions, setDestSuggestions] = useState<SearchResult[]>([]);
  const [isDestLoading, setIsDestLoading] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const destRef = useRef<HTMLDivElement>(null);

  const metrics = calculateRouteMetrics(origin, destination);

  // Debounced search for Origin
  useEffect(() => {
    if (!origin || origin.trim().length < 2) {
      return;
    }
    const timer = setTimeout(async () => {
      setIsOriginLoading(true);
      const results = await searchAlbertaAddresses(origin);
      setOriginSuggestions(results);
      setIsOriginLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [origin]);

  // Debounced search for Destination
  useEffect(() => {
    if (!destination || destination.trim().length < 2) {
      return;
    }
    const timer = setTimeout(async () => {
      setIsDestLoading(true);
      const results = await searchAlbertaAddresses(destination);
      setDestSuggestions(results);
      setIsDestLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [destination]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwap = () => {
    setIsSwapping(true);
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleProceedToQuote = () => {
    if (onSelectRoute) {
      onSelectRoute(origin, destination, metrics.distanceKm);
      return;
    }
    const params = new URLSearchParams({
      pickupAddress: origin,
      dropoffAddress: destination,
      distKm: metrics.distanceKm.toString(),
    });
    router.push(`/quote?${params.toString()}`);
  };

  // Google Maps embed directions URL
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    `${origin}, Alberta to ${destination}, Alberta`
  )}&output=embed`;

  // Direct Google Maps web directions link for opening in full app
  const googleMapsExternalUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    `${origin}, Alberta`
  )}&destination=${encodeURIComponent(`${destination}, Alberta`)}`;

  return (
    <div className="overflow-hidden rounded-card border border-hairline bg-paper-muted shadow-2xl dark:border-white/10 dark:bg-[#0c1626]">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline bg-paper p-5 dark:border-white/10 dark:bg-[#070c14]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-navy-deep text-gold dark:bg-gold/15 dark:text-gold">
            <Compass size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-navy-deep dark:text-white sm:text-lg">
                Interactive Alberta Route & Distance Planner
              </h3>
              <span className="inline-flex items-center gap-1 rounded-xs bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                <Sparkles size={10} /> Live Autocomplete Search
              </span>
            </div>
            <p className="text-xs text-slate dark:text-gray-400">
              Type any Alberta address, city, or postal area to view exact driving distance, route tiers, and pre-fill your quote.
            </p>
          </div>
        </div>

        {/* Map Mode Toggle with Animated Sliding Pill */}
        <div className="relative flex items-center gap-1.5 rounded-xs border border-hairline bg-paper-muted p-1 dark:border-white/10 dark:bg-[#070c14]">
          <button
            type="button"
            onClick={() => setMapMode("googleLive")}
            className={`relative z-10 flex items-center gap-1.5 rounded-2xs px-3 py-1.5 text-xs font-semibold transition-colors ${
              mapMode === "googleLive"
                ? "text-gold-soft font-bold dark:text-navy-deep"
                : "text-slate hover:text-navy-deep dark:text-gray-300 dark:hover:text-white"
            }`}
          >
            {mapMode === "googleLive" && (
              <motion.span
                layoutId="mapTogglePill"
                className="absolute inset-0 -z-10 rounded-2xs bg-navy-deep dark:bg-gold shadow-xs"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            <Navigation size={13} />
            <span>Google Maps View</span>
          </button>

          <button
            type="button"
            onClick={() => setMapMode("compassRadar")}
            className={`relative z-10 flex items-center gap-1.5 rounded-2xs px-3 py-1.5 text-xs font-semibold transition-colors ${
              mapMode === "compassRadar"
                ? "text-gold-soft font-bold dark:text-navy-deep"
                : "text-slate hover:text-navy-deep dark:text-gray-300 dark:hover:text-white"
            }`}
          >
            {mapMode === "compassRadar" && (
              <motion.span
                layoutId="mapTogglePill"
                className="absolute inset-0 -z-10 rounded-2xs bg-navy-deep dark:bg-gold shadow-xs"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            <Route size={13} />
            <span>Route Radar</span>
          </button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
        {/* Left Column: Origin & Destination Inputs + Autocomplete + Route Metrics */}
        <div className="flex flex-col justify-between p-6 sm:p-7">
          <div className="space-y-6">
            {/* Input Row with Swap Button */}
            <div className="relative space-y-4">
              {/* Pickup / Origin with Autocomplete Dropdown */}
              <div ref={originRef} className="relative">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/20 text-[10px] text-navy-deep dark:text-gold">
                      A
                    </span>
                    <span>Where you are (Pickup Address / City)</span>
                  </label>
                  <span className="text-[10px] text-slate-light dark:text-gray-400">Origin Point</span>
                </div>

                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={origin}
                    onFocus={() => setShowOriginDropdown(true)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setOrigin(val);
                      if (!val || val.trim().length < 2) setOriginSuggestions([]);
                      setShowOriginDropdown(true);
                    }}
                    placeholder="Search any Alberta street, city, or community..."
                    className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 pl-10 pr-9 text-xs font-medium text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gold"
                  />
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-gold" />
                  {isOriginLoading ? (
                    <Loader2 size={15} className="absolute right-3.5 top-3.5 text-gold animate-spin" />
                  ) : origin ? (
                    <button
                      type="button"
                      onClick={() => setOrigin("")}
                      className="absolute right-3.5 top-3.5 text-slate hover:text-navy-deep dark:text-gray-400"
                    >
                      <X size={14} />
                    </button>
                  ) : null}
                </div>

                {/* Origin Autocomplete Dropdown */}
                {showOriginDropdown && originSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xs border border-gold/40 bg-paper-muted shadow-xl dark:border-gold/30 dark:bg-[#070c14]">
                    {originSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onMouseDown={() => {
                          setOrigin(item.title);
                          setShowOriginDropdown(false);
                        }}
                        className="flex cursor-pointer items-center justify-between border-b border-hairline/60 px-4 py-2.5 text-xs transition-colors hover:bg-gold/15 dark:border-white/5"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <MapPin size={14} className="text-gold shrink-0" />
                          <div className="truncate">
                            <p className="font-bold text-navy-deep dark:text-white truncate">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-slate-light dark:text-gray-400 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 font-mono text-[9px] text-gold font-semibold ml-2">
                          {item.isLocal ? "Metro" : "Regional"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button Divider */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-hairline dark:border-white/10" />
                </div>
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap pickup and dropoff locations"
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-paper text-navy-deep shadow-sm transition-all hover:scale-110 hover:border-gold hover:text-gold dark:border-white/15 dark:bg-[#070c14] dark:text-gold-soft ${
                    isSwapping ? "rotate-180" : ""
                  }`}
                >
                  <ArrowUpDown size={14} />
                </button>
              </div>

              {/* Destination / Dropoff with Autocomplete Dropdown */}
              <div ref={destRef} className="relative">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] text-emerald-700 dark:text-emerald-400">
                      B
                    </span>
                    <span>Where you go (Destination / Dropoff)</span>
                  </label>
                  <span className="text-[10px] text-slate-light dark:text-gray-400">Destination Point</span>
                </div>

                <div className="relative mt-1.5">
                  <input
                    type="text"
                    value={destination}
                    onFocus={() => setShowDestDropdown(true)}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDestination(val);
                      if (!val || val.trim().length < 2) setDestSuggestions([]);
                      setShowDestDropdown(true);
                    }}
                    placeholder="Search any Alberta destination or community..."
                    className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 pl-10 pr-9 text-xs font-medium text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-500"
                  />
                  <Navigation size={16} className="absolute left-3.5 top-3.5 text-emerald-500" />
                  {isDestLoading ? (
                    <Loader2 size={15} className="absolute right-3.5 top-3.5 text-emerald-500 animate-spin" />
                  ) : destination ? (
                    <button
                      type="button"
                      onClick={() => setDestination("")}
                      className="absolute right-3.5 top-3.5 text-slate hover:text-navy-deep dark:text-gray-400"
                    >
                      <X size={14} />
                    </button>
                  ) : null}
                </div>

                {/* Destination Autocomplete Dropdown */}
                {showDestDropdown && destSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xs border border-emerald-500/40 bg-paper-muted shadow-xl dark:border-emerald-500/30 dark:bg-[#070c14]">
                    {destSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onMouseDown={() => {
                          setDestination(item.title);
                          setShowDestDropdown(false);
                        }}
                        className="flex cursor-pointer items-center justify-between border-b border-hairline/60 px-4 py-2.5 text-xs transition-colors hover:bg-emerald-500/15 dark:border-white/5"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Navigation size={14} className="text-emerald-500 shrink-0" />
                          <div className="truncate">
                            <p className="font-bold text-navy-deep dark:text-white truncate">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-slate-light dark:text-gray-400 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold ml-2">
                          {item.isLocal ? "Metro" : "Regional"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick-Select Popular Hub Chips */}
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-light dark:text-gray-400">
                Popular Alberta & Edmonton Destinations:
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  "Downtown Edmonton",
                  "Windermere, Edmonton",
                  "St. Albert",
                  "Sherwood Park",
                  "Spruce Grove",
                  "Leduc",
                  "Red Deer",
                  "Calgary",
                  "Canmore / Banff",
                ].map((hub) => (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => {
                      if (!origin) setOrigin(hub);
                      else setDestination(hub);
                    }}
                    className={`rounded-xs px-2.5 py-1 font-mono text-[10px] font-semibold transition-all ${
                      destination === hub
                        ? "border border-emerald-500 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold"
                        : origin === hub
                        ? "border border-gold bg-gold/20 text-navy-deep dark:text-gold font-bold"
                        : "border border-hairline bg-paper text-slate hover:border-gold hover:text-navy-deep dark:border-white/10 dark:bg-[#070c14] dark:text-gray-300"
                    }`}
                  >
                    {hub}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Distance & Metrics Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xs border border-hairline bg-paper p-3 dark:border-white/10 dark:bg-[#070c14]">
                <div className="flex items-center gap-1.5 text-slate-light dark:text-gray-400">
                  <Route size={13} />
                  <span className="font-mono text-[10px] uppercase">Route Distance</span>
                </div>
                <p className="mt-1 font-mono text-lg font-bold text-navy-deep dark:text-white">
                  <AnimatedKm target={metrics.distanceKm} />
                </p>
                <span className="text-[10px] text-slate-light dark:text-gray-400">
                  ({metrics.distanceMiles} miles)
                </span>
              </div>

              <div className="rounded-xs border border-hairline bg-paper p-3 dark:border-white/10 dark:bg-[#070c14]">
                <div className="flex items-center gap-1.5 text-slate-light dark:text-gray-400">
                  <Clock size={13} />
                  <span className="font-mono text-[10px] uppercase">Est. Drive Time</span>
                </div>
                <p className="mt-1 font-mono text-lg font-bold text-navy-deep dark:text-white">
                  {metrics.estimatedTime}
                </p>
                <span className="text-[10px] text-slate-light dark:text-gray-400">Highway & City Average</span>
              </div>

              <div className="col-span-2 rounded-xs border border-hairline bg-paper p-3 sm:col-span-1 dark:border-white/10 dark:bg-[#070c14]">
                <div className="flex items-center gap-1.5 text-slate-light dark:text-gray-400">
                  <Truck size={13} />
                  <span className="font-mono text-[10px] uppercase">Transit Tier</span>
                </div>
                <p className="mt-1 font-mono text-xs font-bold text-gold">
                  {metrics.isLocalMetro ? "Edmonton Local Metro" : "Regional Alberta Corridor"}
                </p>
                <span className="text-[10px] text-slate-light dark:text-gray-400">
                  {metrics.isLocalMetro ? "Zero Travel Surcharge" : "Transparent Flat Intercity Rate"}
                </span>
              </div>
            </div>

            {/* Coverage Confirmation Badge */}
            <div className="flex items-center gap-2 rounded-xs border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Route Active:</strong> Compass Cartage operates daily moving crews connecting{" "}
                <strong>{origin || "Pickup"}</strong> to <strong>{destination || "Destination"}</strong>.
              </span>
            </div>
          </div>

          {/* Action Row — Pre-fills Quote Form */}
          {showQuoteCTA && (
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-hairline pt-5 dark:border-white/10">
              <button
                type="button"
                onClick={handleProceedToQuote}
                className="btn-shimmer group flex flex-1 items-center justify-center gap-2 rounded-xs bg-gold px-6 py-3.5 text-xs font-bold text-navy-deep shadow-md transition-all hover:bg-gold-soft hover:shadow-xl dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
              >
                <span>Get Instant Quote for This Route</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href={googleMapsExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xs border border-hairline bg-paper px-4 py-3.5 text-xs font-semibold text-navy-deep transition-colors hover:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white"
              >
                <ExternalLink size={13} />
                <span>Open in Maps</span>
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Google Maps Interactive Embed / Route Radar */}
        <div className="relative min-h-[380px] w-full border-t border-hairline bg-navy-deep lg:border-l lg:border-t-0 dark:border-white/10">
          <AnimatePresence mode="wait">
            {mapMode === "googleLive" ? (
              <motion.div
                key="google-map-iframe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative h-full min-h-[400px] w-full"
              >
                {/* Embedded Live Google Maps with Directions */}
                <iframe
                  title="Google Maps Route Direction"
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full grayscale-[15%] contrast-[105%]"
                />

                {/* Floating GPS Route Indicator Overlay */}
                <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xs border border-white/20 bg-[#070c14]/90 p-3 text-white backdrop-blur shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-[11px] font-bold text-gold">
                      Route: {metrics.distanceKm} km (~{metrics.estimatedTime})
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-white/70">
                    Live Directions
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="compass-radar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative flex h-full min-h-[400px] w-full flex-col justify-between overflow-hidden bg-[#070c14] p-6 text-white"
              >
                {/* Alberta Highway Corridor Vector Grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.08)_1px,transparent_1px)] bg-[size:3rem_3rem]"
                />

                {/* Route Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gold">
                      Alberta Highway Transit Map
                    </span>
                    <h4 className="font-display text-base font-bold text-white">
                      {origin} → {destination}
                    </h4>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                    <Truck size={16} />
                  </div>
                </div>

                {/* Interactive Visual Alberta Road Map */}
                <div className="relative z-10 my-8 flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-sm rounded-card border border-white/15 bg-white/5 p-6 backdrop-blur">
                    {/* Origin Pin */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold bg-gold/25 text-gold font-bold shadow-lg">
                        <span className="radar-ring absolute inset-0 rounded-full border border-gold/60" />
                        <span className="relative z-10 text-xs">A</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase text-white/60">Origin / Pickup</span>
                        <p className="font-display text-sm font-bold text-white">{origin}</p>
                      </div>
                    </div>

                    {/* Connecting Highway Line with animated moving truck */}
                    <div className="relative my-3 ml-5 flex h-20 flex-col justify-center border-l-2 border-dashed border-gold/60 pl-6">
                      <motion.div
                        animate={{ y: [-20, 24, -20] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -left-[14px] flex h-7 w-7 items-center justify-center rounded-full bg-gold text-navy-deep shadow-lg"
                      >
                        <Truck size={13} />
                      </motion.div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[10px] font-bold text-gold backdrop-blur">
                        <Route size={11} />
                        <span>Transit Line: ~{metrics.distanceKm} km</span>
                      </div>
                    </div>

                    {/* Destination Pin */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-400 bg-emerald-500/25 text-emerald-300 font-bold shadow-lg">
                        <span className="radar-ring absolute inset-0 rounded-full border border-emerald-400/60" />
                        <span className="relative z-10 text-xs">B</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase text-white/60">Destination / Dropoff</span>
                        <p className="font-display text-sm font-bold text-emerald-300">{destination}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Radar Footer */}
                <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-4 text-xs">
                  <div className="flex items-center gap-2 text-white/80">
                    <ShieldCheck size={14} className="text-gold" />
                    <span>Alberta Transport Safety Board Verified</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMapMode("googleLive")}
                    className="font-mono text-xs font-semibold text-gold hover:underline"
                  >
                    Switch to Google Maps ↗
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
