// src/components/CallToAction.tsx
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

type CallToActionProps = {
  heading?: string;
  subtext?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  showPhoneOption?: boolean;
};

export default function CallToAction({
  heading = "Ready to book your move?",
  subtext = "Tell us where you're headed and we'll get back to you with a free, no-obligation quote.",
  primaryCtaText = "Get a Free Quote",
  primaryCtaHref = "/quote",
  showPhoneOption = true,
}: CallToActionProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-navy-deep relative overflow-hidden border-t border-hairline/10 py-16 md:py-20"
    >
      {/* Decorative ambient background accent */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gold/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="section-padding mx-auto flex max-w-content flex-col items-start justify-between gap-8 relative md:flex-row md:items-center">
        {/* Content Group */}
        <div className="max-w-xl">
          <p className="eyebrow mb-2 text-gold-soft">Take the Next Step</p>
          <h2
            id="cta-heading"
            className="font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl md:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-paper/75 sm:text-base">
            {subtext}
          </p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-col sm:flex-row shrink-0 items-stretch sm:items-center gap-3.5 w-full md:w-auto">
          {/* Primary Action Button */}
          <Link
            href={primaryCtaHref}
            className="group inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-7 py-3.5 text-sm font-semibold text-navy-deep shadow-sm transition-all duration-200 hover:bg-gold-soft hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
          >
            <span>{primaryCtaText}</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          {/* Optional Direct Call Secondary Button */}
          {showPhoneOption && BUSINESS?.phone && (
            <a
              href={`tel:${BUSINESS.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-paper/20 px-5 py-3.5 text-sm font-semibold text-paper transition-colors duration-200 hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
            >
              <Phone size={15} className="text-gold" aria-hidden="true" />
              <span>Call {BUSINESS.phone}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}