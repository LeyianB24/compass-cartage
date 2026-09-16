// src/components/FleetShowcase.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ShieldCheck, CheckCircle2, ArrowRight, X, ZoomIn, Layers } from "lucide-react";
import { IMAGES, type ImageAsset } from "@/lib/images";

type FleetCategory = "All" | "Freight Trucks" | "Transit Vans" | "Enclosed Trailers" | "Cargo Interiors";

interface FleetVehicle {
  id: string;
  category: "Freight Trucks" | "Transit Vans" | "Enclosed Trailers" | "Cargo Interiors";
  title: string;
  tag: string;
  specs: string;
  capacity: string;
  img: ImageAsset;
  description: string;
  highlights: string[];
}

const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: "lorry1",
    category: "Freight Trucks",
    title: "26ft Commercial Freight Box Truck",
    tag: "Full Home & Long-Haul",
    specs: "Hydraulic Lift Gate • High-Clearance Cargo Body",
    capacity: "~1,800 cu ft • Up to 4-5 Bedroom Home",
    img: IMAGES.lorry1,
    description:
      "Our flagship commercial freight truck engineered for multi-room houses and large corporate offices. Features a heavy-duty hydraulic tailgate lift, smooth air-ride suspension, and weatherproof freight siding.",
    highlights: [
      "Commercial hydraulic lift gate for pianos, safes & heavy items",
      "Air-ride suspension dampening vibration on Alberta highways",
      "Interior dual E-track cargo rails for ratchet strap security",
    ],
  },
  {
    id: "transitVanGrey",
    category: "Transit Vans",
    title: "High-Roof Ford Transit Cargo Van",
    tag: "Condos & Express Moves",
    specs: "High-Roof Standing Height • Custom All-Terrain Clearance",
    capacity: "~550 cu ft • 1-2 Bedroom / Apartment",
    img: IMAGES.transitVanGrey,
    description:
      "Designed for agile urban relocations, underground parkade access, and tight downtown Edmonton driveways. High-roof interior permits upright wardrobe boxes and tall furniture.",
    highlights: [
      "Agile access for downtown high-rises and tight residential driveways",
      "Full standing interior height for efficient loading",
      "Equipped with commercial hand trucks and padded moving blankets",
    ],
  },
  {
    id: "enclosedTrailerBlue",
    category: "Enclosed Trailers",
    title: "Heavy-Duty Tri-Axle Enclosed Cargo Trailer",
    tag: "Unit 65TRL01 • Long-Distance Hauls",
    specs: "Tri-Axle Stability • Diamond-Plate Armor",
    capacity: "~1,200 cu ft • Secondary Long-Distance Haul",
    img: IMAGES.enclosedTrailerBlue,
    description:
      "Unit 65TRL01 is a tri-axle, weather-sealed commercial cargo trailer built for high-volume intercity transport across Alberta, including Calgary, Red Deer, and out-of-province relocations.",
    highlights: [
      "Tri-axle commercial suspension for maximum stability and load balance",
      "Completely sealed against rain, snow, dust, and highway debris",
      "Integrated side-door and rear-ramp entry for rapid staging",
    ],
  },
  {
    id: "residentialDeliveryVan",
    category: "Transit Vans",
    title: "Residential Delivery & Relocation Van",
    tag: "Neighbourhood Dispatch",
    specs: "Low Rear Step • Walk-In Cargo Doors",
    capacity: "~500 cu ft • Suites, Townhomes & Single Items",
    img: IMAGES.residentialDeliveryVan,
    description:
      "Our active residential moving unit backed directly into client driveways. Equipped with clean floor runners, shrink wrap, and padded dollies for swift, safe household moves.",
    highlights: [
      "Low-deck step for rapid, safe loading without heavy ramp incline",
      "Direct driveway placement protecting lawns and walkways",
      "Packed with protective furniture blankets and strapping",
    ],
  },
  {
    id: "lorry2",
    category: "Freight Trucks",
    title: "Commercial Freight Loading Bay & Chassis",
    tag: "Heavy Logistics",
    specs: "Reinforced Chassis • Commercial Step Access",
    capacity: "Full Commercial Grade Payload",
    img: IMAGES.lorry2,
    description:
      "Mid-chassis view showing commercial fuel capacity and heavy steel reinforcement for long-distance transit between Edmonton, Red Deer, Calgary, and beyond.",
    highlights: [
      "Commercial diesel powertrain for reliable cross-province transit",
      "Reinforced frame built for heavy furniture and equipment weight",
      "Regular scheduled commercial vehicle safety inspections",
    ],
  },
  {
    id: "cargoInteriorLoading",
    category: "Cargo Interiors",
    title: "Secure Interior Cargo Bays & Protection",
    tag: "Packing Standards",
    specs: "Quilted Mattress Bags • Padded Stacking",
    capacity: "Padded Interior Cargo Vault",
    img: IMAGES.cargoInteriorLoading,
    description:
      "A look inside our vehicles during active transit: every mattress is sealed in heavy plastic, furniture is wrapped in thick quilted moving pads, and boxes are stacked strictly by weight.",
    highlights: [
      "Wall-to-wall quilted furniture pads preventing transit friction",
      "Individual mattress protection bags and structural ties",
      "Zero shifting guarantee with dual ratchet tie-down tracks",
    ],
  },
  {
    id: "enclosedTrailerFacility",
    category: "Enclosed Trailers",
    title: "Tri-Axle Trailer Fleet Hub & Prep",
    tag: "Maintenance Facility",
    specs: "Inspected Daily • Sanitized Interior",
    capacity: "Fleet Maintenance Bay",
    img: IMAGES.enclosedTrailerFacility,
    description:
      "Stationed at our Edmonton fleet maintenance hub, our trailers undergo thorough cleaning, sweeping, and safety audits between every relocation assignment.",
    highlights: [
      "Cleaned and swept clean after every move",
      "Brake, tire, and coupling checks before every highway departure",
      "Always fully stocked with clean moving blankets and straps",
    ],
  },
  {
    id: "lorry3",
    category: "Freight Trucks",
    title: "Edmonton Fleet Hub & Daily Dispatch Depot",
    tag: "Edmonton HQ Base",
    specs: "Daily Dispatch • Capital Region Base",
    capacity: "Stationed in Edmonton, AB",
    img: IMAGES.lorry3,
    description:
      "Our full commercial moving fleet stationed at the Edmonton facility ready for scheduled morning dispatches and rapid short-notice relocations across Alberta.",
    highlights: [
      "Local Edmonton fleet headquarters enabling on-time arrivals",
      "Commercial cargo transit insurance on all vehicles",
      "Driven exclusively by vetted, professional full-time company crew",
    ],
  },
];

