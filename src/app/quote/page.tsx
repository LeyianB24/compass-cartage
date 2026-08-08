// src/app/quote/page.tsx
import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";
import { BUSINESS } from "@/lib/constants";
import { Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Get a Free Quote | Compass Cartage",
  description: "Request a free, no-obligation moving quote from Compass Cartage.",
};

export default function QuotePage() {
  return (
    <section className="bg-paper">
      <div className="section-padding mx-auto max-w-content py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-3">Get a Free Quote</p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-navy-deep">
              Let&apos;s plan your move
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate">
              Fill out the form and we&apos;ll follow up with a free,
              no-obligation quote — usually within one business day.
            </p>

            <div className="mt-8 space-y-3 border-t border-hairline pt-6">
              <a
                href={BUSINESS.phoneHref}
                className="flex items-center gap-3 text-sm font-medium text-navy-deep"
              >
                <Phone size={16} className="text-gold" />
                {BUSINESS.phone}
              </a>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-3 text-sm font-medium text-navy-deep"
              >
                <Mail size={16} className="text-gold" />
                {BUSINESS.email}
              </a>
            </div>
          </div>

          <QuoteForm />
        </div>
      </div>
    </section>
  );
}