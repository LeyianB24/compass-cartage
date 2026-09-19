// src/app/admin/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Loader2, Shield, ArrowLeft, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const body = await res.json().catch(() => null);
      setError(body?.error || "Invalid authorization credentials");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      {/* Cinematic Fleet Background Image */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/lorry1.jpeg"
          alt="Compass Cartage Logistics Fleet"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter saturate-[0.85] brightness-[0.75] scale-105"
        />

        {/* Sophisticated Dark Gradient Vignette for Perfect Legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#070c14] via-[#070c14]/85 to-[#070c14]/75"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#070c14]/90 via-transparent to-[#070c14]/90"
        />

        {/* Ambient Warm Gold Glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_35%,rgba(197,168,128,0.18),transparent_70%)]"
        />

        {/* Industrial Precision Grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"
        />
      </div>

      {/* Glassmorphic Dispatch Terminal Card */}
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-card border border-white/20 bg-[#0c1626]/85 p-8 shadow-2xl backdrop-blur-2xl dark:border-white/15 dark:bg-[#070c14]/90 sm:p-10"
        >
          {/* Subtle gold top border highlight */}
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <div className="mb-6 flex flex-col items-center text-center">
            <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-gold/40 bg-gold/15 p-2 text-gold shadow-md">
              <Lock size={24} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
              <Shield size={12} />
              <span>Operational Dispatch Terminal</span>
            </div>

            <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Admin Authentication
            </h1>
            <p className="mt-1 text-xs leading-relaxed text-gray-300">
              Enter authorized master key to access real-time dispatch pipelines, fleet calendar, and customer inquiries.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 flex items-center justify-between text-xs font-semibold text-gray-200"
              >
                <span>Authorization Key</span>
                <span className="font-mono text-[10px] text-gray-400">Restricted Access</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <KeyRound size={15} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="••••••••••••"
                  className="w-full rounded-xs border border-white/20 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 transition-all focus:border-gold focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xs border border-red-500/40 bg-red-500/15 p-3 text-xs text-red-300 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xs bg-gold px-5 py-3.5 text-xs font-bold text-navy-deep shadow-lg transition-all hover:bg-gold-soft hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Verifying Master Credentials...</span>
                </>
              ) : (
                <>
                  <Shield size={15} />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Exit Link */}
          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-gray-400 transition-colors hover:text-gold"
            >
              <ArrowLeft size={12} />
              <span>Return to Public Homepage</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}