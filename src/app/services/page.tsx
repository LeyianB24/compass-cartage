// src/app/services/page.tsx
import type { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import CallToAction from "@/components/CallToAction";
import PageHero from "@/components/PageHero";
import { SERVICES } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

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
        <PageHero
          image={IMAGES.indoorsWithTools}
          eyebrow="Our Capabilities"
          title="Moving services built around you"
          lead="Whether it's a studio apartment or a full office floor, we scope every job the same way: carefully, transparently, and completely on your schedule."
        />

        {/* Main Services Grid */}
        <section
          aria-label="All Moving Services"
          className="bg-paper flex-1 py-16 md:py-20"
        >
          <div className="section-padding mx-auto max-w-content">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                index={i}
                imageKey={service.imageKey}
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
