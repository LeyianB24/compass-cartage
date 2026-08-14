// src/lib/constants.ts
// Single source of truth for business info used across the site.

import type { ServiceImageKey } from "./images";

export const BUSINESS = {
  name: "Compass Cartage",
  tagline: "Fast • Reliable • Affordable",
  owner: "Howard Langat",
  phone: "(587) 501-7519", // TEMPORARY — will change once office line is set up
  phoneHref: "tel:+15875017519",
  email: "info@compasscartage.ca", // update once domain email is live
  serviceAreaShort: "Proudly Serving Edmonton & Alberta",
};

// CORRECTED: Compass Cartage is based in Edmonton, not Calgary.
// Local = Edmonton metro (daily service, no long-distance surcharge).
// Long-distance-within-Alberta = quote-based, less frequent, ordered
// Red Deer → Calgary → Lethbridge → Medicine Hat per client's own ordering.
export const SERVICE_AREAS = [
  "Edmonton",
  "Spruce Grove",
  "St. Albert",
  "Leduc",
  "Sherwood Park",
  "Beaumont",
  "Red Deer",
  "Calgary",
  "Lethbridge",
  "Medicine Hat",
];

// Coverage Detail for Interactive Coverage Checker
export type CoverageZoneDetail = {
  city: string;
  region: string;
  postalPrefixes: string[];
  travelFeeTier: "Standard" | "Regional" | "Long Distance";
  estTransitTime: string;
  description: string;
};

export const DETAILED_COVERAGE_ZONES: CoverageZoneDetail[] = [
  {
    city: "Edmonton",
    region: "Capital Region",
    postalPrefixes: [
      "T5A", "T5B", "T5C", "T5E", "T5G", "T5H", "T5J", "T5K", "T5L", "T5M",
      "T5N", "T5P", "T5R", "T5S", "T5T", "T5V", "T5W", "T5X", "T5Y", "T5Z",
      "T6A", "T6B", "T6C", "T6E", "T6G", "T6H", "T6J", "T6K", "T6L", "T6M",
      "T6N", "T6P", "T6R", "T6S", "T6T", "T6V", "T6W", "T6X",
    ],
    travelFeeTier: "Standard",
    estTransitTime: "Same-Day Local",
    description:
      "Core service hub. Full availability for local home, apartment, and office relocations with zero extended travel surcharges.",
  },
  {
    city: "Spruce Grove",
    region: "Capital Region",
    postalPrefixes: ["T7X"],
    travelFeeTier: "Standard",
    estTransitTime: "25 mins from base",
    description: "Daily service routes connecting Spruce Grove to Edmonton.",
  },
  {
    city: "St. Albert",
    region: "Capital Region",
    postalPrefixes: ["T8N"],
    travelFeeTier: "Standard",
    estTransitTime: "20 mins from base",
    description: "Full local service for St. Albert homes and businesses.",
  },
  {
    city: "Leduc",
    region: "Capital Region",
    postalPrefixes: ["T9E"],
    travelFeeTier: "Standard",
    estTransitTime: "30 mins from base",
    description: "Regular routes serving Leduc and surrounding communities.",
  },
  {
    city: "Sherwood Park",
    region: "Strathcona County",
    postalPrefixes: ["T8A", "T8B", "T8H"],
    travelFeeTier: "Standard",
    estTransitTime: "20 mins from base",
    description: "Quick-dispatch local moves throughout Sherwood Park.",
  },
  {
    city: "Beaumont",
    region: "Capital Region",
    postalPrefixes: ["T4X"],
    travelFeeTier: "Standard",
    estTransitTime: "30 mins from base",
    description: "Full local service for Beaumont homes and businesses.",
  },
  {
    city: "Red Deer",
    region: "Central Alberta",
    postalPrefixes: ["T4N", "T4P", "T4R"],
    travelFeeTier: "Long Distance",
    estTransitTime: "~1 hour 45 mins",
    description:
      "Long-distance relocation between Edmonton and Red Deer, quoted per move.",
  },
  {
    city: "Calgary",
    region: "Southern Alberta",
    postalPrefixes: [
      "T2A", "T2B", "T2C", "T2E", "T2G", "T2H", "T2J", "T2K", "T2L", "T2M",
      "T2N", "T2P", "T2R", "T2S", "T2T", "T2V", "T2W", "T2X", "T2Y", "T2Z",
      "T3A", "T3B", "T3C", "T3E", "T3G", "T3H", "T3J", "T3K", "T3L", "T3M",
      "T3N", "T3P", "T3R", "T3S",
    ],
    travelFeeTier: "Long Distance",
    estTransitTime: "~3 hours",
    description:
      "Edmonton to Calgary long-distance relocation, scheduled and quoted per move.",
  },
  {
    city: "Lethbridge",
    region: "Southern Alberta",
    postalPrefixes: ["T1H", "T1J", "T1K"],
    travelFeeTier: "Long Distance",
    estTransitTime: "~4 hours",
    description: "Long-distance moves from Edmonton to Lethbridge.",
  },
  {
    city: "Medicine Hat",
    region: "Southeastern Alberta",
    postalPrefixes: ["T1A", "T1B", "T1C"],
    travelFeeTier: "Long Distance",
    estTransitTime: "~4.5 hours",
    description: "Long-distance moves from Edmonton to Medicine Hat.",
  },
];

