// src/components/CostCalculator.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Truck,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { MOVE_SIZES, SPECIALTY_ADDONS, type MoveSizeOption } from "@/lib/constants";

export default function CostCalculator() {
  const [selectedSize, setSelectedSize] = useState<MoveSizeOption>(MOVE_SIZES[2]); // Default 2 Bedroom
  const [distanceKm, setDistanceKm] = useState<number>(25);
  const [pickupStairs, setPickupStairs] = useState<number>(0);
  const [dropoffStairs, setDropoffStairs] = useState<number>(0);
  const [hasElevator, setHasElevator] = useState<boolean>(true);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [step, setStep] = useState<number>(1);

  // Toggle addon selection
  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate pricing breakdown
  const addonTotal = selectedAddons.reduce((acc, addonId) => {
    const item = SPECIALTY_ADDONS.find((a) => a.id === addonId);
    return acc + (item ? item.cost : 0);
  }, 0);

  const stairsCost = (pickupStairs + dropoffStairs) * 35;
  const distanceFee = distanceKm > 30 ? Math.round((distanceKm - 30) * 2.2) : 0;
  
  const estimatedMin = selectedSize.basePrice + addonTotal + stairsCost + distanceFee;
  const estimatedMax = Math.round(estimatedMin * 1.25);
  const totalLaborHours = Math.round((selectedSize.baseLaborHours + (pickupStairs + dropoffStairs) * 0.4) * 10) / 10;

  // Build query string for quote form pre-population
  const queryParams = new URLSearchParams({
    moveSize: selectedSize.id,
    estMin: estimatedMin.toString(),
    estMax: estimatedMax.toString(),
    crew: selectedSize.recommendedCrew.toString(),
    truck: selectedSize.truckSize,
    addons: selectedAddons.join(","),
  }).toString();

  return (
    <div className="mx-auto w-full max-w-7xl rounded-card border border-hairline bg-paper-muted shadow-lg overflow-hidden dark:border-white/10 dark:bg-[#0f172a]">
      {/* Header bar */}
      <div className="bg-navy-deep px-6 py-6 text-white md:px-10 border-b border-hairline dark:bg-[#070c14] dark:border-white/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-gold/15 text-gold">
              <Calculator size={22} />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white md:text-2xl">
                Instant Move Cost Estimator
              </h2>
              <p className="text-xs text-white/80 dark:text-gray-300 font-normal">
                Transparent, itemized labor & logistics calculations with zero hidden fees
              </p>
            </div>
          </div>

          {/* Stepper pills */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all ${
                  step === s
                    ? "bg-gold text-navy-deep font-bold shadow-md"
                    : "bg-white/10 text-white/80 hover:bg-white/20 dark:bg-white/5 dark:text-gray-300"
                }`}
              >
                <span>Step {s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 p-6 md:grid-cols-[1fr_360px] lg:grid-cols-[1fr_400px] md:p-10">
        {/* Main Step Content */}
        <div>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy-deep dark:text-white">
                    1. Select your home or move size
                  </h3>
                  <p className="text-xs text-slate dark:text-slate">
                    Choose the option that best matches your space to set the baseline labor & truck size.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {MOVE_SIZES.map((option) => {
                    const isSelected = selectedSize.id === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedSize(option)}
                        className={`flex flex-col justify-between rounded-xs border p-4 text-left transition-all ${
                          isSelected
                            ? "border-gold bg-gold/10 shadow-xs ring-1 ring-gold dark:bg-gold/10 dark:border-gold"
                            : "border-hairline bg-paper/50 hover:border-gold/50 hover:bg-paper dark:border-white/10 dark:bg-[#070c14] dark:hover:border-gold/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-display text-base font-semibold text-navy-deep dark:text-white">
                            {option.label}
                          </span>
                          {isSelected && <CheckCircle size={18} className="text-gold" />}
                        </div>
                        <p className="mt-1 text-xs text-slate dark:text-slate">{option.sublabel}</p>
                        <div className="mt-3 flex items-center justify-between border-t border-hairline/60 pt-2 text-[11px] font-medium text-navy-deep/80 dark:border-white/10 dark:text-gray-300">
                          <span className="font-mono">Est. {option.estVolumeCuFt} cu ft</span>
                          <span className="font-mono font-bold text-gold">${option.basePrice}+</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 rounded-xs bg-navy-deep px-6 py-2.5 text-sm font-bold text-gold-soft shadow-xs transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
                  >
                    <span>Next: Access & Distance</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy-deep dark:text-white">
                    2. Location distance & stairs access
                  </h3>
                  <p className="text-xs text-slate dark:text-slate">
                    Help us accurately calculate transit time and crew labor requirement.
                  </p>
                </div>

                {/* Quick Route Selector */}
                <div className="rounded-xs border border-hairline bg-paper/50 p-4 dark:border-white/10 dark:bg-[#070c14]">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-light dark:text-gray-400">
                    Select Route (Where you are → Where you go):
                  </span>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {[
                      { label: "Edmonton Local (15 km)", km: 15 },
                      { label: "Edmonton → St. Albert (18 km)", km: 18 },
                      { label: "Edmonton → Sherwood Park (16 km)", km: 16 },
                      { label: "Edmonton → Spruce Grove (32 km)", km: 32 },
                      { label: "Edmonton → Leduc (35 km)", km: 35 },
                      { label: "Edmonton → Red Deer (150 km)", km: 150 },
                      { label: "Edmonton → Calgary (298 km)", km: 298 },
                      { label: "Edmonton → Canmore / Banff (390 km)", km: 390 },
                    ].map((r) => (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => setDistanceKm(r.km)}
                        className={`rounded-xs px-2.5 py-1 font-mono text-[10px] font-semibold transition-all ${
                          distanceKm === r.km
                            ? "border border-gold bg-gold text-navy-deep font-bold"
                            : "border border-hairline bg-paper text-slate hover:border-gold dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-300"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Distance Slider */}
                <div className="rounded-xs border border-hairline bg-paper/50 p-5 dark:border-white/10 dark:bg-[#070c14]">
                  <div className="flex items-center justify-between">
                    <label htmlFor="distance-slider" className="text-sm font-medium text-navy-deep dark:text-white">
                      Estimated Distance Between Locations
                    </label>
                    <span className="font-mono text-base font-bold text-gold">
                      {distanceKm} km {distanceKm > 100 ? "(Long Distance)" : "(Local)"}
                    </span>
                  </div>
                  <input
                    id="distance-slider"
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="mt-3 w-full accent-gold cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-light dark:text-gray-400">
                    <span>5 km (Local)</span>
                    <span>150 km (Regional)</span>
                    <span>300+ km (Inter-city)</span>
                  </div>
                </div>

                {/* Stairs counter */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xs border border-hairline bg-paper/50 p-5 dark:border-white/10 dark:bg-[#070c14]">
                    <label className="text-sm font-medium text-navy-deep dark:text-white">
                      Pickup Flight of Stairs
                    </label>
                    <div className="mt-3 flex items-center gap-3">
                      {[0, 1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPickupStairs(num)}
                          className={`h-9 w-9 rounded-xs border text-xs font-semibold transition-all ${
                            pickupStairs === num
                              ? "border-gold bg-navy-deep text-gold font-bold dark:bg-gold dark:text-navy-deep"
                              : "border-hairline bg-paper-muted text-navy-deep hover:border-gold/50 dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-200 dark:hover:border-gold/50"
                          }`}
                        >
                          {num === 0 ? "Elev/Gnd" : `${num}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xs border border-hairline bg-paper/50 p-5 dark:border-white/10 dark:bg-[#070c14]">
                    <label className="text-sm font-medium text-navy-deep dark:text-white">
                      Drop-off Flight of Stairs
                    </label>
                    <div className="mt-3 flex items-center gap-3">
                      {[0, 1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setDropoffStairs(num)}
                          className={`h-9 w-9 rounded-xs border text-xs font-semibold transition-all ${
                            dropoffStairs === num
                              ? "border-gold bg-navy-deep text-gold font-bold dark:bg-gold dark:text-navy-deep"
                              : "border-hairline bg-paper-muted text-navy-deep hover:border-gold/50 dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-200 dark:hover:border-gold/50"
                          }`}
                        >
                          {num === 0 ? "Elev/Gnd" : `${num}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Elevator Toggle */}
                <div className="flex items-center justify-between rounded-xs border border-hairline bg-paper/50 p-4 dark:border-white/10 dark:bg-[#070c14]">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} className="text-gold" />
                    <span className="text-sm font-medium text-navy-deep dark:text-white">
                      Elevator Access Available at Locations?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasElevator(!hasElevator)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      hasElevator ? "bg-gold" : "bg-slate-light/40 dark:bg-gray-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        hasElevator ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-gold"
                  >
                    Back to Move Size
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 rounded-xs bg-navy-deep px-6 py-2.5 text-sm font-bold text-gold-soft shadow-xs transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
                  >
                    <span>Next: Add-ons & Review</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy-deep dark:text-white">
                    3. Specialty add-ons & services
                  </h3>
                  <p className="text-xs text-slate dark:text-slate">
                    Select optional equipment or packing services to complete your tailored estimate.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {SPECIALTY_ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`flex cursor-pointer items-center justify-between rounded-xs border p-4 transition-all ${
                          isChecked
                            ? "border-gold bg-gold/10 shadow-xs dark:border-gold dark:bg-gold/10"
                            : "border-hairline bg-paper/50 hover:border-gold/50 dark:border-white/10 dark:bg-[#070c14] dark:hover:border-gold/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="h-4 w-4 rounded-xs accent-gold cursor-pointer"
                          />
                          <div>
                            <p className="text-sm font-semibold text-navy-deep dark:text-white">{addon.label}</p>
                            <p className="text-xs text-slate dark:text-slate">{addon.description}</p>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-bold text-gold">
                          +${addon.cost}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-gold"
                  >
                    Back to Access
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSize(MOVE_SIZES[2]);
                      setDistanceKm(25);
                      setPickupStairs(0);
                      setDropoffStairs(0);
                      setSelectedAddons([]);
                      setStep(1);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  >
                    <RotateCcw size={12} />
                    Reset Calculator
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Estimate Summary Sidebar */}
        <div className="flex flex-col justify-between rounded-card border border-hairline bg-paper p-6 shadow-xs dark:border-white/10 dark:bg-[#070c14]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-gold">
              <Sparkles size={14} />
              <span>Live Estimate Calculation</span>
            </div>

            <div className="mt-4 border-b border-hairline pb-4 dark:border-white/10">
              <p className="text-xs text-slate dark:text-slate">Estimated Range</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-navy-deep dark:text-white">
                  ${estimatedMin}
                </span>
                <span className="text-sm font-medium text-slate dark:text-gray-400"> - ${estimatedMax}</span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-slate-light dark:text-gray-400">
                Binding guaranteed range based on provided details
              </p>
            </div>

            <div className="mt-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between text-navy-deep dark:text-white">
                <div className="flex items-center gap-2">
                  <Users size={15} className="text-gold" />
                  <span>Recommended Crew</span>
                </div>
                <span className="font-mono font-semibold text-navy-deep dark:text-gold-soft">
                  {selectedSize.recommendedCrew} Movers
                </span>
              </div>

              <div className="flex items-center justify-between text-navy-deep dark:text-white">
                <div className="flex items-center gap-2">
                  <Truck size={15} className="text-gold" />
                  <span>Truck Capacity</span>
                </div>
                <span className="font-mono font-semibold text-navy-deep dark:text-gold-soft">
                  {selectedSize.truckSize}
                </span>
              </div>

              <div className="flex items-center justify-between text-navy-deep dark:text-white">
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-gold" />
                  <span>Est. Labor Hours</span>
                </div>
                <span className="font-mono font-semibold text-navy-deep dark:text-gold-soft">
                  ~{totalLaborHours} Hours
                </span>
              </div>
            </div>

            {/* Itemized list */}
            <div className="mt-6 rounded-xs bg-paper-muted p-3 border border-hairline text-[11px] space-y-1.5 dark:border-white/10 dark:bg-[#0f172a]">
              <div className="flex justify-between text-slate dark:text-gray-300">
                <span>Base ({selectedSize.label})</span>
                <span className="font-mono">${selectedSize.basePrice}</span>
              </div>
              {distanceFee > 0 && (
                <div className="flex justify-between text-slate dark:text-gray-300">
                  <span>Distance ({distanceKm} km)</span>
                  <span className="font-mono">+${distanceFee}</span>
                </div>
              )}
              {stairsCost > 0 && (
                <div className="flex justify-between text-slate dark:text-gray-300">
                  <span>Stairs ({pickupStairs + dropoffStairs} flights)</span>
                  <span className="font-mono">+${stairsCost}</span>
                </div>
              )}
              {addonTotal > 0 && (
                <div className="flex justify-between text-slate dark:text-gray-300">
                  <span>Selected Add-ons ({selectedAddons.length})</span>
                  <span className="font-mono">+${addonTotal}</span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate dark:text-gray-300">
              <ShieldCheck size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Includes full commercial cargo insurance</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href={`/quote?${queryParams}`}
              className="group flex w-full items-center justify-center gap-2 rounded-xs bg-navy-deep py-3 px-4 text-xs font-bold text-gold-soft shadow-md transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
            >
              <span>Lock In Quote With Details</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-2 text-center font-mono text-[10px] text-slate-light dark:text-gray-400">
              No obligation • Instant dispatch lock
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
