// src/components/AdminRequestRow.tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Image as ImageIcon,
  ChevronDown,
  Trash2,
  XCircle,
  MessageSquare,
  Edit3,
  Check,
  Loader2,
  Maximize2,
  X,
  Truck,
  Navigation,
  Tag,
  Copy,
} from "lucide-react";
import { bookMove, updateRequestStatus, deleteQuoteRequest, cancelBooking, updateRequestNotes } from "@/lib/actions";
import CommunicationModal from "./CommunicationModal";

type Props = {
  request: {
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
};

function getRecommendedVehicle(moveSize: string | null) {
  const size = (moveSize || "").toLowerCase();
  if (size.includes("3") || size.includes("4") || size.includes("commercial") || size.includes("large") || size.includes("5")) {
    return {
      title: "Unit 101 - 26ft Freightliner Heavy Box Truck",
      image: "/images/lorry1.jpeg",
      desc: "Hydraulic Tailgate Lift • 1,800 cu ft Capacity",
      capacityTag: "Multi-Bedroom / Heavy Haul",
    };
  }
  if (size.includes("2") || size.includes("townhouse")) {
    return {
      title: "Unit 102 - 20ft City Cargo Moving Truck",
      image: "/images/lorry2.jpeg",
      desc: "Low-Deck Loading Ramp • 1,350 cu ft Capacity",
      capacityTag: "2-3 Bedroom Residence",
    };
  }
  if (size.includes("long") || size.includes("alberta") || size.includes("province")) {
    return {
      title: "Unit 104 - Tri-Axle Enclosed Cargo Transporter",
      image: "/images/hero 3.jpg",
      desc: "Weather-Sealed • 2,200 cu ft Combined",
      capacityTag: "Intercity Highway Haul",
    };
  }
  return {
    title: "Unit 103 - High-Roof Ford Transit Cargo Van",
    image: "/images/transit-van-side-loaded.jpeg",
    desc: "Padded Furniture Bay • Walk-In High Clearance",
    capacityTag: "Studio / 1-Bedroom / Condo",
  };
}

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const STATUS_OPTIONS = ["NEW", "CONTACTED", "QUOTED", "BOOKED", "COMPLETED", "DECLINED"] as const;
const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-gold/15 text-gold border-gold/40",
  CONTACTED: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
  QUOTED: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400",
  BOOKED: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  COMPLETED: "bg-slate-500/15 text-slate border-slate-500/30 dark:text-slate-300",
  DECLINED: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
};

