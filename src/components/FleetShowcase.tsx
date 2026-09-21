// src/components/FleetShowcase.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ShieldCheck, CheckCircle2, ArrowRight, X, ZoomIn, Info } from "lucide-react";
import { IMAGES, type ImageAsset } from "@/lib/images";

type FleetCategory = "All" | "Freight Trucks" | "Transit Vans" | "Enclosed Trailers" | "Cargo Interiors";

interface FleetVehicle {
  id: string;
  category: "Freight Trucks" | "Transit Vans" | "Enclosed Trailers" | "Cargo Interiors";
  title: string;
  tag: string;
  specs: string;
  capacity: string;
  oneLiner: string;
  img: ImageAsset;
  description: string;
  highlights: string[];
  moveSizeId: string;
}

const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: "lorry1",
    category: "Freight Trucks",
    title: "26ft Commercial Freight Box Truck",
    tag: "Full Home & Long-Haul",
    specs: "Hydraulic Lift Gate • High-Clearance Cargo Body",
    capacity: "~1,800 cu ft • 3–5 Bedroom Home",
    oneLiner: "Flagship heavy freight truck with hydraulic tailgate lift for whole-home moves.",
    img: IMAGES.lorry1,
    description:
      "Our flagship commercial freight truck engineered for multi-room houses and large corporate offices. Features a heavy-duty hydraulic tailgate lift and weatherproof freight siding.",
    highlights: [
      "Commercial hydraulic lift gate for pianos, safes & heavy appliances",
      "Reinforced heavy-duty chassis built for Alberta highway transit",
      "Dual interior E-track cargo rails for ratchet strap security",
    ],
    moveSizeId: "3-bedroom",
  },
  {
    id: "transitVanGrey",
    category: "Transit Vans",
    title: "High-Roof Ford Transit Cargo Van",
    tag: "Condos & Express Moves",
    specs: "High-Roof Standing Height • Parkade Accessible",
    capacity: "~550 cu ft • 1–2 Bedrooms / Condos",
    oneLiner: "Agile high-roof van built for downtown Edmonton parkades and rapid apartment moves.",
    img: IMAGES.transitVanGrey,
    description:
      "Designed for agile urban relocations, underground parkade access, and tight downtown Edmonton driveways. High-roof interior permits upright wardrobe boxes and tall furniture.",
    highlights: [
      "Agile clearance for high-rise parkades and tight residential driveways",
      "Full standing interior height for rapid, ergonomic box staging",
      "Equipped with commercial hand trucks and thick moving blankets",
    ],
    moveSizeId: "1-bedroom",
  },
  {
    id: "enclosedTrailerBlue",
    category: "Enclosed Trailers",
    title: "Heavy-Duty Tri-Axle Enclosed Cargo Trailer",
    tag: "Unit 65TRL01 • Intercity Hauls",
    specs: "Tri-Axle Stability • Diamond-Plate Armor",
    capacity: "~1,200 cu ft • Long-Distance Secondary Haul",
    oneLiner: "Weather-sealed commercial trailer built for Edmonton to Calgary and intercity transit.",
    img: IMAGES.enclosedTrailerBlue,
    description:
      "Unit 65TRL01 is a tri-axle, weather-sealed commercial cargo trailer built for high-volume intercity transport across Alberta, including Calgary, Red Deer, and provincial relocations.",
    highlights: [
      "Tri-axle commercial suspension for maximum highway stability and load balance",
      "Completely sealed against Alberta winter snow, rain, and highway debris",
      "Side-door and rear-ramp entry for rapid room-by-room staging",
    ],
    moveSizeId: "3-bedroom",
  },
  {
    id: "residentialDeliveryVan",
    category: "Transit Vans",
    title: "Residential Delivery & Relocation Van",
    tag: "Neighbourhood Dispatch",
    specs: "Low Rear Step • Direct Driveway Access",
    capacity: "~500 cu ft • Townhomes & Suites",
    oneLiner: "Low-step residential van engineered for direct driveway loading without damaging lawns.",
    img: IMAGES.residentialDeliveryVan,
    description:
      "Our active residential moving unit backed directly into client driveways. Equipped with clean floor runners, shrink wrap, and padded dollies for swift, safe household moves.",
    highlights: [
      "Low-deck step for rapid, safe loading without steep ramp incline",
      "Direct driveway placement protecting manicured walkways and curbs",
      "Fully stocked with clean quilted moving blankets and heavy strapping",
    ],
    moveSizeId: "2-bedroom",
  },
  {
    id: "transitVanSideLoaded",
    category: "Transit Vans",
    title: "High-Roof Van Cargo Bay & Sofa Staging",
    tag: "Real Client Move • Edmonton",
    specs: "Side Sliding Access • Quilted Blanket Shield",
    capacity: "Loaded Residential Sofa & Padded Bay",
    oneLiner: "Side-loading bay with heavy blue quilted moving pads and reinforced tie-down anchors.",
    img: IMAGES.transitVanSideLoaded,
    description:
      "Captured on-site during an Edmonton residential move: showing our high-roof cargo van loaded with client furniture protected by heavy blue moving pads and safety tie-down points.",
    highlights: [
      "High roof standing clearance for sofas and tall armchairs",
      "Heavy padded moving blankets shielding upholstery from scuffs",
      "Reinforced safety divider protecting the cab and crew",
    ],
    moveSizeId: "studio",
  },
  {
    id: "lorry2",
    category: "Freight Trucks",
    title: "Commercial Freight Loading Bay & Chassis",
    tag: "Heavy Logistics",
    specs: "Reinforced Chassis • Commercial Step Access",
    capacity: "Full Commercial Grade Payload",
    oneLiner: "Mid-chassis heavy freight platform built for large estates and corporate equipment.",
    img: IMAGES.lorry2,
    description:
      "Mid-chassis view showing commercial fuel capacity and heavy steel reinforcement for long-distance transit between Edmonton, Red Deer, Calgary, and beyond.",
    highlights: [
      "Commercial diesel powertrain for reliable cross-province transit",
      "Reinforced frame built for heavy furniture and machinery weight",
      "Regular scheduled commercial vehicle safety inspections",
    ],
    moveSizeId: "4-plus-bedroom",
  },
  {
    id: "cargoInteriorLoading",
    category: "Cargo Interiors",
    title: "Secure Interior Cargo Bay & Protection",
    tag: "Packing Standards",
    specs: "Quilted Mattress Bags • Padded Stacking",
    capacity: "Padded Interior Cargo Vault",
    oneLiner: "Interior cargo bay with wall-to-wall quilted padding, ratchet strapping, and mattress bags.",
    img: IMAGES.cargoInteriorLoading,
    description:
      "A look inside our vehicles during active transit: every mattress is sealed in heavy plastic, furniture is wrapped in thick quilted moving pads, and boxes are stacked strictly by weight.",
    highlights: [
      "Wall-to-wall quilted furniture pads preventing transit friction",
      "Individual mattress protection bags and structural ties",
      "Zero shifting guarantee with dual ratchet tie-down tracks",
    ],
    moveSizeId: "1-bedroom",
  },
  {
    id: "enclosedTrailerFacility",
    category: "Enclosed Trailers",
    title: "Tri-Axle Trailer Fleet Hub & Prep",
    tag: "Maintenance Facility",
    specs: "Inspected Daily • Sanitized Interior",
    capacity: "Fleet Maintenance Bay",
    oneLiner: "Sanitized and safety-audited trailer interior stationed at our Edmonton depot.",
    img: IMAGES.enclosedTrailerFacility,
    description:
      "Stationed at our Edmonton fleet maintenance hub, our trailers undergo thorough cleaning, sweeping, and safety audits between every relocation assignment.",
    highlights: [
      "Cleaned and swept clean after every move",
      "Brake, tire, and coupling checks before every highway departure",
      "Always fully stocked with clean moving blankets and straps",
    ],
    moveSizeId: "3-bedroom",
  },
  {
    id: "lorry3",
    category: "Freight Trucks",
    title: "Edmonton Fleet Hub & Daily Dispatch Depot",
    tag: "Edmonton HQ Base",
    specs: "Daily Dispatch • Capital Region Base",
    capacity: "Stationed in Edmonton, AB",
    oneLiner: "Edmonton-stationed fleet depot enabling prompt on-time dispatch across the Capital Region.",
    img: IMAGES.lorry3,
    description:
      "Our full commercial moving fleet stationed at the Edmonton facility ready for scheduled morning dispatches and rapid short-notice relocations across Alberta.",
    highlights: [
      "Local Edmonton fleet headquarters enabling on-time arrivals",
      "Commercial cargo transit insurance on all vehicles",
      "Driven exclusively by vetted, professional full-time company crew",
    ],
    moveSizeId: "office-large",
  },
];

