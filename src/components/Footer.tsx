// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { BUSINESS, SERVICE_AREAS } from "@/lib/constants";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Cost Calculator", href: "/calculator" },
  { label: "Inventory Planner", href: "/inventory" },
  { label: "Moving Checklist", href: "/checklist" },
  { label: "Coverage Map", href: "/service-area" },
  { label: "Moving FAQ", href: "/faq" },
  { label: "Work Gallery", href: "/gallery" },
  { label: "Get a Quote", href: "/quote" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      aria-labelledby="footer-heading"
      className="relative overflow-hidden bg-navy-deep text-paper"
    >
      <h2 id="footer-heading" className="sr-only">
        Site Footer
      </h2>

      {/* Signature route-line motif — draws itself in once scrolled into view */}
      <svg
        className="pointer-events-none absolute -top-6 left-0 h-16 w-full opacity-40"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M0 60 C 200 10, 380 90, 600 40 S 1000 10, 1200 55"
          stroke="#c9a227"
          strokeWidth="1.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <motion.circle
          cx="600"
          cy="40"
          r="4"
          fill="#c9a227"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3, duration: 0.3 }}
        />
      </svg>

      <div className="section-padding mx-auto max-w-content pt-16">
        <div className="grid gap-12 pb-12 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              aria-label={`${BUSINESS?.name || "Compass Cartage"} - Home`}
            >
              <svg
                viewBox="0 0 48 48"
                className="h-8 w-8 shrink-0 transition-transform duration-200 hover:scale-105"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="4"
                  width="40"
                  height="40"
                  rx="9"
                  stroke="#e4c65c"
                  strokeWidth="1.6"
                />
                <path
                  d="M15 30 L24 14 L33 30"
                  stroke="#e4c65c"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M19.5 24 L28.5 24"
                  stroke="#f7f6f2"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-display text-xl font-semibold tracking-tight text-paper">
                {BUSINESS?.name || "Compass Cartage"}
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/70">
              {BUSINESS?.tagline || "Moving services built around you"}. Serving households and businesses across Calgary, Airdrie, Cochrane, and Alberta with moves that show up on time and are handled with care.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <p className="eyebrow mb-4 text-gold-soft">Quick Links</p>
            <ul className="space-y-2.5 text-xs lg:text-sm text-paper/75">
              {QUICK_LINKS.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Planning Column */}
          <div>
            <p className="eyebrow mb-4 text-gold-soft">Tools & Hubs</p>
            <ul className="space-y-2.5 text-xs lg:text-sm text-paper/75">
              {QUICK_LINKS.slice(5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <p className="eyebrow mb-4 text-gold-soft">Contact Us</p>
            <ul className="space-y-3 text-xs lg:text-sm text-paper/75">
              {BUSINESS?.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="shrink-0 text-gold" aria-hidden="true" />
                  <a
                    href={BUSINESS.phoneHref || `tel:${BUSINESS.phone}`}
                    className="transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xs"
                  >
                    {BUSINESS.phone}
                  </a>
                </li>
              )}
              {BUSINESS?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="shrink-0 text-gold" aria-hidden="true" />
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xs"
                  >
                    {BUSINESS.email}
                  </a>
                </li>
              )}
              {BUSINESS?.serviceAreaShort && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  <span>{BUSINESS.serviceAreaShort}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Sub-Footer / Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-paper/10 py-6 text-xs text-paper/60 md:flex-row">
          <p>
            © {currentYear} {BUSINESS?.name || "Compass Cartage"}. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>Site built by</span>
            <a
              href="mailto:technologiesbezalel@gmail.com"
              className="font-medium text-gold-soft transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-xs"
            >
              Bezalel Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}