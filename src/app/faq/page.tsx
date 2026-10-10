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
    <main className="relative w-full overflow-hidden -mt-20">
      <PageHero
        image={IMAGES.indoorsWithTools}
        eyebrow="Knowledge Base"
        title="Everything you need to know before move day"
        lead="Got questions about insurance, packing, stair surcharges, or deposit policies? Search our clear answers below."
      />

      <section className="relative border-b border-hairline bg-paper py-16 dark:border-white/10 dark:bg-[#070c14] md:py-24">
        <div className="section-padding mx-auto max-w-content">
          <FaqAccordion />
        </div>
      </section>

      <CallToAction
        heading="Still have a question?"
        subtext="Howard and the Compass Cartage team are always happy to help. Call or request a quote today."
      />
    </main>
  );
}
