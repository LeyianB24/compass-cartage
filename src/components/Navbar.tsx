// src/components/Navbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Package,
  CalendarCheck,
  MapPin,
  Images,
  ArrowLeft,
  ChevronDown,
  Wrench,
  Calculator,
} from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import ThemeToggle from "@/components/ThemeToggle";
import BrandMark from "@/components/BrandMark";
import LogoutButton from "@/components/LogoutButton";

interface NavItem {
  label: string;
  href: string;
}

const PRIMARY_LINKS: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Fleet", href: "/#fleet" },
  { label: "Pricing", href: "/calculator" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const TOOL_LINKS = [
  {
    label: "Inventory Planner",
    href: "/inventory",
    desc: "Calculate cubic volume room-by-room",
    icon: Package,
  },
  {
    label: "Moving Checklist",
    href: "/checklist",
    desc: "Week-by-week timeline & countdown",
    icon: CalendarCheck,
  },
  {
    label: "Coverage Map",
    href: "/service-area",
    desc: "Edmonton & Alberta transit zones",
    icon: MapPin,
  },
  {
    label: "Work Gallery",
    href: "/gallery",
    desc: "Real move-day photos & crew actions",
    icon: Images,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdminRoute = pathname?.startsWith("/admin");
  const isAdminDashboard = pathname === "/admin";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 16);
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  const isToolActive = TOOL_LINKS.some((t) => pathname === t.href);

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
            <BrandMark className="h-10 w-10 shrink-0" />
            <div>
              <span className="font-display text-lg font-semibold leading-none text-navy-deep dark:text-white">
                {BUSINESS?.name || "Compass Cartage"}
              </span>
              {isAdminRoute ? (
                <span className="mt-0.5 block font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                  Admin Dispatch
                </span>
              ) : (
                <span className="hidden sm:block font-mono text-[10px] text-slate-light dark:text-gray-400">
                  Edmonton, AB
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
              {PRIMARY_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative text-xs lg:text-sm transition-colors duration-200 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                      isActive && link.href !== "/#fleet"
                        ? "font-bold text-navy-deep dark:text-gold"
                        : "font-medium text-slate hover:text-navy-deep dark:text-gray-300 dark:hover:text-gold"
                    }`}
                  >
                    {link.label}
                    {isActive && link.href !== "/#fleet" && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gold rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Moving Tools Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setToolsOpen((v) => !v)}
                  aria-expanded={toolsOpen}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1.5 text-xs lg:text-sm font-medium transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    isToolActive
                      ? "font-bold text-navy-deep dark:text-gold"
                      : "text-slate hover:text-navy-deep dark:text-gray-300 dark:hover:text-gold"
                  }`}
                >
                  <span>Moving Tools</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      toolsOpen ? "rotate-180 text-gold" : "text-slate-light dark:text-gray-400"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {toolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-3 w-72 rounded-xs border border-hairline bg-paper p-2 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#0a1320]"
                    >
                      <div className="mb-2 border-b border-hairline px-3 py-1.5 dark:border-white/10">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
                          Self-Serve Relocation Suite
                        </span>
                      </div>
                      <div className="space-y-1">
                        {TOOL_LINKS.map((tool) => {
                          const Icon = tool.icon;
                          const isCurrent = pathname === tool.href;
                          return (
                            <Link
                              key={tool.href}
                              href={tool.href}
                              onClick={() => setToolsOpen(false)}
                              className={`group flex items-start gap-3 rounded-xs p-2.5 transition-all ${
                                isCurrent
                                  ? "bg-gold/15 text-navy-deep dark:bg-gold/20 dark:text-gold"
                                  : "hover:bg-paper-muted dark:hover:bg-white/5"
                              }`}
                            >
                              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xs bg-paper-muted text-gold dark:bg-[#070c14]">
                                <Icon size={15} />
                              </div>
                              <div>
                                <span className="block text-xs font-bold text-navy-deep dark:text-white group-hover:text-gold">
                                  {tool.label}
                                </span>
                                <span className="block text-[11px] text-slate dark:text-gray-400">
                                  {tool.desc}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Desktop Call To Actions & Theme Toggle */}
            <div className="hidden items-center gap-3 lg:gap-4 md:flex">
              {BUSINESS?.phone && (
                <a
                  href={BUSINESS.phoneHref || `tel:${BUSINESS.phone}`}
                  className="flex items-center gap-1.5 text-xs lg:text-sm font-semibold text-navy-deep hover:text-gold dark:text-gray-200 dark:hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xs"
                >
                  <Phone size={14} strokeWidth={2.2} className="text-gold" aria-hidden="true" />
                  <span>{BUSINESS.phone}</span>
                </a>
              )}

              <ThemeToggle />

              <Link
                href="/quote"
                className="btn-shimmer rounded-xs bg-navy-deep px-4 py-2 text-xs lg:text-sm font-bold text-gold-soft shadow-xs transition-all hover:bg-gold hover:text-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
              >
                Get a Free Quote
              </Link>
            </div>

            {/* Mobile Menu Trigger & Theme Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-md text-navy-deep hover:bg-paper-muted dark:text-white dark:hover:bg-[#1e1e1e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
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
            className="max-h-[85vh] overflow-y-auto border-t border-hairline bg-paper dark:border-white/10 dark:bg-[#070c14] md:hidden shadow-2xl"
          >
            <nav className="section-padding flex flex-col gap-1.5 py-5" aria-label="Mobile Navigation">
              {/* Primary Links */}
              {PRIMARY_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex min-h-[44px] items-center px-3 py-2.5 text-base font-medium rounded-xs transition-colors ${
                      isActive
                        ? "font-bold text-gold bg-gold/10"
                        : "text-navy-deep hover:text-gold hover:bg-paper-muted dark:text-gray-200 dark:hover:text-gold dark:hover:bg-white/5"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Collapsible Moving Tools on Mobile */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setMobileToolsOpen((v) => !v)}
                  className="flex min-h-[44px] w-full items-center justify-between px-3 py-2.5 text-base font-medium text-navy-deep hover:text-gold dark:text-gray-200 dark:hover:text-gold"
                  aria-expanded={mobileToolsOpen}
                >
                  <span className="flex items-center gap-2">
                    <Wrench size={16} className="text-gold" />
                    <span>Moving Tools Suite</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      mobileToolsOpen ? "rotate-180 text-gold" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {mobileToolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 space-y-1 border-l-2 border-gold/30 pl-3 py-2"
                    >
                      {TOOL_LINKS.map((tool) => {
                        const Icon = tool.icon;
                        const isCurrent = pathname === tool.href;
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className={`flex min-h-[44px] items-center gap-3 px-2 py-2 text-sm rounded-xs transition-colors ${
                              isCurrent
                                ? "font-bold text-gold bg-gold/10"
                                : "text-slate hover:text-navy-deep dark:text-gray-300 dark:hover:text-gold"
                            }`}
                            onClick={() => setOpen(false)}
                          >
                            <Icon size={16} className="text-gold shrink-0" />
                            <div>
                              <span className="block font-semibold">{tool.label}</span>
                              <span className="block text-[11px] text-slate-light dark:text-gray-400">
                                {tool.desc}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Call & Quote Action Block */}
              <div className="mt-4 border-t border-hairline pt-4 dark:border-white/10 space-y-2.5">
                {BUSINESS?.phone && (
                  <a
                    href={BUSINESS.phoneHref || `tel:${BUSINESS.phone}`}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xs border border-hairline bg-paper-muted py-3 text-sm font-semibold text-navy-deep hover:text-gold dark:border-white/15 dark:bg-[#0f172a] dark:text-gray-200 dark:hover:text-gold"
                    onClick={() => setOpen(false)}
                  >
                    <Phone size={16} className="text-gold" aria-hidden="true" />
                    <span>Call Dispatch: {BUSINESS.phone}</span>
                  </a>
                )}

                <Link
                  href="/quote"
                  className="flex min-h-[44px] w-full items-center justify-center rounded-xs bg-navy-deep py-3 text-center text-sm font-bold text-gold-soft shadow-xs transition-all hover:bg-gold hover:text-navy-deep dark:bg-gold dark:text-navy-deep"
                  onClick={() => setOpen(false)}
                >
                  Get a Free Quote
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}