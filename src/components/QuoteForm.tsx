// src/components/QuoteForm.tsx
"use client";

import { useState, FormEvent, useId, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, Sparkles, ImagePlus, X } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

function QuoteFormContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const moveSizeParam = searchParams.get("moveSize") || "";
  const estMin = searchParams.get("estMin");
  const estMax = searchParams.get("estMax");
  const inventoryParam = searchParams.get("inventory");
  const cuFtParam = searchParams.get("cuFt");

  const [userSelectedSize, setUserSelectedSize] = useState<string | null>(null);
  const selectedSize = userSelectedSize ?? moveSizeParam;

  const notesDefault = (() => {
    const notesParts: string[] = [];
    if (estMin && estMax) notesParts.push(`[Calculator Estimate: $${estMin} - $${estMax}]`);
    if (inventoryParam) notesParts.push(`[Inventory (${cuFtParam || "0"} cu ft): ${inventoryParam}]`);
    return notesParts.join("\n");
  })();

  const MAX_PHOTOS = 5;
  const MAX_SIZE_MB = 8;

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024);
    setPhotos((prev) => [...prev, ...valid].slice(0, MAX_PHOTOS));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    // Remove the raw file input's default entries, attach our controlled photos array instead
    formData.delete("photos");
    photos.forEach((file) => formData.append("photos", file));

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        body: formData, // no Content-Type header — browser sets the multipart boundary
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Request failed");
      }

      setStatus("success");
      form.reset();
      setPhotos([]);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error && err.message !== "Request failed"
          ? err.message
          : "Something went wrong sending your request. Please try again or call us directly."
      );
    }
  }

  function handleReset() {
    setStatus("idle");
    setErrorMsg("");
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center border border-hairline bg-paper-muted px-8 py-16 text-center shadow-xs rounded-card"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
          <CheckCircle2 size={36} className="text-gold" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold text-navy-deep">
          Quote request sent
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate">
          Thanks for reaching out — we&apos;ll review your move details and get
          back to you shortly with a free quote.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-8 flex items-center gap-2 rounded-sm border border-hairline bg-paper px-5 py-2.5 text-xs font-semibold text-navy-deep transition-colors hover:bg-paper-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep"
        >
          <RefreshCw size={14} className="text-slate" />
          Submit Another Request
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-hairline bg-paper-muted p-6 md:p-8 shadow-xs rounded-card" noValidate>
      {(estMin || inventoryParam) && (
        <div className="mb-6 rounded-sm border border-gold/40 bg-gold/5 p-4 flex items-center gap-3 text-xs text-navy-deep">
          <Sparkles size={18} className="text-gold shrink-0" />
          <div>
            <p className="font-semibold">Calculated Details Pre-Loaded!</p>
            <p className="text-slate text-[11px]">
              Your estimate and inventory selections have been automatically attached to your request notes below.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" name="name" required placeholder="John Doe" />
        <Field label="Phone Number" name="phone" type="tel" required placeholder="(555) 000-0000" />
        <Field label="Email" name="email" type="email" required className="sm:col-span-2" placeholder="john@example.com" />
        <Field label="Moving From" name="pickupAddress" required placeholder="City, ZIP, or address" />
        <Field label="Moving To" name="dropoffAddress" required placeholder="City, ZIP, or address" />
        <Field label="Preferred Move Date" name="moveDate" type="date" />

        <div>
          <label htmlFor="moveSize" className="mb-1.5 block text-sm font-medium text-navy-deep">
            Home / Move Size
          </label>
          <select
            id="moveSize"
            name="moveSize"
            value={selectedSize}
            onChange={(e) => setUserSelectedSize(e.target.value)}
            className="w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-sm text-navy-deep transition-colors focus:border-gold focus:bg-paper-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <option value="">Select size</option>
            <option value="studio">Studio</option>
            <option value="1-bedroom">1 Bedroom</option>
            <option value="2-bedroom">2 Bedroom</option>
            <option value="3-bedroom">3 Bedroom</option>
            <option value="4-plus-bedroom">4+ Bedroom House</option>
            <option value="office-small">Small Office</option>
            <option value="office-large">Office / Commercial</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-navy-deep">
            Additional Notes & Inventory
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            defaultValue={notesDefault}
            placeholder="Anything we should know — stairs, elevator access, fragile items, preferred times, etc."
            className="w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-sm text-navy-deep placeholder:text-slate-light transition-colors focus:border-gold focus:bg-paper-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </div>

        {/* Photo upload */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-navy-deep">
            Photos of Items or Space (optional)
          </label>
          <p className="mb-3 text-xs text-slate-light">
            Up to {MAX_PHOTOS} photos, {MAX_SIZE_MB}MB each — helps us give a more accurate quote.
          </p>

          <div className="flex flex-wrap gap-3">
            {photos.map((file, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-xs border border-hairline">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload preview ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-deep/80 text-white"
                  aria-label="Remove photo"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {photos.length < MAX_PHOTOS && (
              <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xs border border-dashed border-hairline bg-paper text-slate-light transition-colors hover:border-gold hover:text-gold">
                <ImagePlus size={20} />
                <span className="text-[10px]">Add photo</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="photos"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-xs bg-red-50 p-3 text-sm text-red-700 border border-red-200"
          >
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-navy-deep px-7 py-3.5 text-sm font-semibold text-paper shadow-xs transition-colors hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {status === "submitting" ? "Sending..." : "Request My Free Quote"}
      </button>
    </form>
  );
}

export default function QuoteForm() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate">Loading quote form...</div>}>
      <QuoteFormContent />
    </Suspense>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

function Field({ label, name, type = "text", required = false, className = "", placeholder = "" }: FieldProps) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy-deep">
        {label}
        {required && <span className="text-gold" aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-sm text-navy-deep placeholder:text-slate-light transition-colors focus:border-gold focus:bg-paper-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      />
    </div>
  );
}