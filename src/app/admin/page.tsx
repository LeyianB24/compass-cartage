// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import AdminRequestRow from "@/components/AdminRequestRow";

export const dynamic = "force-dynamic"; // always show fresh data, never cache

export default async function AdminPage() {
  const requests = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { bookedSlot: true },
  });

  return (
    <div className="min-h-screen bg-paper">
      <div className="section-padding mx-auto max-w-content py-12">
        <p className="eyebrow mb-2">Compass Cartage</p>
        <h1 className="font-display text-3xl font-semibold text-navy-deep">Quote Requests</h1>
        <p className="mt-1 text-sm text-slate">{requests.length} total requests</p>

        <div className="mt-8 space-y-4">
          {requests.length === 0 && (
            <p className="rounded-card border border-hairline bg-white p-8 text-center text-sm text-slate">
              No quote requests yet.
            </p>
          )}
          {requests.map((r) => (
            <AdminRequestRow key={r.id} request={r} />
          ))}
        </div>
      </div>
    </div>
  );
}