// src/app/checklist/page.tsx
import type { Metadata } from "next";
import MovingChecklist from "@/components/MovingChecklist";
import PageHero from "@/components/PageHero";
import CallToAction from "@/components/CallToAction";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Interactive Moving Checklist & Timeline",
  description:
    "Free 8-week interactive moving checklist and timeline to plan your home or office relocation step by step.",
  openGraph: {
    title: "Interactive Moving Checklist & Timeline | Compass Cartage",
    description: "Stay organized and stress-free with our step-by-step moving countdown.",
    url: "https://www.compasscartage.com/checklist",
  },
};

export default function ChecklistPage() {
  return (
    <>
      <PageHero
        image={IMAGES.couplePacking}
        eyebrow="Relocation Planner"
        title="Your step-by-step moving countdown"
        lead="Use our interactive 8-week timeline to check off tasks, manage utilities, pack efficiently, and track move-day readiness."
      />

      <section className="bg-paper py-12 md:py-20">
        <div className="section-padding mx-auto max-w-content">
          <MovingChecklist />
        </div>
      </section>

      <CallToAction
        heading="Have questions about your timeline?"
        subtext="Our experienced dispatch team is available to assist with parking permits, elevator bookings, and custom packing scheduling."
      />
    </>
  );
}
