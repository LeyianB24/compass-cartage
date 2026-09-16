// src/components/QuoteForm.tsx
"use client";

import { useState, FormEvent, Suspense, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ImagePlus,
  X,
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  ShieldCheck,
  Navigation,
  Route,
  DollarSign,
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

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
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
          // If the currently selected slug doesn't exist, pick the default one
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

    // Compile comprehensive notes
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

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center rounded-card border border-hairline bg-paper-muted p-8 text-center shadow-lg dark:border-white/10 dark:bg-[#1e1e1e] sm:p-12"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="font-display mt-5 text-2xl font-bold text-navy-deep dark:text-white">
          Quote Request Received!
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate dark:text-gray-300">
          Thank you, <strong className="text-navy-deep dark:text-white">{formData.name}</strong>. We&apos;ve sent an itemized summary to <strong className="text-navy-deep dark:text-white">{formData.email}</strong>.
        </p>

        {/* Confirmation Detail Pill */}
        <div className="mt-6 w-full max-w-md rounded-xs border border-hairline bg-paper p-4 text-left dark:border-white/10 dark:bg-[#070c14]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-light dark:text-gray-400">Selected Service Tier:</span>
            <span className="font-bold text-gold">{quoteEstimate.tier.name}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-light dark:text-gray-400">Route Distance:</span>
            <span className="font-semibold text-navy-deep dark:text-white">~{distanceKm} km</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-light dark:text-gray-400">Distance Travel Fee:</span>
            <span className="font-semibold text-navy-deep dark:text-white">
              {quoteEstimate.distance.totalDistanceCharge > 0 ? `$${quoteEstimate.distance.totalDistanceCharge.toFixed(2)}` : "Included (Local Metro)"}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-hairline pt-2 text-xs dark:border-white/10">
            <span className="font-bold text-navy-deep dark:text-white">Estimated Upfront Total:</span>
            <span className="font-mono text-base font-bold text-gold">
              ${quoteEstimate.estimatedTotalMin} - ${quoteEstimate.estimatedTotalMax}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="mt-8 flex items-center gap-2 rounded-sm border border-hairline bg-paper px-6 py-2.5 text-xs font-semibold text-navy-deep transition-all hover:bg-paper-dark dark:border-white/15 dark:bg-[#121212] dark:text-white dark:hover:border-gold"
        >
          <RefreshCw size={14} className="text-slate" />
          Submit Another Request
        </button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-card border border-hairline bg-paper-muted p-6 shadow-xl dark:border-white/10 dark:bg-[#0f172a] sm:p-8">
      {/* Stepper Navigation Header */}
      <div className="mb-8 border-b border-hairline pb-5 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
              Step {step} of 3
            </span>
            <h3 className="font-display text-xl font-semibold text-navy-deep dark:text-white">
              {step === 1 && "Contact & Move Timing"}
              {step === 2 && "Locations & Route Distance"}
              {step === 3 && "Move Scope, Tier & Estimate"}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(s)}
                className={`flex h-7 w-7 items-center justify-center rounded-xs font-mono text-xs font-bold transition-all ${
                  step === s
                    ? "bg-navy-deep text-gold-soft font-bold dark:bg-gold dark:text-navy-deep"
                    : step > s
                    ? "bg-emerald-600/20 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-paper text-slate-light dark:bg-[#070c14] dark:text-gray-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-paper dark:bg-[#070c14]">
          <motion.div
            className="h-full bg-gold"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* STEP 1: Contact Details & Move Date */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Full Name *
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                  />
                  <User size={15} className="absolute right-3 top-3 text-slate-light dark:text-gray-500" />
                </div>
              </div>

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
                  className="mt-1 w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Preferred Move Date
                </label>
                <input
                  type="date"
                  value={formData.moveDate}
                  onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                  className="mt-1 w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-xs text-navy-deep outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20 dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.phone || !formData.email}
                className="btn-shimmer flex items-center gap-2 rounded-xs bg-navy-deep px-6 py-3 text-xs font-bold text-gold-soft transition-all hover:bg-gold hover:text-navy-deep disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
              >
                <span>Continue to Locations & Route</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Locations & Distance Charging */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Moving From (Pickup Address / City) *
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Downtown Edmonton, 104 St NW, AB"
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                    className="w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                  />
                  <MapPin size={15} className="absolute right-3 top-3 text-slate-light dark:text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Moving To (Dropoff Address / City) *
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Albert / Calgary / Red Deer"
                    value={formData.dropoffAddress}
                    onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
                    className="w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                  />
                  <MapPin size={15} className="absolute right-3 top-3 text-slate-light dark:text-gray-500" />
                </div>
              </div>
            </div>

            {/* Live Distance Travel Fee Breakdown Banner */}
            <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold">
                    <Route size={16} />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold">
                      Route Distance & Mileage Charge
                    </span>
                    <p className="text-xs font-medium text-navy-deep dark:text-gray-200">
                      ~{distanceKm} km transit distance
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-gold">
                    {quoteEstimate.distance.totalDistanceCharge > 0
                      ? `+$${quoteEstimate.distance.totalDistanceCharge.toFixed(2)} Travel Fee`
                      : "$0.00 Travel Fee"}
                  </span>
                  <p className="text-[10px] text-slate-light dark:text-gray-400">
                    {quoteEstimate.distance.billableKm === 0
                      ? `First ${distanceConfig.includedKm} km included free`
                      : `${quoteEstimate.distance.billableKm} billable km @ $${distanceConfig.perKmRate.toFixed(2)}/km`}
                  </p>
                </div>
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-slate dark:text-gray-400">
                {quoteEstimate.distance.explanation}
              </p>
            </div>

            {/* Live Google Maps Route Preview */}
            {formData.pickupAddress && formData.dropoffAddress && (
              <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-gold">
                    <Navigation size={13} />
                    <span>Live Google Maps Directions Preview</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                      `${formData.pickupAddress}, Alberta`
                    )}&destination=${encodeURIComponent(`${formData.dropoffAddress}, Alberta`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold text-gold hover:underline"
                  >
                    Open in Google Maps ↗
                  </a>
                </div>

                <div className="mt-3 aspect-[16/7] w-full overflow-hidden rounded-xs border border-hairline bg-navy-deep dark:border-white/10">
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

            {/* Access conditions */}
            <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
              <p className="text-xs font-semibold text-navy-deep dark:text-gray-200">
                Property Access Conditions (Select all that apply)
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasStairs: !formData.hasStairs })}
                  className={`rounded-xs border px-3 py-1.5 text-xs font-medium transition-all ${
                    formData.hasStairs
                      ? "border-gold bg-gold/15 text-gold font-bold dark:border-gold dark:bg-gold/20 dark:text-gold"
                      : "border-hairline bg-paper-muted text-slate dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-400"
                  }`}
                >
                  {formData.hasStairs ? "✓ Stairs Involved (+$35)" : "+ Has Stairs"}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasElevator: !formData.hasElevator })}
                  className={`rounded-xs border px-3 py-1.5 text-xs font-medium transition-all ${
                    formData.hasElevator
                      ? "border-gold bg-gold/15 text-gold font-bold dark:border-gold dark:bg-gold/20 dark:text-gold"
                      : "border-hairline bg-paper-muted text-slate dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-400"
                  }`}
                >
                  {formData.hasElevator ? "✓ Elevator Access" : "+ Elevator Available"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-shimmer flex items-center gap-2 rounded-xs bg-navy-deep px-6 py-3 text-xs font-bold text-gold-soft transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
              >
                <span>Select Service Tier & Review</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Move Size, Price Tiers & Real-Time Quote Summary */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                Move Size / Property Type
              </label>
              <select
                value={formData.moveSize}
                onChange={(e) => setFormData({ ...formData, moveSize: e.target.value })}
                className="mt-1 w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-xs text-navy-deep outline-none transition-all focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
              >
                {MOVE_SIZES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label} ({s.sublabel}) — Base ${s.basePrice}
                  </option>
                ))}
              </select>
            </div>

            {/* ADMIN-CONFIGURED MOVING PRICE TIERS */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                  Select Your Moving Service Tier
                </label>
                <span className="font-mono text-[10px] text-gold-soft dark:text-gold uppercase tracking-wider">
                  Admin Active Pricing Rates
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-light dark:text-gray-400">
                Choose the level of service tailored to your timeline, packing prep, and furniture protection needs.
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
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
                          className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold ${
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
                Specialty Add-on Services (Optional)
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
                          <span className="font-mono text-[10px] text-gold-soft dark:text-gold">+${addon.cost}</span>
                        </div>
                        <p className="text-[10px] text-slate-light dark:text-gray-400">{addon.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                Photos of Space or Heavy Furniture (Optional)
              </label>
              <p className="mb-2 text-[11px] text-slate-light dark:text-gray-400">
                Up to {MAX_PHOTOS} photos, {MAX_SIZE_MB}MB each.
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
                      className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-white"
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

            {/* Additional notes */}
            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                Additional Instructions / Inventory Notes
              </label>
              <textarea
                rows={2}
                placeholder="List fragile items, piano, safe, specific preferred times, or storage instructions..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 w-full rounded-xs border border-hairline bg-paper px-4 py-2 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
              />
            </div>

            {/* REAL-TIME ITEMIZED QUOTE SUMMARY CARD */}
            <div className="rounded-xs border border-gold/40 bg-paper p-5 dark:border-gold/30 dark:bg-[#070c14] shadow-sm">
              <div className="flex items-center justify-between border-b border-hairline pb-3 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gold" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-navy-deep dark:text-white">
                    Itemized Quote Calculation
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ Binding Upfront Estimate
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate dark:text-gray-300">
                    Base Move: {quoteEstimate.moveSize.label} ({quoteEstimate.tier.name})
                  </span>
                  <span className="font-mono font-semibold text-navy-deep dark:text-white">
                    ${quoteEstimate.baseAdjustedPrice}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate dark:text-gray-300">
                    Route Distance: ~{distanceKm} km
                  </span>
                  <span className="font-mono font-semibold text-navy-deep dark:text-white">
                    {quoteEstimate.distance.totalDistanceCharge > 0
                      ? `+$${quoteEstimate.distance.totalDistanceCharge.toFixed(2)}`
                      : "$0.00 (Included)"}
                  </span>
                </div>

                {quoteEstimate.stairsCost > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate dark:text-gray-300">Stairs Access Fee</span>
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
                    <span className="text-xs font-bold text-navy-deep dark:text-white">Estimated Total:</span>
                    <p className="text-[10px] text-slate-light dark:text-gray-400">
                      Zero surprise fees. Guaranteed rate stability.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xl font-bold text-gold">
                      ${quoteEstimate.estimatedTotalMin} - ${quoteEstimate.estimatedTotalMax}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 rounded-xs border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400"
                >
                  <AlertCircle size={15} className="shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft size={14} />
                <span>Back to Locations</span>
              </button>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-shimmer flex items-center gap-2 rounded-xs bg-navy-deep px-8 py-3.5 text-xs font-bold text-gold-soft shadow-lg transition-all hover:bg-gold hover:text-navy-deep disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    <span>Submit Binding Quote Request</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
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