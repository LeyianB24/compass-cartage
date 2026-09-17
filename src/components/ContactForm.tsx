// src/components/ContactForm.tsx
"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      // Send as a general inquiry
      const res = await fetch("/api/quote", {
        method: "POST",
        body: (() => {
          const fd = new FormData();
          fd.append("name", formData.name);
          fd.append("email", formData.email);
          fd.append("phone", formData.phone || "Not provided");
          fd.append("pickupAddress", "Contact Desk Inquiry");
          fd.append("dropoffAddress", formData.subject);
          fd.append("moveDate", "General Inquiry");
          fd.append("moveSize", formData.subject);
          fd.append("notes", `[Subject: ${formData.subject}]\n\n${formData.message}`);
          return fd;
        })(),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit inquiry.");
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Unable to send your inquiry at this moment. Please call or email us directly!");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-card border border-emerald-500/30 bg-emerald-500/10 p-8 text-center backdrop-blur dark:bg-emerald-950/30">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="font-display mt-4 text-2xl font-bold text-navy-deep dark:text-white">
          Message Received!
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate dark:text-gray-300">
          Thank you, {formData.name.split(" ")[0]}. Howard and the Compass Cartage team will get back to you shortly.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
              setStatus("idle");
            }}
            className="rounded-xs border border-hairline bg-paper px-4 py-2 text-xs font-semibold text-navy-deep hover:border-gold dark:border-white/10 dark:bg-[#070c14] dark:text-white"
          >
            Send Another Message
          </button>
          <a
            href={BUSINESS.phoneHref}
            className="rounded-xs bg-gold px-4 py-2 text-xs font-bold text-navy-deep transition-all hover:bg-gold-soft"
          >
            Call Dispatch: {BUSINESS.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div className="flex items-center gap-2.5 rounded-xs border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 mb-1.5">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Sarah Jenkins"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2.5 text-sm text-navy-deep placeholder:text-slate-light/60 focus:border-gold focus:outline-none dark:border-white/10 dark:bg-[#070c14] dark:text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="sarah@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2.5 text-sm text-navy-deep placeholder:text-slate-light/60 focus:border-gold focus:outline-none dark:border-white/10 dark:bg-[#070c14] dark:text-white"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="(587) 501-7519"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2.5 text-sm text-navy-deep placeholder:text-slate-light/60 focus:border-gold focus:outline-none dark:border-white/10 dark:bg-[#070c14] dark:text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 mb-1.5">
            Inquiry Topic
          </label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full rounded-xs border border-hairline bg-paper px-3.5 py-2.5 text-sm text-navy-deep focus:border-gold focus:outline-none dark:border-white/10 dark:bg-[#070c14] dark:text-white"
          >
            <option value="General Inquiry">General Question</option>
            <option value="Existing Booking Update">Existing Move or Booking Question</option>
            <option value="Commercial Partnership">Commercial Logistics / Corporate Move</option>
            <option value="Specialty Freight / Heavy Item">Specialty Freight or Heavy Appliance</option>
            <option value="Feedback / Review">Feedback or Customer Review</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-light dark:text-gray-400 mb-1.5">
          How can we help? *
        </label>
        <textarea
          required
          rows={5}
          placeholder="Tell us about your dates, questions, or how we can assist..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full rounded-xs border border-hairline bg-paper p-3 text-sm leading-relaxed text-navy-deep placeholder:text-slate-light/60 focus:border-gold focus:outline-none dark:border-white/10 dark:bg-[#070c14] dark:text-white"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-slate-light dark:text-gray-400">
          Need a complete price estimate? Use our{" "}
          <a href="/quote" className="font-semibold text-gold underline">
            Free Quote Form
          </a>{" "}
          for binding rates.
        </p>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-shimmer flex items-center justify-center gap-2 rounded-xs bg-navy-deep px-6 py-3 text-xs font-bold text-gold-soft shadow-md transition-all hover:bg-gold hover:text-navy-deep disabled:opacity-60 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
        >
          {status === "submitting" ? (
            <span>Sending...</span>
          ) : (
            <>
              <span>Send Message</span>
              <Send size={14} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
