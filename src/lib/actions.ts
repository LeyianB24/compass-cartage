// src/lib/actions.ts
"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { verifyAdminAuth } from "./auth";
import { generateNextQuoteNumber } from "./quoteNumber";
import { logActivity } from "./activityLogger";

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

  const updatedQuote = await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: { status: "BOOKED" },
    select: { id: true, quoteNumber: true, name: true },
  });

  await logActivity({
    action: "BOOKING_CREATED",
    category: "BOOKING",
    quoteNumber: updatedQuote.quoteNumber,
    quoteRequestId: updatedQuote.id,
    actor: "Admin",
    title: `Move Booked (${moveType})`,
    details: `Confirmed booking for ${updatedQuote.name} on ${dateStr}. Assigned type: ${moveType}. Quote #${updatedQuote.quoteNumber || updatedQuote.id}.`,
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

  const updatedQuote = await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: { status: "QUOTED" },
    select: { id: true, quoteNumber: true, name: true },
  });

  await logActivity({
    action: "BOOKING_CANCELLED",
    category: "BOOKING",
    quoteNumber: updatedQuote.quoteNumber,
    quoteRequestId: updatedQuote.id,
    actor: "Admin",
    title: "Booking Slot Cancelled",
    details: `Reservation cancelled for Quote #${updatedQuote.quoteNumber || updatedQuote.id} (${updatedQuote.name}). Status returned to QUOTED.`,
    status: "WARNING",
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

  const current = await prisma.quoteRequest.findUnique({
    where: { id: quoteRequestId },
    select: { id: true, quoteNumber: true, name: true, status: true },
  });

  await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: { status },
  });

  if (current) {
    await logActivity({
      action: "STATUS_UPDATED",
      category: "STATUS",
      quoteNumber: current.quoteNumber,
      quoteRequestId: current.id,
      actor: "Admin",
      title: `Status Changed to ${status}`,
      details: `Quote #${current.quoteNumber || current.id} (${current.name}) transitioned from ${current.status} to ${status}.`,
    });
  }

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

  const updated = await prisma.quoteRequest.update({
    where: { id: quoteRequestId },
    data: { notes },
    select: { id: true, quoteNumber: true, name: true },
  });

  await logActivity({
    action: "NOTE_UPDATED",
    category: "DISPATCH",
    quoteNumber: updated.quoteNumber,
    quoteRequestId: updated.id,
    actor: "Admin",
    title: `Notes Updated #${updated.quoteNumber || updated.id}`,
    details: `Dispatch operational notes modified for ${updated.name}.`,
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteQuoteRequest(quoteRequestId: string): Promise<ActionSimpleResult> {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return { success: false, error: "Unauthorized: Admin session required" };
  }

  const target = await prisma.quoteRequest.findUnique({
    where: { id: quoteRequestId },
    select: { id: true, quoteNumber: true, name: true },
  });

  // Delete booked slot first if any
  await prisma.bookedSlot.deleteMany({
    where: { quoteRequestId },
  });

  await prisma.quoteRequest.delete({
    where: { id: quoteRequestId },
  });

  if (target) {
    await logActivity({
      action: "QUOTE_DELETED",
      category: "SYSTEM",
      quoteNumber: target.quoteNumber,
      actor: "Admin",
      title: `Quote Record Removed`,
      details: `Permanently deleted Quote #${target.quoteNumber || target.id} (${target.name}) and associated booking records.`,
      status: "WARNING",
    });
  }

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

  const quoteNumber = await generateNextQuoteNumber();

  const created = await prisma.quoteRequest.create({
    data: {
      quoteNumber,
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

  await logActivity({
    action: "MANUAL_LEAD",
    category: "QUOTE",
    quoteNumber,
    quoteRequestId: created.id,
    actor: "Admin",
    title: `Manual Lead #${quoteNumber} Created`,
    details: `Admin intake created for ${created.name} (${created.phone}). Origin: ${created.pickupAddress}, Dropoff: ${created.dropoffAddress}. Initial status: ${created.status}.`,
  });

  revalidatePath("/admin");
  return { success: true };
}