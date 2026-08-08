// src/components/Footer.tsx
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { BUSINESS, SERVICE_AREAS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-deep text-paper">
      {/* Signature route-line motif — a dashed path with a waypoint,
          echoing the logo's compass mark. One deliberate flourish. */}
      <svg
        className="pointer-events-none absolute -top-6 left-0 h-16 w-full opacity-40"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 60 C 200 10, 380 90, 600 40 S 1000 10, 1200 55"
          stroke="#c9a227"
          strokeWidth="1.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
        <circle cx="600" cy="40" r="4" fill="#c9a227" />
      </svg>

      <div className="section-padding mx-auto max-w-content pt-16">
        <div className="grid gap-12 pb-12 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none">
                <rect x="4" y="4" width="40" height="40" rx="9" stroke="#e4c65c" strokeWidth="1.6" />
                <path
                  d="M15 30 L24 14 L33 30"
                  stroke="#e4c65c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path d="M19.5 24 L28.5 24" stroke="#f7f6f2" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="font-display text-lg font-semibold">{BUSINESS.name}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
              {BUSINESS.tagline}. Serving households and businesses across the
              region with moves that show up on time and handled with care.
            </p>
          </div>

          {/* Contact column */}
          <div>
            <p className="eyebrow mb-4 text-gold-soft">Contact</p>
            <ul className="space-y-3 text-sm text-paper/75">
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-gold" />
                <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-gold" />
                <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-gold" />
                {BUSINESS.serviceAreaShort}
              </li>
            </ul>
          </div>

          {/* Areas column */}
          <div>
            <p className="eyebrow mb-4 text-gold-soft">Service Area</p>
            <ul className="space-y-2 text-sm text-paper/75">
              {SERVICE_AREAS.slice(0, 5).map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-paper/10 py-6 text-xs text-paper/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <p>
            Site by{" "}
            <a
              href="mailto:technologiesbezalel@gmail.com"
              className="text-gold-soft hover:text-gold"
            >
              Bezalel Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}