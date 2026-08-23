// src/components/Testimonials.tsx
import Image from "next/image";
import { Star } from "lucide-react";
import { IMAGES } from "@/lib/images";

const REVIEWS = [
  {
    quote:
      "Arrived exactly at 8:00 AM, wrapped every piece of furniture in thick quilted blankets, and the final price matched the binding quote to the cent.",
    name: "Sarah M.",
    context: "Windermere Residential Move",
  },
  {
    quote:
      "Relocated our office workstations over the weekend with zero downtime on Monday morning. Exceptional single-crew continuity.",
    name: "David K.",
    context: "Downtown Office Relocation",
  },
  {
    quote:
      "Inter-city move to Calgary that could've been chaotic was handled with total calm and structural precision. Highly recommend.",
    name: "Priya R.",
    context: "Edmonton to Calgary Move",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-paper border-b border-hairline dark:border-white/10 dark:bg-[#070c14]">
      <div className="section-padding mx-auto max-w-content py-20 md:py-28">
        <div className="grid items-start gap-10 md:grid-cols-[0.8fr_2fr]">
          {/* Aside: a framed photograph paired with the heading */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xs ring-1 ring-hairline shadow-lg dark:ring-white/10">
              <Image
                src={IMAGES.smilingMover.src}
                alt={IMAGES.smilingMover.alt}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
              {/* Soft navy fade at the base for an editorial tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 to-transparent dark:from-[#070c14]/70" />
            </div>
          </div>

          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold mb-2 block">
              Verified Client Ledger
            </span>
            <h2 className="font-display text-3xl font-semibold text-navy-deep dark:text-white sm:text-4xl">
              What Clients Report After Relocation
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((review) => (
                <figure
                  key={review.name}
                  className="flex flex-col justify-between rounded-xs border border-hairline bg-paper-muted p-6 shadow-sm transition-all hover:border-gold/50 dark:border-white/10 dark:bg-[#0f172a] dark:hover:border-gold/50"
                >
                  <figcaption>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} className="fill-gold text-gold" />
                      ))}
                    </div>
                    <blockquote className="mt-4 text-xs leading-relaxed text-slate dark:text-gray-300 font-normal">
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>
                  </figcaption>
                  <p className="mt-6 text-xs font-semibold text-navy-deep dark:text-white">
                    {review.name}
                    <span className="block font-mono text-[10px] font-normal text-slate-light dark:text-gray-400 mt-0.5">
                      {review.context}
                    </span>
                  </p>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
