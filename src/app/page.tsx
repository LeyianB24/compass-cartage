// src/app/page.tsx
import { Metadata } from "next";
import Hero from "@/components/Hero";
import AboutAuthority from "@/components/AboutAuthority";
import FeaturedServicesMatrix from "@/components/FeaturedServicesMatrix";
import ProcessTimeline from "@/components/ProcessTimeline";
import StatsCounter from "@/components/StatsCounter";
import Testimonials from "@/components/Testimonials";
import GalleryStrip from "@/components/GalleryStrip";
import CallToAction from "@/components/CallToAction";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Edmonton's Premier Movers | One Trusted Crew for Every Move",
  description:
    "Moving Edmonton & Alberta since 2012. Professional residential, commercial, and storage solutions with upfront, binding quotes and zero hidden fees.",
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
        {/* 1. Hero Section with Interactive Quote Widget */}
        <Hero />

        {/* 2. About Us & Local Authority Section (Light Mode Feature) */}
        <AboutAuthority />

        {/* 3. Featured Services Matrix (Residential, Commercial, Storage) */}
        <FeaturedServicesMatrix />

        {/* 4. Interactive Step-by-Step Process Timeline */}
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