// Client note: no maximum distance for moves outside Alberta, but those
// are limited to twice a month (every two weeks) due to scheduling.
export const OUT_OF_PROVINCE_NOTE =
  "No maximum distance for moves outside Alberta — these are scheduled twice a month (every two weeks). Contact us to check the next available slot.";

export type Service = {
  title: string;
  description: string;
  imageKey: ServiceImageKey;
};

// Matches Howard's actual service list. Everything is quote-based —
// free quotes, flexible scheduling.
export const SERVICES: Service[] = [
  {
    title: "Local Moves",
    description:
      "Full-service moving within Edmonton and surrounding communities — quoted upfront, no surprises.",
    imageKey: "indoorsWithTools",
  },
  {
    title: "Long-Distance Moves",
    description:
      "Moving across Alberta or beyond. No maximum distance for out-of-province moves — scheduled every two weeks.",
    imageKey: "truckSunnyDay",
  },
  {
    title: "Storage Moves",
    description:
      "Moving items into or out of storage, handled with the same care as a full household move.",
    imageKey: "storageWarehouse",
  },
  {
    title: "Furniture Storage",
    description:
      "Short and long-term storage for furniture between moves, renovations, or downsizing.",
    imageKey: "storageWarehouse",
  },
  {
    title: "Couch & Appliance Delivery",
    description:
      "Single large-item delivery — couches, fridges, washers/dryers, and more.",
    imageKey: "fridgeAppliance",
  },
  {
    title: "Single-Item Moves",
    description:
      "Just need one thing moved? We handle single-item jobs without a full crew markup.",
    imageKey: "fridgeAppliance",
  },
  {
    title: "Moving-Related Packing",
    description:
      "Packing help so your belongings travel safely, without you doing it all yourself.",
    imageKey: "packingScene",
  },
  {
    title: "Loading & Unloading",
    description:
      "Renting your own truck? We'll handle the heavy lifting on either end.",
    imageKey: "indoorsWithTools",
  },
  {
    title: "Junk Removal",
    description:
      "Clearing out items you don't want to bring with you — responsibly disposed of.",
    imageKey: "storageWarehouse",
  },
  {
    title: "Last-Minute & Same-Day Moves",
    description:
      "Flexible scheduling for moves that can't wait — especially for smaller jobs.",
    imageKey: "moversNeededToday",
  },
];

// Brand colors — matches business card, rate card, and website.
export const BRAND_COLORS = {
  navy: "#0b1f3a",
  navyDeep: "#071426",
  gold: "#c9a227",
  goldSoft: "#e4c65c",
};

// -----------------------------------------------------------------------------
// Interactive Moving Cost Estimator Configurations
// (kept as-is — not geography-dependent)
// -----------------------------------------------------------------------------
export type MoveSizeOption = {
  id: string;
  label: string;
  sublabel: string;
  baseLaborHours: number;
  recommendedCrew: number;
  truckSize: string;
  estVolumeCuFt: number;
  basePrice: number;
};

