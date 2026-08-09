// src/app/service-area/page.tsx
import type { Metadata } from "next";
import { MapPin, Navigation } from "lucide-react";
import CallToAction from "@/components/CallToAction";
import PageHero from "@/components/PageHero";
import { SERVICE_AREAS, BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Service Area",
  description: `Explore the cities, counties, and regions served by ${BUSINESS.name || "Compass Cartage"}. Professional local and long-distance moving solutions.`,
  openGraph: {
    title: "Service Area | Compass Cartage",
    description: `Based locally and moving families and businesses across ${BUSINESS.serviceAreaShort || "our region"}.`,
    url: "https://www.compasscartage.com/service-area",
  },
};

export default function ServiceAreaPage() {
  // Generate LocalBusiness Schema with dynamic AreaServed targets for Local SEO
  const serviceAreaJsonLd = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Compass Cartage",
    description: "Local and long-distance moving services.",
    areaServed: SERVICE_AREAS.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
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
          lead="Based locally and moving families and businesses across the region. Not seeing your city listed below? Reach out to our team — we regularly accommodate long-distance moves beyond our core zones."
        />

        {/* Cities Grid Section */}
        <section
          aria-label="Cities and Regions Served"
          className="bg-paper flex-1 py-16 md:py-20"
        >
          <div className="section-padding mx-auto max-w-content">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate">
                <Navigation size={14} className="text-gold" aria-hidden="true" />
                <span>Primary Coverage Zones ({SERVICE_AREAS.length})</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_AREAS.map((area) => (
                <div
                  key={area}
                  className="group relative flex items-center gap-3.5 rounded-sm border border-hairline bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-paper text-gold transition-colors duration-200 group-hover:bg-navy-deep group-hover:text-gold">
                    <MapPin size={18} aria-hidden="true" />
                  </div>
                  <span className="text-sm font-semibold text-navy-deep transition-colors duration-200 group-hover:text-navy">
                    {area}
                  </span>
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
