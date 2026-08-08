// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Service Area", href: "/service-area" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 16);
  });

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/95 backdrop-blur">
      <motion.div
        animate={{
          height: scrolled ? 68 : 80,
          boxShadow: scrolled
            ? "0 4px 20px -8px rgba(7,20,38,0.12)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="section-padding mx-auto flex max-w-content items-center justify-between"
      >
        {/* Logo mark */}
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
            <rect x="4" y="4" width="40" height="40" rx="9" stroke="#0b1f3a" strokeWidth="2" />
            <path
              d="M15 30 L24 14 L33 30"
              stroke="#c9a227"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path d="M19.5 24 L28.5 24" stroke="#0b1f3a" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span className="font-display text-lg font-semibold leading-none text-navy-deep">
            {BUSINESS.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-slate transition-colors hover:text-navy-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={BUSINESS.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-navy-deep"
          >
            <Phone size={16} strokeWidth={2} className="text-gold" />
            {BUSINESS.phone}
          </a>
          <Link
            href="/quote"
            className="rounded-sm bg-navy-deep px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-navy"
          >
            Get a Free Quote
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.div>

      {/* Mobile menu panel */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden border-t border-hairline bg-paper md:hidden"
        >
          <nav className="section-padding flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-base font-medium text-navy-deep"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={BUSINESS.phoneHref}
              className="flex items-center gap-2 py-3 text-base font-medium text-navy-deep"
            >
              <Phone size={16} className="text-gold" />
              {BUSINESS.phone}
            </a>
            <Link
              href="/quote"
              className="mt-2 rounded-sm bg-navy-deep px-5 py-3 text-center text-sm font-semibold text-paper"
              onClick={() => setOpen(false)}
            >
              Get a Free Quote
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
}