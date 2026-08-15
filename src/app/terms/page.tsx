// src/app/terms/page.tsx
import type { Metadata } from "next";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service | Compass Cartage",
};

export default function TermsPage() {
  return (
    <section className="bg-paper">
      <div className="section-padding mx-auto max-w-3xl py-16">
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="font-display text-4xl font-semibold text-navy-deep">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate">Last updated: {new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate">
          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">Quotes & Pricing</h2>
            <p>
              All quotes provided by {BUSINESS.name} are estimates based on the information provided at the time of
              request. Final pricing is confirmed once move details are verified. Everything is quote-based — there
              are no hidden or surprise fees beyond what is agreed upon in writing before move day.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">Scheduling</h2>
            <p>
              Local and long-distance-within-Alberta moves are scheduled based on availability. Moves outside
              Alberta have no maximum distance but are limited to twice a month (every two weeks) due to logistics.
              Last-minute and same-day moves are accommodated where possible for smaller jobs.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">Cancellations</h2>
            <p>
              We understand plans change. Please notify us as early as possible if you need to reschedule or cancel
              a booked move so we can adjust our schedule accordingly.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">Liability</h2>
            <p>
              {BUSINESS.name} takes care in handling all items during a move. Specific liability terms and coverage
              details will be confirmed in writing as part of your move agreement.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">Prohibited Items</h2>
            <p>
              For safety reasons, we cannot transport hazardous materials (gasoline, propane, fireworks, paint
              thinners), perishable unsealed food, or live animals. Please keep personal documents and valuables
              with you during the move.
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-navy-deep">Contact</h2>
            <p>
              Questions about these terms can be directed to {BUSINESS.name} at {BUSINESS.email} or {BUSINESS.phone}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}