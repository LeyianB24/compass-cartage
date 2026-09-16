// src/components/AdminAnalyticsView.tsx
"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Building,
  Home,
} from "lucide-react";

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
  status: string;
  createdAt: string;
  bookedSlot: { date: string; moveType: string } | null;
};

type Props = {
  requests: RequestType[];
};

export default function AdminAnalyticsView({ requests }: Props) {
  const analytics = useMemo(() => {
    const total = requests.length;
    const newCount = requests.filter((r) => r.status === "NEW").length;
    const contacted = requests.filter((r) => r.status === "CONTACTED").length;
    const quoted = requests.filter((r) => r.status === "QUOTED").length;
    const booked = requests.filter((r) => r.status === "BOOKED").length;
    const completed = requests.filter((r) => r.status === "COMPLETED").length;
    const declined = requests.filter((r) => r.status === "DECLINED").length;

    // Conversion rate
    const conversionRate = total > 0 ? Math.round(((booked + completed) / total) * 100) : 0;

    // Estimated revenue pipeline ($450 avg for studio, $800 2br, $1400 3br+, $2200 long-dist/commercial)
    let pipelineRevenue = 0;
    requests.forEach((r) => {
      if (r.status === "BOOKED" || r.status === "COMPLETED" || r.status === "QUOTED") {
        const size = (r.moveSize || "").toLowerCase();
        if (size.includes("commercial")) pipelineRevenue += 2400;
        else if (size.includes("4 bedroom") || size.includes("3 bedroom")) pipelineRevenue += 1500;
        else if (size.includes("2 bedroom")) pipelineRevenue += 850;
        else if (size.includes("1 bedroom")) pipelineRevenue += 550;
        else pipelineRevenue += 400;
      }
    });

    // Move types breakdown
    const moveTypes = {
      LOCAL: 0,
      LONG_DISTANCE_ALBERTA: 0,
      OUT_OF_PROVINCE: 0,
    };
    requests.forEach((r) => {
      if (r.bookedSlot) {
        if (r.bookedSlot.moveType === "OUT_OF_PROVINCE") moveTypes.OUT_OF_PROVINCE++;
        else if (r.bookedSlot.moveType === "LONG_DISTANCE_ALBERTA") moveTypes.LONG_DISTANCE_ALBERTA++;
        else moveTypes.LOCAL++;
      }
    });

    // Move sizes breakdown
    const sizes: Record<string, number> = {};
    requests.forEach((r) => {
      const key = r.moveSize || "Unspecified";
      sizes[key] = (sizes[key] || 0) + 1;
    });

    return {
      total,
      newCount,
      contacted,
      quoted,
      booked,
      completed,
      declined,
      conversionRate,
      pipelineRevenue,
      moveTypes,
      sizes,
    };
  }, [requests]);

  return (
    <div className="space-y-8">
      {/* Top High-Level Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-light dark:text-gray-400">
              Pipeline Conversion
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-navy-deep dark:text-white">
            {analytics.conversionRate}%
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate dark:text-gray-400">
            {analytics.booked + analytics.completed} of {analytics.total} total leads converted
          </p>
        </div>

        <div className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-light dark:text-gray-400">
              Estimated Pipeline
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-navy-deep dark:text-white">
            ${analytics.pipelineRevenue.toLocaleString()}
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate dark:text-gray-400">
            Active quoted & booked move value
          </p>
        </div>

        <div className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-light dark:text-gray-400">
              Active Bookings
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 text-blue-500">
              <Truck size={16} />
            </div>
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-navy-deep dark:text-white">
            {analytics.booked}
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate dark:text-gray-400">
            Scheduled on fleet dispatch calendar
          </p>
        </div>

        <div className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-light dark:text-gray-400">
              Completed Ledger
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/15 text-purple-500">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="mt-2 font-display text-3xl font-bold text-navy-deep dark:text-white">
            {analytics.completed}
          </p>
          <p className="mt-1 font-mono text-[11px] text-slate dark:text-gray-400">
            Successfully closed moves
          </p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lead Pipeline Funnel */}
        <div className="rounded-card border border-hairline bg-paper-muted p-6 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-gold mb-4">
            <PieChart size={15} />
            <span>Lead Status Pipeline Distribution</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "New Unprocessed", count: analytics.newCount, color: "bg-gold text-navy-deep" },
              { label: "Contacted / In Discussion", count: analytics.contacted, color: "bg-blue-500 text-white" },
              { label: "Quote Dispatched", count: analytics.quoted, color: "bg-purple-500 text-white" },
              { label: "Booked & Scheduled", count: analytics.booked, color: "bg-emerald-500 text-white" },
              { label: "Move Completed", count: analytics.completed, color: "bg-slate text-white" },
              { label: "Declined / Lost", count: analytics.declined, color: "bg-red-500 text-white" },
            ].map((stage) => {
              const pct = analytics.total > 0 ? Math.round((stage.count / analytics.total) * 100) : 0;
              return (
                <div key={stage.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-navy-deep dark:text-gray-200">{stage.label}</span>
                    <span className="font-mono text-slate dark:text-gray-400">
                      {stage.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-paper dark:bg-[#070c14]">
                    <div className={`h-full ${stage.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Route Classification */}
        <div className="rounded-card border border-hairline bg-paper-muted p-6 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-gold mb-4">
            <ShieldCheck size={15} />
            <span>Fleet Transit Route Classification</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xs border border-hairline bg-paper p-4 text-center dark:border-white/10 dark:bg-[#070c14]">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/15 text-blue-500 mb-2">
                <Home size={18} />
              </div>
              <p className="font-mono text-2xl font-bold text-navy-deep dark:text-white">
                {analytics.moveTypes.LOCAL}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate dark:text-gray-400">
                Local Edmonton Area
              </p>
            </div>

            <div className="rounded-xs border border-hairline bg-paper p-4 text-center dark:border-white/10 dark:bg-[#070c14]">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold mb-2">
                <Truck size={18} />
              </div>
              <p className="font-mono text-2xl font-bold text-navy-deep dark:text-white">
                {analytics.moveTypes.LONG_DISTANCE_ALBERTA}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate dark:text-gray-400">
                Alberta Regional
              </p>
            </div>

            <div className="rounded-xs border border-hairline bg-paper p-4 text-center dark:border-white/10 dark:bg-[#070c14]">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/15 text-purple-500 mb-2">
                <Building size={18} />
              </div>
              <p className="font-mono text-2xl font-bold text-navy-deep dark:text-white">
                {analytics.moveTypes.OUT_OF_PROVINCE}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate dark:text-gray-400">
                Out of Province
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xs border border-hairline bg-paper p-4 text-xs leading-relaxed text-slate dark:border-white/10 dark:bg-[#070c14] dark:text-gray-300">
            <p className="font-semibold text-navy-deep dark:text-white mb-1">
              Dispatch Operational Standard:
            </p>
            All residential and commercial moves maintain single-crew vehicle continuity with full licensed and insured coverage.
          </div>
        </div>
      </div>
    </div>
  );
}
