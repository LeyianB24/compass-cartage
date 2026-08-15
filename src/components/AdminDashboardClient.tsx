// src/components/AdminDashboardClient.tsx
"use client";

import { useState, useMemo } from "react";
import { Inbox, Sparkles, CalendarCheck, CheckCircle2 } from "lucide-react";
import AdminRequestRow from "./AdminRequestRow";

type RequestType = {
  id: string;
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  dropoffAddress: string;
  moveDate: string | null;
  moveSize: string | null;
  notes: string | null;
  photoUrls: string[];
  status: string;
  createdAt: string;
  bookedSlot: { date: string; moveType: string } | null;
};

type Props = {
  requests: RequestType[];
  stats: { total: number; new: number; booked: number; completed: number };
};

const FILTERS = ["ALL", "NEW", "CONTACTED", "QUOTED", "BOOKED", "COMPLETED", "DECLINED"];

export default function AdminDashboardClient({ requests, stats }: Props) {
  const [filter, setFilter] = useState("ALL");

  const filtered = useMemo(
    () => (filter === "ALL" ? requests : requests.filter((r) => r.status === filter)),
    [requests, filter]
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <p className="eyebrow mb-1">Overview</p>
      <h1 className="font-display text-3xl font-semibold text-navy-deep">Quote Requests</h1>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Inbox} label="Total Requests" value={stats.total} />
        <StatCard icon={Sparkles} label="New" value={stats.new} accent />
        <StatCard icon={CalendarCheck} label="Booked" value={stats.booked} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} />
      </div>

      {/* Filter tabs */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-hairline pb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === f
                ? "bg-navy-deep text-paper"
                : "bg-white text-slate border border-hairline hover:border-navy-deep"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 && (
          <p className="rounded-card border border-hairline bg-white p-8 text-center text-sm text-slate">
            No requests match this filter.
          </p>
        )}
        {filtered.map((r) => (
          <AdminRequestRow key={r.id} request={r} />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: typeof Inbox;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-card border border-hairline bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-display font-semibold text-navy-deep">{value}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${accent ? "bg-gold/15 text-gold" : "bg-navy-deep/5 text-navy-deep"}`}>
          <Icon size={15} />
        </div>
      </div>
      <p className="mt-1 text-xs text-slate">{label}</p>
    </div>
  );
}