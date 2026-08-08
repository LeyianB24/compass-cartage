// src/app/services/page.tsx
import type { Metadata } from "next";
import ServiceCard from "@/components/ServiceCard";
import CallToAction from "@/components/CallToAction";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services | Compass Cartage",
  description:
    "Local moves, long-distance relocations, packing, storage, and commercial moving services.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-hairline bg-white">
        <div className="section-padding mx-auto max-w-content py-16 md:py-20">
          <p className="eyebrow mb-3">Services</p>
          <h1 className="font-display text-4xl font-semibold text-navy-deep md:text-5xl">
            Moving services built around you
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate">
            Whether it&apos;s a studio apartment or a full office floor, we
            scope every job the same way: carefully, and on your schedule.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="section-padding mx-auto max-w-content py-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      <CallToAction
        heading="Not sure which service fits?"
        subtext="Tell us about your move and we'll recommend the right option."
      />
    </>
  );
}