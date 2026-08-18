// src/app/quote/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import QuoteForm from "@/components/QuoteForm";
import PageHero from "@/components/PageHero";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";
import { Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Get a Free Quote | Compass Cartage",
  description: "Request a free, no-obligation moving quote from Compass Cartage.",
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        image={IMAGES.moversWorking}
        eyebrow="Get a Free Quote"
        title="Let's plan your move"
        lead="Fill out the form below and we'll follow up with a free, no-obligation quote — usually within one business day."
      >
        {/* Right-aligned contact aside inside the hero */}
        <div className="space-y-3 border-t border-paper/15 pt-6">
          <a
            href={BUSINESS.phoneHref}
            className="flex items-center gap-3 text-sm font-medium text-paper hover:text-gold-soft"
          >
            <Phone size={16} className="text-gold-soft" />
            {BUSINESS.phone}
          </a>
          <a
            href={`mailto:${BUSINESS.email}`}
            className="flex items-center gap-3 text-sm font-medium text-paper hover:text-gold-soft"
          >
            <Mail size={16} className="text-gold-soft" />
            {BUSINESS.email}
          </a>
        </div>
      </PageHero>

      <section className="bg-paper">
        <div className="section-padding mx-auto max-w-content py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
            {/* Aside: a framed photo + reassurance copy beside the form,
                so the left column stays useful instead of empty. */}
            <aside className="md:pt-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-hairline">
                <Image
                  src={IMAGES.detailTexture.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="-scale-x-100 object-cover opacity-40"
                />
              </div>
              <h2 className="mt-6 font-display text-xl font-semibold text-navy-deep">
                No surprise fees. Ever.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                The quote you receive is the price you pay. We&apos;ll walk
                through access, stairs, and any oversized items up front so
                there are no surprises on moving day.
              </p>
            </aside>

            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
