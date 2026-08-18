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
    <section className="relative isolate overflow-hidden border-b border-hairline bg-[#071426] dark:bg-[#030914] text-[#f7f6f2]">
      {/* Backdrop photograph */}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Legibility overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[1] bg-gradient-to-r from-[#071426]/95 via-[#071426]/85 to-[#071426]/60 dark:from-[#030914]/95 dark:via-[#030914]/85 dark:to-[#030914]/65"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-[1] h-24 bg-gradient-to-t from-[#071426] dark:from-[#030914] to-transparent"
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
            <p className="eyebrow mb-3 text-[#e4c65c]">{eyebrow}</p>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] text-[#f7f6f2] md:text-5xl lg:text-6xl">
              {title}
            </h1>
            {lead && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#f7f6f2]/80 md:text-lg">
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
