// src/components/QuoteForm.tsx
"use client";

import { useState, FormEvent, Suspense, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  ImagePlus,
  X,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ShieldCheck,
  Navigation,
  Route,
  DollarSign,
  Check,
  Copy,
  Lock,
} from "lucide-react";
import { MOVE_SIZES, SPECIALTY_ADDONS } from "@/lib/constants";
import {
  DEFAULT_DISTANCE_CONFIG,
  DEFAULT_PRICING_TIERS,
  estimateRoadDistanceKm,
  computeMoveQuoteEstimate,
  type DistanceConfig,
  type ServicePricingTier,
} from "@/lib/pricing-tiers";

type Status = "idle" | "submitting" | "success" | "error";

const STEPS = [
  { step: 1, title: "Your Details", subtitle: "Name & Contact" },
  { step: 2, title: "Route & Access", subtitle: "Origin to Destination" },
  { step: 3, title: "Scope & Inventory", subtitle: "Size, Tier & Photos" },
  { step: 4, title: "Review & Submit", subtitle: "Upfront Rate Lock" },
];

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [assignedQuoteNumber, setAssignedQuoteNumber] = useState("");
  const [copiedQuote, setCopiedQuote] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic pricing tiers and distance settings from Admin API
  const [distanceConfig, setDistanceConfig] = useState<DistanceConfig>(DEFAULT_DISTANCE_CONFIG);
  const [tiers, setTiers] = useState<ServicePricingTier[]>(DEFAULT_PRICING_TIERS);
  const [selectedTierSlug, setSelectedTierSlug] = useState<string>(
    searchParams.get("tier") || "standard"
  );

  // Fetch admin-configured pricing tiers on mount
  useEffect(() => {
    fetch("/api/pricing-tiers")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.distanceConfig) setDistanceConfig(data.distanceConfig);
        if (data?.tiers && Array.isArray(data.tiers) && data.tiers.length > 0) {
          setTiers(data.tiers);
          const exists = data.tiers.some((t: ServicePricingTier) => t.slug === selectedTierSlug);
          if (!exists) {
            const def = data.tiers.find((t: ServicePricingTier) => t.isDefault) || data.tiers[0];
            if (def) setSelectedTierSlug(def.slug);
          }
        }
      })
      .catch((err) => console.error("Could not load pricing tiers:", err));
  }, [selectedTierSlug]);

  // Form State with lazy initial values from searchParams
  const [formData, setFormData] = useState(() => ({
    name: searchParams.get("name") || "",
    phone: searchParams.get("phone") || "",
    email: searchParams.get("email") || "",
    pickupAddress: searchParams.get("pickupAddress") || "",
    dropoffAddress: searchParams.get("dropoffAddress") || "",
    moveDate: "",
    moveSize: searchParams.get("moveSize") || "1-bedroom",
    hasStairs: false,
    hasElevator: false,
    selectedAddons: [] as string[],
    notes: "",
  }));

  const initialDistParam = searchParams.get("distKm");
  const inventoryParam = searchParams.get("inventory");
  const cuFtParam = searchParams.get("cuFt");

  // Dynamic distance calculation
  const distanceKm = useMemo(() => {
    if (initialDistParam && !isNaN(Number(initialDistParam))) {
      return Math.round(Number(initialDistParam));
    }
    if (formData.pickupAddress && formData.dropoffAddress) {
      return estimateRoadDistanceKm(formData.pickupAddress, formData.dropoffAddress);
    }
    return 18; // Default local metro
  }, [initialDistParam, formData.pickupAddress, formData.dropoffAddress]);

  // Master Quote Estimation Calculation
  const quoteEstimate = useMemo(() => {
    return computeMoveQuoteEstimate({
      moveSizeId: formData.moveSize,
      distanceKm,
      tierSlug: selectedTierSlug,
      hasStairs: formData.hasStairs,
      hasElevator: formData.hasElevator,
      selectedAddons: formData.selectedAddons,
      distanceConfig,
      tiers,
    });
  }, [formData.moveSize, distanceKm, selectedTierSlug, formData.hasStairs, formData.hasElevator, formData.selectedAddons, distanceConfig, tiers]);

  const MAX_PHOTOS = 5;
  const MAX_SIZE_MB = 8;

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024);
    setPhotos((prev) => [...prev, ...valid].slice(0, MAX_PHOTOS));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleAddon(id: string) {
    setFormData((prev) => ({
      ...prev,
      selectedAddons: prev.selectedAddons.includes(id)
        ? prev.selectedAddons.filter((a) => a !== id)
        : [...prev.selectedAddons, id],
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const noteLines: string[] = [];
    noteLines.push(`[Service Tier: ${quoteEstimate.tier.name}]`);
    noteLines.push(`[Route Distance: ~${distanceKm} km | Distance Fee: $${quoteEstimate.distance.totalDistanceCharge.toFixed(2)}]`);
    noteLines.push(`[Estimated Quote: $${quoteEstimate.estimatedTotalMin} - $${quoteEstimate.estimatedTotalMax}]`);
    if (inventoryParam) noteLines.push(`[Inventory (${cuFtParam || "0"} cu ft): ${inventoryParam}]`);
    if (formData.hasStairs) noteLines.push("• Access Note: Involves stairs");
    if (formData.hasElevator) noteLines.push("• Access Note: Elevator available");
    if (formData.selectedAddons.length > 0) {
      noteLines.push(`• Requested Add-ons: ${formData.selectedAddons.join(", ")}`);
    }
    if (formData.notes) noteLines.push(`• Client Notes: ${formData.notes}`);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("phone", formData.phone);
    payload.append("email", formData.email);
    payload.append("pickupAddress", formData.pickupAddress || "Edmonton Metro (To be confirmed)");
    payload.append("dropoffAddress", formData.dropoffAddress || "Edmonton Metro (To be confirmed)");
    payload.append("moveDate", formData.moveDate);
    payload.append("moveSize", formData.moveSize);
    payload.append("distanceKm", distanceKm.toString());
    payload.append("distanceFee", quoteEstimate.distance.totalDistanceCharge.toString());
    payload.append("pricingTier", quoteEstimate.tier.name);
    payload.append("estimatedPrice", quoteEstimate.estimatedTotalMin.toString());
    payload.append("notes", noteLines.join("\n"));

    photos.forEach((file) => payload.append("photos", file));

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Request failed");
      }

      const resData = await res.json().catch(() => null);
      if (resData?.quoteNumber) {
        setAssignedQuoteNumber(resData.quoteNumber);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error && err.message !== "Request failed"
          ? err.message
          : "Something went wrong sending your request. Please try again or call us directly."
      );
    }
  }

  function handleReset() {
    setStatus("idle");
    setStep(1);
    setErrorMsg("");
    setPhotos([]);
  }

  // SUCCESS STATE WITH ANIMATED SVG DRAW-PATH CHECKMARK
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center rounded-card border border-hairline bg-paper-muted p-8 text-center shadow-2xl dark:border-white/10 dark:bg-[#0c1626] sm:p-12"
      >
        {/* Animated SVG Checkmark */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <svg className="h-20 w-20" viewBox="0 0 100 100">
            {/* Outer Circle Animation */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#c5a880"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            {/* Checkmark Stroke Draw Animation */}
            <motion.path
              d="M30 52 L44 66 L70 34"
              fill="none"
              stroke="#10b981"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <h3 className="font-display mt-6 text-2xl font-bold text-navy-deep dark:text-white sm:text-3xl">
          Quote Request Received!
        </h3>
        <p className="mt-2 max-w-md text-xs sm:text-sm text-slate dark:text-gray-300">
          Thank you, <strong className="text-navy-deep dark:text-white">{formData.name}</strong>. We&apos;ve logged your move itinerary and sent an itemized confirmation receipt to <strong className="text-navy-deep dark:text-white">{formData.email}</strong>.
        </p>

        {/* Assigned Quote Number Card */}
        <div className="mt-5 flex w-full max-w-lg items-center justify-between rounded-card border border-gold/40 bg-gold/10 p-4 text-left">
          <div>
            <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-slate dark:text-gray-300">
              Your Official Quote Number
            </span>
            <span className="font-mono text-xl font-bold tracking-tight text-gold">
              #{assignedQuoteNumber || "CC-2026-PROCESSING"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (assignedQuoteNumber) {
                navigator.clipboard.writeText(assignedQuoteNumber);
                setCopiedQuote(true);
                setTimeout(() => setCopiedQuote(false), 2000);
              }
            }}
            className="flex items-center gap-1.5 rounded-xs border border-gold/40 bg-paper-muted px-3 py-1.5 font-mono text-xs font-semibold text-navy-deep transition hover:border-gold dark:bg-[#070c14] dark:text-white"
          >
            {copiedQuote ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-gold" />
                <span>Copy Ref</span>
              </>
            )}
          </button>
        </div>

        {/* Confirmation Summary Card */}
        <div className="mt-6 w-full max-w-lg rounded-xs border border-hairline bg-paper p-5 text-left dark:border-white/10 dark:bg-[#070c14]">
          <div className="flex items-center justify-between border-b border-hairline pb-3 dark:border-white/10">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold">
              Confirmed Booking Details
            </span>
            <span className="rounded-xs bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Dispatched to Dispatch Queue
            </span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate dark:text-gray-400">Client Contact:</span>
              <span className="font-semibold text-navy-deep dark:text-white">
                {formData.name} ({formData.phone})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate dark:text-gray-400">Transit Route:</span>
              <span className="font-semibold text-navy-deep dark:text-white text-right truncate max-w-[240px]">
                {formData.pickupAddress} → {formData.dropoffAddress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate dark:text-gray-400">Calculated Distance:</span>
              <span className="font-mono font-semibold text-navy-deep dark:text-white">
                ~{distanceKm} km
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate dark:text-gray-400">Selected Service Tier:</span>
              <span className="font-bold text-gold">{quoteEstimate.tier.name}</span>
            </div>
            <div className="flex justify-between border-t border-hairline pt-2 dark:border-white/10">
              <span className="font-bold text-navy-deep dark:text-white">Upfront Rate Estimate:</span>
              <span className="font-mono text-base font-bold text-gold">
                ${quoteEstimate.estimatedTotalMin} - ${quoteEstimate.estimatedTotalMax} CAD
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="mt-8 flex items-center gap-2 rounded-xs border border-hairline bg-paper px-6 py-3 text-xs font-semibold text-navy-deep transition-all hover:bg-gold hover:text-navy-deep dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:hover:border-gold"
        >
          <RefreshCw size={14} />
          <span>Plan Another Relocation</span>
        </button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-card border border-hairline bg-paper-muted p-6 shadow-xl dark:border-white/10 dark:bg-[#0c1626] sm:p-8">
      {/* ROUTE MOTIF PROGRESS INDICATOR */}
      <div className="mb-8 border-b border-hairline pb-6 dark:border-white/10">
        {/* Progress Tracker Steps */}
        <div className="relative">
          {/* Connecting dashed route line */}
          <div className="absolute top-4 left-6 right-6 -z-0 hidden sm:block">
            <div className="h-0.5 w-full border-t-2 border-dashed border-hairline dark:border-white/15" />
            {/* Active animated route fill */}
            <motion.div
              className="absolute top-0 left-0 h-0.5 bg-gold"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
            {STEPS.map((s) => {
              const isPassed = step > s.step;
              const isCurrent = step === s.step;

              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    // Only allow navigating backwards or to valid previous steps directly
                    if (s.step < step) setStep(s.step);
                  }}
                  disabled={s.step > step}
                  className={`group relative z-10 flex items-center gap-3 rounded-xs p-2 text-left transition-all sm:flex-col sm:items-center sm:text-center ${
                    s.step > step ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {/* Step Icon Badge */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition-all ${
                      isCurrent
                        ? "border-2 border-gold bg-navy-deep text-gold shadow-md ring-4 ring-gold/20 dark:bg-gold dark:text-navy-deep"
                        : isPassed
                        ? "border border-emerald-500 bg-emerald-500 text-white shadow-xs"
                        : "border border-hairline bg-paper text-slate-light dark:border-white/15 dark:bg-[#070c14] dark:text-gray-400"
                    }`}
                  >
                    {isPassed ? <Check size={14} /> : s.step}
                  </div>

                  <div>
                    <span
                      className={`block font-mono text-[10px] font-bold uppercase tracking-wider ${
                        isCurrent
                          ? "text-gold"
                          : isPassed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-light dark:text-gray-400"
                      }`}
                    >
                      Step 0{s.step}
                    </span>
                    <span className="block font-display text-xs font-bold text-navy-deep dark:text-white">
                      {s.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <AnimatePresence mode="wait">
          {/* STEP 1: YOUR DETAILS */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                  Phase 1 of 4 • Primary Contact
                </span>
                <h3 className="font-display text-lg font-bold text-navy-deep dark:text-white sm:text-xl">
                  Who are we coordinating this move with?
                </h3>
                <p className="mt-0.5 text-xs text-slate dark:text-gray-300">
                  We use your direct details to deliver your itemized PDF quote and confirm crew dispatch schedule.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                    Full Client Name *
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gold"
                    />
                    <User size={15} className="absolute right-3 top-3.5 text-slate-light dark:text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                    Direct Phone Number *
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="tel"
                      required
                      placeholder="(780) 555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gold"
                    />
                    <Phone size={15} className="absolute right-3 top-3.5 text-slate-light dark:text-gray-500" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                    Email Address (For itemized PDF summary) *
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gold"
                    />
                    <Mail size={15} className="absolute right-3 top-3.5 text-slate-light dark:text-gray-500" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                    Preferred Moving Date
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="date"
                      value={formData.moveDate}
                      onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                      className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 text-xs text-navy-deep outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                    />
                    <Calendar size={15} className="absolute right-3 top-3.5 text-slate-light dark:text-gray-500 pointer-events-none" />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-light dark:text-gray-400">
                    Dates are confirmed based on fleet availability; flexible dates often unlock optimum dispatch rates.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-hairline dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.phone || !formData.email}
                  className="btn-shimmer flex items-center gap-2 rounded-xs bg-navy-deep px-6 py-3.5 text-xs font-bold text-gold-soft transition-all hover:bg-gold hover:text-navy-deep disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
                >
                  <span>Continue to Route & Access</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: MOVE DETAILS & ROUTE */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                  Phase 2 of 4 • Route & Accessibility
                </span>
                <h3 className="font-display text-lg font-bold text-navy-deep dark:text-white sm:text-xl">
                  Where are we picking up and delivering?
                </h3>
                <p className="mt-0.5 text-xs text-slate dark:text-gray-300">
                  Exact street addresses allow precision highway routing and accurate mileage calculation.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                    Pickup Location (Origin) *
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      required
                      placeholder="e.g. 104 St NW, Edmonton, AB"
                      value={formData.pickupAddress}
                      onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                      className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                    />
                    <MapPin size={15} className="absolute right-3 top-3.5 text-gold" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                    Delivery Location (Destination) *
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      required
                      placeholder="e.g. St. Albert / Calgary / Red Deer"
                      value={formData.dropoffAddress}
                      onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
                      className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-emerald-500 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-emerald-500"
                    />
                    <Navigation size={15} className="absolute right-3 top-3.5 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Live Distance Travel Fee Breakdown Banner */}
              <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xs bg-gold/15 text-gold">
                      <Route size={17} />
                    </div>
                    <div>
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold">
                        Calculated Transit Route
                      </span>
                      <p className="text-xs font-semibold text-navy-deep dark:text-white">
                        ~{distanceKm} km driving distance
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-gold">
                      {quoteEstimate.distance.totalDistanceCharge > 0
                        ? `+$${quoteEstimate.distance.totalDistanceCharge.toFixed(2)} Travel Fee`
                        : "$0.00 Travel Fee"}
                    </span>
                    <p className="text-[10px] text-slate-light dark:text-gray-400">
                      {quoteEstimate.distance.billableKm === 0
                        ? `First ${distanceConfig.includedKm} km included free in base rate`
                        : `${quoteEstimate.distance.billableKm} billable km @ $${distanceConfig.perKmRate.toFixed(2)}/km`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Google Maps Preview */}
              {formData.pickupAddress && formData.dropoffAddress && (
                <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-gold">
                      <Navigation size={13} />
                      <span>Google Directions Route Preview</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                        `${formData.pickupAddress}, Alberta`
                      )}&destination=${encodeURIComponent(`${formData.dropoffAddress}, Alberta`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-semibold text-gold hover:underline"
                    >
                      Open in Maps ↗
                    </a>
                  </div>

                  <div className="aspect-[16/7] w-full overflow-hidden rounded-xs border border-hairline bg-navy-deep dark:border-white/10">
                    <iframe
                      title="Google Maps Moving Route Preview"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        `${formData.pickupAddress}, Alberta to ${formData.dropoffAddress}, Alberta`
                      )}&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* Access Conditions */}
              <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
                <p className="text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Property Access Characteristics (Select all that apply)
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasStairs: !formData.hasStairs })}
                    className={`rounded-xs border px-3 py-2 text-xs font-medium transition-all ${
                      formData.hasStairs
                        ? "border-gold bg-gold/15 text-gold font-bold dark:border-gold dark:bg-gold/20 dark:text-gold"
                        : "border-hairline bg-paper-muted text-slate dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-400"
                    }`}
                  >
                    {formData.hasStairs ? "✓ Multiple Flights of Stairs (+$35)" : "+ Stairs Involved"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasElevator: !formData.hasElevator })}
                    className={`rounded-xs border px-3 py-2 text-xs font-medium transition-all ${
                      formData.hasElevator
                        ? "border-gold bg-gold/15 text-gold font-bold dark:border-gold dark:bg-gold/20 dark:text-gold"
                        : "border-hairline bg-paper-muted text-slate dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-400"
                    }`}
                  >
                    {formData.hasElevator ? "✓ Service Elevator Available" : "+ Service Elevator Access"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-hairline dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!formData.pickupAddress || !formData.dropoffAddress}
                  className="btn-shimmer flex items-center gap-2 rounded-xs bg-navy-deep px-6 py-3.5 text-xs font-bold text-gold-soft transition-all hover:bg-gold hover:text-navy-deep disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
                >
                  <span>Continue to Scope & Inventory</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SCOPE, INVENTORY & PHOTOS */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                  Phase 3 of 4 • Inventory Scope & Service Level
                </span>
                <h3 className="font-display text-lg font-bold text-navy-deep dark:text-white sm:text-xl">
                  Choose your moving scope, package tier & upload photos
                </h3>
                <p className="mt-0.5 text-xs text-slate dark:text-gray-300">
                  Select the package that fits your schedule, packing assistance, and furniture assembly requirements.
                </p>
              </div>

              {/* Move Size Selector */}
              <div>
                <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Home Scope / Move Size
                </label>
                <select
                  value={formData.moveSize}
                  onChange={(e) => setFormData({ ...formData, moveSize: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-hairline bg-paper px-4 py-3 text-xs font-medium text-navy-deep outline-none transition-all focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                >
                  {MOVE_SIZES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} ({s.sublabel}) — Base ${s.basePrice}
                    </option>
                  ))}
                </select>
              </div>

              {/* SERVICE TIERS */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                    Select Your Service Tier
                  </label>
                  <span className="font-mono text-[10px] text-gold uppercase tracking-wider">
                    Binding Upfront Pricing
                  </span>
                </div>

                <div className="mt-2 grid gap-3 sm:grid-cols-3">
                  {tiers.map((tier) => {
                    const isSelected = selectedTierSlug === tier.slug;
                    return (
                      <div
                        key={tier.slug}
                        onClick={() => setSelectedTierSlug(tier.slug)}
                        className={`relative cursor-pointer rounded-xs border p-4 transition-all duration-200 ${
                          isSelected
                            ? "border-gold bg-gold/10 shadow-md ring-1 ring-gold dark:border-gold dark:bg-gold/15"
                            : "border-hairline bg-paper hover:border-gold/50 dark:border-white/10 dark:bg-[#070c14] dark:hover:border-gold/50"
                        }`}
                      >
                        {tier.badge && (
                          <span className="absolute -top-2.5 right-3 rounded-full bg-gold px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-navy-deep shadow-xs">
                            {tier.badge}
                          </span>
                        )}

                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                              isSelected
                                ? "border-gold bg-gold text-navy-deep"
                                : "border-hairline text-slate-light dark:border-white/20 dark:text-gray-400"
                            }`}
                          >
                            {isSelected ? "✓" : ""}
                          </div>
                          <h4 className="font-display text-xs font-bold text-navy-deep dark:text-white">
                            {tier.name}
                          </h4>
                        </div>

                        <p className="mt-2 text-[11px] text-slate dark:text-gray-300 leading-relaxed">
                          {tier.description}
                        </p>

                        <ul className="mt-3 space-y-1 border-t border-hairline/60 pt-2 text-[10px] text-slate dark:text-gray-400 dark:border-white/10">
                          {tier.features.slice(0, 3).map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-gold">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specialty Add-ons */}
              <div>
                <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Optional Specialty Add-on Services
                </label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {SPECIALTY_ADDONS.map((addon) => {
                    const isChecked = formData.selectedAddons.includes(addon.label);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.label)}
                        className={`flex cursor-pointer items-start gap-2.5 rounded-xs border p-3 text-xs transition-all ${
                          isChecked
                            ? "border-gold bg-gold/10 text-navy-deep font-semibold dark:border-gold dark:bg-gold/15 dark:text-white"
                            : "border-hairline bg-paper text-slate dark:border-white/10 dark:bg-[#070c14] dark:text-gray-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded-xs accent-gold cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-navy-deep dark:text-white">{addon.label}</p>
                            <span className="font-mono text-[10px] text-gold font-bold">+${addon.cost}</span>
                          </div>
                          <p className="text-[10px] text-slate-light dark:text-gray-400">{addon.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Inventory & Room Photos (Optional — Helps ensure quote accuracy)
                </label>
                <p className="mb-2 text-[11px] text-slate-light dark:text-gray-400">
                  Upload up to {MAX_PHOTOS} photos of bulky furniture, stairways, or storage areas ({MAX_SIZE_MB}MB max per photo).
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {photos.map((file, i) => (
                    <div key={i} className="relative h-16 w-16 overflow-hidden rounded-xs border border-hairline">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload preview ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-white hover:bg-red-600"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  {photos.length < MAX_PHOTOS && (
                    <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xs border border-dashed border-hairline bg-paper text-slate-light transition-all hover:border-gold hover:text-gold dark:border-white/20 dark:bg-[#070c14] dark:hover:border-gold dark:hover:text-gold">
                      <ImagePlus size={16} />
                      <span className="text-[9px]">Add Photo</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        name="photos"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Special Instructions or Fragile Item Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Upright piano in living room, heavy glass cabinet, tight corridor corner..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-hairline dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Route</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="btn-shimmer flex items-center gap-2 rounded-xs bg-navy-deep px-6 py-3.5 text-xs font-bold text-gold-soft transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
                >
                  <span>Proceed to Final Review</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW & SUBMIT */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Phase 4 of 4 • Final Review & Price Lock
                </span>
                <h3 className="font-display text-lg font-bold text-navy-deep dark:text-white sm:text-xl">
                  Review your relocation itinerary & submit
                </h3>
                <p className="mt-0.5 text-xs text-slate dark:text-gray-300">
                  Please verify your details below. Once submitted, your request is dispatched directly to Howard Langat and your itemized summary is sent to your inbox.
                </p>
              </div>

              {/* Complete Summary Verification Grid */}
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                {/* Contact Card */}
                <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
                  <div className="flex items-center justify-between border-b border-hairline pb-2 mb-2 dark:border-white/10">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                      Contact Information
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[10px] text-slate hover:text-gold dark:text-gray-400"
                    >
                      Edit ↗
                    </button>
                  </div>
                  <p className="font-bold text-navy-deep dark:text-white">{formData.name}</p>
                  <p className="text-slate dark:text-gray-300">{formData.phone}</p>
                  <p className="text-slate dark:text-gray-300">{formData.email}</p>
                  <p className="mt-1 font-mono text-[11px] text-gold">
                    Date: {formData.moveDate || "Flexible Scheduling"}
                  </p>
                </div>

                {/* Route Card */}
                <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
                  <div className="flex items-center justify-between border-b border-hairline pb-2 mb-2 dark:border-white/10">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                      Transit Route & Access
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-[10px] text-slate hover:text-gold dark:text-gray-400"
                    >
                      Edit ↗
                    </button>
                  </div>
                  <p className="text-slate dark:text-gray-300">
                    <strong>Pickup:</strong> {formData.pickupAddress}
                  </p>
                  <p className="text-slate dark:text-gray-300 mt-1">
                    <strong>Dropoff:</strong> {formData.dropoffAddress}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                    <span className="rounded-xs bg-gold/15 px-2 py-0.5 font-mono text-gold font-bold">
                      ~{distanceKm} km Transit
                    </span>
                    {formData.hasStairs && (
                      <span className="rounded-xs bg-paper-muted px-2 py-0.5 border border-hairline text-slate dark:border-white/10 dark:text-gray-300">
                        Stairs access
                      </span>
                    )}
                    {formData.hasElevator && (
                      <span className="rounded-xs bg-paper-muted px-2 py-0.5 border border-hairline text-slate dark:border-white/10 dark:text-gray-300">
                        Elevator available
                      </span>
                    )}
                  </div>
                </div>

                {/* Scope & Service Level Card */}
                <div className="sm:col-span-2 rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
                  <div className="flex items-center justify-between border-b border-hairline pb-2 mb-2 dark:border-white/10">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                      Scope, Service Tier & Add-ons
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-[10px] text-slate hover:text-gold dark:text-gray-400"
                    >
                      Edit ↗
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <span className="text-[10px] text-slate-light dark:text-gray-400 block">Move Scope</span>
                      <span className="font-semibold text-navy-deep dark:text-white">
                        {quoteEstimate.moveSize.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-light dark:text-gray-400 block">Service Tier</span>
                      <span className="font-semibold text-gold">
                        {quoteEstimate.tier.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-light dark:text-gray-400 block">Photos Attached</span>
                      <span className="font-semibold text-navy-deep dark:text-white">
                        {photos.length} {photos.length === 1 ? "photo" : "photos"}
                      </span>
                    </div>
                  </div>
                  {formData.selectedAddons.length > 0 && (
                    <p className="mt-2 text-[11px] text-slate dark:text-gray-300 border-t border-hairline/60 pt-2 dark:border-white/10">
                      <strong>Add-ons:</strong> {formData.selectedAddons.join(", ")}
                    </p>
                  )}
                  {formData.notes && (
                    <p className="mt-1 text-[11px] text-slate-light dark:text-gray-400 italic truncate">
                      &quot;{formData.notes}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* REAL-TIME ITEMIZED PRICE BREAKDOWN */}
              <div className="rounded-xs border border-gold/40 bg-paper p-5 dark:border-gold/30 dark:bg-[#070c14] shadow-sm">
                <div className="flex items-center justify-between border-b border-hairline pb-3 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gold" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-navy-deep dark:text-white">
                      Transparent Upfront Calculation
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Binding Upfront Estimate
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate dark:text-gray-300">
                      Base Move Rate ({quoteEstimate.moveSize.label})
                    </span>
                    <span className="font-mono font-semibold text-navy-deep dark:text-white">
                      ${quoteEstimate.baseAdjustedPrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate dark:text-gray-300">
                      Transit Distance Mileage (~{distanceKm} km)
                    </span>
                    <span className="font-mono font-semibold text-navy-deep dark:text-white">
                      {quoteEstimate.distance.totalDistanceCharge > 0
                        ? `+$${quoteEstimate.distance.totalDistanceCharge.toFixed(2)}`
                        : "$0.00 (Local Metro Included)"}
                    </span>
                  </div>

                  {quoteEstimate.stairsCost > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate dark:text-gray-300">Stairs Access Adjustment</span>
                      <span className="font-mono font-semibold text-navy-deep dark:text-white">
                        +${quoteEstimate.stairsCost}
                      </span>
                    </div>
                  )}

                  {quoteEstimate.addonsCost > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate dark:text-gray-300">
                        Selected Add-ons ({quoteEstimate.addonsList.length})
                      </span>
                      <span className="font-mono font-semibold text-navy-deep dark:text-white">
                        +${quoteEstimate.addonsCost}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3 dark:border-white/10">
                    <div>
                      <span className="text-xs font-bold text-navy-deep dark:text-white">Estimated Upfront Total:</span>
                      <p className="text-[10px] text-slate-light dark:text-gray-400">
                        Zero hidden fees. One trusted crew from start to finish.
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xl font-bold text-gold">
                        ${quoteEstimate.estimatedTotalMin} - ${quoteEstimate.estimatedTotalMax} CAD
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message display */}
              <AnimatePresence>
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 rounded-xs border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-600 dark:text-red-400"
                  >
                    <AlertCircle size={15} className="shrink-0 text-red-500" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Edit Scope</span>
                </button>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-shimmer flex items-center justify-center gap-2 rounded-xs bg-gold px-8 py-3.5 text-xs font-bold text-navy-deep shadow-xl transition-all hover:bg-gold-soft hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Transmitting Quote & Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Submit Request & Lock Rates</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Footer */}
              <div className="flex items-center justify-center gap-4 text-center font-mono text-[10px] text-slate-light dark:text-gray-400 pt-2">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Lock size={11} /> 256-Bit Encrypted Dispatch
                </span>
                <span>•</span>
                <span>Response in under 24 hours guaranteed</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

export default function QuoteForm() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate">Loading moving quote wizard...</div>}>
      <QuoteFormContent />
    </Suspense>
  );
}