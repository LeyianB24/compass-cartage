// src/lib/constants.ts
// Single source of truth for business info used across the site.
// Update these values here and they'll update everywhere automatically.

export const BUSINESS = {
  name: "Compass Cartage",
  tagline: "Fast • Reliable • Affordable",
  owner: "Howard Langat",
  phone: "(587) 501-7519",
  phoneHref: "tel:+15875017519", // used for click-to-call links
  email: "compasscartage@gmail.com",
  serviceAreaShort: "Serving Metro Area & Beyond",
};

// Update this list once Howard confirms his exact coverage area.
export const SERVICE_AREAS = [
  "Calgary",
  "Airdrie",
  "Cochrane",
  "Okotoks",
  "Chestermere",
  // Add more cities/regions as confirmed
];

// Update once Howard confirms exact service offerings.
// NOTE: `imageKey` links each service to a key in SERVICE_IMAGES
// (see ./images.ts) so the right photograph stays attached to a
// given service everywhere it appears.
import type { ServiceImageKey } from "./images";

export type Service = {
  title: string;
  description: string;
  imageKey: ServiceImageKey;
};

export const SERVICES: Service[] = [
  {
    title: "Local Moves",
    description:
      "Full-service moving within the metro area — apartments, houses, and everything in between.",
    imageKey: "indoorsWithTools",
  },
  {
    title: "Long-Distance Moves",
    description:
      "Moving across the province or country? We handle logistics start to finish.",
    imageKey: "truckSunnyDay",
  },
  {
    title: "Packing & Unpacking",
    description:
      "Professional packing services to keep your belongings safe in transit.",
    imageKey: "packingScene",
  },
  {
    title: "Storage Solutions",
    description:
      "Short and long-term storage options for moves that need extra flexibility.",
    imageKey: "storageWarehouse",
  },
  {
    title: "Commercial & Office Moves",
    description:
      "Minimize downtime with efficient office and commercial relocation services.",
    imageKey: "officeMove",
  },
  {
    title: "Appliance & Heavy Items",
    description:
      "Fridges, pianos, safes, and gym equipment — moved with the right tools and crew.",
    imageKey: "fridgeAppliance",
  },
  {
    title: "Short-Notice Moves",
    description:
      "Need to move this week? We keep flexible slots open for last-minute and same-day jobs.",
    imageKey: "moversNeededToday",
  },
];

// Brand colors — mirrors the navy/gold theme from the business card & rate card.
export const BRAND_COLORS = {
  navy: "#0b1f3a",
  navyDeep: "#071426",
  gold: "#c9a227",
  goldSoft: "#e4c65c",
};