// src/app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import CallToAction from "@/components/CallToAction";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "About | Compass Cartage",
  description: "Meet the team behind Compass Cartage.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={IMAGES.smilingMover}
        eyebrow="About Us"
        title="Moving, done right"
        lead="A locally owned crew built on showing up, handling every item with care, and quoting a price that holds."
      />
      <section className="bg-paper">
        <div className="section-padding mx-auto max-w-content py-16">
          <div className="grid gap-12 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="font-display text-2xl font-semibold text-navy-deep">
                {/* Placeholder — replace with Howard's real story once he sends details */}
                Built on reliability, one move at a time
              </h2>
              <p className="mt-4 leading-relaxed text-slate">
                {BUSINESS.name} was founded by {BUSINESS.owner} on a simple
                idea: moving day is stressful enough without wondering if
                your movers will show up, handle your things with care, or
                charge you what they quoted. We built our business around
                fixing exactly that.
              </p>
              <p className="mt-4 leading-relaxed text-slate">
                Every job — big or small, local or long-distance — gets the
                same standard: clear communication, careful handling, and a
                price that doesn't change on move-in day.
              </p>
            </div>

            {/* Framed photo + the "why choose us" card stacked, so the
                story side gets a real visual instead of text-only. */}
            <div className="grid gap-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm ring-1 ring-hairline">
                <Image
                  src={IMAGES.moversWorking.src}
                  alt={IMAGES.moversWorking.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="border border-hairline bg-paper-muted p-8">
                <p className="eyebrow mb-4">Why Customers Choose Us</p>
                <ul className="space-y-4 text-sm text-slate">
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    Transparent, flat-rate pricing with no hidden fees
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    Fully insured moves for total peace of mind
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    Experienced crew trained in careful handling
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    Flexible scheduling, including short-notice moves
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}