// src/app/admin/layout.tsx
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-hairline bg-navy-deep">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="9" stroke="#e4c65c" strokeWidth="1.6" />
              <path d="M15 30 L24 14 L33 30" stroke="#e4c65c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M19.5 24 L28.5 24" stroke="#f7f6f2" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div>
              <p className="font-display text-sm font-semibold text-paper leading-none">Compass Cartage</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gold-soft">Admin Dashboard</p>
            </div>
          </Link>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}