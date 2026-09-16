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
  // --- REAL COMPASS CARTAGE MOVING FLEET ---
  // 1. 26ft Commercial Freight Box Truck (Lorry)
  lorry1: {
    src: "/images/lorry1.jpeg",
    alt: "Compass Cartage 26ft commercial freight moving truck with hydraulic lift gate",
  },
  lorry2: {
    src: "/images/lorry2.jpeg",
    alt: "Compass Cartage heavy freight moving truck loading bay and chassis",
  },
  lorry3: {
    src: "/images/lorry3.jpeg",
    alt: "Compass Cartage moving fleet depot and transport truck stationed in Edmonton",
  },

  // 2. High-Roof Custom Transit Van (Charcoal Grey)
  transitVanGrey: {
    src: "/images/hero 2.jpg",
    alt: "Compass Cartage high-roof Ford Transit moving van for apartment and express moves",
  },
  transitVanGreyWheel: {
    src: "/images/hero 4.jpg",
    alt: "Compass Cartage Ford Transit commercial all-terrain clearance for Alberta moves",
  },

  // 3. Heavy-Duty Tri-Axle Enclosed Moving Trailer (65TRL01)
  enclosedTrailerBlue: {
    src: "/images/hero 3.jpg",
    alt: "Compass Cartage heavy-duty tri-axle enclosed moving trailer (Unit 65TRL01)",
  },
  enclosedTrailerFacility: {
    src: "/images/hero 8.jpg",
    alt: "Compass Cartage tri-axle commercial moving trailer stationed at maintenance facility",
  },
  enclosedTrailerProfile: {
    src: "/images/hero 5.jpg",
    alt: "Compass Cartage weather-sealed tri-axle cargo transport trailer for intercity moves",
  },

  // 4. High-Roof Residential Delivery Van (White)
  residentialDeliveryVan: {
    src: "/images/hero 6.jpg",
    alt: "Compass Cartage residential moving van loaded with furniture and boxes at customer driveway",
  },
  residentialDeliveryVanAlt: {
    src: "/images/hero 7.jpg",
    alt: "Compass Cartage residential relocation van open for secure unloading",
  },

  // 5. Interior Van Cargo & Furniture Protection
  cargoInteriorLoading: {
    src: "/images/hero 1.jpg",
    alt: "Compass Cartage interior van cargo bay with padded mattresses and organized boxes",
  },

  // Legacy mappings for backwards compatibility
  heroMovers: {
    src: "/images/hero 1.jpg",
    alt: "Compass Cartage moving crew and fleet handling relocation",
  },
  hero1: {
    src: "/images/hero 1.jpg",
    alt: "Compass Cartage professional moving crew and truck in Edmonton",
  },
  hero2: {
    src: "/images/hero 2.jpg",
    alt: "Compass Cartage moving truck and uniformed relocation team",
  },
  hero3: {
    src: "/images/hero 3.jpg",
    alt: "Compass Cartage movers loading household belongings securely",
  },
  hero4: {
    src: "/images/hero 4.jpg",
    alt: "Compass Cartage residential relocation team at work",
  },
  hero5: {
    src: "/images/hero 5.jpg",
    alt: "Compass Cartage moving van and crew preparing items for transit",
  },
  hero6: {
    src: "/images/hero 6.jpg",
    alt: "Compass Cartage logistics transport and furniture protection",
  },
  hero7: {
    src: "/images/hero 7.jpg",
    alt: "Compass Cartage express relocation fleet across Alberta",
  },
  hero8: {
    src: "/images/hero 8.jpg",
    alt: "Compass Cartage dedicated moving crew and transport",
  },

  // Movers loading a truck on a sunny day — used for the CTA band
  truckSunnyDay: {
    src: "/images/hero 2.jpg",
    alt: "Professional movers in uniform with moving truck on moving day",
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

  // ---- New arrivals ----

  // A couple prepping for a packing process — warm, human, domestic.
  couplePacking: {
    src: "/images/a-couple-preparing-for-the-packing-process.jpeg",
    alt: "A couple preparing for the packing process before a move",
  },

  // Fridge / appliance move — specialty heavy-item handling.
  fridgeAppliance: {
    src: "/images/fridge3.jpeg",
    alt: "Movers carefully transporting a refrigerator appliance",
  },

  // "Movers needed today" — short-notice / same-day move energy.
  moversNeededToday: {
    src: "/images/63185a05af058b28b09c5044_movers-needed-today.jpg",
    alt: "Movers unloading a truck for a short-notice move",
  },

  // Dedicated haul relocation asset
  hireMovingServices: {
    src: "/images/lorry1.jpeg",
    alt: "Compass Cartage moving truck on route for long-distance relocation",
  },

  // Packers and movers service — general crew-at-work shot.
  packersAndMovers: {
    src: "/images/1681205388packers-and-movers-service.webp",
    alt: "Packers and movers service crew loading packed boxes",
  },

  // Alternate two-movers indoor shot — variety for the gallery.
  moversWorkingAlt: {
    src: "/images/pexels-rdne-7464643.jpg",
    alt: "Two professional movers coordinating a move indoors",
  },

  // Generic "50.jpg" — used as a soft texture/accent. Decorative only.
  accentTexture50: {
    src: "/images/50.jpg",
    alt: "",
  },

  // Scene-variety gallery images (iStock). Content varies; alt text is
  // kept honest as "Movers and moving-day scenes" since the specific
  // subject of each numbered stock photo cannot be confirmed here.
  scene01: { src: "/images/360_F_295379180_nGEQOJRF2JlkhpXRAAlZL2JQ3zLIxdXb.jpg", alt: "Movers and moving-day scenes" },
  scene02: { src: "/images/istockphoto-1095327944-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene03: { src: "/images/istockphoto-1096481674-612x612.jpg", alt: "Movers and moving-day scenes" },
  scene04: { src: "/images/istockphoto-1124516333-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene05: { src: "/images/istockphoto-1148585957-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene06: { src: "/images/istockphoto-1158769361-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene07: { src: "/images/istockphoto-1159202850-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene08: { src: "/images/istockphoto-1172135995-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene09: { src: "/images/istockphoto-1182829710-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene10: { src: "/images/istockphoto-1182829715-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene11: { src: "/images/istockphoto-1241951376-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene12: { src: "/images/istockphoto-1269457936-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene13: { src: "/images/istockphoto-1291903683-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene14: { src: "/images/istockphoto-1834676984-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene15: { src: "/images/istockphoto-2115960340-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene16: { src: "/images/istockphoto-888150004-170667a.jpg", alt: "Movers and moving-day scenes" },
  scene17: { src: "/images/istockphoto-923387832-170667a.jpg", alt: "Movers and moving-day scenes" },
} as const satisfies Record<string, ImageAsset>;

/**
 * Curated gallery strip — an ordered set of photographs shown in the
 * "A look at moving day" section on the home page. Mixes signature shots
 * with scene-variety images so the gallery feels intentional, not random.
 * Reorder or swap entries here only.
 */
export const GALLERY: ReadonlyArray<ImageAsset> = [
  // Compass Cartage Real Fleets
  IMAGES.lorry1,
  IMAGES.lorry3,
  IMAGES.lorry2,
  IMAGES.transitVanGrey,
  IMAGES.enclosedTrailerBlue,
  IMAGES.residentialDeliveryVan,
  IMAGES.cargoInteriorLoading,
  IMAGES.enclosedTrailerFacility,
  IMAGES.transitVanGreyWheel,
  IMAGES.couplePacking,
  IMAGES.fridgeAppliance,
  IMAGES.moversNeededToday,
  IMAGES.packersAndMovers,
  IMAGES.moversWorking,
  IMAGES.moversWorkingAlt,
  IMAGES.storageWarehouse,
  IMAGES.smilingMover,
] as const;

/**
 * Per-service image associations. The SERVICES array in constants.ts
 * references these keys so the same photograph stays attached to a
 * given service everywhere it appears.
 */
export const SERVICE_IMAGES = {
  "Local Moves": "lorry2",
  "Long-Distance Moves": "lorry1",
  "Packing & Unpacking": "couplePacking",
  "Storage Solutions": "storageWarehouse",
  "Commercial & Office Moves": "lorry3",
  "Appliance & Heavy Items": "fridgeAppliance",
  "Short-Notice Moves": "moversNeededToday",
} as const;

export type ServiceImageKey = keyof typeof IMAGES;
