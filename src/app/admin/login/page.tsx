// src/app/admin/login/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

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
      setError(body?.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-paper px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-hairline bg-paper-muted p-8 shadow-xs rounded-card">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-deep/5">
            <Lock size={20} className="text-navy-deep" />
          </div>
          <h1 className="mt-4 font-display text-xl font-semibold text-navy-deep">Admin Access</h1>
          <p className="mt-1 text-sm text-slate">Compass Cartage dashboard</p>
        </div>

        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy-deep">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-xs border border-hairline bg-paper px-4 py-2.5 text-sm text-navy-deep focus:border-gold focus:bg-paper-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-sm bg-navy-deep px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-navy disabled:opacity-60"
        >
          {loading ? "Checking..." : "Log In"}
        </button>
      </form>
    </div>
  );
}