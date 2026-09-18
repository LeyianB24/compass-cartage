// src/app/page.tsx
import { Metadata } from "next";
import Hero from "@/components/Hero";
import QuickEstimateSection from "@/components/QuickEstimateSection";
import AboutAuthority from "@/components/AboutAuthority";
import FeaturedServicesMatrix from "@/components/FeaturedServicesMatrix";
import FleetShowcase from "@/components/FleetShowcase";
import InteractiveMoveMap from "@/components/InteractiveMoveMap";
import ProcessTimeline from "@/components/ProcessTimeline";
import StatsCounter from "@/components/StatsCounter";
import Testimonials from "@/components/Testimonials";
import GalleryStrip from "@/components/GalleryStrip";
import CallToAction from "@/components/CallToAction";
import { Navigation } from "lucide-react";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Edmonton's Premier Movers | One Trusted Crew for Every Move",
  description:
    "Professional residential, commercial, and storage moving solutions across Edmonton & Alberta with upfront quotes and zero hidden fees.",
  openGraph: {
    title: "Edmonton's Premier Movers | One Trusted Crew for Every Move",
    description:
      "Professional, reliable residential and commercial moving services across Edmonton and Alberta.",
    type: "website",
  },
};

export default function HomePage() {
  // Generate JSON-LD for MovingCompany / LocalBusiness SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Compass Cartage — Edmonton Premier Movers",
    description: "Professional residential, commercial, and storage moving services.",
    telephone: "+1-587-501-7519",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Edmonton",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    offers: SERVICES.slice(0, 3).map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
    })),
  };

  return (
    <>
      {/* Inject Structured Data for Local Search Rankings */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="relative w-full overflow-hidden">
        {/* 1. Hero Section Clean Presentation */}
        <Hero />

        {/* 2. Quick Move Estimate & Crew Sizing Section (Dedicated Full-Width Edge-to-Edge) */}
        <QuickEstimateSection />

        {/* 3. About Us & Local Authority Section (Light Mode Feature) */}
        <AboutAuthority />

        {/* 3. Featured Services Matrix (Residential, Commercial, Storage) */}
        <FeaturedServicesMatrix />

        {/* 4. Moving Fleet & Equipment Showcase (All Fleets & Lorries) */}
        <FleetShowcase />

        {/* 5. Interactive Route & Google Maps Distance Planner */}
        <section className="relative border-b border-hairline bg-paper py-20 dark:border-white/10 dark:bg-[#070c14] md:py-28">
          <div className="section-padding mx-auto max-w-content">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
                <Navigation size={13} />
                <span>Alberta Route & Coverage Estimator</span>
              </div>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white sm:text-4xl lg:text-5xl">
                Map Your Move: Origin to Destination
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate dark:text-gray-300">
                Plan your route with live Google Maps directions across Edmonton and Alberta. See exact driving distance, travel tiers, and transparent pricing.
              </p>
            </div>

            <InteractiveMoveMap />
          </div>
        </section>

        {/* 6. Interactive Step-by-Step Process Timeline */}
        <ProcessTimeline />

        {/* 5. Company Statistics Counter */}
        <StatsCounter />

        {/* 6. Customer Reviews & Testimonials */}
        <Testimonials />

        {/* 7. Gallery — A Look at Moving Day */}
        <GalleryStrip />

        {/* 8. Call To Action Band */}
        <CallToAction />
      </main>
    </>
  );
}