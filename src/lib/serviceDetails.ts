// src/lib/serviceDetails.ts

export type ServiceDetail = {
  slug: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  imageKey: "heroMovers" | "officeMove" | "storageWarehouse" | "hireMovingServices" | "couplePacking" | "fridgeAppliance" | "moversNeededToday";
  eyebrow: string;
  tagline: string;
  overview: string;
  inclusions: string[];
  pricingGuide: {
    title: string;
    rate: string;
    description: string;
    badge?: string;
  }[];
  process: {
    step: string;
    title: string;
    desc: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  residential: {
    slug: "residential",
    title: "Residential Moving Services",
    subtitle: "Apartments, Condominiums, Townhomes & Family Houses",
    metaTitle: "Residential Movers Edmonton | Compass Cartage",
    metaDescription: "Professional residential moving in Edmonton and across Alberta. Fully insured crew, furniture blankets, and no surprise stair fees.",
    imageKey: "heroMovers",
    eyebrow: "Residential Moving",
    tagline: "Your entire home relocated with zero stress and complete care.",
    overview:
      "Whether you're moving from a 1-bedroom high-rise downtown or a 5-bedroom family home in St. Albert or Sherwood Park, our experienced, full-time crew handles all heavy lifting, wrapping, disassembly, and careful placement in your new home.",
    inclusions: [
      "Thick quilted furniture moving blankets & stretch wrap",
      "Floor protection runners & doorway padding",
      "Disassembly & reassembly of bed frames, tables & desks",
      "Comprehensive cargo insurance & licensed crew coverage",
      "Transparent upfront pricing with zero hidden surcharges",
    ],
    pricingGuide: [
      {
        title: "1-2 Bedroom Apartment",
        rate: "Custom Hourly Estimate",
        description: "2 professional movers + fully equipped moving truck.",
        badge: "Most Popular",
      },
      {
        title: "3-4 Bedroom House",
        rate: "Custom Hourly Estimate",
        description: "3 professional movers + heavy-duty moving truck.",
      },
      {
        title: "Large Estate / 5+ Bed",
        rate: "Custom Flat Quote",
        description: "4+ movers, multiple trucks, dedicated moving coordination.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Free Pre-Move Estimate",
        desc: "We review your room inventory, access details, and dates to provide a clear, binding quote.",
      },
      {
        step: "02",
        title: "Floor & Furniture Prep",
        desc: "We lay down carpet runners and pad all wooden/upholstered furniture before moving a single box.",
      },
      {
        step: "03",
        title: "Smooth Direct Transit",
        desc: "Everything is strapped and locked securely in our moving trucks for a safe journey.",
      },
      {
        step: "04",
        title: "Placement in Assigned Rooms",
        desc: "We place every box where you want it and reassemble all beds and tables before departure.",
      },
    ],
    faqs: [
      {
        question: "Do you charge extra for stairs or elevator moves?",
        answer: "All access factors (stairs, elevators, long walks) are clearly reviewed upfront during your estimate so there are no surprise fees added on moving day.",
      },
      {
        question: "Are my belongings insured during the move?",
        answer: "Yes, 100%. We carry full cargo transit protection and commercial liability coverage. Your belongings are protected throughout the move.",
      },
      {
        question: "Can you disassemble and reassemble our beds?",
        answer: "Yes, basic furniture disassembly and reassembly (standard bed frames, dining tables) is included in every residential move at no extra charge.",
      },
    ],
  },

  commercial: {
    slug: "commercial",
    title: "Commercial & Office Relocations",
    subtitle: "Offices, Retail, Clinics & Facilities",
    metaTitle: "Commercial & Office Movers Edmonton | Compass Cartage",
    metaDescription: "Minimize downtime with weekend & evening office relocations across Edmonton. Workstations, filing systems & furniture.",
    imageKey: "officeMove",
    eyebrow: "Commercial Relocation",
    tagline: "Organized office transitions planned to keep your business operating.",
    overview:
      "We understand that business downtime costs money. Compass Cartage specializes in scheduled evening and weekend office relocations, workstation transfers, file transport, and corporate furniture setup.",
    inclusions: [
      "Weekend & after-hours moving slots to minimize operational downtime",
      "Padded equipment dollies & protective IT wrapping",
      "Modular workstation teardown & conference room setup",
      "Certificate of Insurance (COI) provided for commercial property managers",
      "Furniture disposal & eco-friendly recycling coordination on request",
    ],
    pricingGuide: [
      {
        title: "Small Office (1-5 Workstations)",
        rate: "Custom Hourly Estimate",
        description: "2-3 movers + commercial ramp truck + moving equipment.",
      },
      {
        title: "Medium Corporate (6-20 Desks)",
        rate: "Custom Project Quote",
        description: "Phased weekend schedule + dedicated project lead.",
        badge: "Recommended",
      },
      {
        title: "Large Floor / Facility",
        rate: "Comprehensive Scope Quote",
        description: "Multi-truck fleet, phased logistics, dedicated coordination.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Site Survey & Logistics Plan",
        desc: "We inspect building elevators, loading docks, and generate a Certificate of Insurance for property managers.",
      },
      {
        step: "02",
        title: "Organized Labeling & Prep",
        desc: "Desks, monitors, and file boxes receive clear tags mapped to your new floorplan.",
      },
      {
        step: "03",
        title: "After-Hours Execution",
        desc: "We execute Friday evening or Saturday, leaving Sunday for network and setup checks.",
      },
      {
        step: "04",
        title: "Monday-Ready Delivery",
        desc: "Employees arrive Monday morning to their workstations ready to work.",
      },
    ],
    faqs: [
      {
        question: "Can you provide a Certificate of Insurance (COI) for our building manager?",
        answer: "Yes, we issue building-compliant COIs naming your property manager as additional insured upon request.",
      },
      {
        question: "Do you move after hours and on weekends?",
        answer: "Yes, our commercial relocations can be scheduled for Friday evenings and weekends to prevent business interruption.",
      },
    ],
  },

  storage: {
    slug: "storage",
    title: "Secure Storage Solutions",
    subtitle: "Clean, Climate-Controlled Short & Long-Term Storage",
    metaTitle: "Secure Storage Edmonton | Compass Cartage",
    metaDescription: "Clean, temperature-regulated furniture storage solutions in Edmonton. Direct pickup from your home and flexible monthly terms.",
    imageKey: "storageWarehouse",
    eyebrow: "Secure Storage",
    tagline: "Safe, climate-controlled temporary homes for your furniture and valuables.",
    overview:
      "Need a place to keep your furniture while renovating, waiting on possession dates, or downsizing? Our climate-controlled storage solutions offer clean, secure space with direct pickup and delivery.",
    inclusions: [
      "Monitored, secure facilities with controlled access",
      "Full climate regulation (heated in winter, cooled in summer)",
      "Protective furniture wrapping and organized storage placement",
      "Itemized inventory tracking for all stored items",
      "No long-term lease commitments — flexible month-to-month billing",
    ],
    pricingGuide: [
      {
        title: "Partial Household (1-2 Rooms)",
        rate: "Flexible Monthly Rate",
        description: "Ideal for staging, downsizing, or temporary renovation storage.",
      },
      {
        title: "Apartment / Condo (2-3 Rooms)",
        rate: "Flexible Monthly Rate",
        description: "Full apartment storage with direct pickup and delivery.",
        badge: "Popular Choice",
      },
      {
        title: "Full House Storage",
        rate: "Custom Storage Quote",
        description: "Multi-room household storage tailored to your timeline.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Direct Pickup",
        desc: "Our crew loads your furniture and boxes directly into padded storage containers at your door.",
      },
      {
        step: "02",
        title: "Vault Sealing & Logging",
        desc: "Items are inventoried, wrapped in breathable pads, and secured in our temperature-controlled warehouse.",
      },
      {
        step: "03",
        title: "Redelivery on Your Schedule",
        desc: "Whenever your new home is ready, we dispatch the vault and unload directly into your rooms.",
      },
    ],
    faqs: [
      {
        question: "Is your storage facility heated in Edmonton winters?",
        answer: "Yes, our facilities maintain strict climate control year-round to prevent moisture, wood warping, or freezing damage.",
      },
      {
        question: "Can I access my storage vault if I need something?",
        answer: "Yes, with 24 hours notice, our warehouse team can arrange private access to your assigned vault.",
      },
    ],
  },

  "long-distance": {
    slug: "long-distance",
    title: "Long-Distance & Interprovincial Moves",
    subtitle: "Across Alberta, British Columbia, Saskatchewan & Beyond",
    metaTitle: "Long-Distance Moving Edmonton | Compass Cartage",
    metaDescription: "Direct long-distance moving from Edmonton to Calgary, Red Deer, BC, and beyond. Dedicated truck — never mixed with other customers' cargo.",
    imageKey: "hireMovingServices",
    eyebrow: "Long-Distance Relocation",
    tagline: "Dedicated express moving across Western Canada with one trusted crew.",
    overview:
      "Unlike freight brokers who shuffle your belongings between multiple third-party trailers, Compass Cartage provides dedicated direct hauls. The same crew that loads your home drives the truck and delivers directly to your new address.",
    inclusions: [
      "Dedicated truck — your belongings are NEVER co-mingled with strangers' cargo",
      "Guaranteed binding delivery windows (no 2-week delays)",
      "Real-time GPS tracking and regular driver check-ins",
      "Comprehensive interprovincial transit insurance",
      "Complete assembly and room placement upon arrival",
    ],
    pricingGuide: [
      {
        title: "Edmonton ↔ Calgary / Red Deer",
        rate: "Direct Express Flat Rate",
        description: "Same-day or next-morning guaranteed delivery.",
        badge: "Daily Route",
      },
      {
        title: "Alberta ↔ British Columbia",
        rate: "Dedicated Interprovincial",
        description: "Vancouver, Kelowna, Victoria & Island deliveries.",
      },
      {
        title: "Alberta ↔ Saskatchewan / MB",
        rate: "Prairie Express Flat Rate",
        description: "Saskatoon, Regina, Winnipeg direct transit.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Virtual or In-Person Survey",
        desc: "We calculate exact cubic footage and weight to lock in a guaranteed binding price.",
      },
      {
        step: "02",
        title: "Single-Customer Truck Load",
        desc: "Your home fills a dedicated truck; we seal the doors in your presence.",
      },
      {
        step: "03",
        title: "Direct Highway Transit",
        desc: "Our licensed drivers proceed straight to your destination without cross-dock delays.",
      },
      {
        step: "04",
        title: "Unpack & Inspect",
        desc: "We unpack, place furniture, and verify condition before final sign-off.",
      },
    ],
    faqs: [
      {
        question: "Will my items be transferred to another truck during transit?",
        answer: "Never. Your belongings remain locked in our dedicated vehicle from pickup to delivery.",
      },
      {
        question: "How fast is a move between Edmonton and Calgary?",
        answer: "We offer same-day or next-morning delivery between Edmonton and Calgary/Red Deer.",
      },
    ],
  },
};
