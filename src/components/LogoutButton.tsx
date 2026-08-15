// src/components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-xs border border-paper/20 px-3 py-1.5 text-xs font-medium text-paper/80 transition-colors hover:border-paper/40 hover:text-paper"
    >
      <LogOut size={13} />
      Log Out
    </button>
  );
}