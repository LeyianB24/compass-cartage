// src/components/Testimonials.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";

export type Review = {
  quote: string;
  name: string;
  context: string;
  rating?: number;
  verified?: boolean;
};

const REVIEWS: Review[] = [
  {
    quote:
      "Showed up on time, wrapped every piece of furniture, and the final price matched the quote exactly. Couldn't ask for a smoother move.",
    name: "Sarah M.",
    context: "Local move",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "Moved our office over a weekend with zero downtime on Monday morning. Professional crew that handled delicate equipment with extreme care.",
    name: "David K.",
    context: "Commercial move",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "Long-distance move that could've gone wrong in a dozen ways — it didn't. Transparent communication throughout. Highly recommend.",
    name: "Priya R.",
    context: "Long-distance move",
    rating: 5,
    verified: true,
  },
];

export default function Testimonials({ reviews = REVIEWS }: { reviews?: Review[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-labelledby="testimonials-heading" className="bg-paper py-20">
      <div className="section-padding mx-auto max-w-content">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-3 text-gold-soft">Testimonials</p>
            <h2
              id="testimonials-heading"
              className="font-display text-3xl font-semibold text-navy-deep md:text-4xl"
            >
              What people say after moving day
            </h2>
          </div>

          {/* Social Proof Metric Badge */}
          <div className="flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2 text-xs font-medium text-navy-deep shadow-2xs">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  fill="#c9a227"
                  stroke="#c9a227"
                  aria-hidden="true"
                />
              ))}
            </div>
            <span><strong>4.9/5</strong> rated on Google</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.figure
              key={review.name}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: shouldReduceMotion ? 0 : index * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="group flex flex-col justify-between border border-hairline bg-white p-7 shadow-2xs transition-all duration-300 hover:border-navy-deep hover:shadow-md rounded-xs"
            >
              <div>
                {/* Rating Stars */}
                <div
                  className="flex gap-1"
                  aria-label={`Rated ${review.rating || 5} out of 5 stars`}
                >
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill="#c9a227"
                      stroke="#c9a227"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="mt-4 text-sm leading-relaxed text-slate">
                  &ldquo;{review.quote}&rdquo;
                </blockquote>
              </div>

              <figcaption className="mt-6 flex items-center justify-between border-t border-hairline/60 pt-4">
                <div>
                  <p className="text-sm font-semibold text-navy-deep">
                    {review.name}
                  </p>
                  <p className="text-xs text-slate-light">{review.context}</p>
                </div>

                {review.verified && (
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700"
                    title="Verified Customer"
                  >
                    <CheckCircle2 size={13} className="text-emerald-600" aria-hidden="true" />
                    Verified
                  </span>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}