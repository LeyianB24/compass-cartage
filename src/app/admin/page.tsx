// src/app/admin/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/auth";
import AdminDashboardClient from "@/components/AdminDashboardClient";
import { backfillExistingQuoteNumbers } from "@/lib/quoteNumber";
import { getRecentActivityLogs } from "@/lib/activityLogger";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    redirect("/admin/login");
  }

  // Automatically backfill any existing quotes that lack a quote number
  try {
    await backfillExistingQuoteNumbers();
  } catch (err) {
    console.warn("Auto backfill check skipped:", err);
  }

  const [requests, logs] = await Promise.all([
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { bookedSlot: true },
    }),
    getRecentActivityLogs(250),
  ]);

  const stats = {
    total: requests.length,
    new: requests.filter((r) => r.status === "NEW").length,
    booked: requests.filter((r) => r.status === "BOOKED").length,
    completed: requests.filter((r) => r.status === "COMPLETED").length,
  };

  // Serialize dates for the client component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialized = requests.map((r: any) => ({
    ...r,
    quoteNumber: r.quoteNumber || null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    bookedSlot: r.bookedSlot
      ? { date: r.bookedSlot.date.toISOString(), moveType: r.bookedSlot.moveType }
      : null,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializedLogs = logs.map((log: any) => ({
    id: log.id,
    action: log.action,
    category: log.category,
    quoteNumber: log.quoteNumber || null,
    quoteRequestId: log.quoteRequestId || null,
    actor: log.actor,
    title: log.title,
    details: log.details || null,
    metadata: log.metadata || null,
    status: log.status,
    createdAt: log.createdAt.toISOString(),
    quoteRequest: log.quoteRequest || null,
  }));

  return <AdminDashboardClient requests={serialized} stats={stats} initialLogs={serializedLogs} />;
}