export default function FleetShowcase() {
  const [activeTab, setActiveTab] = useState<FleetCategory>("All");
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);

  const filteredVehicles = FLEET_VEHICLES.filter(
    (v) => activeTab === "All" || v.category === activeTab
  );

  return (
    <section
      id="fleet"
      className="relative border-b border-hairline bg-paper-muted py-20 dark:border-white/10 dark:bg-[#0b1320] md:py-28"
    >
      <div className="section-padding mx-auto max-w-content">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
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
            className="btn-shimmer group inline-flex items-center gap-2 rounded-xs bg-gold px-6 py-3 text-xs font-bold text-navy-deep shadow-sm transition-all hover:bg-gold-soft hover:scale-[1.02] active:scale-[0.98] dark:bg-gold dark:text-navy-deep dark:hover:bg-gold-soft"
          >
            <span>Get a Free Quote</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Fleet Category Filter Tabs with Sliding Pill */}
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
              className={`relative rounded-xs px-4 py-2 font-mono text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "text-gold-soft font-bold dark:text-navy-deep"
                  : "border border-hairline bg-paper text-slate hover:border-gold hover:text-navy-deep dark:border-white/10 dark:bg-[#070c14] dark:text-gray-300 dark:hover:border-gold dark:hover:text-white"
              }`}
            >
              {activeTab === tab && (
                <motion.span
                  layoutId="fleetCategoryPill"
                  className="absolute inset-0 rounded-xs bg-navy-deep dark:bg-gold shadow-xs"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {tab === "All" ? `All Fleet (${FLEET_VEHICLES.length})` : tab}
              </span>
            </button>
          ))}
        </div>

        {/* COMPACT MULTI-CARD GRID: photo, name, capacity, one line */}
        <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredVehicles.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="group flex flex-col justify-between overflow-hidden rounded-xs border border-hairline bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lg dark:border-white/10 dark:bg-[#070c14] dark:hover:border-gold/60"
              >
                <div>
                  {/* Photo Frame */}
                  <div
                    onClick={() => setSelectedVehicle(item)}
                    className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden bg-navy-deep"
                  >
                    <Image
                      src={item.img.src}
                      alt={item.img.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category Pill */}
                    <span className="absolute left-3 top-3 rounded-xs border border-white/20 bg-black/70 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-gold backdrop-blur">
                      {item.tag}
                    </span>

                    {/* Zoom Icon */}
                    <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <ZoomIn size={13} />
                    </div>

                    {/* Capacity Overlay Badge */}
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <span className="font-mono text-[10px] font-bold text-gold-soft">
                        {item.capacity}
                      </span>
                    </div>
                  </div>

                  {/* Compact Card Content: Name + One line */}
                  <div className="p-4">
                    <h3 className="font-display text-base font-bold text-navy-deep dark:text-white group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate dark:text-gray-300 line-clamp-1 font-normal">
                      {item.oneLiner}
                    </p>
                  </div>
                </div>

                {/* Card Footer: "See details" + "Get a quote for this vehicle" */}
                <div className="border-t border-hairline px-4 py-3 dark:border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedVehicle(item)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate hover:text-navy-deep dark:text-gray-300 dark:hover:text-gold transition-colors"
                  >
                    <Info size={13} />
                    <span>See details</span>
                  </button>

                  <Link
                    href={`/quote?moveSize=${item.moveSizeId}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-navy-deep hover:text-gold dark:text-gold-soft dark:hover:underline"
                  >
                    <span>Get a quote for this vehicle</span>
                    <ArrowRight size={13} />
                  </Link>
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
              <p className="text-xs font-bold text-navy-deep dark:text-white">
                Commercial Transit Protection on All Fleet Units
              </p>
              <p className="text-[11px] text-slate dark:text-gray-400">
                All fleet vehicles are commercially licensed, regularly safety-inspected, and covered by comprehensive cargo transit insurance.
              </p>
            </div>
          </div>

          <Link
            href="/gallery"
            className="text-xs font-semibold text-gold hover:text-gold-soft hover:underline shrink-0"
          >
            View Full Moving Day Gallery ({FLEET_VEHICLES.length}+ Photos) →
          </Link>
        </div>

        {/* DETAILS LIGHTBOX MODAL */}
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
                className="relative max-h-[92vh] max-w-3xl w-full overflow-hidden rounded-card border border-white/20 bg-navy-deep shadow-2xl text-white"
              >
                <button
                  type="button"
                  onClick={() => setSelectedVehicle(null)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-2 text-white transition-colors hover:bg-black/90"
                  aria-label="Close fleet details"
                >
                  <X size={20} />
                </button>

                <div className="relative aspect-[16/10] w-full bg-black">
                  <Image
                    src={selectedVehicle.img.src}
                    alt={selectedVehicle.img.alt}
                    fill
                    sizes="(max-width: 1024px) 95vw, 850px"
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="border-t border-white/10 bg-[#070c14] p-6 space-y-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                      {selectedVehicle.tag} • {selectedVehicle.capacity}
                    </span>
                    <h4 className="font-display text-xl font-bold text-white mt-0.5">
                      {selectedVehicle.title}
                    </h4>
                    <p className="mt-1 font-mono text-xs text-gold-soft">
                      {selectedVehicle.specs}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-gray-300">
                      {selectedVehicle.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 border-t border-white/10 pt-3">
                    {selectedVehicle.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-200">
                        <CheckCircle2 size={14} className="text-gold shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setSelectedVehicle(null)}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Close Window
                    </button>
                    <Link
                      href={`/quote?moveSize=${selectedVehicle.moveSizeId}`}
                      onClick={() => setSelectedVehicle(null)}
                      className="rounded-xs bg-gold px-5 py-2.5 text-xs font-bold text-navy-deep hover:bg-gold-soft transition-colors"
                    >
                      Get a quote for this vehicle
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
