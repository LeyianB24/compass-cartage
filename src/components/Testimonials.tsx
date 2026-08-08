// src/components/Testimonials.tsx
import { Star } from "lucide-react";

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
        <p className="eyebrow mb-3">Testimonials</p>
        <h2 className="font-display text-3xl font-semibold text-navy-deep">
          What people say after moving day
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="flex flex-col justify-between border border-hairline bg-white p-6"
            >
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="#c9a227" stroke="#c9a227" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>
              <p className="mt-6 text-xs font-semibold text-navy-deep">
                {review.name}
                <span className="ml-2 font-normal text-slate-light">
                  {review.context}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}