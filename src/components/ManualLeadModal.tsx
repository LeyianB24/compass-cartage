// src/components/ManualLeadModal.tsx
"use client";

import { useState, useTransition } from "react";
import { X, PhoneCall, Plus, Loader2, Calendar, MapPin, User, Mail } from "lucide-react";
import { createManualQuoteRequest } from "@/lib/actions";
import { MOVE_SIZES } from "@/lib/constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ManualLeadModal({ isOpen, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pickupAddress: "",
    dropoffAddress: "",
    moveDate: "",
    moveSize: "2 Bedroom Home",
    notes: "",
    status: "NEW" as "NEW" | "CONTACTED" | "QUOTED" | "BOOKED",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.phone || !formData.pickupAddress || !formData.dropoffAddress) {
      setError("Please complete all required fields (Name, Phone, Pickup & Dropoff addresses).");
      return;
    }

    startTransition(async () => {
      const res = await createManualQuoteRequest(formData);
      if (!res.success) {
        setError(res.error);
      } else {
        // Reset and close
        setFormData({
          name: "",
          phone: "",
          email: "",
          pickupAddress: "",
          dropoffAddress: "",
          moveDate: "",
          moveSize: "2 Bedroom Home",
          notes: "",
          status: "NEW",
        });
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-card border border-hairline bg-paper-muted shadow-2xl dark:border-white/10 dark:bg-[#0f172a]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-hairline bg-navy-deep px-6 py-4 text-white dark:border-white/10 dark:bg-[#070c14]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xs bg-gold/15 text-gold">
              <PhoneCall size={18} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white sm:text-lg">
                Log Phone / Direct Inquiry
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-gold">
                Manual Lead Dispatch Intake
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xs p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="rounded-xs border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200 mb-1">
                Client Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2 pl-9 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                />
                <User size={14} className="absolute left-3 top-2.5 text-slate-light dark:text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="(780) 555-0199"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2 pl-9 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                />
                <PhoneCall size={14} className="absolute left-3 top-2.5 text-slate-light dark:text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="client@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2 pl-9 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                />
                <Mail size={14} className="absolute left-3 top-2.5 text-slate-light dark:text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200 mb-1">
                Preferred Move Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.moveDate}
                  onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                  className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2 pl-9 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                />
                <Calendar size={14} className="absolute left-3 top-2.5 text-slate-light dark:text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200 mb-1">
                Pickup Origin Address *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. 10450 82 Ave NW, Edmonton, AB"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2 pl-9 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                />
                <MapPin size={14} className="absolute left-3 top-2.5 text-slate-light dark:text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200 mb-1">
                Dropoff Destination Address *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Albert / Sherwood Park / Calgary"
                  value={formData.dropoffAddress}
                  onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
                  className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2 pl-9 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                />
                <MapPin size={14} className="absolute left-3 top-2.5 text-slate-light dark:text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200 mb-1">
                Move Size / Inventory Scale
              </label>
              <select
                value={formData.moveSize}
                onChange={(e) => setFormData({ ...formData, moveSize: e.target.value })}
                className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
              >
                {MOVE_SIZES.map((s) => (
                  <option key={s.id} value={s.label}>
                    {s.label} (~{s.estVolumeCuFt} cu ft)
                  </option>
                ))}
                <option value="Commercial Office Relocation">Commercial Office Relocation</option>
                <option value="Single Specialty Item (Piano/Safe)">Single Specialty Item (Piano/Safe)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200 mb-1">
                Initial Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as never })}
                className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
              >
                <option value="NEW">NEW (Unprocessed)</option>
                <option value="CONTACTED">CONTACTED (Spoke with client)</option>
                <option value="QUOTED">QUOTED (Estimate provided)</option>
                <option value="BOOKED">BOOKED (Deposit confirmed)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy-deep dark:text-gray-200 mb-1">
              Internal Dispatch Notes / Access Details
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Client mentioned 3rd-floor walkup, narrow alleyway, requested 3-man crew at 9 AM..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-xs border border-hairline bg-paper p-3 text-xs text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xs border border-hairline bg-paper px-4 py-2 text-xs font-semibold text-slate hover:text-navy-deep dark:border-white/15 dark:bg-[#070c14] dark:text-gray-400 dark:hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-xs bg-navy-deep px-5 py-2 text-xs font-bold text-gold-soft shadow-md transition-all hover:bg-gold hover:text-navy-deep disabled:opacity-60 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Logging Lead...</span>
                </>
              ) : (
                <>
                  <Plus size={14} />
                  <span>Save to Ledger</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
