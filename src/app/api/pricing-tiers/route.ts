// src/app/api/pricing-tiers/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_DISTANCE_CONFIG,
  DEFAULT_PRICING_TIERS,
  type DistanceConfig,
  type ServicePricingTier,
} from "@/lib/pricing-tiers";

export async function GET() {
  try {
    // 1. Fetch distance configuration from DB
    let distRecord = await prisma.distancePricingConfig.findUnique({
      where: { id: "default" },
    });

    if (!distRecord) {
      // Seed default distance configuration
      try {
        distRecord = await prisma.distancePricingConfig.create({
          data: {
            id: "default",
            includedKm: DEFAULT_DISTANCE_CONFIG.includedKm,
            perKmRate: DEFAULT_DISTANCE_CONFIG.perKmRate,
            intercityFlatFee: DEFAULT_DISTANCE_CONFIG.intercityFlatFee,
          },
        });
      } catch {
        distRecord = {
          id: "default",
          includedKm: DEFAULT_DISTANCE_CONFIG.includedKm,
          perKmRate: DEFAULT_DISTANCE_CONFIG.perKmRate,
          intercityFlatFee: DEFAULT_DISTANCE_CONFIG.intercityFlatFee,
          updatedAt: new Date(),
        };
      }
    }

    const distanceConfig: DistanceConfig = {
      includedKm: distRecord.includedKm,
      perKmRate: distRecord.perKmRate,
      minTravelFee: 0,
      intercityFlatFee: distRecord.intercityFlatFee,
    };

    // 2. Fetch service pricing tiers from DB
    let dbTiers = await prisma.pricingTier.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    if (dbTiers.length === 0) {
      // Seed default service tiers
      try {
        for (const defaultTier of DEFAULT_PRICING_TIERS) {
          await prisma.pricingTier.upsert({
            where: { slug: defaultTier.slug },
            update: {},
            create: {
              name: defaultTier.name,
              slug: defaultTier.slug,
              description: defaultTier.description,
              multiplier: defaultTier.multiplier,
              baseFee: defaultTier.baseFee,
              features: defaultTier.features,
              isDefault: defaultTier.isDefault || false,
              isActive: true,
              order: defaultTier.order || 0,
            },
          });
        }
        dbTiers = await prisma.pricingTier.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" },
        });
      } catch {
        // Fallback to in-memory defaults if DB upsert is interrupted
        return NextResponse.json({
          distanceConfig,
          tiers: DEFAULT_PRICING_TIERS,
        });
      }
    }

    const tiers: ServicePricingTier[] = dbTiers.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      badge: t.slug === "white-glove" ? "Maximum Care" : t.slug === "standard" ? "Most Popular" : "Budget Friendly",
      description: t.description,
      multiplier: t.multiplier,
      baseFee: t.baseFee,
      features: t.features,
      isDefault: t.isDefault,
      isActive: t.isActive,
      order: t.order,
    }));

    return NextResponse.json({
      distanceConfig,
      tiers,
    });
  } catch (error) {
    console.error("Failed to fetch pricing tiers:", error);
    return NextResponse.json({
      distanceConfig: DEFAULT_DISTANCE_CONFIG,
      tiers: DEFAULT_PRICING_TIERS,
    });
  }
}
