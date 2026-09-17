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

  packing: {
    slug: "packing",
    title: "Full-Service Packing & Unpacking",
    subtitle: "Professional Packing, Fragile Wrapping & Moving Supplies",
    metaTitle: "Moving Packing Services Edmonton | Compass Cartage",
    metaDescription: "Professional packing and unpacking services in Edmonton. High-density dish packs, wardrobe boxes, shrink wrapping, and fragile care.",
    imageKey: "couplePacking",
    eyebrow: "Packing & Unpacking",
    tagline: "Save hours of stress — let our certified packing team prepare your entire home.",
    overview:
      "Packing is often the most exhausting part of any move. Compass Cartage provides complete full-home packing, fragile-only packing (china, glassware, fine art), and partial packing for tricky areas like kitchens and garages. We arrive with double-walled cartons, heavy bubble wrap, and acid-free packing paper to protect your valuables.",
    inclusions: [
      "Heavy-duty double-walled moving boxes & specialty wardrobe cartons",
      "Specialty dish-pack barrels with cellular dividers for fine china",
      "Acid-free newsprint paper, high-grade bubble wrap & stretch film",
      "Clear room-by-room box labeling and inventory cataloging",
      "Optional unpacking and debris removal service upon arrival",
    ],
    pricingGuide: [
      {
        title: "Fragile & Kitchen Only",
        rate: "Hourly + Supplies",
        description: "Kitchen dishware, glassware, artwork, mirrors, and delicate decor.",
        badge: "Most Popular",
      },
      {
        title: "Partial Home Packing",
        rate: "Custom Estimate",
        description: "Kitchen, living room, and fragile items packed before moving day.",
      },
      {
        title: "Turnkey Full-Home Packing",
        rate: "Complete Package",
        description: "Every room packed, labeled, and prepared the day before your move.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Supply Staging",
        desc: "We arrive with tailored box sizes, bubble wrap, and protective paper.",
      },
      {
        step: "02",
        title: "Fragile First",
        desc: "Dishes, glassware, electronics, and artwork receive custom multi-layer wrapping.",
      },
      {
        step: "03",
        title: "Room Color-Coding",
        desc: "Every box is labeled with its target room and contents for fast move-in.",
      },
      {
        step: "04",
        title: "Unpack & Debris Haul",
        desc: "Optional service to unpack onto flat surfaces and haul away all boxes.",
      },
    ],
    faqs: [
      {
        question: "Do I have to supply my own boxes?",
        answer: "No! We provide commercial-grade boxes, tape, and wrapping paper. You only pay for what is used.",
      },
      {
        question: "Can you pack the day before the move?",
        answer: "Yes, for larger 3-5 bedroom homes we typically schedule packing on the afternoon or day prior to ensure a seamless moving day.",
      },
    ],
  },

  "appliance-delivery": {
    slug: "appliance-delivery",
    title: "Couch, Appliance & Single-Item Delivery",
    subtitle: "Safely Moving Heavy Furniture, Refrigerators, Washers & Specialty Items",
    metaTitle: "Single Item & Appliance Delivery Edmonton | Compass Cartage",
    metaDescription: "Reliable couch, appliance, and heavy item pickup and delivery across Edmonton. Refrigerators, washers, dryers, and sectional sofas moved with care.",
    imageKey: "fridgeAppliance",
    eyebrow: "Appliance & Single-Item",
    tagline: "Fast, equipped pickup and delivery for single heavy items and marketplace purchases.",
    overview:
      "Need a new refrigerator, washer-dryer set, oversized sectional couch, or commercial showcase moved? You don't need to rent an entire moving truck or risk damaging your vehicle. Our 2-mover crew arrives with heavy-duty appliance dollies, neoprene floor runners, and ratcheting cargo straps to transport heavy or awkward items safely.",
    inclusions: [
      "Heavy-duty stair-climbing appliance dollies and four-wheel furniture dollies",
      "Thick quilted furniture pads and door jamb protectors",
      "Ratcheting straps for secure in-transit locking",
      "Disconnection and reconnection assistance (water/electrical lines where applicable)",
      "Curbside or inside-room delivery and placement",
    ],
    pricingGuide: [
      {
        title: "Single Large Furniture / Couch",
        rate: "Affordable Flat Rate",
        description: "Pickup and dropoff of sectional, sofa, armoire, or dining table.",
        badge: "Marketplace Special",
      },
      {
        title: "Major Kitchen Appliance",
        rate: "Equipment Rate",
        description: "Refrigerator, stove, dishwasher, or washer/dryer with stairs protection.",
      },
      {
        title: "Commercial Showcase / Heavy Item",
        rate: "Custom Equipment",
        description: "Gun safes, display cases, marble tables, and heavy specialty items.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Pickup Coordination",
        desc: "We coordinate pickup from the seller, retailer, or residence.",
      },
      {
        step: "02",
        title: "Protective Wrap",
        desc: "The item is blanketed and shrink-wrapped before passing through doors.",
      },
      {
        step: "03",
        title: "Strapped Transit",
        desc: "Secured tightly to our truck's E-track cargo rails.",
      },
      {
        step: "04",
        title: "In-Room Setup",
        desc: "Delivered up stairs or into the exact room of your choice.",
      },
    ],
    faqs: [
      {
        question: "Can you pick up items from Kijiji or Facebook Marketplace?",
        answer: "Yes! We frequently handle Marketplace and store deliveries with prompt payment and pickup coordination.",
      },
      {
        question: "Do you protect door frames and hardwood floors?",
        answer: "Always. We use padded doorway blankets and neoprene floor runners to prevent scrapes and dents.",
      },
    ],
  },

  "junk-removal": {
    slug: "junk-removal",
    title: "Junk Removal & Pre-Move Decluttering",
    subtitle: "Responsible Disposal, Donation Drops & Garage Cleanouts",
    metaTitle: "Junk Removal & Decluttering Edmonton | Compass Cartage",
    metaDescription: "Eco-friendly junk removal and pre-move cleanout services in Edmonton. Furniture disposal, donation drop-offs, and garage clearing with upfront rates.",
    imageKey: "storageWarehouse",
    eyebrow: "Junk Removal & Disposal",
    tagline: "Lighten your move — let us clear out unwanted furniture, appliances, and clutter responsibly.",
    overview:
      "Why pay to move things you no longer need? Compass Cartage combines moving and junk removal into one convenient booking. Before moving day or after an estate cleanout, our crew loads unwanted furniture, electronics, and household clutter, donating usable goods to Edmonton charities and recycling the rest at municipal eco-stations.",
    inclusions: [
      "All heavy lifting, carrying down stairs, and truck loading",
      "Donation drop-off to local Edmonton charitable organizations",
      "Environmentally responsible eco-station sorting & recycling",
      "Swept-clean finish in cleared areas",
      "Transparent pricing based on truck volume with zero surprise dump surcharges",
    ],
    pricingGuide: [
      {
        title: "Quarter Truck Load",
        rate: "Volume Flat Rate",
        description: "1-3 bulky furniture pieces or 10-15 boxes of clutter.",
        badge: "Quick Clearout",
      },
      {
        title: "Half Truck Load",
        rate: "Volume Flat Rate",
        description: "Small garage, basement corner, or bedroom cleanout.",
      },
      {
        title: "Full Truck Cleanout",
        rate: "Complete Job Rate",
        description: "Full estate, large garage, or major renovation debris clearing.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Point & Estimate",
        desc: "Point out what goes; we give an upfront volume rate on the spot.",
      },
      {
        step: "02",
        title: "Safe Removal",
        desc: "Our movers carry everything out without damaging walls or floors.",
      },
      {
        step: "03",
        title: "Charity & Eco Sorting",
        desc: "Items in good shape go to local shelters and community partners.",
      },
      {
        step: "04",
        title: "Broom Clean",
        desc: "We sweep up the staging area before heading out.",
      },
    ],
    faqs: [
      {
        question: "Can I combine junk removal with my moving day?",
        answer: "Yes! This is our most popular option. We can load your keeper items into our moving truck and dispose of unwanted items in a single dispatch.",
      },
      {
        question: "Do you take hazardous materials or paint?",
        answer: "We can advise on eco-station disposal, but cannot transport industrial hazardous chemicals or propane tanks.",
      },
    ],
  },

  "same-day": {
    slug: "same-day",
    title: "Same-Day & Emergency Moving Services",
    subtitle: "Fast-Dispatch Local Moves When Time is Critical",
    metaTitle: "Same Day & Emergency Movers Edmonton | Compass Cartage",
    metaDescription: "Urgent moving assistance in Edmonton. Last-minute apartment moves, lease-end emergencies, and short-notice relocations with quick dispatch.",
    imageKey: "moversNeededToday",
    eyebrow: "Emergency & Same-Day",
    tagline: "Need to move today? Our quick-response dispatch team is on call 7 days a week.",
    overview:
      "Unexpected lease changes, contractor delays, or movers who canceled at the last minute? Don't panic. Compass Cartage maintains reserve dispatch capacity for same-day and emergency moving situations across the Edmonton metro region. Call our dispatch hotline directly for immediate vehicle and crew assignment.",
    inclusions: [
      "Priority dispatch booking with rapid crew routing",
      "Fully stocked commercial moving vehicle with all pads, dollies & tools",
      "2 to 4 movers assigned depending on load size",
      "Full cargo insurance coverage even on short-notice jobs",
      "Upfront quote before we begin loading — no predatory emergency surcharges",
    ],
    pricingGuide: [
      {
        title: "Express Van / 1-2 Movers",
        rate: "Rapid Hourly",
        description: "Studio, single room, or small apartment emergency move.",
        badge: "Fastest Dispatch",
      },
      {
        title: "Standard Box Truck / 2-3 Movers",
        rate: "Standard Emergency",
        description: "Full 1-2 bedroom apartment or urgent condo vacancy.",
      },
      {
        title: "Full House Urgent Dispatch",
        rate: "Priority Crew Rate",
        description: "3-4 movers + large freight truck for sudden home turnovers.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Call Dispatch Directly",
        desc: "Call (587) 501-7519 for live truck availability and instant quote.",
      },
      {
        step: "02",
        title: "Crew En Route",
        desc: "Our team routes to your origin with a fully equipped truck.",
      },
      {
        step: "03",
        title: "Rapid Protective Load",
        desc: "Fast, efficient padding and loading without compromising safety.",
      },
      {
        step: "04",
        title: "Delivered & Done",
        desc: "Safely delivered to your new address before deadlines hit.",
      },
    ],
    faqs: [
      {
        question: "How quickly can you arrive?",
        answer: "Depending on traffic and crew staging, we can often arrive within 90 to 180 minutes of your call in Edmonton, St. Albert, and Sherwood Park.",
      },
      {
        question: "Are your same-day rates much higher?",
        answer: "We believe in fair, honest business. While priority dispatch carries standard scheduling parameters, we never charge predatory or hidden surcharges.",
      },
    ],
  },
};
