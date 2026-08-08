// src/components/CallToAction.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CallToActionProps = {
  heading?: string;
  subtext?: string;
};

export default function CallToAction({
  heading = "Ready to book your move?",
  subtext = "Tell us where you're headed and we'll get back to you with a free, no-obligation quote.",
}: CallToActionProps) {
  return (
    <section className="bg-navy-deep">
      <div className="section-padding mx-auto flex max-w-content flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-2xl font-semibold text-paper md:text-3xl">
            {heading}
          </h2>
          <p className="mt-2 max-w-md text-sm text-paper/65">{subtext}</p>
        </div>
        <Link
          href="/quote"
          className="flex shrink-0 items-center gap-2 rounded-sm bg-gold px-7 py-3.5 text-sm font-semibold text-navy-deep transition-colors hover:bg-gold-soft"
        >
          Get a Free Quote
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}