// src/app/inventory/page.tsx
import type { Metadata } from "next";
import InventoryPlanner from "@/components/InventoryPlanner";
import PageHero from "@/components/PageHero";
import CallToAction from "@/components/CallToAction";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Interactive Inventory & Packing Planner",
  description:
    "Build a room-by-room moving inventory to calculate total volume, estimated weight, packing box counts, and exact truck capacity.",
  openGraph: {
    title: "Interactive Inventory & Packing Planner | Compass Cartage",
    description: "Scope your move room-by-room for an accurate quote.",
    url: "https://www.compasscartage.com/inventory",
  },
};

export default function InventoryPage() {
  return (
    <>
      <PageHero
        image={IMAGES.packingScene}
        eyebrow="Inventory Builder"
        title="Map your move room by room"
        lead="Add your furniture, appliances, and box estimates to view total cubic feet and generate an itemized inventory list for your moving quote."
      />

      <section className="bg-paper py-12 md:py-20">
        <div className="section-padding mx-auto max-w-content">
          <InventoryPlanner />
        </div>
      </section>

      <CallToAction
        heading="Ready to get your binding estimate?"
        subtext="Attach your custom inventory list directly to your quote request."
      />
    </>
  );
}
