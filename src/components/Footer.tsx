// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import BrandMark from "@/components/BrandMark";

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
      className="relative overflow-hidden bg-[#071426] dark:bg-[#030914] text-[#f7f6f2] border-t border-[#c9a227]/20"
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
              <BrandMark className="h-9 w-9" />
              <span className="font-display text-lg font-semibold tracking-tight text-[#f7f6f2]">
                {BUSINESS?.name || "Compass Cartage"}
              </span>
            </Link>

            <p className="mt-3 text-xs leading-relaxed text-[#f7f6f2]/80 md:text-sm">
              {BUSINESS?.tagline || "Fast • Reliable • Affordable"}. Fully licensed and insured
              relocation services across Edmonton and Alberta.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[#e4c65c]">
              <span className="rounded-xs border border-[#c9a227]/30 bg-[#c9a227]/10 px-2 py-0.5">
                100% Insured
              </span>
              <span className="rounded-xs border border-[#c9a227]/30 bg-[#c9a227]/10 px-2 py-0.5">
                Upfront Pricing
              </span>
              <span className="rounded-xs border border-[#c9a227]/30 bg-[#c9a227]/10 px-2 py-0.5">
                WCB Alberta Certified
              </span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <p className="eyebrow mb-4 text-[#e4c65c]">Navigation</p>
            <ul className="space-y-2.5 text-xs lg:text-sm text-[#f7f6f2]/80">
              {QUICK_LINKS.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block transition-colors duration-200 hover:text-[#e4c65c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Planning Column */}
          <div>
            <p className="eyebrow mb-4 text-[#e4c65c]">Tools & Hubs</p>
            <ul className="space-y-2.5 text-xs lg:text-sm text-[#f7f6f2]/80">
              {QUICK_LINKS.slice(5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block transition-colors duration-200 hover:text-[#e4c65c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xs"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <p className="eyebrow mb-4 text-[#e4c65c]">Contact Us</p>
            <ul className="space-y-3 text-xs lg:text-sm text-[#f7f6f2]/80">
              {BUSINESS?.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="shrink-0 text-[#c9a227]" aria-hidden="true" />
                  <a
                    href={BUSINESS.phoneHref || `tel:${BUSINESS.phone}`}
                    className="transition-colors duration-200 hover:text-[#e4c65c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xs"
                  >
                    {BUSINESS.phone}
                  </a>
                </li>
              )}
              {BUSINESS?.email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="shrink-0 text-[#c9a227]" aria-hidden="true" />
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="transition-colors duration-200 hover:text-[#e4c65c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xs"
                  >
                    {BUSINESS.email}
                  </a>
                </li>
              )}
              {BUSINESS?.serviceAreaShort && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-[#c9a227]" aria-hidden="true" />
                  <span>{BUSINESS.serviceAreaShort}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Sub-Footer / Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-[#f7f6f2]/10 py-6 text-xs text-[#f7f6f2]/60 md:flex-row">
          <p>
            © {currentYear} {BUSINESS?.name || "Compass Cartage"}. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>Site built by</span>
            <a
              href="https://www.bezalel.website/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#e4c65c] transition-colors duration-200 hover:text-[#c9a227] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-xs"
            >
              Bezalel Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}