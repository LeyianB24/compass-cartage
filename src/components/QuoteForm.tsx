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
  DollarSign,
  Check,
  Copy,
  Lock,
  Truck,
  HelpCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";
import { MOVE_SIZES, SPECIALTY_ADDONS, BUSINESS } from "@/lib/constants";
import {
  DEFAULT_DISTANCE_CONFIG,
  DEFAULT_PRICING_TIERS,
  estimateRoadDistanceKm,
  computeMoveQuoteEstimate,
  type DistanceConfig,
  type ServicePricingTier,
} from "@/lib/pricing-tiers";

type Status = "idle" | "submitting" | "success" | "error";

const VEHICLE_FIT_GUIDE = [
  {
    moveSizeId: "studio",
    size: "Studio / Bachelor",
    fit: "1–2 rooms, minimal heavy furniture",
    vehicle: "High-Roof Ford Transit Van",
    crew: "2 Dedicated Movers",
  },
  {
    moveSizeId: "1-bedroom",
    size: "1 Bedroom Home / Apt",
    fit: "Full bedroom, sofa, dining set & boxes",
    vehicle: "High-Roof Ford Transit Van",
    crew: "2 Dedicated Movers",
  },
  {
    moveSizeId: "2-bedroom",
    size: "2 Bedroom Home / Condo",
    fit: "2 bedrooms, living room, dining, full kitchen",
    vehicle: "20ft–24ft Moving Truck",
    crew: "2–3 Dedicated Movers",
  },
  {
    moveSizeId: "3-bedroom",
    size: "3 Bedroom House",
    fit: "Full single-family home, garage & appliances",
    vehicle: "26ft Commercial Freight Box Truck",
    crew: "3 Dedicated Movers",
  },
  {
    moveSizeId: "4-plus-bedroom",
    size: "4+ Bedroom Estate",
    fit: "Large multi-level estate, patio & basement items",
    vehicle: "26ft Truck + Support Van / Trailer",
    crew: "4 Dedicated Movers",
  },
  {
    moveSizeId: "office-small",
    size: "Small Office",
    fit: "1–5 workstations, desks, computers & records",
    vehicle: "20ft Truck",
    crew: "2 Dedicated Movers",
  },
  {
    moveSizeId: "office-large",
    size: "Large Commercial",
    fit: "Corporate floor, retail storefront or warehouse",
    vehicle: "Multiple 26ft Fleet Trucks",
    crew: "4+ Dedicated Movers",
  },
];

