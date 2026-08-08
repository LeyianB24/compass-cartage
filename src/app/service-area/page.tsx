// src/app/service-area/page.tsx
import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import CallToAction from "@/components/CallToAction";
import { SERVICE_AREAS, BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Service Area | Compass Cartage",
  description: "See the cities and regions Compass Cartage proudly serves.",
};

export default function ServiceAreaPage() {
  return (
    <>
      <section className="border-b border-hairline bg-white">
        <div className="section-padding mx-auto max-w-content py-16 md:py-20">
          <p className="eyebrow mb-3">Service Area</p>
          <h1 className="font-display text-4xl font-semibold text-navy-deep md:text-5xl">
            {BUSINESS.serviceAreaShort}
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate">
            Based locally and moving families and businesses across the
            region. Not seeing your city listed? Reach out — we may still be
            able to help with long-distance moves.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="section-padding mx-auto max-w-content py-16">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_AREAS.map((area) => (
              <div
                key={area}
                className="flex items-center gap-3 border border-hairline bg-white px-5 py-4"
              >
                <MapPin size={16} className="shrink-0 text-gold" />
                <span className="text-sm font-medium text-navy-deep">
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction
        heading="Outside these areas?"
        subtext="We regularly take on long-distance jobs beyond our core coverage — just ask."
      />
    </>
  );
}