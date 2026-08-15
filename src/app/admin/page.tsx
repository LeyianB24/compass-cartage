// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const requests = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { bookedSlot: true },
  });

  const stats = {
    total: requests.length,
    new: requests.filter((r) => r.status === "NEW").length,
    booked: requests.filter((r) => r.status === "BOOKED").length,
    completed: requests.filter((r) => r.status === "COMPLETED").length,
  };

  // Serialize dates for the client component
  const serialized = requests.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    bookedSlot: r.bookedSlot
      ? { date: r.bookedSlot.date.toISOString(), moveType: r.bookedSlot.moveType }
      : null,
  }));

  return <AdminDashboardClient requests={serialized} stats={stats} />;
}