// src/app/faq/page.tsx
import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import PageHero from "@/components/PageHero";
import CallToAction from "@/components/CallToAction";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common moving questions about pricing, insurance coverage, packing services, elevator access, and short-notice relocations.",
  openGraph: {
    title: "Moving FAQ & Knowledge Hub | Compass Cartage",
    description: "Clear answers to your moving questions.",
    url: "https://www.compasscartage.com/faq",
  },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        image={IMAGES.indoorsWithTools}
        eyebrow="Knowledge Base"
        title="Everything you need to know before move day"
        lead="Got questions about insurance, packing, stair surcharges, or deposit policies? Search our clear answers below."
      />

      <section className="bg-paper py-12 md:py-20">
        <div className="section-padding mx-auto max-w-content">
          <FaqAccordion />
        </div>
      </section>

      <CallToAction
        heading="Still have a question?"
        subtext="Howard and the Compass Cartage team are always happy to help. Call or request a quote today."
      />
    </>
  );
}
