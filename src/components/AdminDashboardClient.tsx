// src/components/AdminDashboardClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Inbox,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  Search,
  Plus,
  Download,
  Calendar as CalendarIcon,
  Table as TableIcon,
  BarChart3,
  Filter,
  X,
} from "lucide-react";
import AdminRequestRow from "./AdminRequestRow";
import AdminCalendarView from "./AdminCalendarView";
import AdminAnalyticsView from "./AdminAnalyticsView";
import ManualLeadModal from "./ManualLeadModal";

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

const FILTERS = ["ALL", "NEW", "CONTACTED", "QUOTED", "BOOKED", "COMPLETED", "DECLINED"] as const;

export default function AdminDashboardClient({ requests, stats }: Props) {
  const [activeTab, setActiveTab] = useState<"ledger" | "calendar" | "analytics">("ledger");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created_desc" | "created_asc" | "move_date">("created_desc");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        document.getElementById("admin-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter and sort requests
  const filtered = useMemo(() => {
    return requests
      .filter((r) => {
        const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          q === "" ||
          r.name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          r.pickupAddress.toLowerCase().includes(q) ||
          r.dropoffAddress.toLowerCase().includes(q) ||
          (r.moveSize && r.moveSize.toLowerCase().includes(q)) ||
          (r.notes && r.notes.toLowerCase().includes(q));

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "created_asc") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "move_date") {
          const dateA = a.moveDate ? new Date(a.moveDate).getTime() : 0;
          const dateB = b.moveDate ? new Date(b.moveDate).getTime() : 0;
          return dateB - dateA;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [requests, statusFilter, searchQuery, sortBy]);

  // Export to CSV Function
  const exportCsv = () => {
    const headers = [
      "ID",
      "Date Created",
      "Client Name",
      "Phone",
      "Email",
      "Origin (Pickup)",
      "Destination (Dropoff)",
      "Preferred Move Date",
      "Move Scope / Size",
      "Status",
      "Booked Date",
      "Move Route Type",
      "Notes",
    ];

    const rows = filtered.map((r) => [
      `"${r.id}"`,
      `"${new Date(r.createdAt).toLocaleString("en-CA")}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.pickupAddress.replace(/"/g, '""')}"`,
      `"${r.dropoffAddress.replace(/"/g, '""')}"`,
      `"${r.moveDate || ""}"`,
      `"${(r.moveSize || "").replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${r.bookedSlot ? new Date(r.bookedSlot.date).toISOString().split("T")[0] : ""}"`,
      `"${r.bookedSlot?.moveType || ""}"`,
      `"${(r.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `compass_cartage_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 space-y-8">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-hairline pb-6 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold">
              Operations Terminal
            </span>
            <span className="rounded-xs bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              ● Live DB Connected
            </span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-bold text-navy-deep dark:text-white sm:text-3xl">
            Dispatch Command Center
          </h1>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xs border border-hairline bg-paper-muted p-1 dark:border-white/10 dark:bg-[#0f172a]">
            <button
              onClick={() => setActiveTab("ledger")}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeTab === "ledger"
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <TableIcon size={14} />
              <span>Ledger Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeTab === "calendar"
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <CalendarIcon size={14} />
              <span>Fleet Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <BarChart3 size={14} />
              <span>Analytics</span>
            </button>
          </div>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xs bg-navy-deep px-4 py-2 text-xs font-bold text-gold-soft shadow-sm transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft shrink-0"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Log Phone Intake</span>
            <span className="sm:hidden">Intake</span>
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Inbox} label="Total Ledger Inquiries" value={stats.total} />
        <StatCard icon={Sparkles} label="Unprocessed Leads" value={stats.new} accent />
        <StatCard icon={CalendarCheck} label="Locked Fleet Bookings" value={stats.booked} />
        <StatCard icon={CheckCircle2} label="Completed Relocations" value={stats.completed} />
      </div>

      {/* TAB 1: LEDGER MATRIX VIEW */}
      {activeTab === "ledger" && (
        <div className="space-y-5">
          {/* Search, Filter & Export Controls Bar */}
          <div className="flex flex-col gap-3 rounded-card border border-hairline bg-paper-muted p-4 shadow-xs dark:border-white/10 dark:bg-[#0f172a] sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search size={15} className="absolute left-3.5 top-2.5 text-slate-light dark:text-gray-400" />
              <input
                id="admin-search-input"
                type="text"
                placeholder="Search clients, phone, address, notes... (Press '/' to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xs border border-hairline bg-paper pl-9 pr-8 py-2 text-xs text-navy-deep placeholder:text-slate-light focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as never)}
                className="rounded-xs border border-hairline bg-paper px-3 py-2 font-mono text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
              >
                <option value="created_desc">Newest Inquiries</option>
                <option value="created_asc">Oldest Inquiries</option>
                <option value="move_date">Target Move Date</option>
              </select>

              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-1.5 rounded-xs border border-hairline bg-paper px-3.5 py-2 font-mono text-xs font-semibold text-navy-deep transition-all hover:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:hover:border-gold"
                title="Download CSV spreadsheet of current results"
              >
                <Download size={13} className="text-gold" />
                <span>Export CSV ({filtered.length})</span>
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <Filter size={13} className="shrink-0 text-gold mr-1" />
            {FILTERS.map((f) => {
              const count = f === "ALL" ? requests.length : requests.filter((r) => r.status === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`shrink-0 rounded-xs px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                    statusFilter === f
                      ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                      : "bg-paper-muted text-slate border border-hairline hover:border-gold dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-300 dark:hover:border-gold"
                  }`}
                >
                  {f === "ALL" ? "All Leads" : f} ({count})
                </button>
              );
            })}
          </div>

          {/* List of Requests */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-card border border-hairline bg-paper-muted p-12 text-center dark:border-white/10 dark:bg-[#0f172a]">
                <p className="font-display text-base font-semibold text-navy-deep dark:text-white">
                  No quote requests found
                </p>
                <p className="mt-1 text-xs text-slate dark:text-gray-400">
                  Try clearing your search query or adjusting status filters.
                </p>
              </div>
            ) : (
              filtered.map((r) => <AdminRequestRow key={r.id} request={r} />)
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DISPATCH CALENDAR VIEW */}
      {activeTab === "calendar" && <AdminCalendarView requests={requests} />}

      {/* TAB 3: PIPELINE ANALYTICS VIEW */}
      {activeTab === "analytics" && <AdminAnalyticsView requests={requests} />}

      {/* Manual Intake Lead Modal */}
      <ManualLeadModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />
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
    <div className="rounded-card border border-hairline bg-paper-muted p-4 shadow-xs dark:border-white/10 dark:bg-[#0f172a]">
      <div className="flex items-center justify-between">
        <p className="font-mono text-2xl font-bold text-navy-deep dark:text-white">{value}</p>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xs ${
            accent
              ? "bg-gold/15 text-gold"
              : "bg-navy-deep/5 text-navy-deep dark:bg-white/10 dark:text-gray-200"
          }`}
        >
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-1 font-mono text-[11px] text-slate dark:text-gray-400">{label}</p>
    </div>
  );
}