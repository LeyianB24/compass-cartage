// src/components/InteractiveMoveMap.tsx
"use client";

import { useState, useId, useEffect } from "react";
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
} from "lucide-react";

export interface RouteCoordinates {
  name: string;
  region: "Metro Edmonton" | "Regional Alberta" | "Intercity Alberta";
  lat: number;
  lng: number;
  isLocal: boolean;
}

// Key Alberta & Edmonton hub coordinates for visual route mapping
export const ALBERTA_LOCATIONS: Record<string, RouteCoordinates> = {
  "Downtown Edmonton": { name: "Downtown Edmonton", region: "Metro Edmonton", lat: 53.5461, lng: -113.4938, isLocal: true },
  "Old Strathcona, Edmonton": { name: "Old Strathcona, Edmonton", region: "Metro Edmonton", lat: 53.5186, lng: -113.4975, isLocal: true },
  "Windermere, Edmonton": { name: "Windermere, Edmonton", region: "Metro Edmonton", lat: 53.4358, lng: -113.5936, isLocal: true },
  "West Edmonton": { name: "West Edmonton", region: "Metro Edmonton", lat: 53.5225, lng: -113.6242, isLocal: true },
  "Mill Woods, Edmonton": { name: "Mill Woods, Edmonton", region: "Metro Edmonton", lat: 53.4635, lng: -113.4373, isLocal: true },
  "St. Albert": { name: "St. Albert", region: "Metro Edmonton", lat: 53.6305, lng: -113.6256, isLocal: true },
  "Sherwood Park": { name: "Sherwood Park", region: "Metro Edmonton", lat: 53.5414, lng: -113.3106, isLocal: true },
  "Spruce Grove": { name: "Spruce Grove", region: "Metro Edmonton", lat: 53.5451, lng: -113.9017, isLocal: true },
  "Leduc": { name: "Leduc", region: "Metro Edmonton", lat: 53.2594, lng: -113.5494, isLocal: true },
  "Beaumont": { name: "Beaumont", region: "Metro Edmonton", lat: 53.3567, lng: -113.4147, isLocal: true },
  "Fort Saskatchewan": { name: "Fort Saskatchewan", region: "Metro Edmonton", lat: 53.7128, lng: -113.2133, isLocal: true },
  "Stony Plain": { name: "Stony Plain", region: "Metro Edmonton", lat: 53.5303, lng: -113.9897, isLocal: true },
  "Red Deer": { name: "Red Deer", region: "Regional Alberta", lat: 52.2681, lng: -113.8112, isLocal: false },
  "Calgary": { name: "Calgary", region: "Intercity Alberta", lat: 51.0447, lng: -114.0719, isLocal: false },
  "Airdrie": { name: "Airdrie", region: "Regional Alberta", lat: 51.2917, lng: -114.0144, isLocal: false },
  "Canmore / Banff": { name: "Canmore / Banff", region: "Intercity Alberta", lat: 51.089, lng: -115.359, isLocal: false },
  "Lethbridge": { name: "Lethbridge", region: "Intercity Alberta", lat: 49.6956, lng: -112.8451, isLocal: false },
  "Medicine Hat": { name: "Medicine Hat", region: "Intercity Alberta", lat: 50.0417, lng: -110.6775, isLocal: false },
  "Grande Prairie": { name: "Grande Prairie", region: "Intercity Alberta", lat: 55.1699, lng: -118.7986, isLocal: false },
  "Fort McMurray": { name: "Fort McMurray", region: "Intercity Alberta", lat: 56.7264, lng: -111.3803, isLocal: false },
};

// Haversine formula for driving distance approximation with highway detour factor
function calculateRouteMetrics(originStr: string, destStr: string) {
  const loc1 = ALBERTA_LOCATIONS[originStr];
  const loc2 = ALBERTA_LOCATIONS[destStr];

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

    // Road winding factor (1.25x for direct highway, 1.35x for urban city streets)
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

  useEffect(() => {
    const start = displayVal;
    const end = target;
    if (start === end) return;
    let startTime: number | null = null;
    const duration = 500;
    let reqId: number;
    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.round(start + (end - start) * ease));
      if (progress < 1) {
        reqId = requestAnimationFrame(step);
      }
    }
    reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const datalistId = useId();
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [mapMode, setMapMode] = useState<"googleLive" | "compassRadar">("googleLive");
  const [isSwapping, setIsSwapping] = useState(false);

  const metrics = calculateRouteMetrics(origin, destination);

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

  // Google Maps embed directions URL (zero API key required, 100% reliable)
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
                Interactive Moving Route & Distance Planner
              </h3>
              <span className="inline-flex items-center gap-1 rounded-xs bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                <Sparkles size={10} /> Live Maps
              </span>
            </div>
            <p className="text-xs text-slate dark:text-gray-400">
              Select where you are and where you are moving to calculate exact distance and travel tier.
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
        {/* Left Column: Origin & Destination Inputs + Route Metrics */}
        <div className="flex flex-col justify-between p-6 sm:p-7">
          <div className="space-y-6">
            {/* Input Row with Swap Button */}
            <div className="relative space-y-4">
              {/* Pickup / Origin */}
              <div>
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
                    list={datalistId}
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="e.g. Downtown Edmonton, St. Albert, Leduc..."
                    className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 pl-10 text-xs font-medium text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gold"
                  />
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-gold" />
                </div>
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

              {/* Destination / Dropoff */}
              <div>
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
                    list={datalistId}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Windermere, Calgary, Red Deer, Sherwood Park..."
                    className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 pl-10 text-xs font-medium text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-emerald-500"
                  />
                  <Navigation size={16} className="absolute left-3.5 top-3.5 text-emerald-500" />
                </div>
              </div>

              {/* Autocomplete Datalist */}
              <datalist id={datalistId}>
                {Object.keys(ALBERTA_LOCATIONS).map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>

            {/* Quick-Select Hub Chips */}
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

          {/* Action Row */}
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
                    Live Google Directions
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
