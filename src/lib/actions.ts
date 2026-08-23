// src/lib/actions.ts
"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { verifyAdminAuth } from "./auth";

export type BookMoveResult = { success: true } | { success: false; error: string };
export type ActionSimpleResult = { success: true } | { success: false; error: string };

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

  // Check if slot already exists for this quote request
  const existingSlot = await prisma.bookedSlot.findUnique({
    where: { quoteRequestId },
  });

  if (existingSlot) {
    await prisma.bookedSlot.update({
      where: { id: existingSlot.id },
      data: { date, moveType },
    });
  } else {
    await prisma.bookedSlot.create({
      data: { date, moveType, quoteRequestId },
    });
  }

  await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: { status: "BOOKED" },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function cancelBooking(quoteRequestId: string): Promise<ActionSimpleResult> {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return { success: false, error: "Unauthorized: Admin session required" };
  }

  const slot = await prisma.bookedSlot.findUnique({
    where: { quoteRequestId },
  });

  if (slot) {
    await prisma.bookedSlot.delete({
      where: { id: slot.id },
    });
  }

  await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: { status: "QUOTED" },
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

export async function updateRequestNotes(
  quoteRequestId: string,
  notes: string
): Promise<ActionSimpleResult> {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return { success: false, error: "Unauthorized: Admin session required" };
  }

  await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: { notes },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteQuoteRequest(quoteRequestId: string): Promise<ActionSimpleResult> {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return { success: false, error: "Unauthorized: Admin session required" };
  }

  // Delete booked slot first if any
  await prisma.bookedSlot.deleteMany({
    where: { quoteRequestId },
  });

  await prisma.quoteRequest.delete({
    where: { id: quoteRequestId },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function createManualQuoteRequest(data: {
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  dropoffAddress: string;
  moveDate?: string;
  moveSize?: string;
  notes?: string;
  status?: "NEW" | "CONTACTED" | "QUOTED" | "BOOKED";
}): Promise<ActionSimpleResult> {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return { success: false, error: "Unauthorized: Admin session required" };
  }

  if (!data.name || !data.phone || !data.pickupAddress || !data.dropoffAddress) {
    return { success: false, error: "Missing required client fields" };
  }

  await prisma.quoteRequest.create({
    data: {
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || "intake@compasscartage.internal",
      pickupAddress: data.pickupAddress.trim(),
      dropoffAddress: data.dropoffAddress.trim(),
      moveDate: data.moveDate || null,
      moveSize: data.moveSize || "2 Bedroom Home",
      notes: data.notes?.trim() || "Logged via Dispatch Intake Terminal",
      status: data.status || "NEW",
    },
  });

  revalidatePath("/admin");
  return { success: true };
}