// src/lib/actions.ts
"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export type BookMoveResult = { success: true } | { success: false; error: string };

export async function bookMove(
  quoteRequestId: string,
  moveType: "LOCAL" | "LONG_DISTANCE_ALBERTA" | "OUT_OF_PROVINCE",
  dateStr: string
): Promise<BookMoveResult> {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { success: false, error: "Invalid date" };
  }

  // Client rule: out-of-province moves are limited to twice a month.
  if (moveType === "OUT_OF_PROVINCE") {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const existingCount = await prisma.bookedSlot.count({
      where: {
        moveType: "OUT_OF_PROVINCE",
        date: { gte: monthStart, lt: monthEnd },
      },
    });

    if (existingCount >= 2) {
      return {
        success: false,
        error:
          "Out-of-province moves are limited to twice a month, and this month is fully booked. Please choose a different month.",
      };
    }
  }

  await prisma.bookedSlot.create({
    data: { date, moveType, quoteRequestId },
  });

  await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: { status: "BOOKED" },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function updateRequestStatus(
  quoteRequestId: string,
  status: "NEW" | "CONTACTED" | "QUOTED" | "BOOKED" | "COMPLETED" | "DECLINED"
) {
  await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: { status },
  });
  revalidatePath("/admin");
}