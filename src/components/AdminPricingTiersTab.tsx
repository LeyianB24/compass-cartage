// src/components/AdminPricingTiersTab.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Route,
  Layers,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Sliders,
  X,
} from "lucide-react";
import {
  DEFAULT_DISTANCE_CONFIG,
  DEFAULT_PRICING_TIERS,
  calculateDistanceFee,
  type DistanceConfig,
  type ServicePricingTier,
} from "@/lib/pricing-tiers";

function getTierImage(slug: string, name: string): string {
  const s = (slug + " " + name).toLowerCase();
  if (s.includes("vip") || s.includes("white-glove") || s.includes("premium")) {
    return "/images/portrait-two-smiling-professional-movers-effortlessly-carrying-cardboard-boxes-room-house-angled-top-view-young-male-334690896.webp";
  }
  if (s.includes("standard") || s.includes("full")) {
    return "/images/lorry1.jpeg";
  }
  if (s.includes("economy") || s.includes("van") || s.includes("labor")) {
    return "/images/transit-van-cargo-loading.jpeg";
  }
  return "/images/lorry3.jpeg";
}

export default function AdminPricingTiersTab() {
  const [distanceConfig, setDistanceConfig] = useState<DistanceConfig>(DEFAULT_DISTANCE_CONFIG);
  const [tiers, setTiers] = useState<ServicePricingTier[]>(DEFAULT_PRICING_TIERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sample distance preview
  const [sampleDistance, setSampleDistance] = useState(150);

  // Load data from admin API
  useEffect(() => {
    fetch("/api/admin/pricing-tiers")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load pricing data");
        return res.json();
      })
      .then((data) => {
        if (data.distanceConfig) setDistanceConfig(data.distanceConfig);
        if (data.tiers && Array.isArray(data.tiers)) setTiers(data.tiers);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  // Compute live preview fee for the sample distance
  const sampleFee = calculateDistanceFee(sampleDistance, distanceConfig);

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/pricing-tiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          distanceConfig,
          tiers,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to save configuration");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error saving configuration");
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new tier
  const handleAddTier = () => {
    const newTier: ServicePricingTier = {
      id: `custom-${Date.now()}`,
      name: "Custom Service Tier",
      slug: `custom-${Date.now().toString().slice(-4)}`,
      badge: "Specialized",
      description: "Custom relocation scope configured for specific business or seasonal requirements.",
      multiplier: 1.15,
      baseFee: 50,
      features: [
        "Dedicated professional moving crew",
        "Commercial moving truck & fuel",
        "Protective moving blankets & equipment",
      ],
      isDefault: false,
      isActive: true,
      order: tiers.length + 1,
    };
    setTiers([...tiers, newTier]);
  };

  // Delete a tier
  const handleDeleteTier = (index: number) => {
    const updated = tiers.filter((_, idx) => idx !== index);
    setTiers(updated);
  };

  // Update tier field
  const handleUpdateTier = (index: number, field: keyof ServicePricingTier, value: unknown) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  // Feature bullet point editing
  const handleUpdateFeature = (tierIndex: number, featIndex: number, text: string) => {
    const updated = [...tiers];
    const newFeatures = [...updated[tierIndex].features];
    newFeatures[featIndex] = text;
    updated[tierIndex].features = newFeatures;
    setTiers(updated);
  };

  const handleAddFeature = (tierIndex: number) => {
    const updated = [...tiers];
    updated[tierIndex].features = [...updated[tierIndex].features, "New feature benefit"];
    setTiers(updated);
  };

  const handleRemoveFeature = (tierIndex: number, featIndex: number) => {
    const updated = [...tiers];
    updated[tierIndex].features = updated[tierIndex].features.filter((_, i) => i !== featIndex);
    setTiers(updated);
  };

  // Reset to system defaults
  const handleResetDefaults = () => {
    if (confirm("Reset all distance rates and moving price tiers to system defaults?")) {
      setDistanceConfig(DEFAULT_DISTANCE_CONFIG);
      setTiers(DEFAULT_PRICING_TIERS);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-card border border-hairline bg-paper-muted p-12 text-center text-xs text-slate dark:border-white/10 dark:bg-[#0c1626]">
        Loading pricing & distance tiers configuration...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Save Action */}
      <div className="flex flex-col justify-between gap-4 rounded-card border border-hairline bg-paper-muted p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1626] sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-gold">
            <Sliders size={14} />
            <span>Moving Rate & Distance Control Center</span>
          </div>
          <h2 className="font-display mt-1 text-2xl font-bold text-navy-deep dark:text-white">
            Pricing Tiers & Mileage Distance Rates
          </h2>
          <p className="mt-1 text-xs text-slate dark:text-gray-300">
            Configure how distance is charged across Alberta and define moving service tiers (Standard, White-Glove, Economy) that customer quotes calculate from.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 rounded-xs border border-hairline bg-paper px-4 py-2.5 text-xs font-semibold text-slate transition-all hover:bg-paper-dark dark:border-white/15 dark:bg-[#070c14] dark:text-gray-300 dark:hover:text-white"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-shimmer flex items-center gap-2 rounded-xs bg-gold px-6 py-2.5 text-xs font-bold text-navy-deep shadow-md transition-all hover:bg-gold-soft disabled:opacity-60"
          >
            <Save size={14} />
            <span>{isSaving ? "Saving Rates..." : "Save Pricing Config"}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xs border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span>Rates saved successfully! All customer quotes and map calculations are now using these active prices.</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xs border border-red-500/40 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: Distance Mileage & Transit Rate Configuration */}
      <div className="rounded-card border border-hairline bg-paper-muted p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1626]">
        <div className="flex items-center gap-2 border-b border-hairline pb-4 dark:border-white/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-gold/15 text-gold">
            <Route size={16} />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-navy-deep dark:text-white">
              1. Distance Mileage & Highway Transit Charging
            </h3>
            <p className="text-xs text-slate dark:text-gray-400">
              Control the free local inclusion radius, per-kilometer travel rate, and long-distance intercity surcharge.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {/* Included Free KM */}
          <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate dark:text-gray-300">
              Free Included Distance (km)
            </label>
            <p className="mt-0.5 text-[10px] text-slate-light dark:text-gray-400">
              Local moves within this radius incur $0 travel fee.
            </p>
            <div className="relative mt-3">
              <input
                type="number"
                min="0"
                step="5"
                value={distanceConfig.includedKm}
                onChange={(e) =>
                  setDistanceConfig({ ...distanceConfig, includedKm: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-xs border border-hairline bg-paper-muted px-4 py-2.5 font-mono text-sm font-bold text-navy-deep outline-none focus:border-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-white"
              />
              <span className="absolute right-3 top-3 font-mono text-xs text-slate-light dark:text-gray-500">
                km
              </span>
            </div>
          </div>

          {/* Per KM Rate */}
          <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate dark:text-gray-300">
              Rate Per Kilometer ($/km)
            </label>
            <p className="mt-0.5 text-[10px] text-slate-light dark:text-gray-400">
              Charged for every km exceeding the free radius.
            </p>
            <div className="relative mt-3">
              <span className="absolute left-3.5 top-2.5 font-mono text-sm font-bold text-gold">$</span>
              <input
                type="number"
                min="0"
                step="0.25"
                value={distanceConfig.perKmRate}
                onChange={(e) =>
                  setDistanceConfig({ ...distanceConfig, perKmRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-xs border border-hairline bg-paper-muted pl-8 pr-4 py-2.5 font-mono text-sm font-bold text-navy-deep outline-none focus:border-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-white"
              />
              <span className="absolute right-3 top-3 font-mono text-xs text-slate-light dark:text-gray-500">
                /km
              </span>
            </div>
          </div>

          {/* Intercity Highway Surcharge */}
          <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate dark:text-gray-300">
              Intercity Highway Base ($)
            </label>
            <p className="mt-0.5 text-[10px] text-slate-light dark:text-gray-400">
              Base transit charge for trips 100km+ (e.g. Red Deer, Calgary).
            </p>
            <div className="relative mt-3">
              <span className="absolute left-3.5 top-2.5 font-mono text-sm font-bold text-gold">$</span>
              <input
                type="number"
                min="0"
                step="10"
                value={distanceConfig.intercityFlatFee}
                onChange={(e) =>
                  setDistanceConfig({ ...distanceConfig, intercityFlatFee: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-xs border border-hairline bg-paper-muted pl-8 pr-4 py-2.5 font-mono text-sm font-bold text-navy-deep outline-none focus:border-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-white"
              />
              <span className="absolute right-3 top-3 font-mono text-xs text-slate-light dark:text-gray-500">
                CAD
              </span>
            </div>
          </div>
        </div>

        {/* Live Interactive Distance Rate Tester */}
        <div className="mt-6 rounded-xs border border-gold/30 bg-gold/5 p-4 dark:border-gold/20 dark:bg-gold/10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-gold shrink-0" />
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-navy-deep dark:text-white">
                  Live Distance Fee Calculator Simulator
                </span>
                <p className="text-[11px] text-slate dark:text-gray-300">
                  Drag the slider to test how a customer route is charged with your current settings:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={sampleDistance}
                onChange={(e) => setSampleDistance(parseInt(e.target.value))}
                className="w-44 accent-gold"
              />
              <span className="font-mono text-xs font-bold text-navy-deep dark:text-white">
                {sampleDistance} km
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between border-t border-gold/20 pt-3 text-xs">
            <span className="text-slate dark:text-gray-300">
              {sampleFee.explanation}
            </span>
            <div className="font-mono font-bold text-gold text-sm">
              Travel Charge: ${sampleFee.totalDistanceCharge.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Moving Service Tiers Configuration */}
      <div className="rounded-card border border-hairline bg-paper-muted p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1626]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xs bg-gold/15 text-gold">
              <Layers size={16} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-navy-deep dark:text-white">
                2. Moving Service Pricing Tiers
              </h3>
              <p className="text-xs text-slate dark:text-gray-400">
                Define the tiers presented to customers in the quote wizard. Each tier has its own multiplier, base fee adjustment, and service inclusions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddTier}
            className="flex items-center gap-1.5 rounded-xs border border-hairline bg-paper px-3 py-1.5 text-xs font-semibold text-navy-deep hover:border-gold hover:text-gold dark:border-white/15 dark:bg-[#070c14] dark:text-gray-200 dark:hover:border-gold"
          >
            <Plus size={13} />
            <span>Add Custom Tier</span>
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {tiers.map((tier, tIdx) => (
            <div
              key={tier.slug || tIdx}
              className={`rounded-card border p-6 transition-all ${
                tier.isActive
                  ? "border-hairline bg-paper dark:border-white/10 dark:bg-[#070c14]"
                  : "border-hairline/60 bg-paper/50 opacity-60 dark:border-white/5 dark:bg-[#070c14]/50"
              }`}
            >
              {/* Tier Header Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-deep text-gold text-xs font-mono font-bold dark:bg-gold dark:text-navy-deep">
                    {tIdx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => handleUpdateTier(tIdx, "name", e.target.value)}
                      className="font-display font-bold text-base text-navy-deep dark:text-white bg-transparent border-b border-transparent hover:border-hairline focus:border-gold outline-none"
                    />
                    {tier.isDefault && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                        Default Tier
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={tier.isActive}
                      onChange={(e) => handleUpdateTier(tIdx, "isActive", e.target.checked)}
                      className="rounded-xs accent-gold cursor-pointer"
                    />
                    <span>Active on Public Quote</span>
                  </label>

                  {tiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTier(tIdx)}
                      title="Delete this tier"
                      className="text-slate-light hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Tier Visual Header Card */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xs border border-hairline bg-paper-muted/60 p-3 dark:border-white/5 dark:bg-[#070c14]/80">
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xs border border-hairline bg-navy-deep shadow-xs">
                  <Image
                    src={getTierImage(tier.slug, tier.name)}
                    alt={tier.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-1.5 left-2 font-mono text-[9px] font-bold text-gold">
                    Tier {tIdx + 1} Equipment
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-gold">
                      Public Tier Identity
                    </span>
                    <span className="font-mono text-[10px] text-slate dark:text-gray-400">
                      Slug: /{tier.slug}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-navy-deep dark:text-white font-semibold mt-0.5">
                    {tier.name} {tier.badge ? `(${tier.badge})` : ""}
                  </p>
                  <p className="font-mono text-[11px] text-slate dark:text-gray-400 mt-0.5 line-clamp-1">
                    {tier.description}
                  </p>
                </div>
              </div>

              {/* Tier Rate Configuration Fields */}
              <div className="mt-5 grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate dark:text-gray-300">
                    Badge Label (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular"
                    value={tier.badge || ""}
                    onChange={(e) => handleUpdateTier(tIdx, "badge", e.target.value)}
                    className="mt-1 w-full rounded-xs border border-hairline bg-paper-muted px-3 py-2 text-xs text-navy-deep outline-none focus:border-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate dark:text-gray-300">
                    Price Multiplier
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      step="0.05"
                      min="0.5"
                      max="3.0"
                      value={tier.multiplier}
                      onChange={(e) => handleUpdateTier(tIdx, "multiplier", parseFloat(e.target.value) || 1.0)}
                      className="w-full rounded-xs border border-hairline bg-paper-muted px-3 py-2 font-mono text-xs font-bold text-navy-deep outline-none focus:border-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-white"
                    />
                    <span className="absolute right-3 top-2 text-[10px] text-slate-light dark:text-gray-400">
                      {tier.multiplier === 1.0 ? "Base (1.0x)" : `${tier.multiplier > 1.0 ? `+${Math.round((tier.multiplier - 1) * 100)}%` : `-${Math.round((1 - tier.multiplier) * 100)}%`}`}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate dark:text-gray-300">
                    Base Flat Adjustment ($)
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2 font-mono text-xs text-gold">$</span>
                    <input
                      type="number"
                      step="5"
                      value={tier.baseFee}
                      onChange={(e) => handleUpdateTier(tIdx, "baseFee", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xs border border-hairline bg-paper-muted pl-6 pr-3 py-2 font-mono text-xs font-bold text-navy-deep outline-none focus:border-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate dark:text-gray-300">
                    Internal Identifier (Slug)
                  </label>
                  <input
                    type="text"
                    disabled={tier.slug === "standard"}
                    value={tier.slug}
                    onChange={(e) => handleUpdateTier(tIdx, "slug", e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"))}
                    className="mt-1 w-full rounded-xs border border-hairline bg-paper-muted px-3 py-2 font-mono text-xs text-slate outline-none disabled:opacity-60 dark:border-white/15 dark:bg-[#0f172a] dark:text-gray-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <label className="block text-[11px] font-bold text-slate dark:text-gray-300">
                  Customer-Facing Description
                </label>
                <input
                  type="text"
                  value={tier.description}
                  onChange={(e) => handleUpdateTier(tIdx, "description", e.target.value)}
                  className="mt-1 w-full rounded-xs border border-hairline bg-paper-muted px-3 py-2 text-xs text-navy-deep outline-none focus:border-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-white"
                />
              </div>

              {/* Features / Bullet Points */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate dark:text-gray-300">
                    Included Features & Equipment Bullet Points
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddFeature(tIdx)}
                    className="text-[11px] font-semibold text-gold hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>Add Bullet Point</span>
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <span className="text-gold text-xs">✓</span>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleUpdateFeature(tIdx, fIdx, e.target.value)}
                        className="flex-1 rounded-xs border border-hairline bg-paper-muted px-3 py-1.5 text-xs text-navy-deep outline-none focus:border-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-white"
                      />
                      {tier.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(tIdx, fIdx)}
                          className="text-slate-light hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