export default function AdminRequestRow({ request }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Modals & sub-states
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookDate, setBookDate] = useState(request.moveDate || "");
  const [moveType, setMoveType] = useState<"LOCAL" | "LONG_DISTANCE_ALBERTA" | "OUT_OF_PROVINCE">("LOCAL");
  const [bookError, setBookError] = useState("");

  const [copiedNum, setCopiedNum] = useState(false);

  const quoteDisplayNumber = request.quoteNumber || `CC-${request.id.slice(-4).toUpperCase()}`;

  const [commOpen, setCommOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  // Notes editing state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteContent, setNoteContent] = useState(request.notes || "");

  function handleStatusChange(newStatus: string) {
    startTransition(() => {
      updateRequestStatus(request.id, newStatus as never);
    });
  }

  function handleBook() {
    setBookError("");
    startTransition(async () => {
      const result = await bookMove(request.id, moveType, bookDate);
      if (!result.success) {
        setBookError(result.error);
      } else {
        setBookingOpen(false);
      }
    });
  }

  function handleCancelBooking() {
    if (!window.confirm("Cancel this booked slot and return status to Quoted?")) return;
    startTransition(async () => {
      await cancelBooking(request.id);
    });
  }

  function handleDelete() {
    if (!window.confirm(`Permanently remove lead for ${request.name}? This action cannot be undone.`)) return;
    startTransition(async () => {
      await deleteQuoteRequest(request.id);
    });
  }

  function handleSaveNotes() {
    startTransition(async () => {
      await updateRequestNotes(request.id, noteContent);
      setIsEditingNotes(false);
    });
  }

  return (
    <>
      <div className="group rounded-card border border-hairline bg-paper-muted shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:shadow-md dark:border-white/10 dark:bg-[#0c1626] dark:hover:border-gold/70">
        {/* Row Header Bar */}
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div
            onClick={() => setExpanded((v) => !v)}
            className="flex-1 cursor-pointer"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Official Quote Number Badge */}
              <div className="flex items-center gap-1">
                <span className="rounded-xs border border-gold/40 bg-gold/15 px-2 py-0.5 font-mono text-xs font-bold text-gold">
                  #{quoteDisplayNumber}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(quoteDisplayNumber);
                    setCopiedNum(true);
                    setTimeout(() => setCopiedNum(false), 2000);
                  }}
                  className="p-0.5 text-slate hover:text-gold dark:text-gray-400"
                  title="Copy Quote Number"
                >
                  {copiedNum ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
              </div>

              <span className="font-display text-base font-bold text-navy-deep dark:text-white">
                {request.name}
              </span>
              <span
                className={`rounded-xs border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${STATUS_COLORS[request.status]}`}
              >
                {request.status}
              </span>
              {request.photoUrls.length > 0 && (
                <div
                  className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5"
                  title={`${request.photoUrls.length} customer inventory photos uploaded`}
                >
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {request.photoUrls.slice(0, 2).map((url, pIdx) => (
                      <div
                        key={pIdx}
                        className="relative h-4 w-4 rounded-full border border-gold overflow-hidden bg-navy-deep shrink-0"
                      >
                        <Image src={url} alt="Inventory item" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="font-mono text-[9px] font-bold text-gold">
                    {request.photoUrls.length} {request.photoUrls.length === 1 ? "photo" : "photos"}
                  </span>
                </div>
              )}
              {request.bookedSlot && (
                <span className="rounded-xs border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Booked: {new Date(request.bookedSlot.date).toLocaleDateString("en-CA")} ({request.bookedSlot.moveType})
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-slate dark:text-gray-300">
              <span className="truncate max-w-md">
                {request.pickupAddress} → {request.dropoffAddress}
              </span>
              <span className="text-gold font-semibold">&middot; {request.moveSize || "Size not specified"}</span>
              {request.distanceKm != null && request.distanceKm > 0 && (
                <span className="inline-flex items-center gap-1 text-slate-light dark:text-gray-400">
                  <Navigation size={11} className="text-gold" />
                  ~{request.distanceKm} km
                  {request.distanceFee != null && request.distanceFee > 0 && ` (+$${request.distanceFee} travel)`}
                </span>
              )}
              {request.pricingTier && (
                <span className="inline-flex items-center gap-1 rounded-xs bg-gold/15 px-1.5 py-0.5 text-[10px] font-bold text-gold">
                  <Tag size={10} />
                  {request.pricingTier}
                  {request.estimatedPrice != null && ` · $${request.estimatedPrice.toLocaleString()}`}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
            <span className="font-mono text-[11px] text-slate-light dark:text-gray-400">
              {timeAgo(request.createdAt)}
            </span>

            {/* Quick Action Shortcuts */}
            <button
              onClick={() => setCommOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xs border border-hairline bg-paper px-2.5 py-1.5 font-mono text-[11px] font-semibold text-navy-deep hover:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:hover:border-gold"
              title="Open client communication desk"
            >
              <MessageSquare size={13} className="text-gold" />
              <span>Contact</span>
            </button>

            <button
              onClick={() => setExpanded((v) => !v)}
              className="rounded-xs p-1 text-slate hover:text-navy-deep dark:text-gray-400 dark:hover:text-white"
              aria-label="Toggle details"
            >
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${expanded ? "rotate-180 text-gold" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Expanded Ledger Details */}
        {expanded && (
          <div className="border-t border-hairline p-5 bg-paper/30 dark:border-white/10 dark:bg-[#070c14]/40 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="rounded-xs border border-hairline bg-paper p-3 dark:border-white/10 dark:bg-[#070c14]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 block mb-1">
                  Phone Number
                </span>
                <a
                  href={`tel:${request.phone}`}
                  className="flex items-center gap-1.5 font-semibold text-navy-deep hover:text-gold dark:text-white"
                >
                  <Phone size={13} className="text-gold shrink-0" /> {request.phone}
                </a>
              </div>

              <div className="rounded-xs border border-hairline bg-paper p-3 dark:border-white/10 dark:bg-[#070c14]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 block mb-1">
                  Email Address
                </span>
                <a
                  href={`mailto:${request.email}`}
                  className="flex items-center gap-1.5 font-semibold text-navy-deep hover:text-gold dark:text-white truncate"
                >
                  <Mail size={13} className="text-gold shrink-0" /> {request.email}
                </a>
              </div>

              <div className="rounded-xs border border-hairline bg-paper p-3 dark:border-white/10 dark:bg-[#070c14]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 block mb-1">
                  Preferred Move Date
                </span>
                <div className="flex items-center gap-1.5 font-semibold text-navy-deep dark:text-white">
                  <Calendar size={13} className="text-gold shrink-0" />{" "}
                  {request.moveDate || "Flexible / Not Given"}
                </div>
              </div>

              <div className="rounded-xs border border-hairline bg-paper p-3 dark:border-white/10 dark:bg-[#070c14]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 block mb-1">
                  Inventory Scope
                </span>
                <div className="flex items-center gap-1.5 font-semibold text-navy-deep dark:text-white">
                  <Truck size={13} className="text-gold shrink-0" /> {request.moveSize || "Standard Move"}
                </div>
              </div>
            </div>

            {/* Origin and Destination Card */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xs border border-hairline bg-paper p-3 dark:border-white/10 dark:bg-[#070c14]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold block mb-1">
                  Origin (Pickup Address)
                </span>
                <div className="flex items-start gap-1.5 text-slate dark:text-gray-200">
                  <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                  <span>{request.pickupAddress}</span>
                </div>
              </div>

              <div className="rounded-xs border border-hairline bg-paper p-3 dark:border-white/10 dark:bg-[#070c14]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold block mb-1">
                  Destination (Dropoff Address)
                </span>
                <div className="flex items-start gap-1.5 text-slate dark:text-gray-200">
                  <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                  <span>{request.dropoffAddress}</span>
                </div>
              </div>
            </div>

            {/* Distance & Tier Pricing Card */}
            <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
              <div className="flex items-center justify-between mb-3 border-b border-hairline pb-2 dark:border-white/10">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-navy-deep dark:text-white flex items-center gap-1.5">
                  <Navigation size={13} className="text-gold" />
                  Route Distance & Tier Pricing Estimate
                </span>
                {request.pricingTier && (
                  <span className="rounded-xs bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-bold text-gold">
                    Tier: {request.pricingTier}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-light dark:text-gray-400 block">Road Distance</span>
                  <span className="font-bold text-navy-deep dark:text-white">
                    {request.distanceKm != null ? `~${request.distanceKm} km` : "Not calculated"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-light dark:text-gray-400 block">Travel Mileage Fee</span>
                  <span className="font-bold text-gold">
                    {request.distanceFee != null ? `$${request.distanceFee.toLocaleString()} CAD` : "$0 CAD (Included)"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-light dark:text-gray-400 block">Package Tier</span>
                  <span className="font-bold text-navy-deep dark:text-white">
                    {request.pricingTier || "Standard Full-Service"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-light dark:text-gray-400 block">Total Est. Quote</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {request.estimatedPrice != null ? `$${request.estimatedPrice.toLocaleString()} CAD` : "Quote Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Dispatch Vehicle with Truck Image */}
            {(() => {
              const rec = getRecommendedVehicle(request.moveSize);
              return (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xs border border-hairline bg-navy-deep shadow-xs">
                    <Image
                      src={rec.image}
                      alt={rec.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-1 left-1 rounded-xs bg-black/75 px-1.5 py-0.5 font-mono text-[8px] font-bold text-gold">
                      MATCHED FLEET
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                        Dispatch Vehicle Recommendation
                      </span>
                      <span className="rounded-xs bg-navy-deep/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-navy-deep dark:bg-white/10 dark:text-gray-200">
                        {rec.capacityTag}
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-navy-deep dark:text-white mt-0.5">
                      {rec.title}
                    </h4>
                    <p className="font-mono text-xs text-slate dark:text-gray-400 mt-0.5">
                      {rec.desc} &middot; Matched from customer scope: <span className="text-gold font-semibold">{request.moveSize || "Standard"}</span>
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Notes Section with In-place Editing */}
            <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-navy-deep dark:text-white">
                  Dispatch & Customer Notes
                </span>
                {!isEditingNotes ? (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-gold hover:underline"
                  >
                    <Edit3 size={12} /> Edit Notes
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveNotes}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 rounded-xs bg-gold px-2 py-0.5 font-mono text-[10px] font-bold text-navy-deep hover:bg-gold-soft"
                    >
                      <Check size={11} /> Save
                    </button>
                    <button
                      onClick={() => setIsEditingNotes(false)}
                      className="font-mono text-[10px] text-slate hover:text-navy-deep dark:text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {isEditingNotes ? (
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full rounded-xs border border-hairline bg-paper-muted p-2.5 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#0f172a] dark:text-white"
                />
              ) : (
                <p className="text-xs text-slate dark:text-gray-300 leading-relaxed">
                  {request.notes || "No special instructions recorded."}
                </p>
              )}
            </div>

            {/* Photo Attachments Lightbox Gallery */}
            {request.photoUrls.length > 0 && (
              <div className="rounded-xs border border-hairline bg-paper p-4 dark:border-white/10 dark:bg-[#070c14]">
                <div className="mb-3 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-navy-deep dark:text-white">
                    <ImageIcon size={14} className="text-gold" /> Uploaded Inventory Photos ({request.photoUrls.length})
                  </p>
                  <span className="font-mono text-[10px] text-slate dark:text-gray-400">
                    Click any photo to zoom
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
                  {request.photoUrls.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setPreviewPhoto(url)}
                      className="group relative h-24 w-full cursor-pointer overflow-hidden rounded-xs border border-hairline bg-navy-deep shadow-2xs transition-all hover:border-gold"
                    >
                      <Image
                        src={url}
                        alt={`Photo ${i + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 size={16} className="text-white" />
                      </div>
                      <div className="absolute bottom-1 right-1 rounded-xs bg-black/70 px-1 font-mono text-[8px] text-gold">
                        #{i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="font-mono text-xs font-bold text-slate dark:text-gray-300">Status:</label>
                  <select
                    value={request.status}
                    disabled={isPending}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="rounded-xs border border-hairline bg-paper px-3 py-1.5 font-mono text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {!request.bookedSlot ? (
                  <button
                    onClick={() => setBookingOpen((v) => !v)}
                    className="rounded-xs bg-navy-deep px-3.5 py-1.5 font-mono text-xs font-bold text-gold-soft shadow-xs hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
                  >
                    Schedule & Book Move
                  </button>
                ) : (
                  <button
                    onClick={handleCancelBooking}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 rounded-xs border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-red-600 hover:bg-red-500 hover:text-white dark:border-red-500/40 dark:text-red-400"
                  >
                    <XCircle size={13} />
                    <span>Cancel Booked Slot</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 rounded-xs border border-hairline bg-paper px-3 py-1.5 font-mono text-xs font-semibold text-slate hover:border-red-500/50 hover:text-red-600 dark:border-white/15 dark:bg-[#070c14] dark:text-gray-400 dark:hover:text-red-400"
                  title="Permanently remove lead"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Booking Drawer Form */}
            {bookingOpen && (
              <div className="rounded-xs border border-gold/40 bg-gold/5 p-4 space-y-3 dark:bg-[#0f172a]">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-navy-deep dark:text-white block">
                  Assign Slot & Book Fleet
                </span>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block font-mono text-[11px] font-medium text-navy-deep dark:text-gray-200">
                      Confirmed Move Date *
                    </label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full rounded-xs border border-hairline bg-paper px-3 py-1.5 text-xs dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block font-mono text-[11px] font-medium text-navy-deep dark:text-gray-200">
                      Move Route Classification *
                    </label>
                    <select
                      value={moveType}
                      onChange={(e) => setMoveType(e.target.value as never)}
                      className="w-full rounded-xs border border-hairline bg-paper px-3 py-1.5 text-xs dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                    >
                      <option value="LOCAL">Local (Edmonton Metropolitan Area)</option>
                      <option value="LONG_DISTANCE_ALBERTA">Long-Distance (Alberta Provincial)</option>
                      <option value="OUT_OF_PROVINCE">Out of Province (Max 2 slots / month)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setBookingOpen(false)}
                    className="rounded-xs border border-hairline bg-paper px-3 py-1.5 font-mono text-xs text-slate hover:text-navy-deep dark:border-white/15 dark:bg-[#070c14] dark:text-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBook}
                    disabled={isPending || !bookDate}
                    className="flex items-center gap-1.5 rounded-xs bg-navy-deep px-4 py-1.5 font-mono text-xs font-bold text-gold-soft hover:bg-gold hover:text-navy-deep disabled:opacity-50 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
                  >
                    {isPending ? <Loader2 size={13} className="animate-spin" /> : null}
                    <span>Lock in Slot</span>
                  </button>
                </div>
                {bookError && (
                  <p className="w-full font-mono text-xs text-red-600 dark:text-red-400 mt-2">
                    {bookError}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Communication Modal */}
      <CommunicationModal
        isOpen={commOpen}
        onClose={() => setCommOpen(false)}
        request={request}
      />

      {/* Enhanced Photo Lightbox Modal */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-md border border-gold/40 bg-navy-deep shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black hover:text-gold"
            >
              <X size={18} />
            </button>
            <div className="relative h-[75vh] w-[85vw] max-w-4xl bg-black/40 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewPhoto}
                alt="Client uploaded photo preview"
                className="max-h-full max-w-full object-contain rounded-xs"
              />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 bg-[#070c14] px-4 py-3">
              <span className="font-mono text-xs text-gold font-semibold">
                Client Inventory Media Attachment &middot; {request.name}
              </span>
              <a
                href={previewPhoto}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-white hover:text-gold underline flex items-center gap-1"
              >
                Open original in new tab ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}