// src/app/gallery/page.tsx
import type { Metadata } from "next";
import FilterableGallery from "@/components/FilterableGallery";
import PageHero from "@/components/PageHero";
import CallToAction from "@/components/CallToAction";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Moving Day Gallery & Project Showcase",
  description:
    "Explore real photos of Compass Cartage moving crews, packing preparations, fleet trucks, and heavy item transports.",
  openGraph: {
    title: "Moving Day Gallery | Compass Cartage",
    description: "Real crews, real homes, real care.",
    url: "https://www.compasscartage.com/gallery",
  },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        image={IMAGES.heroMovers}
        eyebrow="Visual Showcase"
        title="Real crews, real homes, real care"
        lead="Filter through our photography portfolio showcasing residential moves, commercial office relocations, custom packing setups, and specialty heavy item transports."
      />

      <section className="bg-paper py-12 md:py-20">
        <div className="section-padding mx-auto max-w-content">
          <FilterableGallery />
        </div>
      </section>

      <CallToAction
        heading="Ready to experience stress-free moving day?"
        subtext="Request a free, no-obligation quote today and let Howard's team handle the rest."
      />
    </>
  );
}