export default function FleetShowcase() {
  const [activeTab, setActiveTab] = useState<FleetCategory>("All");
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);

  const filteredVehicles = FLEET_VEHICLES.filter(
    (v) => activeTab === "All" || v.category === activeTab
  );

  return (
    <section id="fleet" className="relative border-b border-hairline bg-paper-muted py-20 dark:border-white/10 dark:bg-[#0b1320] md:py-28">
      <div className="section-padding mx-auto max-w-content">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-gold-soft dark:text-gold">
              <Truck size={14} />
              <span>Our Dedicated Equipment & Fleet</span>
            </div>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-navy-deep dark:text-white sm:text-4xl lg:text-5xl">
              Real Vehicles. Dedicated Crew. Stationed in Edmonton.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate dark:text-gray-300">
              We never broker out moves or send unbranded rental vans. Explore our actual moving fleet — commercial freight box trucks, high-roof Transit vans, and tri-axle trailers.
            </p>
          </div>

          <Link
            href="/quote"
            className="group inline-flex items-center gap-2 rounded-xs bg-gold px-6 py-3 text-xs font-bold text-navy-deep shadow-sm transition-all hover:bg-gold-soft dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
          >
            <span>Book Your Move</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Fleet Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-hairline pb-4 dark:border-white/10">
          {(
            [
              "All",
              "Freight Trucks",
              "Transit Vans",
              "Enclosed Trailers",
              "Cargo Interiors",
            ] as FleetCategory[]
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xs px-4 py-2 font-mono text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-navy-deep text-gold-soft font-bold shadow-xs dark:bg-gold dark:text-navy-deep"
                  : "border border-hairline bg-paper text-slate hover:border-gold hover:text-navy-deep dark:border-white/10 dark:bg-[#070c14] dark:text-gray-300 dark:hover:border-gold dark:hover:text-white"
              }`}
            >
              {tab === "All" ? `All Fleet (${FLEET_VEHICLES.length})` : tab}
            </button>
          ))}
        </div>

        {/* Responsive Multi-Card Grid */}
        <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredVehicles.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group flex flex-col justify-between overflow-hidden rounded-xs border border-hairline bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-xl dark:border-white/10 dark:bg-[#070c14] dark:hover:border-gold/60"
              >
                <div>
                  {/* Visual Photograph Frame */}
                  <div
                    onClick={() => setSelectedVehicle(item)}
                    className="relative aspect-[16/11] w-full cursor-pointer overflow-hidden bg-navy-deep"
                  >
                    <Image
                      src={item.img.src}
                      alt={item.img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Category Pill */}
                    <span className="absolute left-3 top-3 rounded-xs border border-white/20 bg-black/70 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur">
                      {item.tag}
                    </span>

                    {/* Zoom Icon Hint */}
                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <ZoomIn size={14} />
                    </div>

                    {/* Specs Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-gold-soft">
                        {item.capacity}
                      </span>
                      <p className="text-xs font-semibold text-white truncate">
                        {item.specs}
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-navy-deep dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate dark:text-gray-300">
                      {item.description}
                    </p>

                    <ul className="mt-4 space-y-2 border-t border-hairline pt-3.5 dark:border-white/10">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-navy-deep dark:text-gray-200">
                          <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-gold dark:text-gold-soft" />
                          <span className="text-[11px] leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-hairline p-5 pt-3 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedVehicle(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-gold dark:text-gray-400 dark:hover:text-gold"
                    >
                      <Layers size={13} />
                      <span>View Full Image</span>
                    </button>
                    <Link
                      href={`/quote?moveSize=${item.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-navy-deep hover:text-gold dark:text-gold-soft dark:hover:underline"
                    >
                      <span>Book Fleet</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Fleet Reliability Strip */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xs border border-hairline bg-paper p-5 shadow-xs dark:border-white/10 dark:bg-[#070c14]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xs bg-gold/15 text-gold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-navy-deep dark:text-white">Commercial Transit Protection on All Fleet Units</p>
              <p className="text-[11px] text-slate dark:text-gray-400">All fleet vehicles are commercially licensed, regularly safety-inspected, and covered by comprehensive cargo transit insurance.</p>
            </div>
          </div>

          <Link
            href="/gallery"
            className="text-xs font-semibold text-gold hover:text-gold-soft hover:underline shrink-0"
          >
            View Full Moving Day Gallery ({FLEET_VEHICLES.length}+ Photos) →
          </Link>
        </div>

        {/* Lightbox Modal for Full Fleet Resolution */}
        <AnimatePresence>
          {selectedVehicle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVehicle(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[92vh] max-w-4xl overflow-hidden rounded-card border border-white/20 bg-navy-deep shadow-2xl text-white"
              >
                <button
                  type="button"
                  onClick={() => setSelectedVehicle(null)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black/90"
                  aria-label="Close fleet preview"
                >
                  <X size={20} />
                </button>

                <div className="relative aspect-[16/10] w-full min-w-[320px] sm:min-w-[620px] md:min-w-[820px] bg-black">
                  <Image
                    src={selectedVehicle.img.src}
                    alt={selectedVehicle.img.alt}
                    fill
                    sizes="(max-width: 1024px) 95vw, 1000px"
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="border-t border-white/10 bg-[#070c14] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                        {selectedVehicle.tag} • {selectedVehicle.capacity}
                      </span>
                      <h4 className="font-display text-lg font-bold text-white">
                        {selectedVehicle.title}
                      </h4>
                      <p className="mt-1 text-xs text-gray-300">
                        {selectedVehicle.specs}
                      </p>
                    </div>

                    <Link
                      href="/quote"
                      onClick={() => setSelectedVehicle(null)}
                      className="rounded-xs bg-gold px-5 py-2.5 text-xs font-bold text-navy-deep hover:bg-gold-soft"
                    >
                      Request This Vehicle
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
