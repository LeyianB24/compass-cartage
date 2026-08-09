// src/app/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import StatsCounter from "@/components/StatsCounter";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Trusted Moving Services | One Crew for Every Move",
  description:
    "Professional, reliable residential and commercial moving services. Get a stress-free move with our experienced team.",
  openGraph: {
    title: "Trusted Moving Services | One Crew for Every Move",
    description:
      "Professional, reliable residential and commercial moving services.",
    type: "website",
  },
};

export default function HomePage() {
  // Generate JSON-LD for MovingCompany / LocalBusiness SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    name: "Your Moving Company Name",
    description: "Professional residential and commercial moving services.",
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
        {/* Hero Section */}
        <Hero />

        {/* Services Preview Section */}
        <section
          aria-labelledby="services-heading"
          className="bg-paper relative border-y border-navy-deep/5 py-16 md:py-24"
        >
          <div className="section-padding mx-auto max-w-content">
            {/* Header Flex Container */}
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow mb-3 tracking-wider text-xs font-bold uppercase text-gold">
                  What We Do
                </p>
                <h2
                  id="services-heading"
                  className="font-display text-3xl font-semibold tracking-tight text-navy-deep sm:text-4xl"
                >
                  Every kind of move, one trusted crew
                </h2>
              </div>

              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-navy-deep transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-sm"
              >
                <span>View all services</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

            {/* Services Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 3).map((service, i) => (
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

        {/* Stats Counter Section */}
        <section aria-label="Company Statistics">
          <StatsCounter />
        </section>

        {/* Testimonials Section */}
        <section aria-label="Customer Reviews">
          <Testimonials />
        </section>

        {/* Call To Action Section */}
        <CallToAction />
      </main>
    </>
  );
}