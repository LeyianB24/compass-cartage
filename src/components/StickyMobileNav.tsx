// src/components/StickyMobileNav.tsx
"use client";

import Link from "next/link";
import { Phone, Calculator } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function StickyMobileNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-paper-muted/95 px-4 py-2.5 backdrop-blur-lg shadow-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#181818]/95 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        {/* Call Now Action */}
        <a
          href={BUSINESS.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-hairline bg-paper py-2.5 text-xs font-bold text-navy-deep transition-all hover:bg-gold-soft/20 dark:border-white/15 dark:bg-[#222222] dark:text-white dark:hover:border-[#00a3e0]/50"
        >
          <Phone size={15} className="text-navy dark:text-[#00a3e0]" />
          <span>Call {BUSINESS.phone}</span>
        </a>

        {/* Instant Quote Action */}
        <Link
          href="/quote"
          className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-navy py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-navy-deep dark:bg-[#00a3e0] dark:text-[#092634] dark:shadow-[0_0_15px_rgba(0,163,224,0.4)] dark:hover:bg-[#38bdf8]"
        >
          <Calculator size={15} />
          <span>Get Free Quote</span>
        </Link>
      </div>
    </div>
  );
}
