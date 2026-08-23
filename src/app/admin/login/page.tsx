// src/app/admin/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Shield } from "lucide-react";

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
    <div className="flex min-h-[75vh] items-center justify-center bg-paper px-6 py-12 dark:bg-[#070c14]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card border border-hairline bg-paper-muted p-8 shadow-xl dark:border-white/10 dark:bg-[#0f172a]"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xs bg-gold/15 text-gold mb-2">
            <Lock size={22} />
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
            Dispatch Terminal
          </span>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy-deep dark:text-white">
            Admin Authentication
          </h1>
          <p className="mt-1 text-xs text-slate dark:text-gray-400">
            Enter master key to access the dispatch ledger
          </p>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-navy-deep dark:text-gray-200">
            Authorization Key
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            placeholder="••••••••••••"
            className="w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-sm text-navy-deep focus:border-gold focus:outline-none dark:border-white/15 dark:bg-[#070c14] dark:text-white"
          />
        </div>

        {error && (
          <div className="mt-3 rounded-xs border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xs bg-navy-deep px-5 py-3 text-xs font-bold text-gold-soft shadow-md transition-all hover:bg-gold hover:text-navy-deep disabled:opacity-60 dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Verifying Key...</span>
            </>
          ) : (
            <>
              <Shield size={14} />
              <span>Authenticate Session</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}