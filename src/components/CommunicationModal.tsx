// src/components/CommunicationModal.tsx
"use client";

import { useState } from "react";
import { X, Mail, MessageSquare, Copy, Check, ExternalLink, Send, Loader2, AlertCircle } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  request: {
    id: string;
    name: string;
    phone: string;
    email: string;
    pickupAddress: string;
    dropoffAddress: string;
    moveDate: string | null;
    moveSize: string | null;
  } | null;
};

export default function CommunicationModal({ isOpen, onClose, request }: Props) {
  const [templateType, setTemplateType] = useState<"quote" | "confirmation" | "prep">("quote");
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState("");

  if (!isOpen || !request) return null;

  const clientFirstName = request.name.split(" ")[0] || "Valued Client";
  const dateFormatted = request.moveDate
    ? new Date(request.moveDate).toLocaleDateString("en-CA", { dateStyle: "full" })
    : "[Date Pending Confirmation]";

  // Template generation
  let subject = "";
  let body = "";

  if (templateType === "quote") {
    subject = `Compass Cartage Relocation Quote Estimate — ${request.name}`;
    body = `Hi ${clientFirstName},\n\nThank you for reaching out to Compass Cartage. We have reviewed the specifications for your upcoming relocation (${request.moveSize || "Residential Move"}) from ${request.pickupAddress} to ${request.dropoffAddress}.\n\nOur single-crew continuous relocation rate includes:\n• Dedicated professional moving technicians\n• Fully equipped 24ft/26ft air-ride commercial moving truck\n• High-density quilted furniture pads, neoprene floor runners & door jamb shielding\n• Comprehensive commercial cargo transit insurance\n\nTo lock in your preferred moving date (${dateFormatted}) with a binding price guarantee, please reply directly to this email or call us at ${BUSINESS.phone}.\n\nWarm regards,\nDispatch Operations | Compass Cartage\n${BUSINESS.phone} • ${BUSINESS.email}`;
  } else if (templateType === "confirmation") {
    subject = `Confirmed: Compass Cartage Move Booking — ${dateFormatted}`;
    body = `Hi ${clientFirstName},\n\nWe are pleased to confirm that your move has been locked into the Compass Cartage active dispatch ledger for ${dateFormatted}.\n\nBooking Overview:\n• Origin: ${request.pickupAddress}\n• Destination: ${request.dropoffAddress}\n• Scope: ${request.moveSize || "Standard Move"}\n• Assigned: Dedicated Single Crew\n\nOur lead mover will contact you 24 hours prior to arrival to confirm parking arrangements and final logistics.\n\nIf you have any questions prior to moving day, don't hesitate to reach us at ${BUSINESS.phone}.\n\nWarm regards,\nCompass Cartage Operations Team`;
  } else {
    subject = `Moving Day Preparation & Packing Guidelines — Compass Cartage`;
    body = `Hi ${clientFirstName},\n\nTo ensure moving day on ${dateFormatted} goes as smoothly and quickly as possible, here is our quick pre-move checklist:\n\n1. Electronics & Cables: Unplug and label power cables and pack remotes together.\n2. Fragile / High-Value Items: Set aside personal documents, jewelry, and medications.\n3. Clear Pathways: Ensure hallways and driveways are clear of snow, ice, or obstacles.\n4. Keys & Access: Confirm elevator booking or parking permits with building management if applicable.\n\nWe look forward to taking care of your move!\n\nBest regards,\nCompass Cartage Team\n${BUSINESS.phone}`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendDirect = async () => {
    if (!request) return;
    setIsSending(true);
    setSendError("");
    setSendSuccess(false);

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: request.email,
          subject,
          body,
          quoteRequestId: request.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to send email");
      }

      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 6000);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const mailtoUrl = `mailto:${encodeURIComponent(request.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const smsUrl = `sms:${encodeURIComponent(request.phone)}?body=${encodeURIComponent(body)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-card border border-hairline bg-paper-muted shadow-2xl dark:border-white/10 dark:bg-[#0f172a]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline bg-navy-deep px-6 py-4 text-white dark:border-white/10 dark:bg-[#070c14]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xs bg-gold/15 text-gold">
              <Mail size={18} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white sm:text-lg">
                Client Communication Desk
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-wider text-gold">
                {request.name} &middot; {request.email}
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

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Template Selectors */}
          <div className="flex flex-wrap gap-2 border-b border-hairline pb-4 dark:border-white/10">
            <button
              type="button"
              onClick={() => setTemplateType("quote")}
              className={`rounded-xs px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                templateType === "quote"
                  ? "bg-navy-deep text-gold-soft font-bold dark:bg-gold dark:text-navy-deep"
                  : "bg-paper text-slate hover:bg-paper-muted hover:text-navy-deep dark:bg-[#070c14] dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              1. Quote Estimate
            </button>

            <button
              type="button"
              onClick={() => setTemplateType("confirmation")}
              className={`rounded-xs px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                templateType === "confirmation"
                  ? "bg-navy-deep text-gold-soft font-bold dark:bg-gold dark:text-navy-deep"
                  : "bg-paper text-slate hover:bg-paper-muted hover:text-navy-deep dark:bg-[#070c14] dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              2. Booking Confirmed
            </button>

            <button
              type="button"
              onClick={() => setTemplateType("prep")}
              className={`rounded-xs px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                templateType === "prep"
                  ? "bg-navy-deep text-gold-soft font-bold dark:bg-gold dark:text-navy-deep"
                  : "bg-paper text-slate hover:bg-paper-muted hover:text-navy-deep dark:bg-[#070c14] dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              3. Moving Day Prep
            </button>
          </div>

          {/* Subject display */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 mb-1">
              Subject Line
            </label>
            <div className="rounded-xs border border-hairline bg-paper px-3.5 py-2 text-xs font-semibold text-navy-deep dark:border-white/10 dark:bg-[#070c14] dark:text-white">
              {subject}
            </div>
          </div>

          {/* Message Preview */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 mb-1">
              Message Content
            </label>
            <textarea
              readOnly
              rows={8}
              value={body}
              className="w-full rounded-xs border border-hairline bg-paper p-3 font-mono text-xs leading-relaxed text-slate focus:outline-none dark:border-white/10 dark:bg-[#070c14] dark:text-gray-300 select-all"
            />
          </div>

          {/* Feedback alerts */}
          {sendSuccess && (
            <div className="flex items-center gap-2 rounded-xs border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <Check size={16} />
              <span>Email delivered directly to {request.email} via Resend!</span>
            </div>
          )}

          {sendError && (
            <div className="flex items-center gap-2 rounded-xs border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
              <AlertCircle size={16} />
              <span>{sendError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-hairline dark:border-white/10">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xs border border-hairline bg-paper px-4 py-2 text-xs font-semibold text-navy-deep hover:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white dark:hover:border-gold"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? "Copied to Clipboard!" : "Copy Text"}</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {request.phone && (
                <a
                  href={smsUrl}
                  className="inline-flex items-center gap-1.5 rounded-xs border border-hairline bg-paper px-3.5 py-2 text-xs font-semibold text-navy-deep hover:border-gold dark:border-white/15 dark:bg-[#070c14] dark:text-white"
                >
                  <MessageSquare size={14} className="text-gold" />
                  <span>SMS</span>
                </a>
              )}

              <a
                href={mailtoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xs border border-hairline bg-paper px-3 py-2 text-xs font-semibold text-slate hover:text-navy-deep dark:border-white/15 dark:bg-[#070c14] dark:text-gray-300 dark:hover:text-white"
                title="Open client's default email program"
              >
                <span>Email Client</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>

              <button
                type="button"
                onClick={handleSendDirect}
                disabled={isSending}
                className="btn-shimmer inline-flex items-center gap-1.5 rounded-xs bg-navy-deep px-5 py-2 text-xs font-bold text-gold-soft shadow-md transition-all hover:bg-gold hover:text-navy-deep disabled:opacity-60 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
              >
                {isSending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send via Resend</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
