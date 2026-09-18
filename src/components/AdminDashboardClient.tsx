// src/components/AdminDashboardClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
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
  Sliders,
  Truck,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Eye,
  Shield,
} from "lucide-react";
import AdminRequestRow from "./AdminRequestRow";
import AdminCalendarView from "./AdminCalendarView";
import AdminAnalyticsView from "./AdminAnalyticsView";
import AdminPricingTiersTab from "./AdminPricingTiersTab";
import AdminActivityLogsTab, { type SerializedActivityLog } from "./AdminActivityLogsTab";
import ManualLeadModal from "./ManualLeadModal";

const FLEET_UNITS = [
  {
    unitId: "UNIT-101",
    name: "26ft Commercial Freightliner Lorry",
    type: "Heavy Haul / Multi-Bedroom",
    capacity: "1,800 cu ft • 4-5 Bed Homes",
    status: "Active Dispatched",
    statusColor: "text-emerald-700 bg-emerald-500/15 border-emerald-500/30 dark:text-emerald-400",
    image: "/images/lorry1.jpeg",
    specs: "Hydraulic Tailgate Lift • Air-Ride Suspension",
  },
  {
    unitId: "UNIT-102",
    name: "20ft City Cargo Moving Truck",
    type: "Residential / Commercial",
    capacity: "1,350 cu ft • 2-3 Bed Homes",
    status: "Ready for Dispatch",
    statusColor: "text-blue-700 bg-blue-500/15 border-blue-500/30 dark:text-blue-400",
    image: "/images/lorry2.jpeg",
    specs: "Walk-Up Low Ramp • E-Track Ratchet Rails",
  },
  {
    unitId: "UNIT-103",
    name: "High-Roof Ford Transit Cargo Van",
    type: "Express / Studio / Condo",
    capacity: "650 cu ft • Padded Furniture Bay",
    status: "Ready for Dispatch",
    statusColor: "text-blue-700 bg-blue-500/15 border-blue-500/30 dark:text-blue-400",
    image: "/images/transit-van-side-loaded.jpeg",
    specs: "High-Ceiling Clearance • Padded Moving Blankets",
  },
  {
    unitId: "UNIT-104",
    name: "16ft Urban Box Transport Lorry",
    type: "Apartment / 1-2 Bed Homes",
    capacity: "900 cu ft • Medium Haul",
    status: "Ready for Dispatch",
    statusColor: "text-blue-700 bg-blue-500/15 border-blue-500/30 dark:text-blue-400",
    image: "/images/lorry3.jpeg",
    specs: "Tight Urban Turning • High Roof Clearance",
  },
  {
    unitId: "UNIT-105",
    name: "Tri-Axle Enclosed Cargo Transporter",
    type: "Long Distance & Heavy Cargo",
    capacity: "2,200 cu ft Combined",
    status: "In Service (Highway)",
    statusColor: "text-gold bg-gold/15 border-gold/30",
    image: "/images/hero 3.jpg",
    specs: "Weather-Sealed • Commercial Highway Class",
  },
];

type RequestType = {
  id: string;
  quoteNumber?: string | null;
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  dropoffAddress: string;
  moveDate: string | null;
  moveSize: string | null;
  distanceKm?: number | null;
  distanceFee?: number | null;
  pricingTier?: string | null;
  estimatedPrice?: number | null;
  notes: string | null;
  photoUrls: string[];
  status: string;
  createdAt: string;
  bookedSlot: { date: string; moveType: string } | null;
};

type Props = {
  requests: RequestType[];
  stats: { total: number; new: number; booked: number; completed: number };
  initialLogs?: SerializedActivityLog[];
};

const FILTERS = ["ALL", "NEW", "CONTACTED", "QUOTED", "BOOKED", "COMPLETED", "DECLINED"] as const;

