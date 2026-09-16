// src/app/api/admin/pricing-tiers/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/auth";
import { DEFAULT_DISTANCE_CONFIG, DEFAULT_PRICING_TIERS } from "@/lib/pricing-tiers";

// GET: Return all distance config and tiers (admin view)
export async function GET() {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let distRecord = await prisma.distancePricingConfig.findUnique({
      where: { id: "default" },
    });

    if (!distRecord) {
      distRecord = await prisma.distancePricingConfig.create({
        data: {
          id: "default",
          includedKm: DEFAULT_DISTANCE_CONFIG.includedKm,
          perKmRate: DEFAULT_DISTANCE_CONFIG.perKmRate,
          intercityFlatFee: DEFAULT_DISTANCE_CONFIG.intercityFlatFee,
        },
      });
    }

    let tiers = await prisma.pricingTier.findMany({
      orderBy: { order: "asc" },
    });

    if (tiers.length === 0) {
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
      tiers = await prisma.pricingTier.findMany({
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({
      distanceConfig: {
        includedKm: distRecord.includedKm,
        perKmRate: distRecord.perKmRate,
        intercityFlatFee: distRecord.intercityFlatFee,
      },
      tiers,
    });
  } catch (error) {
    console.error("Admin pricing GET error:", error);
    return NextResponse.json({ error: "Failed to fetch pricing data" }, { status: 500 });
  }
}

// POST: Save updated distance config and updated tiers
export async function POST(req: NextRequest) {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { distanceConfig, tiers } = body;

    // 1. Update distance config
    if (distanceConfig) {
      await prisma.distancePricingConfig.upsert({
        where: { id: "default" },
        update: {
          includedKm: Number(distanceConfig.includedKm) || DEFAULT_DISTANCE_CONFIG.includedKm,
          perKmRate: Number(distanceConfig.perKmRate) || DEFAULT_DISTANCE_CONFIG.perKmRate,
          intercityFlatFee: Number(distanceConfig.intercityFlatFee) || DEFAULT_DISTANCE_CONFIG.intercityFlatFee,
        },
        create: {
          id: "default",
          includedKm: Number(distanceConfig.includedKm) || DEFAULT_DISTANCE_CONFIG.includedKm,
          perKmRate: Number(distanceConfig.perKmRate) || DEFAULT_DISTANCE_CONFIG.perKmRate,
          intercityFlatFee: Number(distanceConfig.intercityFlatFee) || DEFAULT_DISTANCE_CONFIG.intercityFlatFee,
        },
      });
    }

    // 2. Update or create tiers
    if (Array.isArray(tiers)) {
      for (let i = 0; i < tiers.length; i++) {
        const tier = tiers[i];
        const slug = tier.slug || tier.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
        
        await prisma.pricingTier.upsert({
          where: { slug },
          update: {
            name: tier.name,
            description: tier.description,
            multiplier: Number(tier.multiplier) || 1.0,
            baseFee: Number(tier.baseFee) || 0,
            features: Array.isArray(tier.features) ? tier.features : [],
            isDefault: Boolean(tier.isDefault),
            isActive: tier.isActive !== false,
            order: i + 1,
          },
          create: {
            name: tier.name,
            slug,
            description: tier.description,
            multiplier: Number(tier.multiplier) || 1.0,
            baseFee: Number(tier.baseFee) || 0,
            features: Array.isArray(tier.features) ? tier.features : [],
            isDefault: Boolean(tier.isDefault),
            isActive: tier.isActive !== false,
            order: i + 1,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Pricing configuration updated successfully." });
  } catch (error) {
    console.error("Admin pricing save error:", error);
    return NextResponse.json({ error: "Failed to save pricing configuration" }, { status: 500 });
  }
}

// DELETE: Delete a specific tier by slug
export async function DELETE(req: NextRequest) {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Missing tier slug" }, { status: 400 });
    }

    // Don't delete the default standard tier to avoid empty state, deactivate instead
    if (slug === "standard") {
      return NextResponse.json({ error: "Standard tier cannot be deleted, but can be edited." }, { status: 400 });
    }

    await prisma.pricingTier.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true, message: `Tier ${slug} deleted.` });
  } catch (error) {
    console.error("Admin pricing tier DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete tier" }, { status: 500 });
  }
}
