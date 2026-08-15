// src/components/AdminRequestRow.tsx
"use client";

import { useState, useTransition } from "react";
import { Phone, Mail, MapPin, Calendar, Image as ImageIcon, ChevronDown } from "lucide-react";
import { bookMove, updateRequestStatus } from "@/lib/actions";

type Props = {
  request: {
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
};

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

const STATUS_OPTIONS = ["NEW", "CONTACTED", "QUOTED", "BOOKED", "COMPLETED", "DECLINED"];
const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-gold/15 text-gold",
  CONTACTED: "bg-blue-100 text-blue-700",
  QUOTED: "bg-purple-100 text-purple-700",
  BOOKED: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-slate-100 text-slate",
  DECLINED: "bg-red-100 text-red-700",
};

export default function AdminRequestRow({ request }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookDate, setBookDate] = useState(request.moveDate || "");
  const [moveType, setMoveType] = useState<"LOCAL" | "LONG_DISTANCE_ALBERTA" | "OUT_OF_PROVINCE">("LOCAL");
  const [bookError, setBookError] = useState("");

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

  return (
    <div className="rounded-card border border-hairline bg-paper-muted shadow-xs">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-display text-base font-semibold text-navy-deep">{request.name}</span>
            <span className={`rounded-xs px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLORS[request.status]}`}>
              {request.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate">
            {request.pickupAddress} → {request.dropoffAddress} &middot; {request.moveSize || "size not specified"}
          </p>
        </div>
        <span className="shrink-0 text-[11px] text-slate-light">{timeAgo(request.createdAt)}</span>
        <ChevronDown size={18} className={`text-slate transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-hairline p-5">
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div className="flex items-center gap-2 text-navy-deep">
              <Phone size={14} className="text-gold" /> {request.phone}
            </div>
            <div className="flex items-center gap-2 text-navy-deep">
              <Mail size={14} className="text-gold" /> {request.email}
            </div>
            <div className="flex items-center gap-2 text-navy-deep">
              <Calendar size={14} className="text-gold" /> {request.moveDate || "No date given"}
            </div>
            <div className="flex items-center gap-2 text-navy-deep">
              <MapPin size={14} className="text-gold" />
              {request.bookedSlot
                ? `Booked: ${new Date(request.bookedSlot.date).toLocaleDateString("en-CA")} (${request.bookedSlot.moveType.replace(/_/g, " ")})`
                : "Not yet booked"}
            </div>
          </div>

          {request.notes && (
            <p className="mt-4 rounded-xs border border-hairline bg-paper p-3 text-xs text-slate">{request.notes}</p>
          )}

          {request.photoUrls.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-navy-deep">
                <ImageIcon size={14} className="text-gold" /> Photos
              </p>
              <div className="flex flex-wrap gap-2">
                {request.photoUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Uploaded photo ${i + 1}`} className="h-16 w-16 rounded-xs border border-hairline object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-hairline pt-4">
            <label className="text-xs font-medium text-slate">Status:</label>
            <select
              value={request.status}
              disabled={isPending}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-xs border border-hairline bg-paper px-3 py-1.5 text-xs text-navy-deep focus:outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {!request.bookedSlot && (
              <button
                onClick={() => setBookingOpen((v) => !v)}
                className="rounded-xs bg-navy-deep px-3 py-1.5 text-xs font-semibold text-paper hover:bg-navy"
              >
                Book This Move
              </button>
            )}
          </div>

          {bookingOpen && (
            <div className="mt-3 flex flex-wrap items-end gap-3 rounded-xs border border-gold/40 bg-gold/5 p-4">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-navy-deep">Date</label>
                <input
                  type="date"
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  className="rounded-xs border border-hairline bg-paper-muted px-3 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-navy-deep">Type</label>
                <select
                  value={moveType}
                  onChange={(e) => setMoveType(e.target.value as never)}
                  className="rounded-xs border border-hairline bg-paper-muted px-3 py-1.5 text-xs"
                >
                  <option value="LOCAL">Local (Edmonton area)</option>
                  <option value="LONG_DISTANCE_ALBERTA">Long-Distance (Alberta)</option>
                  <option value="OUT_OF_PROVINCE">Out of Province</option>
                </select>
              </div>
              <button
                onClick={handleBook}
                disabled={isPending || !bookDate}
                className="rounded-xs bg-navy-deep px-4 py-1.5 text-xs font-semibold text-paper hover:bg-navy disabled:opacity-50"
              >
                Confirm Booking
              </button>
              {bookError && <p className="w-full text-xs text-red-600">{bookError}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}