// src/app/services/page.tsx
import type { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import CallToAction from "@/components/CallToAction";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Comprehensive moving solutions including local residential moves, long-distance relocations, full-service packing, secure storage, and commercial office moves.",
  openGraph: {
    title: "Moving Services | Compass Cartage",
    description:
      "Whether it's a studio apartment or a full office floor, we scope every job carefully and on your schedule.",
    url: "https://www.compasscartage.com/services",
  },
};

export default function ServicesPage() {
  // Generate ItemList JSON-LD Schema for rich snippet indexing on search engines
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Compass Cartage Moving Services",
    description: "Full range of residential and commercial moving services.",
    itemListElement: SERVICES.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "MovingCompany",
          name: "Compass Cartage",
        },
      },
    })),
  };

  return (
    <>
      {/* Inject ItemList JSON-LD Schema for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />

      <div className="flex flex-col min-h-full">
        {/* Page Hero Header Section */}
        <section
          aria-labelledby="services-page-heading"
          className="border-b border-hairline bg-white relative overflow-hidden"
        >
          {/* Subtle Background Accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-paper/50 to-transparent pointer-events-none" />

          <div className="section-padding mx-auto max-w-content py-16 md:py-24 relative">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3 tracking-wider text-xs font-bold uppercase text-gold">
                Our Capabilities
              </p>
              <h1
                id="services-page-heading"
                className="font-display text-4xl font-semibold tracking-tight text-navy-deep sm:text-5xl"
              >
                Moving services built around you
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate md:text-lg">
                Whether it&apos;s a studio apartment or a full office floor, we
                scope every job the same way: carefully, transparently, and completely on your schedule.
              </p>
            </div>
          </div>
        </section>

        {/* Main Services Grid */}
        <section
          aria-label="All Moving Services"
          className="bg-paper flex-1 py-16 md:py-20"
        >
          <div className="section-padding mx-auto max-w-content">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map((service, i) => (
                <ServiceCard
                  key={service.slug || service.title}
                  title={service.title}
                  description={service.description}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Contextual Call-To-Action */}
        <CallToAction
          heading="Not sure which service fits?"
          subtext="Tell us about your move and we'll build a custom package tailored to your exact timeline and budget."
        />
      </div>
    </>
  );
}