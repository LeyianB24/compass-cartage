// src/components/Testimonials.tsx
import Image from "next/image";
import { Star } from "lucide-react";
import { IMAGES } from "@/lib/images";

// Placeholder reviews — replace with Howard's real customer reviews
// (e.g. pulled from his Google Business Profile) once available.
const REVIEWS = [
  {
    quote:
      "Showed up on time, wrapped every piece of furniture, and the final price matched the quote exactly.",
    name: "Sarah M.",
    context: "Local move",
  },
  {
    quote:
      "Moved our office over a weekend with zero downtime on Monday morning. Professional crew.",
    name: "David K.",
    context: "Commercial move",
  },
  {
    quote:
      "Long-distance move that could've gone wrong in a dozen ways — it didn't. Highly recommend.",
    name: "Priya R.",
    context: "Long-distance move",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-paper">
      <div className="section-padding mx-auto max-w-content py-20">
        <div className="grid items-start gap-10 md:grid-cols-[0.8fr_2fr]">
          {/* Aside: a framed photograph paired with the heading —
              gives the section a human face before the words. */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm ring-1 ring-hairline">
              <Image
                src={IMAGES.smilingMover.src}
                alt={IMAGES.smilingMover.alt}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
              {/* Soft navy fade at the base for an editorial tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/35 to-transparent" />
            </div>
          </div>

          <div>
            <p className="eyebrow mb-3">Testimonials</p>
            <h2 className="font-display text-3xl font-semibold text-navy-deep">
              What people say after moving day
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((review) => (
                <figure
                  key={review.name}
                  className="flex flex-col justify-between border border-hairline bg-paper-muted p-6"
                >
                  <figcaption>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill="#c9a227" stroke="#c9a227" />
                      ))}
                    </div>
                    <blockquote className="mt-4 text-sm leading-relaxed text-slate">
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>
                  </figcaption>
                  <p className="mt-6 text-xs font-semibold text-navy-deep">
                    {review.name}
                    <span className="ml-2 font-normal text-slate-light">
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
