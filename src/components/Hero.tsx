// src/components/Hero.tsx
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-paper">
      <div className="section-padding mx-auto grid max-w-content gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="eyebrow mb-5">{BUSINESS.serviceAreaShort}</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-navy-deep md:text-5xl lg:text-6xl">
            Moving day,
            <br />
            handled with care.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-slate md:text-lg">
            {BUSINESS.tagline}. From a single studio to a full office
            relocation, Compass Cartage gets you there on time and in one
            piece.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="flex items-center justify-center gap-2 rounded-sm bg-navy-deep px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-navy"
            >
              Get a Free Quote
              <ArrowRight size={16} />
            </Link>
            <a
              href={BUSINESS.phoneHref}
              className="flex items-center justify-center gap-2 rounded-sm border border-hairline bg-white px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:border-navy-deep"
            >
              <Phone size={16} className="text-gold" />
              {BUSINESS.phone}
            </a>
          </div>
        </div>

        {/* Visual: dashed route line converging on a waypoint —
            echoes the compass logomark, ties hero to footer motif */}
        <div className="relative hidden aspect-square items-center justify-center md:flex">
          <svg viewBox="0 0 400 400" className="h-full w-full" fill="none">
            <circle cx="200" cy="200" r="170" stroke="#e3e1da" strokeWidth="1" />
            <path
              d="M40 320 C 120 260, 140 140, 200 200 S 320 100, 360 80"
              stroke="#c9a227"
              strokeWidth="2"
              strokeDasharray="2 12"
              strokeLinecap="round"
            />
            <circle cx="200" cy="200" r="7" fill="#0b1f3a" />
            <circle cx="200" cy="200" r="7" fill="none" stroke="#c9a227" strokeWidth="2">
              <animate attributeName="r" values="7;16;7" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="360" cy="80" r="5" fill="#c9a227" />
            <circle cx="40" cy="320" r="5" fill="#0b1f3a" />
          </svg>
        </div>
      </div>
    </section>
  );
}