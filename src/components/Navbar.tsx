// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Calculator,
  Package,
  CalendarCheck,
  HelpCircle,
  Images,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import ThemeToggle from "@/components/ThemeToggle";
import BrandMark from "@/components/BrandMark";
import LogoutButton from "@/components/LogoutButton";

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

  const isAdminRoute = pathname?.startsWith("/admin");
  const isAdminDashboard = pathname === "/admin";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 16);
  });

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/95 backdrop-blur-md dark:border-white/10 dark:bg-[#070c14]/95">
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
        {/* Logo Mark & Admin Status Pill */}
        <div className="flex items-center gap-3">
          <Link
            href={isAdminRoute ? "/admin" : "/"}
            className="flex items-center gap-3 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            onClick={() => setOpen(false)}
            aria-label={`${BUSINESS?.name || "Compass Cartage"} Home`}
          >
            <BrandMark className="h-10 w-10" />
            <div>
              <span className="font-display text-lg font-semibold leading-none text-navy-deep dark:text-white">
                {BUSINESS?.name || "Compass Cartage"}
              </span>
              {isAdminRoute && (
                <span className="mt-0.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                  Dispatch Ledger Terminal
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* ADMIN MODE NAVBAR CONTROLS */}
        {isAdminRoute ? (
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xs border border-hairline bg-paper-muted px-3.5 py-1.5 font-mono text-xs font-semibold text-slate transition-all hover:border-gold hover:text-navy-deep dark:border-white/15 dark:bg-[#0f172a] dark:text-gray-300 dark:hover:border-gold dark:hover:text-white"
            >
              <ArrowLeft size={13} />
              <span>Public Site</span>
            </Link>

            <ThemeToggle />

            {isAdminDashboard && (
              <div className="hidden sm:block">
                <LogoutButton />
              </div>
            )}
          </div>
        ) : (
          /* REGULAR PUBLIC NAVBAR CONTROLS */
          <>
            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-5 lg:gap-6 lg:flex" aria-label="Main Navigation">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-xs lg:text-sm transition-colors duration-200 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      isActive
                        ? "font-bold text-navy-deep dark:text-gold"
                        : "font-medium text-slate hover:text-navy-deep dark:text-gray-300 dark:hover:text-gold"
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
                  className="flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-navy-deep hover:text-gold dark:text-gray-200 dark:hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xs"
                >
                  <Phone size={15} strokeWidth={2} className="text-gold" aria-hidden="true" />
                  <span>{BUSINESS.phone}</span>
                </a>
              )}

              <ThemeToggle />

              <Link
                href="/quote"
                className="rounded-xs bg-navy-deep px-4 py-2 text-xs lg:text-sm font-bold text-gold-soft shadow-xs transition-all hover:bg-gold hover:text-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
              >
                Scope Your Move
              </Link>
            </div>

            {/* Mobile Menu Trigger & Theme Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="rounded-md p-2 text-navy-deep hover:bg-paper-muted dark:text-white dark:hover:bg-[#1e1e1e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Animated Mobile Menu Panel for Public Routes */}
      <AnimatePresence>
        {open && !isAdminRoute && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-hairline bg-paper dark:border-white/10 dark:bg-[#070c14] md:hidden"
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
                        ? "font-bold text-gold"
                        : "font-medium text-navy-deep hover:text-gold dark:text-gray-200 dark:hover:text-gold"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span>{link.label}</span>
                    {link.icon && <link.icon size={16} className="text-slate-light dark:text-gray-400" />}
                  </Link>
                );
              })}

              {BUSINESS?.phone && (
                <a
                  href={BUSINESS.phoneHref || `tel:${BUSINESS.phone}`}
                  className="flex items-center gap-2 py-3 text-base font-medium text-navy-deep hover:text-gold dark:text-gray-200 dark:hover:text-gold"
                  onClick={() => setOpen(false)}
                >
                  <Phone size={16} className="text-gold" aria-hidden="true" />
                  {BUSINESS.phone}
                </a>
              )}

              <Link
                href="/quote"
                className="mt-3 rounded-xs bg-navy-deep px-5 py-3 text-center text-sm font-bold text-gold-soft shadow-xs transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep"
                onClick={() => setOpen(false)}
              >
                Scope Your Move Online
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}