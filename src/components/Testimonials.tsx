import Image from "next/image";
import { ShieldCheck, Clock, Award } from "lucide-react";
import { IMAGES } from "@/lib/images";

const COMMITMENTS = [
  {
    icon: Award,
    title: "Upfront, Honest Pricing",
    quote:
      "The price we quote is the price you pay. We walk through stairs, access, and room inventories in advance so there are never surprise fees on moving day.",
    context: "Transparent Estimates",
  },
  {
    icon: ShieldCheck,
    title: "Careful Property Protection",
    quote:
      "Every piece of furniture is wrapped in clean, quilted moving blankets, and doorways and floors are padded to keep both your old and new home in pristine condition.",
    context: "Furniture & Home Care",
  },
  {
    icon: Clock,
    title: "One Dedicated Crew",
    quote:
      "The exact same trusted team loads your truck, drives directly to your destination, and places every item in your assigned room. Zero third-party handoffs.",
    context: "Dedicated Moving Crew",
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
              The Compass Cartage Standard
            </span>
            <h2 className="font-display text-3xl font-semibold text-navy-deep dark:text-white sm:text-4xl">
              What You Can Count On Every Move
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {COMMITMENTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex flex-col justify-between rounded-xs border border-hairline bg-paper-muted p-6 shadow-sm transition-all hover:border-gold/50 dark:border-white/10 dark:bg-[#0f172a] dark:hover:border-gold/50"
                  >
                    <div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xs bg-gold/15 text-gold-soft dark:text-gold">
                        <Icon size={20} />
                      </div>
                      <h3 className="mt-4 font-display text-base font-semibold text-navy-deep dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-xs leading-relaxed text-slate dark:text-gray-300 font-normal">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>
                    <p className="mt-6 font-mono text-[10px] font-semibold text-gold-soft dark:text-gold">
                      {item.context}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
