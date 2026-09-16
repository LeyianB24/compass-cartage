// src/lib/pricing-tiers.ts
/**
 * Compass Cartage — Moving Price Tiers & Distance Charging Engine
 * Centralized calculation library for distance fees, service tiers, and quote estimates.
 */

import { MOVE_SIZES, SPECIALTY_ADDONS } from "./constants";

export interface DistanceConfig {
  includedKm: number;      // Distance included in base rate (free radius, default 30km)
  perKmRate: number;       // Rate per km beyond includedKm (default $2.50/km)
  minTravelFee: number;    // Minimum travel fee floor
  intercityFlatFee: number; // Flat long-distance intercity surcharge for trips >= 100km (e.g. Edmonton <-> Red Deer / Calgary)
}

export interface ServicePricingTier {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  description: string;
  multiplier: number;      // e.g. 1.0 (Standard), 1.25 (White-Glove), 0.85 (Economy)
  baseFee: number;         // Flat fee adjustment (e.g. +$80 for White-Glove materials, -$40 for self-packing)
  features: string[];
  isDefault?: boolean;
  isActive?: boolean;
  order?: number;
}

// Default Distance Configuration
export const DEFAULT_DISTANCE_CONFIG: DistanceConfig = {
  includedKm: 30,
  perKmRate: 2.50,
  minTravelFee: 0,
  intercityFlatFee: 120,
};

// Default Service Tiers (Editable by Admin in /admin)
export const DEFAULT_PRICING_TIERS: ServicePricingTier[] = [
  {
    id: "tier-standard",
    name: "Standard Full-Service",
    slug: "standard",
    badge: "Most Popular",
    description: "Our hallmark moving experience with dedicated crew, padded blankets, cargo strapping, and careful placement.",
    multiplier: 1.0,
    baseFee: 0,
    features: [
      "Dedicated professional moving crew (no day laborers)",
      "High-grade commercial padded moving blankets & heavy cargo straps",
      "Floor runners & door jamb protection on both properties",
      "Full cargo transit protection & licensed coverage",
      "Disassembly & reassembly of standard bed frames and tables",
    ],
    isDefault: true,
    isActive: true,
    order: 1,
  },
  {
    id: "tier-white-glove",
    name: "White-Glove VIP Care",
    slug: "white-glove",
    badge: "Maximum Care",
    description: "Hands-off luxury moving with full shrink-wrapping, mattress encasements, wardrobe staging, and priority dispatch.",
    multiplier: 1.25,
    baseFee: 80,
    features: [
      "All features in Standard Full-Service",
      "Full heavy-gauge shrink wrap on all upholstered & wood furniture",
      "Heavy-duty mattress bags for all bed sets",
      "Wardrobe box garment transport (up to 4 boxes included)",
      "Priority early-morning or custom dispatch window guarantee",
      "Complimentary TV unmounting & specialized appliance prep",
    ],
    isDefault: false,
    isActive: true,
    order: 2,
  },
  {
    id: "tier-economy",
    name: "Economy Labor & Transit",
    slug: "economy",
    badge: "Budget Friendly",
    description: "Streamlined loading, transport, and unloading for organized self-packers who have all boxes packed and ready.",
    multiplier: 0.88,
    baseFee: -35,
    features: [
      "Experienced 2-man professional moving crew",
      "Commercial moving truck with fuel included",
      "Heavy appliance dollies & four-wheel carts",
      "Fast, efficient point-to-point transport",
      "Client handles boxing and small miscellaneous loose items",
    ],
    isDefault: false,
    isActive: true,
    order: 3,
  },
];

// Key Alberta driving distance lookup for instant distance evaluation
export const CITY_DISTANCE_CACHE: Record<string, number> = {
  "downtown edmonton": 10,
  "old strathcona": 12,
  "windermere": 18,
  "west edmonton": 14,
  "mill woods": 16,
  "st. albert": 20,
  "sherwood park": 18,
  "spruce grove": 35,
  "stony plain": 42,
  "leduc": 38,
  "beaumont": 30,
  "fort saskatchewan": 36,
  "devon": 38,
  "camrose": 92,
  "wetaskiwin": 75,
  "red deer": 148,
  "sylvan lake": 160,
  "lacombe": 125,
  "ponoka": 105,
  "calgary": 298,
  "airdrie": 272,
  "cochrane": 315,
  "canmore": 395,
  "banff": 415,
  "lethbridge": 510,
  "medicine hat": 585,
  "grande prairie": 455,
  "fort mcmurray": 435,
  "lloydminster": 250,
};

/**
 * Calculates road distance between two addresses or city names
 */
export function estimateRoadDistanceKm(originStr: string, destStr: string): number {
  const o = originStr.toLowerCase().trim();
  const d = destStr.toLowerCase().trim();

  if (!o || !d) return 18; // Default local metro

  // Check if either or both are exact known keys
  let distO = 10;
  let distD = 10;

  for (const [city, km] of Object.entries(CITY_DISTANCE_CACHE)) {
    if (o.includes(city)) distO = km;
    if (d.includes(city)) distD = km;
  }

  // If one is Edmonton Metro and the other is a regional city (e.g. Edmonton -> Calgary)
  const oIsMetro = o.includes("edmonton") || o.includes("st. albert") || o.includes("sherwood park") || o.includes("leduc");
  const dIsMetro = d.includes("edmonton") || d.includes("st. albert") || d.includes("sherwood park") || d.includes("leduc");

  if (oIsMetro && dIsMetro) {
    // Both local metro
    return Math.max(8, Math.round(Math.abs(distO - distD) + 12));
  }

  // Cross-city trip (e.g. Edmonton -> Calgary or Red Deer -> Calgary)
  if (distO > 50 && distD > 50) {
    return Math.max(30, Math.abs(distO - distD) + 15);
  }

  return Math.max(distO, distD);
}

