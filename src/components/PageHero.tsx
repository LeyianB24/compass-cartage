// src/components/PageHero.tsx
import Image from "next/image";
import type { ImageAsset } from "@/lib/images";

type PageHeroProps = {
  image: ImageAsset;
  eyebrow: string;
  title: string;
  lead?: string;
  /** Right-aligned aside content (e.g. contact details on the quote page). */
  children?: React.ReactNode;
};

/**
 * Full-bleed inner-page hero with a photographic backdrop, a navy-tinted
 * gradient overlay for legibility, and the signature route-line motif
 * along the bottom edge. Server component — no client JS needed.
 */
export default function PageHero({
  image,
  eyebrow,
  title,
  lead,
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-hairline bg-navy-deep text-paper">
      {/* Backdrop photograph */}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Legibility overlays:
          - a left-to-right navy wash so type reads on the image,
          - a subtle bottom fade into the page that softens the seam. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[1] bg-gradient-to-r from-navy-deep/92 via-navy-deep/80 to-navy-deep/55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-[1] h-24 bg-gradient-to-t from-navy-deep to-transparent"
      />

      {/* Signature route-line motif along the lower edge */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 h-12 w-full opacity-60"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 45 C 220 5, 420 60, 600 25 S 980 5, 1200 40"
          stroke="#c9a227"
          strokeWidth="1.2"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
        <circle cx="600" cy="25" r="3" fill="#c9a227" />
      </svg>

      <div className="section-padding mx-auto max-w-content py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="eyebrow mb-3 text-gold-soft">{eyebrow}</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-paper md:text-5xl lg:text-6xl">
              {title}
            </h1>
            {lead && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg">
                {lead}
              </p>
            )}
          </div>

          {children && (
            <div className="md:pb-2">{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}
