// src/components/QuoteForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg("Something went wrong sending your request. Please try again or call us directly.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center border border-hairline bg-white px-8 py-16 text-center">
        <CheckCircle2 size={40} className="text-gold" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-navy-deep">
          Quote request sent
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate">
          Thanks for reaching out — we&apos;ll get back to you shortly with a
          free quote.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-hairline bg-white p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" name="name" required />
        <Field label="Phone Number" name="phone" type="tel" required />
        <Field label="Email" name="email" type="email" required className="sm:col-span-2" />
        <Field label="Moving From" name="pickupAddress" required />
        <Field label="Moving To" name="dropoffAddress" required />
        <Field label="Preferred Move Date" name="moveDate" type="date" />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy-deep">
            Home / Move Size
          </label>
          <select
            name="moveSize"
            className="w-full border border-hairline bg-paper px-4 py-2.5 text-sm text-navy-deep focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            <option value="">Select size</option>
            <option value="studio">Studio</option>
            <option value="1-bedroom">1 Bedroom</option>
            <option value="2-bedroom">2 Bedroom</option>
            <option value="3-bedroom">3+ Bedroom</option>
            <option value="office">Office / Commercial</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-navy-deep">
            Additional Notes
          </label>
          <textarea
            name="notes"
            rows={4}
            placeholder="Anything we should know — stairs, elevator access, fragile items, etc."
            className="w-full border border-hairline bg-paper px-4 py-2.5 text-sm text-navy-deep placeholder:text-slate-light focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-navy-deep px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-navy disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        {status === "submitting" ? "Sending..." : "Request My Free Quote"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-navy-deep">
        {label}
        {required && <span className="text-gold"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full border border-hairline bg-paper px-4 py-2.5 text-sm text-navy-deep focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      />
    </div>
  );
}