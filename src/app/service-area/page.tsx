// src/app/service-area/page.tsx
import type { Metadata } from "next";
import { MapPin, Navigation } from "lucide-react";
import CallToAction from "@/components/CallToAction";
import PageHero from "@/components/PageHero";
import CoverageChecker from "@/components/CoverageChecker";
import { DETAILED_COVERAGE_ZONES, BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Service Area & Coverage Map",
  description: `Explore cities, counties, and postal regions served by ${BUSINESS.name || "Compass Cartage"}. Professional local and long-distance moving solutions.`,
  openGraph: {
    title: "Service Area | Compass Cartage",
    description: `Based locally and moving families and businesses across ${BUSINESS.serviceAreaShort || "our region"}.`,
    url: "https://www.compasscartage.com/service-area",
  },
};

export default function ServiceAreaPage() {
  const serviceAreaJsonLd = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Compass Cartage",
    description: "Local and long-distance moving services.",
    areaServed: DETAILED_COVERAGE_ZONES.map((z) => ({
      "@type": "AdministrativeArea",
      name: z.city,
    })),
  };

  return (
    <>
      {/* Local SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreaJsonLd) }}
      />

      <div className="flex flex-col min-h-full">
        {/* Page Hero Header */}
        <PageHero
          image={IMAGES.truckSunnyDay}
          eyebrow="Coverage Map"
          title={BUSINESS.serviceAreaShort || "Proudly serving our local community"}
          lead="Based in Metro Calgary and relocating families and businesses across Alberta. Enter your city or postal code below to check instant coverage."
        />

        {/* Coverage Checker Widget Section */}
        <section aria-label="Coverage Search" className="bg-paper py-12 border-b border-hairline">
          <div className="section-padding mx-auto max-w-content">
            <CoverageChecker />
          </div>
        </section>

        {/* Cities & Regions Detailed Grid Section */}
        <section
          aria-label="Cities and Regions Served"
          className="bg-paper flex-1 py-16 md:py-20"
        >
          <div className="section-padding mx-auto max-w-content">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate">
                <Navigation size={14} className="text-gold" aria-hidden="true" />
                <span>Primary Coverage Hubs ({DETAILED_COVERAGE_ZONES.length})</span>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {DETAILED_COVERAGE_ZONES.map((zone) => (
                <div
                  key={zone.city}
                  className="group relative flex flex-col justify-between rounded-card border border-hairline bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-gold/60 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-paper text-gold transition-colors duration-200 group-hover:bg-navy-deep group-hover:text-gold">
                          <MapPin size={20} aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-navy-deep">
                            {zone.city}
                          </h3>
                          <p className="text-[11px] text-slate-light">{zone.region}</p>
                        </div>
                      </div>
                      <span className="rounded-xs bg-paper px-2 py-0.5 text-[10px] font-bold text-navy-deep">
                        {zone.travelFeeTier}
                      </span>
                    </div>

                    <p className="mt-4 text-xs text-slate leading-relaxed">
                      {zone.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-hairline pt-3 text-[11px] text-slate-light">
                    <span>Est. Transit: {zone.estTransitTime}</span>
                    <span className="font-semibold text-gold group-hover:underline">Daily Routes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <CallToAction
          heading="Outside these areas?"
          subtext="We regularly take on long-distance jobs and specialty moves beyond our core coverage — just ask."
        />
      </div>
    </>
  );
}