export const MOVE_SIZES: MoveSizeOption[] = [
  {
    id: "studio",
    label: "Studio Apartment",
    sublabel: "1-2 rooms, partial furniture",
    baseLaborHours: 3,
    recommendedCrew: 2,
    truckSize: "16ft Box Truck",
    estVolumeCuFt: 350,
    basePrice: 280,
  },
  {
    id: "1-bedroom",
    label: "1 Bedroom Home",
    sublabel: "Full bedroom, living room & kitchen",
    baseLaborHours: 4,
    recommendedCrew: 2,
    truckSize: "16ft - 20ft Truck",
    estVolumeCuFt: 550,
    basePrice: 380,
  },
  {
    id: "2-bedroom",
    label: "2 Bedroom Home",
    sublabel: "Apartment, townhouse or condo",
    baseLaborHours: 5.5,
    recommendedCrew: 3,
    truckSize: "20ft - 24ft Truck",
    estVolumeCuFt: 850,
    basePrice: 560,
  },
  {
    id: "3-bedroom",
    label: "3 Bedroom House",
    sublabel: "Full single-family home",
    baseLaborHours: 7.5,
    recommendedCrew: 3,
    truckSize: "26ft Heavy Truck",
    estVolumeCuFt: 1200,
    basePrice: 780,
  },
  {
    id: "4-plus-bedroom",
    label: "4+ Bedroom House",
    sublabel: "Large estate, multi-level home",
    baseLaborHours: 9.5,
    recommendedCrew: 4,
    truckSize: "26ft Truck + Support Van",
    estVolumeCuFt: 1700,
    basePrice: 1050,
  },
  {
    id: "office-small",
    label: "Small Office",
    sublabel: "1 - 5 workstations & equipment",
    baseLaborHours: 4.5,
    recommendedCrew: 2,
    truckSize: "20ft Truck",
    estVolumeCuFt: 600,
    basePrice: 450,
  },
  {
    id: "office-large",
    label: "Large Commercial",
    sublabel: "Corporate floor or retail store",
    baseLaborHours: 10,
    recommendedCrew: 4,
    truckSize: "Multiple 26ft Fleet Trucks",
    estVolumeCuFt: 2200,
    basePrice: 1250,
  },
];

export const SPECIALTY_ADDONS = [
  { id: "full-packing", label: "Full Professional Packing", cost: 180, description: "Boxes, bubble wrap & full packing labor included" },
  { id: "heavy-appliance", label: "Fridge / Large Appliance", cost: 95, description: "Heavy-duty dolly straps & protective blankets" },
  { id: "piano-safe", label: "Piano / Gun Safe / Gym Rig", cost: 160, description: "Specialty rigging equipment & heavy-lift crew" },
  { id: "storage-1week", label: "1 Week Vault Storage", cost: 120, description: "Climate controlled secure storage space" },
  { id: "unpacking", label: "Unpacking & Setup", cost: 140, description: "Unbox & place items in designated rooms" },
];

// -----------------------------------------------------------------------------
// Inventory Planner Items (kept as-is — not geography-dependent)
// -----------------------------------------------------------------------------
export type InventoryCategory = {
  name: string;
  icon: string;
  items: Array<{
    id: string;
    name: string;
    cuFt: number;
    weightLbs: number;
  }>;
};

