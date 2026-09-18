// src/lib/quoteNumber.ts

import { prisma } from "./prisma";

/**
 * Generates the next sequential unique quote number for the current calendar year.
 * Format: CC-YYYY-XXXX (e.g., CC-2026-1001, CC-2026-1002)
 */
export async function generateNextQuoteNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `CC-${currentYear}-`;

  try {
    // Find the latest quote for the current year
    const latestQuote = await prisma.quoteRequest.findFirst({
      where: {
        quoteNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        quoteNumber: "desc",
      },
      select: {
        quoteNumber: true,
      },
    });

    if (latestQuote?.quoteNumber) {
      const parts = latestQuote.quoteNumber.split("-");
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) {
        const nextSeq = lastSeq + 1;
        return `${prefix}${nextSeq}`;
      }
    }

    // If no quotes exist yet for this year, count total quotes to seed sequence
    const totalCount = await prisma.quoteRequest.count();
    const startSeq = 1000 + totalCount + 1;
    return `${prefix}${startSeq}`;
  } catch (error) {
    console.error("Error generating sequential quote number:", error);
    // Reliable fallback with high-entropy timestamp suffix
    const fallbackSeq = Math.floor(1000 + (Date.now() % 9000));
    return `CC-${currentYear}-${fallbackSeq}`;
  }
}

/**
 * Formats or resolves a quote number, providing a consistent display fallback
 * for legacy records that might predate the quoteNumber column.
 */
export function formatQuoteNumber(quoteNumber?: string | null, id?: string): string {
  if (quoteNumber && quoteNumber.trim()) {
    return quoteNumber.trim();
  }
  if (id) {
    return `CC-LEGACY-${id.slice(-4).toUpperCase()}`;
  }
  return "CC-PENDING";
}

/**
 * Backfills any quote requests in the database that currently lack a quoteNumber.
 */
export async function backfillExistingQuoteNumbers(): Promise<{ updatedCount: number }> {
  try {
    const unnumberedQuotes = await prisma.quoteRequest.findMany({
      where: {
        OR: [
          { quoteNumber: null },
          { quoteNumber: "" },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        pickupAddress: true,
        dropoffAddress: true,
        status: true,
        createdAt: true,
      },
    });

    if (unnumberedQuotes.length === 0) {
      return { updatedCount: 0 };
    }

    let sequence = 1001;
    let updatedCount = 0;

    for (const quote of unnumberedQuotes) {
      const year = quote.createdAt ? new Date(quote.createdAt).getFullYear() : new Date().getFullYear();
      const generatedNumber = `CC-${year}-${sequence}`;

      await prisma.quoteRequest.update({
        where: { id: quote.id },
        data: { quoteNumber: generatedNumber },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existingLog = await (prisma as any).activityLog.findFirst({
        where: { quoteRequestId: quote.id },
      });

      if (!existingLog) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).activityLog.create({
          data: {
            action: "QUOTE_SUBMITTED",
            category: "QUOTE",
            quoteNumber: generatedNumber,
            quoteRequestId: quote.id,
            actor: "Client",
            title: `Quote Request #${generatedNumber} Logged`,
            details: `Historical relocation intake for ${quote.name} (${quote.phone}). Moving from ${quote.pickupAddress} to ${quote.dropoffAddress}. Status: ${quote.status}`,
            status: "SUCCESS",
            createdAt: quote.createdAt || new Date(),
          },
        });
      }

      sequence++;
      updatedCount++;
    }

    return { updatedCount };
  } catch (err) {
    console.error("Failed to backfill quote numbers:", err);
    return { updatedCount: 0 };
  }
}
