// src/lib/images.ts
// Single source of truth for the photography used across the site.
// Images live under /public/images and are served as static string paths.
//
// Centralizing them here (rather than hard-coding "/images/..." across
// components) keeps alt text consistent for accessibility/SEO and makes
// swapping an asset a one-line change.

export type ImageAsset = {
  /** Static path served from /public */
  src: string;
  /** Accessible description, used for alt text and OpenGraph captions. */
  alt: string;
};

/**
 * Canonical image registry. Reference via IMAGES.<key> in components,
 * never hard-code a path elsewhere.
 */
export const IMAGES = {
  // Hero — the headline photograph: two movers carrying a box together,
  // the core action the brand is built around.
  heroMovers: {
    src: "/images/portrait-two-smiling-professional-movers-effortlessly-carrying-cardboard-boxes-room-house-angled-top-view-young-male-334690896.webp",
    alt: "Two smiling professional movers carrying cardboard boxes through a room, viewed from above",
  },

  // Movers loading a truck on a sunny day — used for the CTA band and
  // the "we get you there" full-bleed moment.
  truckSunnyDay: {
    src: "/images/professional-movers-carrying-boxes-truck-bright-sunny-day-two-uniformed-carry-large-under-clear-blue-sky-image-410839417.webp",
    alt: "Professional movers in uniform carrying large boxes into a moving truck on a bright sunny day",
  },

  // Movers indoors with a tool case — used for inner page heroes and
  // the testimonials backdrop.
  indoorsWithTools: {
    src: "/images/uses-tools-from-case-two-young-movers-in-blue-uniform-working-indoors-in-the-room-free-photo.jpg",
    alt: "Two young movers in blue uniform using tools from a case while working indoors in a room",
  },

  // Warm packing scene — used for the stats band and packing service card.
  packingScene: {
    src: "/images/pexels-rdne-stock-project-7464479.jpg",
    alt: "Movers carefully wrapping and packing household items",
  },

  // Smiling mover portrait — used for the about page hero & trust strip.
  smilingMover: {
    src: "/images/pexels-rdne-7464493.jpg",
    alt: "Smiling professional mover in uniform standing ready to help",
  },

  // Two movers at work indoors — used for the quote page hero.
  moversWorking: {
    src: "/images/pexels-rdne-stock-project-7464657.jpg",
    alt: "Two professional movers working together to load boxes indoors",
  },

  // Warehouse / logistics scene — used for the services hero & storage card.
  storageWarehouse: {
    src: "/images/pexels-artempodrez-5025667.jpg",
    alt: "Organized storage warehouse with stacked boxes and inventory",
  },

  // Office / commercial move — used for the office service card.
  officeMove: {
    src: "/images/istockphoto-1709876640-612x612.jpg",
    alt: "Movers relocating office furniture and equipment",
  },

  // Generic accent texture — used as a soft decorative backdrop on the
  // service-area page. Kept generic on purpose.
  detailTexture: {
    src: "/images/OIP.webp",
    alt: "",
  },
} as const satisfies Record<string, ImageAsset>;

/**
 * Per-service image associations. The SERVICES array in constants.ts
 * references these keys so the same photograph stays attached to a
 * given service everywhere it appears.
 */
export const SERVICE_IMAGES = {
  "Local Moves": "indoorsWithTools",
  "Long-Distance Moves": "truckSunnyDay",
  "Packing & Unpacking": "packingScene",
  "Storage Solutions": "storageWarehouse",
  "Commercial & Office Moves": "officeMove",
} as const;

export type ServiceImageKey = keyof typeof SERVICE_IMAGES;