export const INVENTORY_CATEGORIES: InventoryCategory[] = [
  {
    name: "Living Room",
    icon: "Sofa",
    items: [
      { id: "sofa-3seat", name: "3-Seater Sofa", cuFt: 60, weightLbs: 150 },
      { id: "sectional", name: "L-Sectional Sofa", cuFt: 110, weightLbs: 260 },
      { id: "armchair", name: "Armchair / Recliner", cuFt: 25, weightLbs: 65 },
      { id: "tv-stand", name: "TV Stand / Entertainment Unit", cuFt: 30, weightLbs: 70 },
      { id: "large-tv", name: "Large Flat TV (55\"+)", cuFt: 10, weightLbs: 45 },
      { id: "coffee-table", name: "Coffee Table", cuFt: 15, weightLbs: 35 },
      { id: "bookshelf", name: "Tall Bookshelf", cuFt: 35, weightLbs: 80 },
    ],
  },
  {
    name: "Bedroom",
    icon: "Bed",
    items: [
      { id: "king-bed", name: "King Bed Frame & Mattress", cuFt: 75, weightLbs: 180 },
      { id: "queen-bed", name: "Queen Bed Frame & Mattress", cuFt: 60, weightLbs: 140 },
      { id: "twin-bed", name: "Single / Twin Bed", cuFt: 35, weightLbs: 85 },
      { id: "dresser", name: "6-Drawer Dresser", cuFt: 45, weightLbs: 120 },
      { id: "nightstand", name: "Nightstand", cuFt: 10, weightLbs: 25 },
      { id: "wardrobe", name: "Armoire / Wardrobe", cuFt: 50, weightLbs: 140 },
    ],
  },
  {
    name: "Kitchen & Dining",
    icon: "Utensils",
    items: [
      { id: "dining-table", name: "Dining Table (6-seater)", cuFt: 45, weightLbs: 100 },
      { id: "dining-chair", name: "Dining Chair", cuFt: 8, weightLbs: 15 },
      { id: "refrigerator", name: "Full Refrigerator", cuFt: 55, weightLbs: 250 },
      { id: "microwave", name: "Microwave / Countertop Appliance", cuFt: 5, weightLbs: 30 },
      { id: "china-cabinet", name: "China Cabinet / Buffet", cuFt: 55, weightLbs: 160 },
    ],
  },
  {
    name: "Home Office",
    icon: "Briefcase",
    items: [
      { id: "executive-desk", name: "Large Desk / Executive Desk", cuFt: 40, weightLbs: 110 },
      { id: "office-chair", name: "Ergonomic Office Chair", cuFt: 15, weightLbs: 35 },
      { id: "filing-cabinet", name: "2-Drawer File Cabinet", cuFt: 15, weightLbs: 45 },
      { id: "monitor-setup", name: "Desktop Computer & Monitors", cuFt: 8, weightLbs: 25 },
    ],
  },
  {
    name: "Boxes & Miscellaneous",
    icon: "Package",
    items: [
      { id: "box-small", name: "Small Box (Books/Heavy)", cuFt: 1.5, weightLbs: 30 },
      { id: "box-medium", name: "Medium Box (General Household)", cuFt: 3.0, weightLbs: 35 },
      { id: "box-large", name: "Large Box (Linens/Pillows)", cuFt: 4.5, weightLbs: 30 },
      { id: "wardrobe-box", name: "Hanging Wardrobe Box", cuFt: 12, weightLbs: 45 },
      { id: "bicycle", name: "Bicycle / Sports Equipment", cuFt: 20, weightLbs: 30 },
      { id: "patio-set", name: "Patio Table & Chairs", cuFt: 40, weightLbs: 85 },
    ],
  },
];

// -----------------------------------------------------------------------------
// Relocation Checklist Timeline (kept as-is — not geography-dependent)
// -----------------------------------------------------------------------------
export type ChecklistMilestone = {
  id: string;
  timeframe: string;
  title: string;
  tasks: Array<{ id: string; text: string; category: string }>;
};

export const RELOCATION_CHECKLIST: ChecklistMilestone[] = [
  {
    id: "8-weeks",
    timeframe: "8 Weeks Before Move",
    title: "Planning & Scoping",
    tasks: [
      { id: "t1", text: "Get a free quote from Compass Cartage and reserve your move date", category: "Booking" },
      { id: "t2", text: "Create a moving budget and inventory all belongings room by room", category: "Inventory" },
      { id: "t3", text: "Sort belongings into Keep, Donate, Sell, and Trash categories", category: "Declutter" },
      { id: "t4", text: "Gather important records (medical, dental, school, veterinary) into a secure binder", category: "Admin" },
    ],
  },
  {
    id: "4-weeks",
    timeframe: "4 Weeks Before Move",
    title: "Packing & Notifications",
    tasks: [
      { id: "t5", text: "Order moving boxes, packing tape, bubble wrap, and markers", category: "Supplies" },
      { id: "t6", text: "Begin packing non-essential items (seasonal decor, books, extra linens)", category: "Packing" },
      { id: "t7", text: "Notify utility providers (power, water, internet, gas) to schedule transfer/disconnect", category: "Utilities" },
      { id: "t8", text: "File change of address with Canada Post and update bank & insurance records", category: "Admin" },
    ],
  },
  {
    id: "2-weeks",
    timeframe: "2 Weeks Before Move",
    title: "Preparation & Logistics",
    tasks: [
      { id: "t9", text: "Confirm move timing and parking/elevator access with Compass Cartage", category: "Booking" },
      { id: "t10", text: "Pack the majority of household items, labeling every box with destination room", category: "Packing" },
      { id: "t11", text: "Drain gas and oil from lawnmowers and outdoor power tools", category: "Safety" },
      { id: "t12", text: "Arrange childcare or pet sitting for moving day", category: "Family" },
    ],
  },
  {
    id: "1-week",
    timeframe: "1 Week Before Move",
    title: "Final Countdown",
    tasks: [
      { id: "t13", text: "Pack an 'Essentials First-Night Box' (toiletries, change of clothes, chargers, basic tools)", category: "Essentials" },
      { id: "t14", text: "Defrost refrigerator and freezer 24 hours prior to move if transporting", category: "Appliances" },
      { id: "t15", text: "Disassemble large furniture pieces (bed frames, dining table legs)", category: "Furniture" },
      { id: "t16", text: "Charge all mobile phones, tablets, and portable battery packs", category: "Admin" },
    ],
  },
  {
    id: "move-day",
    timeframe: "Moving Day!",
    title: "Execution & Transition",
    tasks: [
      { id: "t17", text: "Greet the Compass Cartage crew and perform initial walkthrough of the property", category: "Move Day" },
      { id: "t18", text: "Point out high-value or fragile items needing specialized handling", category: "Safety" },
      { id: "t19", text: "Do a final walk-through of closets, cabinets, attic, and garage before truck leaves", category: "Verification" },
      { id: "t20", text: "Verify final destination address and sign bills of lading", category: "Admin" },
    ],
  },
  {
    id: "post-move",
    timeframe: "Post-Move",
    title: "Settling In",
    tasks: [
      { id: "t21", text: "Assemble beds and set up essential nightstand lighting first", category: "Setup" },
      { id: "t22", text: "Unpack kitchen boxes and connect major appliances", category: "Kitchen" },
      { id: "t23", text: "Inspect all furniture and boxes for safe delivery", category: "Verification" },
      { id: "t24", text: "Leave an honest review of your experience with Compass Cartage", category: "Feedback" },
    ],
  },
];

