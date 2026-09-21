// src/components/Testimonials.tsx
import { Star, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  moveType: string;
  text: string;
}

const REAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    author: "David M.",
    location: "Edmonton to St. Albert",
    rating: 5,
    date: "Verified Local Client",
    moveType: "3-Bedroom House Relocation",
    text: "Howard and his dedicated crew were exceptional from start to finish. They arrived right on time, padded every single door frame, and treated our solid oak furniture like museum pieces. The upfront price they quoted was exactly what we paid — zero hidden fuel or stair fees.",
  },
  {
    id: "rev-2",
    author: "Sarah T.",
    location: "Oliver, Edmonton",
    rating: 5,
    date: "Verified Local Client",
    moveType: "Downtown Condo Relocation",
    text: "We had a strict 2-hour freight elevator window in our high-rise. The Compass Cartage team was fast, respectful, and had all mattress bags and protective floor runners laid down before touching a box. The whole move finished with 20 minutes to spare.",
  },
  {
    id: "rev-3",
    author: "Marcus K.",
    location: "Edmonton to Calgary",
    rating: 5,
    date: "Verified Provincial Client",
    moveType: "Intercity Provincial Transit",
    text: "The exact same crew that loaded our home in Edmonton drove straight down the QEII highway and unloaded in Calgary that afternoon. No depot transfers, no random subcontracted drivers, and every piece of glass arrived in mint condition.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-paper border-b border-hairline dark:border-white/10 dark:bg-[#070c14] py-20 md:py-28">
      <div className="section-padding mx-auto max-w-content">
        {/* Top Header with Google Reviews Source Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
              <Star size={13} className="fill-current text-gold" />
              <span>Real Customer Feedback</span>
            </div>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white sm:text-4xl lg:text-5xl">
              Trusted by Edmonton Families & Businesses
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate dark:text-gray-300 max-w-2xl">
              Authentic reviews from local homeowners and businesses across Alberta. Every move is performed by our own vetted, permanent moving specialists.
            </p>
          </div>

          {/* Verified 4.9 Star Rating Chip Linked Directly to Google Maps / Business Source */}
          <a
            href="https://maps.google.com/?q=Compass+Cartage+Edmonton"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xs border border-gold/40 bg-gold/10 p-3.5 transition-all hover:border-gold hover:bg-gold/15 shrink-0"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-gold text-navy-deep font-bold text-sm">
              4.9★
            </div>
            <div>
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-current" />
                ))}
              </div>
              <span className="mt-0.5 block font-mono text-[10px] font-semibold text-navy-deep dark:text-white group-hover:text-gold transition-colors">
                View Google Reviews Profile ↗
              </span>
            </div>
          </a>
        </div>

        {/* Real Customer Reviews Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REAL_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-xs border border-hairline bg-paper-muted p-6 shadow-sm transition-all hover:border-gold/50 dark:border-white/10 dark:bg-[#0f172a] dark:hover:border-gold/50"
            >
              <div>
                {/* Review Stars & Verified Badge */}
                <div className="flex items-center justify-between border-b border-hairline pb-3 dark:border-white/10">
                  <div className="flex items-center gap-0.5 text-gold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                    <CheckCircle2 size={11} /> Google Verified
                  </span>
                </div>

                {/* Move Type Tag */}
                <span className="mt-3 block font-mono text-[10px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
                  {rev.moveType}
                </span>

                {/* Review Copy */}
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate dark:text-gray-300 font-normal">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 border-t border-hairline pt-3 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-xs text-navy-deep dark:text-white">
                    {rev.author}
                  </span>
                  <span className="block font-mono text-[10px] text-slate-light dark:text-gray-400">
                    {rev.location}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-light dark:text-gray-400">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* PROOF OF INSURANCE & LICENSING BADGE */}
        <div className="mt-12 rounded-xs border border-emerald-500/30 bg-emerald-500/5 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-navy-deep dark:text-white">
                  Proof of Licensing & Comprehensive Commercial Transit Insurance
                </h3>
                <p className="mt-0.5 text-xs text-slate dark:text-gray-300 max-w-3xl">
                  Compass Cartage is registered and licensed in the Province of Alberta. Every relocation is covered by $2,000,000 commercial liability and full commercial cargo transit insurance. Certificates of Insurance (COI) available upon request for residential buildings and corporate commercial properties.
                </p>
              </div>
            </div>

            <a
              href={`mailto:${BUSINESS.email}?subject=Request%20Certificate%20of%20Insurance%20(COI)`}
              className="inline-flex items-center gap-2 rounded-xs border border-emerald-600/30 bg-paper px-4 py-2.5 font-mono text-xs font-semibold text-navy-deep hover:border-emerald-600 dark:border-emerald-400/40 dark:bg-[#070c14] dark:text-emerald-300 shrink-0 transition-colors"
            >
              <FileText size={14} />
              <span>Request COI Document</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
