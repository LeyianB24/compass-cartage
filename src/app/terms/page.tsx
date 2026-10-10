// src/app/terms/page.tsx
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Terms of Service | Compass Cartage",
  description: "Moving agreement terms, quotes, cancellation policies, and liability guidelines for Compass Cartage.",
};

export default function TermsPage() {
  return (
    <main className="relative w-full overflow-hidden -mt-20">
      <PageHero
        image={IMAGES.detailTexture}
        eyebrow="Legal & Terms"
        title="Terms of Service"
        lead="Clear, upfront guidelines covering estimates, scheduling commitments, liability coverage, and move-day policies."
        hideCta
      />

      <section className="relative border-b border-hairline bg-paper py-16 dark:border-white/10 dark:bg-[#070c14] md:py-24">
        <div className="section-padding mx-auto max-w-3xl">
          <p className="text-xs text-slate-light dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate dark:text-gray-300">
            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">Quotes & Pricing</h2>
              <p>
                All quotes provided by {BUSINESS.name} are estimates based on the information provided at the time of
                request. Final pricing is confirmed once move details are verified. Everything is quote-based — there
                are no hidden or surprise fees beyond what is agreed upon in writing before move day.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">Scheduling</h2>
              <p>
                Local and long-distance-within-Alberta moves are scheduled based on availability. Moves outside
                Alberta have no maximum distance but are limited to twice a month (every two weeks) due to logistics.
                Last-minute and same-day moves are accommodated where possible for smaller jobs.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">Cancellations</h2>
              <p>
                We understand plans change. Please notify us as early as possible if you need to reschedule or cancel
                a booked move so we can adjust our schedule accordingly.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">Liability</h2>
              <p>
                {BUSINESS.name} takes care in handling all items during a move. Specific liability terms and coverage
                details will be confirmed in writing as part of your move agreement.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">Prohibited Items</h2>
              <p>
                For safety reasons, we cannot transport hazardous materials (gasoline, propane, fireworks, paint
                thinners), perishable unsealed food, or live animals. Please keep personal documents and valuables
                with you during the move.
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep dark:text-white">Contact</h2>
              <p>
                Questions about these terms can be directed to {BUSINESS.name} at {BUSINESS.email} or {BUSINESS.phone}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}