// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Phone, Calculator, Package, CalendarCheck, HelpCircle, Images } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Calculator", href: "/calculator", icon: Calculator },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Checklist", href: "/checklist", icon: CalendarCheck },
  { label: "Coverage", href: "/service-area" },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "Gallery", href: "/gallery", icon: Images },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 16);
  });

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/95 backdrop-blur-md">
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
        {/* Logo Mark */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep focus-visible:ring-offset-2"
          onClick={() => setOpen(false)}
          aria-label={`${BUSINESS?.name || "Compass Cartage"} Home`}
        >
          <svg
            viewBox="0 0 48 48"
            className="h-9 w-9 shrink-0 transition-transform duration-200 hover:scale-105"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="4"
              y="4"
              width="40"
              height="40"
              rx="9"
              stroke="#0b1f3a"
              strokeWidth="2"
            />
            <path
              d="M15 30 L24 14 L33 30"
              stroke="#c9a227"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M19.5 24 L28.5 24"
              stroke="#0b1f3a"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display text-lg font-semibold leading-none text-navy-deep">
            {BUSINESS?.name || "Compass Cartage"}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-5 lg:gap-6 lg:flex" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs lg:text-sm transition-colors duration-200 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep ${
                  isActive
                    ? "font-semibold text-navy-deep"
                    : "font-medium text-slate hover:text-navy-deep"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Call To Actions & Theme Toggle */}
        <div className="hidden items-center gap-4 md:flex">
          {BUSINESS?.phone && (
            <a
              href={BUSINESS.phoneHref || `tel:${BUSINESS.phone}`}
              className="flex items-center gap-1.5 text-xs lg:text-sm font-medium text-navy-deep transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep rounded-xs"
            >
              <Phone size={15} strokeWidth={2} className="text-gold" aria-hidden="true" />
              <span>{BUSINESS.phone}</span>
            </a>
          )}

          <ThemeToggle />

          <Link
            href="/quote"
            className="rounded-sm bg-navy-deep px-4 py-2 text-xs lg:text-sm font-semibold text-paper shadow-xs transition-colors hover:bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep focus-visible:ring-offset-2"
          >
            Get a Free Quote
          </Link>
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-md p-2 text-navy-deep transition-colors hover:bg-paper-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </motion.div>

      {/* Animated Mobile Menu Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-hairline bg-paper md:hidden"
          >
            <nav className="section-padding flex flex-col gap-1 py-4" aria-label="Mobile Navigation">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between py-2.5 text-base transition-colors ${
                      isActive
                        ? "font-semibold text-gold"
                        : "font-medium text-navy-deep hover:text-gold"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span>{link.label}</span>
                    {link.icon && <link.icon size={16} className="text-slate-light" />}
                  </Link>
                );
              })}

              {BUSINESS?.phone && (
                <a
                  href={BUSINESS.phoneHref || `tel:${BUSINESS.phone}`}
                  className="flex items-center gap-2 py-3 text-base font-medium text-navy-deep hover:text-gold"
                  onClick={() => setOpen(false)}
                >
                  <Phone size={16} className="text-gold" aria-hidden="true" />
                  {BUSINESS.phone}
                </a>
              )}

              <Link
                href="/quote"
                className="mt-3 rounded-sm bg-navy-deep px-5 py-3 text-center text-sm font-semibold text-paper shadow-xs transition-colors hover:bg-navy"
                onClick={() => setOpen(false)}
              >
                Get a Free Quote
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}