function formatPhoneNumber(value: string) {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const len = phoneNumber.length;
  if (len < 4) return phoneNumber;
  if (len < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [assignedQuoteNumber, setAssignedQuoteNumber] = useState("");
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [showVehicleGuide, setShowVehicleGuide] = useState(false);
  const [step1Errors, setStep1Errors] = useState<{ size?: string; pickup?: string; dropoff?: string }>({});
  const [step3Errors, setStep3Errors] = useState<{ name?: string; phone?: string; email?: string }>({});
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

  // Support both ?size= and ?moveSize=
  const initialMoveSize = useMemo(() => {
    const raw = searchParams.get("size") || searchParams.get("moveSize");
    if (!raw) return "1-bedroom";
    // If exact match
    if (MOVE_SIZES.some((s) => s.id === raw)) return raw;
    // Common aliases
    if (raw === "commercial") return "office-large";
    return "1-bedroom";
  }, [searchParams]);

  const [formData, setFormData] = useState(() => ({
    name: searchParams.get("name") || "",
    phone: searchParams.get("phone") ? formatPhoneNumber(searchParams.get("phone")!) : "",
    email: searchParams.get("email") || "",
    pickupAddress: searchParams.get("pickupAddress") || searchParams.get("from") || "",
    dropoffAddress: searchParams.get("dropoffAddress") || searchParams.get("to") || "",
    moveDate: "",
    moveSize: initialMoveSize,
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
  }, [
    formData.moveSize,
    distanceKm,
    selectedTierSlug,
    formData.hasStairs,
    formData.hasElevator,
    formData.selectedAddons,
    distanceConfig,
    tiers,
  ]);

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

  // Step 1 Validation
  function validateStep1() {
    const errors: { size?: string; pickup?: string; dropoff?: string } = {};
    if (!formData.moveSize) errors.size = "Please select your home or move size.";
    if (!formData.pickupAddress.trim()) errors.pickup = "Please enter your pickup location.";
    if (!formData.dropoffAddress.trim()) errors.dropoff = "Please enter your delivery destination.";
    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  }

  // Step 3 Validation
  function validateStep3() {
    const errors: { name?: string; phone?: string; email?: string } = {};
    if (!formData.name.trim()) errors.name = "Please enter your full name.";
    const cleanPhone = formData.phone.replace(/[^\d]/g, "");
    if (cleanPhone.length < 10) errors.phone = "Please enter a valid 10-digit phone number.";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      errors.email = "Please enter a valid email address.";
    }
    setStep3Errors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleProceedToStep2() {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  }

  function handleProceedToStep3() {
    setStep(3);
    window.scrollTo({ top: 180, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateStep3()) return;

    setStatus("submitting");
    setErrorMsg("");

    const noteLines: string[] = [];
    noteLines.push(`[Service Tier: ${quoteEstimate.tier.name}]`);
    noteLines.push(
      `[Route Distance: ~${distanceKm} km | Distance Fee: $${quoteEstimate.distance.totalDistanceCharge.toFixed(2)}]`
    );
    noteLines.push(
      `[Estimated Quote: $${quoteEstimate.estimatedTotalMin} - $${quoteEstimate.estimatedTotalMax}]`
    );
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote request.");
      }

      if (data.quoteNumber) {
        setAssignedQuoteNumber(data.quoteNumber);
      }
      setStatus("success");
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please call dispatch directly."
      );
    }
  }

  // SUCCESS SCREEN: Clear explanation of what happens next and response time
  if (status === "success") {
    return (
      <div className="rounded-card border border-emerald-500/30 bg-paper p-8 text-center shadow-xl dark:border-emerald-500/30 dark:bg-[#0c1626]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={36} />
        </div>

        <h3 className="mt-5 font-display text-2xl font-bold text-navy-deep dark:text-white">
          Quote Request Received!
        </h3>

        {/* Assigned Quote Number Badge */}
        {assignedQuoteNumber && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 font-mono text-xs font-bold text-gold">
            <span>Reference ID: {assignedQuoteNumber}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(assignedQuoteNumber);
                setCopiedQuote(true);
                setTimeout(() => setCopiedQuote(false), 2000);
              }}
              className="text-white hover:text-gold transition-colors"
              title="Copy quote reference number"
            >
              {copiedQuote ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>
        )}

        <div className="mx-auto mt-6 max-w-lg rounded-xs border border-hairline bg-paper-muted p-5 text-left dark:border-white/10 dark:bg-[#070c14]">
          <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
            Estimated Scope & Upfront Rate Lock
          </h4>
          <div className="mt-3 flex items-baseline justify-between border-b border-hairline pb-3 dark:border-white/10">
            <span className="text-xs text-slate dark:text-gray-300">
              {quoteEstimate.moveSize.label} · {quoteEstimate.tier.name}
            </span>
            <span className="font-mono text-xl font-bold text-navy-deep dark:text-white">
              ${quoteEstimate.estimatedTotalMin} – ${quoteEstimate.estimatedTotalMax}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-light dark:text-gray-400 space-y-1">
            <p>• Route: {formData.pickupAddress} → {formData.dropoffAddress} (~{distanceKm} km)</p>
            <p>• Dedicated Crew: {quoteEstimate.moveSize.recommendedCrew} Movers with {quoteEstimate.moveSize.truckSize}</p>
          </div>
        </div>

        {/* WHAT HAPPENS NEXT SECTION */}
        <div className="mx-auto mt-6 max-w-lg rounded-xs border border-gold/30 bg-gold/5 p-5 text-left">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
            <Clock size={16} />
            <span>What Happens Next & Expected Response Time</span>
          </div>

          <ol className="mt-3 space-y-2.5 text-xs text-slate dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 font-mono text-[10px] font-bold text-navy-deep dark:text-gold">
                1
              </span>
              <span>
                <strong>Edmonton Dispatch Review:</strong> Our lead logistics coordinator reviews your route, stairs, and parking access.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 font-mono text-[10px] font-bold text-navy-deep dark:text-gold">
                2
              </span>
              <span>
                <strong>Response Window:</strong> We follow up within <strong>15–30 minutes</strong> during dispatch hours (Mon–Sat 7am–8pm MT) or by 8:00 AM the next morning.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 font-mono text-[10px] font-bold text-navy-deep dark:text-gold">
                3
              </span>
              <span>
                <strong>Official PDF Sent:</strong> A detailed PDF estimate has been dispatched to <em>{formData.email}</em>.
              </span>
            </li>
          </ol>
        </div>

        {/* Immediate Assistance Call Link */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex items-center gap-2 rounded-xs bg-navy-deep px-6 py-3 text-xs font-bold text-gold-soft hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep"
          >
            <Phone size={14} />
            <span>Urgent Move? Call Dispatch: {BUSINESS.phone}</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setStep(1);
            }}
            className="rounded-xs border border-hairline px-4 py-3 text-xs font-semibold text-slate hover:border-gold hover:text-navy-deep dark:border-white/15 dark:text-gray-300"
          >
            Submit Another Route
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-hairline bg-paper p-6 sm:p-8 shadow-xl dark:border-white/10 dark:bg-[#0a1320]">
      {/* MULTI-STEP PROGRESS HEADER: STEP 1 OF 3 */}
      <div className="mb-8 border-b border-hairline pb-6 dark:border-white/10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
            Step {step} of 3:{" "}
            {step === 1 && "Move Size & Route"}
            {step === 2 && "Upfront Estimate & Package"}
            {step === 3 && "Send My Guaranteed Quote"}
          </span>
          <span className="font-mono text-[11px] text-slate-light dark:text-gray-400">
            {step === 1 && "33% complete"}
            {step === 2 && "66% complete"}
            {step === 3 && "Final Step"}
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-paper-muted dark:bg-white/10">
          <motion.div
            className="h-full bg-gold rounded-full"
            initial={{ width: "33%" }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* FORM CONTENT */}
      <form onSubmit={handleSubmit} noValidate>
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STEP 1 OF 3: MOVE SIZE & ROUTE (NO CONTACT INFO REQUESTED BEFORE ESTIMATE) */}
          {/* ========================================================================= */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-display text-2xl font-bold text-navy-deep dark:text-white">
                  Tell us what you&apos;re moving and where
                </h3>
                <p className="mt-1 text-xs text-slate dark:text-gray-300">
                  Pick your home size and route to calculate your instant upfront price range. No phone number or email required to see the estimate.
                </p>
              </div>

              {/* Move Size Selector without stray '*' */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="moveSizeSelect"
                    className="block text-xs font-bold text-navy-deep dark:text-gray-200"
                  >
                    Home Scope / Move Size
                  </label>
                  {/* Help Me Choose Toggle Link */}
                  <button
                    type="button"
                    onClick={() => setShowVehicleGuide((v) => !v)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
                  >
                    <HelpCircle size={13} />
                    <span>Not sure which vehicle? Help me choose</span>
                  </button>
                </div>

                <div className="relative mt-1.5">
                  <select
                    id="moveSizeSelect"
                    value={formData.moveSize}
                    onChange={(e) => {
                      setFormData({ ...formData, moveSize: e.target.value });
                      if (step1Errors.size) setStep1Errors({ ...step1Errors, size: undefined });
                    }}
                    className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 text-xs font-medium text-navy-deep outline-none transition-all focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:focus:border-gold"
                  >
                    {MOVE_SIZES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} ({s.sublabel}) — Est. ~{s.estVolumeCuFt} cu ft
                      </option>
                    ))}
                  </select>
                </div>
                {step1Errors.size && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-500">{step1Errors.size}</p>
                )}
              </div>

              {/* Vehicle Fit Guide Modal / Collapsible Table */}
              <AnimatePresence>
                {showVehicleGuide && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden rounded-xs border border-gold/40 bg-paper-muted p-4 dark:border-white/15 dark:bg-[#070c14]"
                  >
                    <div className="flex items-center justify-between border-b border-hairline pb-2 dark:border-white/10">
                      <span className="font-mono text-xs font-bold uppercase text-gold">
                        Compass Cartage Fleet Sizing Guide
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowVehicleGuide(false)}
                        className="text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-hairline dark:border-white/10 font-mono text-[10px] uppercase text-slate-light dark:text-gray-400">
                            <th className="pb-2">Move Size</th>
                            <th className="pb-2">Typical Inventory</th>
                            <th className="pb-2">Recommended Vehicle</th>
                            <th className="pb-2">Crew</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-hairline dark:divide-white/5">
                          {VEHICLE_FIT_GUIDE.map((row) => (
                            <tr
                              key={row.moveSizeId}
                              onClick={() => {
                                setFormData({ ...formData, moveSize: row.moveSizeId });
                                setShowVehicleGuide(false);
                              }}
                              className={`cursor-pointer transition-colors hover:bg-gold/10 ${
                                formData.moveSize === row.moveSizeId ? "bg-gold/15 font-bold" : ""
                              }`}
                            >
                              <td className="py-2 pr-2 text-navy-deep dark:text-white font-medium">
                                {row.size}
                              </td>
                              <td className="py-2 pr-2 text-slate dark:text-gray-300">{row.fit}</td>
                              <td className="py-2 pr-2 text-gold font-semibold">{row.vehicle}</td>
                              <td className="py-2 text-slate-light dark:text-gray-400">{row.crew}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Origin & Destination Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pickupInput"
                    className="block text-xs font-bold text-navy-deep dark:text-gray-200"
                  >
                    Where are we picking up?
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="pickupInput"
                      type="text"
                      value={formData.pickupAddress}
                      onChange={(e) => {
                        setFormData({ ...formData, pickupAddress: e.target.value });
                        if (step1Errors.pickup) setStep1Errors({ ...step1Errors, pickup: undefined });
                      }}
                      placeholder="e.g. 104 Street NW, Oliver, Edmonton"
                      className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 pl-10 text-xs font-medium text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500"
                    />
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-gold" />
                  </div>
                  {step1Errors.pickup && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-500">{step1Errors.pickup}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dropoffInput"
                    className="block text-xs font-bold text-navy-deep dark:text-gray-200"
                  >
                    Where are we delivering?
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="dropoffInput"
                      type="text"
                      value={formData.dropoffAddress}
                      onChange={(e) => {
                        setFormData({ ...formData, dropoffAddress: e.target.value });
                        if (step1Errors.dropoff) setStep1Errors({ ...step1Errors, dropoff: undefined });
                      }}
                      placeholder="e.g. Windermere, St. Albert, or Calgary"
                      className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 pl-10 text-xs font-medium text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500"
                    />
                    <Navigation size={16} className="absolute left-3.5 top-3.5 text-emerald-500" />
                  </div>
                  {step1Errors.dropoff && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-500">{step1Errors.dropoff}</p>
                  )}
                </div>
              </div>

              {/* Preferred Date (Optional) */}
              <div>
                <label
                  htmlFor="moveDateInput"
                  className="block text-xs font-semibold text-navy-deep dark:text-gray-200"
                >
                  Target Move Date <span className="font-normal text-slate-light dark:text-gray-400">(Optional)</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="moveDateInput"
                    type="date"
                    value={formData.moveDate}
                    onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                    className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 pl-10 text-xs font-medium text-navy-deep outline-none transition-all focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                  />
                  <Calendar size={16} className="absolute left-3.5 top-3.5 text-gold" />
                </div>
              </div>

              {/* Step 1 Action Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xs bg-navy-deep py-3.5 text-xs sm:text-sm font-bold text-gold-soft shadow-lg transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep"
                >
                  <span>See My Instant Price Estimate</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2 OF 3: UPFRONT TRANSPARENT ESTIMATE & SERVICE PACKAGE               */}
          {/* ========================================================================= */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Instant Estimate Calculated
                </span>
                <h3 className="font-display text-2xl font-bold text-navy-deep dark:text-white">
                  Your Upfront Moving Rate
                </h3>
                <p className="mt-1 text-xs text-slate dark:text-gray-300">
                  Based on {quoteEstimate.moveSize.label} with estimated ~{distanceKm} km transit.
                </p>
              </div>

              {/* BIG TRANSPARENT PRICE RANGE BANNER */}
              <div className="rounded-xs border border-gold/40 bg-gradient-to-br from-paper to-paper-muted p-6 dark:from-[#0a1320] dark:to-[#070c14] shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-hairline pb-4 dark:border-white/10">
                  <div>
                    <span className="font-mono text-xs uppercase text-slate dark:text-gray-400">
                      Estimated Range (All-Inclusive)
                    </span>
                    <div className="font-display text-3xl sm:text-4xl font-extrabold text-navy-deep dark:text-gold">
                      ${quoteEstimate.estimatedTotalMin} – ${quoteEstimate.estimatedTotalMax}
                    </div>
                  </div>
                  <div className="rounded-xs bg-gold/15 px-3 py-1 font-mono text-xs font-semibold text-gold">
                    Upfront Guarantee
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-light dark:text-gray-400">
                      Dedicated Crew
                    </span>
                    <span className="font-bold text-navy-deep dark:text-white">
                      {quoteEstimate.moveSize.recommendedCrew} Movers
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-light dark:text-gray-400">
                      Fleet Class
                    </span>
                    <span className="font-bold text-navy-deep dark:text-white">
                      {quoteEstimate.moveSize.truckSize}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-light dark:text-gray-400">
                      Labor Estimate
                    </span>
                    <span className="font-bold text-navy-deep dark:text-white">
                      ~{quoteEstimate.moveSize.baseLaborHours} Hours
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] uppercase text-slate-light dark:text-gray-400">
                      Travel Tier
                    </span>
                    <span className="font-bold text-navy-deep dark:text-white">
                      {quoteEstimate.distance.tier} (~{distanceKm} km)
                    </span>
                  </div>
                </div>
              </div>

              {/* SERVICE TIER CHOOSER */}
              <div>
                <label className="block text-xs font-bold text-navy-deep dark:text-gray-200 mb-2">
                  Choose Service Tier
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {tiers.map((tier) => {
                    const isSelected = selectedTierSlug === tier.slug;
                    return (
                      <div
                        key={tier.slug}
                        onClick={() => setSelectedTierSlug(tier.slug)}
                        className={`cursor-pointer rounded-xs border p-3.5 transition-all ${
                          isSelected
                            ? "border-gold bg-gold/15 shadow-sm dark:bg-gold/20 dark:border-gold"
                            : "border-hairline bg-paper hover:border-gold/50 dark:border-white/10 dark:bg-[#070c14]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-navy-deep dark:text-white">
                            {tier.name.split(" ")[0]}
                          </span>
                          {tier.badge && (
                            <span className="font-mono text-[9px] font-semibold text-gold">
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-slate dark:text-gray-300 line-clamp-2">
                          {tier.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACCESS & OPTIONAL ADDONS */}
              <div>
                <label className="block text-xs font-bold text-navy-deep dark:text-gray-200 mb-2">
                  Access & Specialty Add-Ons
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="flex items-center gap-2.5 rounded-xs border border-hairline p-3 text-xs text-navy-deep dark:border-white/10 dark:text-gray-200 cursor-pointer hover:bg-paper-muted dark:hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={formData.hasStairs}
                      onChange={(e) => setFormData({ ...formData, hasStairs: e.target.checked })}
                      className="accent-gold h-4 w-4"
                    />
                    <span>Flight of stairs at pickup or dropoff</span>
                  </label>

                  <label className="flex items-center gap-2.5 rounded-xs border border-hairline p-3 text-xs text-navy-deep dark:border-white/10 dark:text-gray-200 cursor-pointer hover:bg-paper-muted dark:hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={formData.hasElevator}
                      onChange={(e) => setFormData({ ...formData, hasElevator: e.target.checked })}
                      className="accent-gold h-4 w-4"
                    />
                    <span>Elevator available for move</span>
                  </label>
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {SPECIALTY_ADDONS.slice(0, 4).map((addon) => {
                    const isChecked = formData.selectedAddons.includes(addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between rounded-xs border p-3 text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? "border-gold bg-gold/10 text-navy-deep dark:text-gold"
                            : "border-hairline text-slate dark:border-white/10 dark:text-gray-300 hover:border-gold/40"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(addon.id)}
                            className="accent-gold h-4 w-4"
                          />
                          <span>{addon.label}</span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-gold">
                          +${addon.cost}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-hairline dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-navy-deep dark:text-gray-300"
                >
                  <ArrowLeft size={14} />
                  <span>Edit Route or Size</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedToStep3}
                  className="btn-shimmer inline-flex items-center gap-2 rounded-xs bg-navy-deep px-6 py-3 text-xs sm:text-sm font-bold text-gold-soft hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep"
                >
                  <span>Looks Good — Send Me This Quote</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3 OF 3: CONTACT DETAILS TO SEND OFFICIAL QUOTE                       */}
          {/* ========================================================================= */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-display text-2xl font-bold text-navy-deep dark:text-white">
                  Where should we send your official quote?
                </h3>
                <p className="mt-1 text-xs text-slate dark:text-gray-300">
                  We will lock in your estimated rate of <strong>${quoteEstimate.estimatedTotalMin} – ${quoteEstimate.estimatedTotalMax}</strong> and prepare your crew schedule.
                </p>
              </div>

              {/* Name, Phone, Email with plain-language labels */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fullNameInput"
                    className="block text-xs font-bold text-navy-deep dark:text-gray-200"
                  >
                    Your Full Name
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="fullNameInput"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (step3Errors.name) setStep3Errors({ ...step3Errors, name: undefined });
                      }}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 pl-10 text-xs font-medium text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500"
                    />
                    <User size={16} className="absolute left-3.5 top-3.5 text-gold" />
                  </div>
                  {step3Errors.name && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-500">{step3Errors.name}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phoneInput"
                      className="block text-xs font-bold text-navy-deep dark:text-gray-200"
                    >
                      Cell Phone Number <span className="font-normal text-slate-light dark:text-gray-400">(For text confirmation)</span>
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        id="phoneInput"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          setFormData({ ...formData, phone: formatted });
                          if (step3Errors.phone) setStep3Errors({ ...step3Errors, phone: undefined });
                        }}
                        placeholder="(587) 555-0199"
                        className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 pl-10 text-xs font-medium text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500"
                      />
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-gold" />
                    </div>
                    {step3Errors.phone && (
                      <p className="mt-1 text-[11px] font-semibold text-rose-500">{step3Errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="emailInput"
                      className="block text-xs font-bold text-navy-deep dark:text-gray-200"
                    >
                      Email Address <span className="font-normal text-slate-light dark:text-gray-400">(For PDF breakdown)</span>
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        id="emailInput"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (step3Errors.email) setStep3Errors({ ...step3Errors, email: undefined });
                        }}
                        placeholder="sarah@example.com"
                        className="w-full rounded-xs border border-hairline bg-paper px-4 py-3 pl-10 text-xs font-medium text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500"
                      />
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-gold" />
                    </div>
                    {step3Errors.email && (
                      <p className="mt-1 text-[11px] font-semibold text-rose-500">{step3Errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Optional Notes */}
                <div>
                  <label
                    htmlFor="notesInput"
                    className="block text-xs font-semibold text-navy-deep dark:text-gray-200"
                  >
                    Special Notes or Heavy Items <span className="font-normal text-slate-light dark:text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    id="notesInput"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Elevator booked for 10am; piano on main floor; condo loading dock code 4492"
                    className="mt-1.5 w-full rounded-xs border border-hairline bg-paper p-3 text-xs text-navy-deep outline-none transition-all placeholder:text-slate-light focus:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>

                {/* Optional Photo Attachment */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200">
                      Add Photos of Items or Rooms <span className="font-normal text-slate-light dark:text-gray-400">(Optional, up to 5)</span>
                    </label>
                    <span className="text-[11px] text-slate-light dark:text-gray-400">
                      {photos.length}/{MAX_PHOTOS}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {photos.map((p, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-xs border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs text-navy-deep dark:text-white"
                      >
                        <span className="truncate max-w-[120px]">{p.name}</span>
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="text-slate hover:text-rose-500"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {photos.length < MAX_PHOTOS && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-xs border border-dashed border-hairline px-3 py-1.5 text-xs text-slate hover:border-gold hover:text-navy-deep dark:border-white/20 dark:text-gray-300"
                      >
                        <ImagePlus size={14} className="text-gold" />
                        <span>Upload Photo</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message if API fails */}
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xs border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Step 3 Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-hairline dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-navy-deep dark:text-gray-300"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Estimate</span>
                </button>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-shimmer inline-flex items-center gap-2 rounded-xs bg-navy-deep px-7 py-3.5 text-xs sm:text-sm font-bold text-gold-soft hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep disabled:opacity-50"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Transmitting Quote...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>Send My Guaranteed Quote</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-light dark:text-gray-400">
                <ShieldCheck size={14} className="text-gold" />
                <span>Zero obligations. We never sell your personal information or spam.</span>
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
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded-card border border-hairline bg-paper p-8 dark:border-white/10 dark:bg-[#070c14]">
          <Loader2 size={24} className="animate-spin text-gold" />
        </div>
      }
    >
      <QuoteFormContent />
    </Suspense>
  );
}