export default function AdminDashboardClient({ requests, stats, initialLogs = [] }: Props) {
  const [activeTab, setActiveTab] = useState<"ledger" | "calendar" | "analytics" | "pricing" | "logs">("ledger");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created_desc" | "created_asc" | "move_date">("created_desc");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [showFleetDeck, setShowFleetDeck] = useState(true);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  // Extract all client uploaded inventory photos across all requests for quick visual access
  const allCustomerPhotos = useMemo(() => {
    const list: { url: string; clientName: string; date: string; requestId: string }[] = [];
    requests.forEach((r) => {
      if (r.photoUrls && r.photoUrls.length > 0) {
        r.photoUrls.forEach((url) => {
          list.push({ url, clientName: r.name, date: r.createdAt, requestId: r.id });
        });
      }
    });
    return list;
  }, [requests]);

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
          (r.quoteNumber && r.quoteNumber.toLowerCase().includes(q)) ||
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
      "Distance (km)",
      "Distance Fee ($)",
      "Service Tier",
      "Estimated Total ($)",
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
      `"${r.distanceKm ? `~${r.distanceKm} km` : "Local"}"`,
      `"${r.distanceFee ? `$${r.distanceFee.toFixed(2)}` : "$0.00"}"`,
      `"${r.pricingTier || "Standard"}"`,
      `"${r.estimatedPrice ? `$${Math.round(r.estimatedPrice)}` : ""}"`,
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
      {/* Top Header & Quick Actions */}
      <div className="relative overflow-hidden rounded-card border border-hairline bg-paper-muted p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1626]">
        {/* Subtle moving fleet truck photo watermark overlay */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-1/3 opacity-10 dark:opacity-20 overflow-hidden">
          <Image
            src="/images/lorry1.jpeg"
            alt=""
            fill
            className="object-cover object-left"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper-muted via-paper-muted/80 to-transparent dark:from-[#0c1626] dark:via-[#0c1626]/80" />
        </div>

        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex items-start gap-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gold/40 bg-navy-deep p-1 shadow-sm">
              <Image
                src="/logos/logo Compass Cartage.png"
                alt="Compass Cartage Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-gold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operational Command Center</span>
              </div>
              <h1 className="font-display mt-0.5 text-2xl font-bold tracking-tight text-navy-deep dark:text-white sm:text-3xl">
                Dispatch Ledger & Pipeline
              </h1>
              <p className="mt-0.5 text-xs text-slate dark:text-gray-400">
                Real-time moving inquiries, calendar dispatches, pricing rate controls, and conversion metrics.
              </p>
            </div>
          </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Tabs */}
          <div className="flex items-center rounded-xs border border-hairline bg-paper-muted p-1 dark:border-white/10 dark:bg-[#070c14]">
            <button
              onClick={() => setActiveTab("ledger")}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeTab === "ledger"
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <TableIcon size={14} />
              <span>Inquiry Ledger</span>
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

            <button
              onClick={() => setActiveTab("pricing")}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeTab === "pricing"
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <Sliders size={14} />
              <span>Pricing & Tiers</span>
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                activeTab === "logs"
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <Shield size={14} />
              <span>Activity Logs</span>
              <span className="rounded-xs bg-gold/15 px-1.5 py-0.2 text-[10px] text-gold font-bold">
                {initialLogs.length}
              </span>
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
    </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Inbox} label="Total Ledger Inquiries" value={stats.total} />
        <StatCard icon={Sparkles} label="Unprocessed Leads" value={stats.new} accent />
        <StatCard icon={CalendarCheck} label="Locked Fleet Bookings" value={stats.booked} />
        <StatCard icon={CheckCircle2} label="Completed Relocations" value={stats.completed} />
      </div>

      {/* COMPASS CARTAGE ACTIVE FLEET OPERATIONS DECK */}
      <div className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0c1626]">
        <div className="flex items-center justify-between border-b border-hairline pb-3 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-gold/15 text-gold">
              <Truck size={15} />
            </div>
            <div>
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-navy-deep dark:text-white">
                Compass Cartage Fleet Operations Roster
              </h2>
              <p className="text-[11px] text-slate dark:text-gray-400">
                Active commercial vehicles, lorries, trailers & cargo capacity
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFleetDeck((v) => !v)}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-gold hover:underline"
          >
            <span>{showFleetDeck ? "Hide Fleet Roster" : "Show Fleet Roster"}</span>
            {showFleetDeck ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {showFleetDeck && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FLEET_UNITS.map((unit) => (
              <div
                key={unit.unitId}
                className="group relative flex flex-col overflow-hidden rounded-xs border border-hairline bg-paper transition-all hover:border-gold/60 dark:border-white/10 dark:bg-[#070c14]"
              >
                {/* Vehicle Thumbnail with Status Badge */}
                <div className="relative h-32 w-full overflow-hidden bg-navy-deep">
                  <Image
                    src={unit.image}
                    alt={unit.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2">
                    <span className="rounded-xs bg-navy-deep/90 px-2 py-0.5 font-mono text-[10px] font-bold text-gold backdrop-blur-xs border border-gold/30">
                      {unit.unitId}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <span
                      className={`inline-block rounded-xs border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${unit.statusColor}`}
                    >
                      {unit.status}
                    </span>
                  </div>
                </div>

                {/* Specs and Details */}
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <h3 className="font-display text-xs font-bold text-navy-deep dark:text-white line-clamp-1">
                      {unit.name}
                    </h3>
                    <p className="font-mono text-[10px] text-gold mt-0.5">{unit.type}</p>
                    <p className="mt-1 font-mono text-[10px] text-slate dark:text-gray-400">
                      {unit.capacity}
                    </p>
                  </div>
                  <div className="mt-2 border-t border-hairline/60 pt-1.5 dark:border-white/5">
                    <p className="font-mono text-[9px] text-slate-light dark:text-gray-400 truncate">
                      {unit.specs}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CLIENT INVENTORY MEDIA HUB (When quotes have photos) */}
      {allCustomerPhotos.length > 0 && (
        <div className="rounded-card border border-hairline bg-paper-muted p-5 shadow-xs dark:border-white/10 dark:bg-[#0c1626]">
          <div className="flex items-center justify-between border-b border-hairline pb-3 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xs bg-gold/15 text-gold">
                <ImageIcon size={15} />
              </div>
              <div>
                <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-navy-deep dark:text-white">
                  Client Inventory Media Hub ({allCustomerPhotos.length} Photos)
                </h2>
                <p className="text-[11px] text-slate dark:text-gray-400">
                  Customer-submitted room & item inventory photos for quote accuracy
                </p>
              </div>
            </div>
            <span className="font-mono text-[11px] text-gold font-semibold">
              Click any photo to inspect full size
            </span>
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {allCustomerPhotos.map((photo, pIdx) => (
              <div
                key={pIdx}
                onClick={() => setLightboxPhoto(photo.url)}
                className="group relative h-28 w-32 shrink-0 cursor-pointer overflow-hidden rounded-xs border border-hairline bg-navy-deep transition-all hover:border-gold hover:shadow-md dark:border-white/10"
              >
                <Image
                  src={photo.url}
                  alt={`Inventory photo from ${photo.clientName}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90" />
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="rounded-full bg-black/60 p-1 text-gold">
                    <Eye size={12} />
                  </div>
                </div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <p className="font-mono text-[10px] font-bold text-white truncate">
                    {photo.clientName}
                  </p>
                  <p className="font-mono text-[9px] text-gold/90">
                    {new Date(photo.date).toLocaleDateString("en-CA")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* TAB 4: PRICING CONFIG & SERVICE TIERS */}
      {activeTab === "pricing" && <AdminPricingTiersTab />}

      {/* TAB 5: EXECUTIVE ACTIVITY & AUDIT LOGS */}
      {activeTab === "logs" && (
        <AdminActivityLogsTab
          logs={initialLogs}
          onSelectQuote={(quoteRef) => {
            setSearchQuery(quoteRef);
            setActiveTab("ledger");
          }}
        />
      )}

      {/* Photo Preview Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-md border border-gold/40 bg-navy-deep shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black hover:text-gold"
            >
              <X size={18} />
            </button>
            <div className="relative h-[75vh] w-[85vw] max-w-4xl">
              <Image
                src={lightboxPhoto}
                alt="Client uploaded photo preview"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 bg-[#070c14] px-4 py-2.5">
              <span className="font-mono text-xs text-gold">High-Resolution Client Inventory Attachment</span>
              <a
                href={lightboxPhoto}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-white hover:text-gold underline flex items-center gap-1"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Manual Intake Lead Modal */}
      <ManualLeadModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />
    </div>
  );
}

function CountUpNumber({ target }: { target: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let startTime: number | null = null;
    const duration = 750;
    let reqId: number;
    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * ease));
      if (progress < 1) {
        reqId = requestAnimationFrame(step);
      }
    }
    reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [target]);

  return <span>{target === 0 ? 0 : current}</span>;
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
    <div className="group relative overflow-hidden rounded-card border border-hairline bg-paper-muted p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md dark:border-white/10 dark:bg-[#0c1626] dark:hover:border-gold/50">
      <div className="flex items-center justify-between">
        <p className="font-mono text-2xl font-bold text-navy-deep dark:text-white">
          <CountUpNumber target={value} />
        </p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xs transition-transform duration-300 group-hover:scale-110 ${
            accent
              ? "bg-gold/20 text-gold"
              : "bg-navy-deep/5 text-navy-deep dark:bg-white/10 dark:text-gold"
          }`}
        >
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-1 font-mono text-[11px] text-slate dark:text-gray-400">{label}</p>
    </div>
  );
}