/**
 * Computes exact distance travel charge based on active configuration
 */
export function calculateDistanceFee(
  distanceKm: number,
  config: DistanceConfig = DEFAULT_DISTANCE_CONFIG
): {
  distanceKm: number;
  billableKm: number;
  perKmRate: number;
  distanceFee: number;
  intercityFee: number;
  totalDistanceCharge: number;
  explanation: string;
} {
  const safeKm = Math.max(0, distanceKm);
  const billableKm = Math.max(0, safeKm - config.includedKm);
  const distanceFee = Math.round(billableKm * config.perKmRate);
  
  // Intercity surcharge applies to trips >= 100km (e.g. Red Deer, Calgary, etc.)
  const intercityFee = safeKm >= 100 ? config.intercityFlatFee : 0;
  const totalDistanceCharge = Math.max(config.minTravelFee, distanceFee + intercityFee);

  let explanation = "";
  if (billableKm === 0) {
    explanation = `Local Metro route (${safeKm} km). Free distance travel included (first ${config.includedKm} km free).`;
  } else {
    explanation = `${safeKm} km total: ${config.includedKm} km free + ${billableKm} billable km @ $${config.perKmRate.toFixed(2)}/km` +
      (intercityFee > 0 ? ` + $${intercityFee} highway intercity surcharge` : "");
  }

  return {
    distanceKm: safeKm,
    billableKm,
    perKmRate: config.perKmRate,
    distanceFee,
    intercityFee,
    totalDistanceCharge,
    explanation,
  };
}

export interface QuoteEstimateInput {
  moveSizeId: string;
  distanceKm: number;
  tierSlug?: string;
  hasStairs?: boolean;
  hasElevator?: boolean;
  stairsCount?: number;
  selectedAddons?: string[];
  distanceConfig?: DistanceConfig;
  tiers?: ServicePricingTier[];
}

export interface QuoteEstimateBreakdown {
  moveSize: {
    id: string;
    label: string;
    sublabel: string;
    truckSize: string;
    recommendedCrew: number;
    baseLaborHours: number;
    basePrice: number;
  };
  tier: ServicePricingTier;
  baseAdjustedPrice: number;
  distance: {
    distanceKm: number;
    billableKm: number;
    perKmRate: number;
    distanceFee: number;
    intercityFee: number;
    totalDistanceCharge: number;
    explanation: string;
  };
  stairsCost: number;
  addonsCost: number;
  addonsList: Array<{ id: string; label: string; cost: number }>;
  estimatedTotalMin: number;
  estimatedTotalMax: number;
}

/**
 * Master calculation function producing a complete itemized quote estimate
 */
export function computeMoveQuoteEstimate({
  moveSizeId,
  distanceKm,
  tierSlug = "standard",
  hasStairs = false,
  hasElevator = false,
  stairsCount = 0,
  selectedAddons = [],
  distanceConfig = DEFAULT_DISTANCE_CONFIG,
  tiers = DEFAULT_PRICING_TIERS,
}: QuoteEstimateInput): QuoteEstimateBreakdown {
  const moveSize = MOVE_SIZES.find((s) => s.id === moveSizeId) || MOVE_SIZES[1]; // Default 1-bedroom
  const tier = tiers.find((t) => t.slug === tierSlug && t.isActive !== false) || tiers[0] || DEFAULT_PRICING_TIERS[0];

  // Base price scaled by selected service tier multiplier & base fee
  const rawBase = moveSize.basePrice;
  const baseAdjustedPrice = Math.round(rawBase * tier.multiplier + tier.baseFee);

  // Distance travel fee
  const distance = calculateDistanceFee(distanceKm, distanceConfig);

  // Access / Stairs calculation (elevators remove flight fees)
  const effectiveFlights = hasElevator ? 0 : (stairsCount > 0 ? stairsCount : hasStairs ? 1 : 0);
  const stairsCost = effectiveFlights * 35;

  // Addons cost
  const addonsList: Array<{ id: string; label: string; cost: number }> = [];
  let addonsCost = 0;
  for (const addonIdOrLabel of selectedAddons) {
    const found = SPECIALTY_ADDONS.find(
      (a) => a.id === addonIdOrLabel || a.label.toLowerCase() === addonIdOrLabel.toLowerCase()
    );
    if (found) {
      addonsList.push({ id: found.id, label: found.label, cost: found.cost });
      addonsCost += found.cost;
    }
  }

  const estimatedTotalMin = baseAdjustedPrice + distance.totalDistanceCharge + stairsCost + addonsCost;
  const estimatedTotalMax = Math.round(estimatedTotalMin * 1.18);

  return {
    moveSize: {
      id: moveSize.id,
      label: moveSize.label,
      sublabel: moveSize.sublabel,
      truckSize: moveSize.truckSize,
      recommendedCrew: moveSize.recommendedCrew,
      baseLaborHours: moveSize.baseLaborHours,
      basePrice: moveSize.basePrice,
    },
    tier,
    baseAdjustedPrice,
    distance,
    stairsCost,
    addonsCost,
    addonsList,
    estimatedTotalMin,
    estimatedTotalMax,
  };
}
