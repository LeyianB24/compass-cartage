// src/app/calculator/page.tsx
import type { Metadata } from "next";
import CostCalculator from "@/components/CostCalculator";
import PageHero from "@/components/PageHero";
import CallToAction from "@/components/CallToAction";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Instant Moving Cost Calculator",
  description:
    "Calculate instant moving cost estimates, crew requirements, and truck sizing for local and long-distance moves in Calgary and Alberta.",
  openGraph: {
    title: "Instant Moving Cost Calculator | Compass Cartage",
    description: "Get real-time binding estimates with zero hidden fees.",
    url: "https://www.compasscartage.com/calculator",
  },
};

export default function CalculatorPage() {
  return (
    <>
      <PageHero
        image={IMAGES.indoorsWithTools}
        eyebrow="Cost & Logistics Estimator"
        title="Estimate your move in under 60 seconds"
        lead="Use our interactive calculation tool to model crew sizes, truck capacities, and itemized moving costs tailored to your home."
      />

      <section className="bg-paper py-12 md:py-20">
        <div className="section-padding mx-auto max-w-content">
          <CostCalculator />
        </div>
      </section>

      <CallToAction
        heading="Ready to confirm your move date?"
        subtext="Lock in your calculation with Howard's crew for guaranteed rate stability."
      />
    </>
  );
}
