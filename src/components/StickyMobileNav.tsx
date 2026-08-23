// src/components/StickyMobileNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Calculator } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function StickyMobileNav() {
  const pathname = usePathname();

  // Hide sticky dock on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-paper-muted/95 px-4 py-2.5 backdrop-blur-lg shadow-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#070c14]/95 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        {/* Call Now Action */}
        <a
          href={BUSINESS.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-xs border border-hairline bg-paper py-2.5 text-xs font-bold text-navy-deep transition-all hover:bg-gold/10 dark:border-white/15 dark:bg-[#0f172a] dark:text-white dark:hover:border-gold"
        >
          <Phone size={14} className="text-gold" />
          <span>Call Dispatch</span>
        </a>

        {/* Instant Quote Action */}
        <Link
          href="/quote"
          className="flex flex-1 items-center justify-center gap-2 rounded-xs bg-navy-deep py-2.5 text-xs font-bold text-gold-soft shadow-md transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
        >
          <Calculator size={14} />
          <span>Scope Move</span>
        </Link>
      </div>
    </div>
  );
}
