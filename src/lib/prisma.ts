// src/lib/prisma.ts
import { PrismaClient as BasePrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

export interface DistancePricingConfigModel {
  findUnique(args: { where: { id: string } }): Promise<{
    id: string;
    includedKm: number;
    perKmRate: number;
    intercityFlatFee: number;
    updatedAt: Date;
  } | null>;
  create(args: {
    data: {
      id?: string;
      includedKm?: number;
      perKmRate?: number;
      intercityFlatFee?: number;
    };
  }): Promise<{
    id: string;
    includedKm: number;
    perKmRate: number;
    intercityFlatFee: number;
    updatedAt: Date;
  }>;
  upsert(args: {
    where: { id: string };
    update: {
      includedKm?: number;
      perKmRate?: number;
      intercityFlatFee?: number;
    };
    create: {
      id?: string;
      includedKm?: number;
      perKmRate?: number;
      intercityFlatFee?: number;
    };
  }): Promise<{
    id: string;
    includedKm: number;
    perKmRate: number;
    intercityFlatFee: number;
    updatedAt: Date;
  }>;
}

export interface PricingTierModel {
  findMany(args?: {
    where?: { isActive?: boolean };
    orderBy?: { order?: "asc" | "desc" };
  }): Promise<Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    multiplier: number;
    baseFee: number;
    features: string[];
    isDefault: boolean;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }>>;
  findUnique(args: { where: { slug?: string; id?: string } }): Promise<{
    id: string;
    name: string;
    slug: string;
    description: string;
    multiplier: number;
    baseFee: number;
    features: string[];
    isDefault: boolean;
    isActive: boolean;
    order: number;
  } | null>;
  create(args: { data: Record<string, unknown> }): Promise<Record<string, unknown>>;
  update(args: { where: { id?: string; slug?: string }; data: Record<string, unknown> }): Promise<Record<string, unknown>>;
  upsert(args: {
    where: { slug: string };
    update: Record<string, unknown>;
    create: Record<string, unknown>;
  }): Promise<Record<string, unknown>>;
  delete(args: { where: { id?: string; slug?: string } }): Promise<Record<string, unknown>>;
}

export type ExtendedPrismaClient = BasePrismaClient & {
  distancePricingConfig: DistancePricingConfigModel;
  pricingTier: PricingTierModel;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

// App runtime connects via the pooled URL, through the Neon driver adapter
// (required in Prisma 7 — bare `new PrismaClient()` no longer connects directly).
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

export const prisma: ExtendedPrismaClient =
  globalForPrisma.prisma ??
  (new BasePrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  }) as unknown as ExtendedPrismaClient);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;