// -----------------------------------------------------------------------------
// Searchable FAQ Data (kept as-is — not geography-dependent)
// -----------------------------------------------------------------------------
export type FaqItem = {
  id: string;
  category: "Pricing & Quotes" | "Moving Safety & Care" | "Packing & Logistics" | "Services & Storage";
  question: string;
  answer: string;
};

export const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    category: "Pricing & Quotes",
    question: "How do you calculate moving quotes?",
    answer: "Our quotes are transparent and binding. For local moves, we calculate based on estimated labor hours, crew size, and distance tier. For long-distance moves, we calculate based on overall volume (cubic feet), mileage, and access conditions (stairs/elevators). There are no surprise fees on moving day.",
  },
  {
    id: "faq-2",
    category: "Pricing & Quotes",
    question: "Are there any hidden fuel or stair fees?",
    answer: "No. Unlike traditional movers who add unexpected line items, all stair travel, fuel surcharges, and heavy equipment usage are explicitly detailed in your written quote before move day.",
  },
  {
    id: "faq-3",
    category: "Moving Safety & Care",
    question: "Is Compass Cartage fully insured?",
    answer: "Yes, 100%. We carry comprehensive commercial cargo insurance, general liability coverage, and full worker's compensation. Your furniture and property are protected throughout transit.",
  },
  {
    id: "faq-4",
    category: "Moving Safety & Care",
    question: "How do you protect delicate furniture and hardwood floors?",
    answer: "Our crews use thick padded moving blankets, custom stretch wrapping, doorframe guards, and heavy-duty floor runners on every job. High-value glass and electronics receive specialty bubble wrapping.",
  },
  {
    id: "faq-5",
    category: "Packing & Logistics",
    question: "Can I pack my own boxes or do you provide full packing?",
    answer: "You have complete flexibility! You can pack your own boxes and have us load/transport them, or you can opt for our Full Packing Service where our trained team carefully packs your entire home with premium supplies.",
  },
  {
    id: "faq-6",
    category: "Packing & Logistics",
    question: "What items cannot be moved in the truck?",
    answer: "For safety regulations, we cannot transport hazardous flammables (gasoline, propane tanks, fireworks, paint thinners), perishable unsealed food, or live animals/pets. You should keep personal documents and jewelry with you.",
  },
  {
    id: "faq-7",
    category: "Services & Storage",
    question: "Do you offer short-notice or weekend moves?",
    answer: "Yes! We keep flexible slots open for same-week and short-notice emergencies, especially for smaller jobs.",
  },
  {
    id: "faq-8",
    category: "Services & Storage",
    question: "How often do you run moves outside Alberta?",
    answer: "There's no maximum distance for moves outside Alberta, but these are scheduled twice a month (every two weeks) to keep logistics reliable. Reach out for the next available slot.",
  },
];