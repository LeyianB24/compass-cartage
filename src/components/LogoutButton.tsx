// src/components/LogoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-xs border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-red-600 transition-all hover:bg-red-500 hover:text-white disabled:opacity-50 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
      title="Terminate admin session"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <LogOut size={13} />}
      <span>Log Out</span>
    </button>
  );
}