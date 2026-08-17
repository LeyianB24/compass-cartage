// src/lib/actions.ts
"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { verifyAdminAuth } from "./auth";

export type BookMoveResult = { success: true } | { success: false; error: string };

const VALID_MOVE_TYPES = ["LOCAL", "LONG_DISTANCE_ALBERTA", "OUT_OF_PROVINCE"] as const;
const VALID_STATUSES = ["NEW", "CONTACTED", "QUOTED", "BOOKED", "COMPLETED", "DECLINED"] as const;

export async function bookMove(
  quoteRequestId: string,
  moveType: "LOCAL" | "LONG_DISTANCE_ALBERTA" | "OUT_OF_PROVINCE",
  dateStr: string
): Promise<BookMoveResult> {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return { success: false, error: "Unauthorized: Admin session required" };
  }

  if (!quoteRequestId || typeof quoteRequestId !== "string") {
    return { success: false, error: "Invalid quote request ID" };
  }

  if (!VALID_MOVE_TYPES.includes(moveType)) {
    return { success: false, error: "Invalid move type" };
  }

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
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    throw new Error("Unauthorized: Admin session required");
  }

  if (!quoteRequestId || typeof quoteRequestId !== "string") {
    throw new Error("Invalid quote request ID");
  }

  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid status");
  }

  await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: { status },
  });
  revalidatePath("/admin");
}