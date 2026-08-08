// src/app/about/page.tsx
import type { Metadata } from "next";
import CallToAction from "@/components/CallToAction";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About | Compass Cartage",
  description: "Meet the team behind Compass Cartage.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-hairline bg-white">
        <div className="section-padding mx-auto max-w-content py-16 md:py-20">
          <p className="eyebrow mb-3">About Us</p>
          <h1 className="font-display text-4xl font-semibold text-navy-deep md:text-5xl">
            Moving, done right
          </h1>
        </div>
      </section>

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
                price that doesn&apos;t change on move-in day.
              </p>
            </div>

            <div className="border border-hairline bg-white p-8">
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
      </section>

      <CallToAction />
    </>
  );
}