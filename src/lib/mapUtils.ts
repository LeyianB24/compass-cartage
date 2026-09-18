// src/lib/mapUtils.ts

export interface AlbertaLocation {
  name: string;
  region: "Metro Edmonton" | "Regional Alberta" | "Intercity Alberta";
  lat: number;
  lng: number;
  isLocal: boolean;
  category?: "Neighborhood" | "City" | "Town" | "County";
}

// Master Alberta & Metro Edmonton Locality Database
export const ALBERTA_LOCALITIES: AlbertaLocation[] = [
  // Edmonton Core & Central
  { name: "Downtown Edmonton", region: "Metro Edmonton", lat: 53.5461, lng: -113.4938, isLocal: true, category: "Neighborhood" },
  { name: "Old Strathcona, Edmonton", region: "Metro Edmonton", lat: 53.5186, lng: -113.4975, isLocal: true, category: "Neighborhood" },
  { name: "Oliver / Grandin, Edmonton", region: "Metro Edmonton", lat: 53.5385, lng: -113.5152, isLocal: true, category: "Neighborhood" },
  { name: "Glenora, Edmonton", region: "Metro Edmonton", lat: 53.5439, lng: -113.5517, isLocal: true, category: "Neighborhood" },
  { name: "Garneau, Edmonton", region: "Metro Edmonton", lat: 53.5218, lng: -113.5173, isLocal: true, category: "Neighborhood" },
  { name: "Highlands, Edmonton", region: "Metro Edmonton", lat: 53.5686, lng: -113.4286, isLocal: true, category: "Neighborhood" },
  
  // Edmonton Southwest & West
  { name: "Windermere, Edmonton", region: "Metro Edmonton", lat: 53.4358, lng: -113.5936, isLocal: true, category: "Neighborhood" },
  { name: "Terwillegar Towne, Edmonton", region: "Metro Edmonton", lat: 53.4567, lng: -113.5786, isLocal: true, category: "Neighborhood" },
  { name: "West Edmonton", region: "Metro Edmonton", lat: 53.5225, lng: -113.6242, isLocal: true, category: "Neighborhood" },
  { name: "Hamptons, Edmonton", region: "Metro Edmonton", lat: 53.4983, lng: -113.6705, isLocal: true, category: "Neighborhood" },
  { name: "Riverbend, Edmonton", region: "Metro Edmonton", lat: 53.4862, lng: -113.5769, isLocal: true, category: "Neighborhood" },
  { name: "Rutherford, Edmonton", region: "Metro Edmonton", lat: 53.4183, lng: -113.5412, isLocal: true, category: "Neighborhood" },

  // Edmonton South & Southeast
  { name: "Mill Woods, Edmonton", region: "Metro Edmonton", lat: 53.4635, lng: -113.4373, isLocal: true, category: "Neighborhood" },
  { name: "Summerside, Edmonton", region: "Metro Edmonton", lat: 53.4219, lng: -113.4583, isLocal: true, category: "Neighborhood" },
  { name: "Ellerslie, Edmonton", region: "Metro Edmonton", lat: 53.4258, lng: -113.4892, isLocal: true, category: "Neighborhood" },
  { name: "Walker, Edmonton", region: "Metro Edmonton", lat: 53.4172, lng: -113.4239, isLocal: true, category: "Neighborhood" },
  { name: "Meadows / Tamarack, Edmonton", region: "Metro Edmonton", lat: 53.4811, lng: -113.3664, isLocal: true, category: "Neighborhood" },

  // Edmonton North & Northeast
  { name: "Griesbach, Edmonton", region: "Metro Edmonton", lat: 53.6044, lng: -113.5042, isLocal: true, category: "Neighborhood" },
  { name: "Clareview, Edmonton", region: "Metro Edmonton", lat: 53.6022, lng: -113.4072, isLocal: true, category: "Neighborhood" },
  { name: "Castledowns, Edmonton", region: "Metro Edmonton", lat: 53.6186, lng: -113.5358, isLocal: true, category: "Neighborhood" },
  { name: "Manning Village, Edmonton", region: "Metro Edmonton", lat: 53.6192, lng: -113.3769, isLocal: true, category: "Neighborhood" },

  // Metro Municipalities & Commuter Hubs
  { name: "St. Albert", region: "Metro Edmonton", lat: 53.6305, lng: -113.6256, isLocal: true, category: "City" },
  { name: "Sherwood Park", region: "Metro Edmonton", lat: 53.5414, lng: -113.3106, isLocal: true, category: "Town" },
  { name: "Spruce Grove", region: "Metro Edmonton", lat: 53.5451, lng: -113.9017, isLocal: true, category: "City" },
  { name: "Stony Plain", region: "Metro Edmonton", lat: 53.5303, lng: -113.9897, isLocal: true, category: "Town" },
  { name: "Leduc", region: "Metro Edmonton", lat: 53.2594, lng: -113.5494, isLocal: true, category: "City" },
  { name: "Beaumont", region: "Metro Edmonton", lat: 53.3567, lng: -113.4147, isLocal: true, category: "City" },
  { name: "Fort Saskatchewan", region: "Metro Edmonton", lat: 53.7128, lng: -113.2133, isLocal: true, category: "City" },
  { name: "Devon", region: "Metro Edmonton", lat: 53.3644, lng: -113.7314, isLocal: true, category: "Town" },
  { name: "Morinville", region: "Metro Edmonton", lat: 53.7917, lng: -113.6508, isLocal: true, category: "Town" },
  { name: "Strathcona County", region: "Metro Edmonton", lat: 53.5350, lng: -113.2000, isLocal: true, category: "County" },
  { name: "Parkland County", region: "Metro Edmonton", lat: 53.5500, lng: -114.1000, isLocal: true, category: "County" },
  { name: "Sturgeon County", region: "Metro Edmonton", lat: 53.7500, lng: -113.5000, isLocal: true, category: "County" },

  // Regional Alberta Corridor
  { name: "Camrose", region: "Regional Alberta", lat: 53.0239, lng: -112.8272, isLocal: false, category: "City" },
  { name: "Wetaskiwin", region: "Regional Alberta", lat: 52.9694, lng: -113.3686, isLocal: false, category: "City" },
  { name: "Red Deer", region: "Regional Alberta", lat: 52.2681, lng: -113.8112, isLocal: false, category: "City" },
  { name: "Sylvan Lake", region: "Regional Alberta", lat: 52.3083, lng: -114.0964, isLocal: false, category: "Town" },
  { name: "Lacombe", region: "Regional Alberta", lat: 52.4683, lng: -113.7369, isLocal: false, category: "City" },
  { name: "Ponoka", region: "Regional Alberta", lat: 52.6869, lng: -113.5822, isLocal: false, category: "Town" },
  { name: "Airdrie", region: "Regional Alberta", lat: 51.2917, lng: -114.0144, isLocal: false, category: "City" },
  { name: "Cochrane", region: "Regional Alberta", lat: 51.1883, lng: -114.4686, isLocal: false, category: "Town" },
  { name: "Okotoks", region: "Regional Alberta", lat: 50.7258, lng: -113.9750, isLocal: false, category: "Town" },
  { name: "Chestermere", region: "Regional Alberta", lat: 51.0508, lng: -113.8219, isLocal: false, category: "City" },

  // Intercity & Long Distance Alberta
  { name: "Calgary", region: "Intercity Alberta", lat: 51.0447, lng: -114.0719, isLocal: false, category: "City" },
  { name: "Canmore / Banff", region: "Intercity Alberta", lat: 51.0890, lng: -115.3590, isLocal: false, category: "Town" },
  { name: "Lethbridge", region: "Intercity Alberta", lat: 49.6956, lng: -112.8451, isLocal: false, category: "City" },
  { name: "Medicine Hat", region: "Intercity Alberta", lat: 50.0417, lng: -110.6775, isLocal: false, category: "City" },
  { name: "Grande Prairie", region: "Intercity Alberta", lat: 55.1699, lng: -118.7986, isLocal: false, category: "City" },
  { name: "Fort McMurray", region: "Intercity Alberta", lat: 56.7264, lng: -111.3803, isLocal: false, category: "City" },
  { name: "Lloydminster", region: "Intercity Alberta", lat: 53.2783, lng: -110.0056, isLocal: false, category: "City" },
  { name: "Cold Lake", region: "Intercity Alberta", lat: 54.4642, lng: -110.1825, isLocal: false, category: "City" },
  { name: "Whitecourt", region: "Intercity Alberta", lat: 54.1417, lng: -115.6833, isLocal: false, category: "Town" },
  { name: "Peace River", region: "Intercity Alberta", lat: 56.2361, lng: -117.2917, isLocal: false, category: "Town" },
  { name: "Jasper", region: "Intercity Alberta", lat: 52.8737, lng: -118.0814, isLocal: false, category: "Town" },
];

export interface SearchResult {
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  isLocal: boolean;
}

/**
 * Searches Alberta localities locally and supplements with OpenStreetMap / Photon geocoder
 */
export async function searchAlbertaAddresses(query: string): Promise<SearchResult[]> {
  const clean = query.trim();
  if (clean.length < 2) return [];

  const lower = clean.toLowerCase();

  // 1. First priority: Exact or partial match in curated Alberta database
  const localMatches: SearchResult[] = ALBERTA_LOCALITIES.filter((item) =>
    item.name.toLowerCase().includes(lower)
  ).map((item) => ({
    title: item.name,
    subtitle: `${item.region}${item.category ? ` • ${item.category}` : ""}`,
    lat: item.lat,
    lng: item.lng,
    isLocal: item.isLocal,
  }));

  // If we found 5 or more strong local matches, return them immediately
  if (localMatches.length >= 5) {
    return localMatches.slice(0, 6);
  }

  // 2. Query Photon Geocoder API with Alberta bounding box filter
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    // Bounding box for Alberta: minLon: -120, minLat: 49, maxLon: -110, maxLat: 60
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      clean + ", Alberta, Canada"
    )}&limit=5&bbox=-120,49,-110,60`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apiResults: SearchResult[] = data.features.map((feat: any) => {
          const props = feat.properties || {};
          const coords = feat.geometry?.coordinates || [0, 0];
          const name = props.name || props.street || clean;
          const city = props.city || props.town || props.county || "Alberta";
          const state = props.state || "Alberta";
          const isEdmonton = city.toLowerCase().includes("edmonton");

          return {
            title: props.housenumber ? `${props.housenumber} ${name}` : name,
            subtitle: `${city}, ${state}`,
            lat: coords[1],
            lng: coords[0],
            isLocal: isEdmonton,
          };
        });

        // Deduplicate against existing local matches
        const combined = [...localMatches];
        apiResults.forEach((ar) => {
          if (!combined.some((c) => c.title.toLowerCase() === ar.title.toLowerCase())) {
            combined.push(ar);
          }
        });

        return combined.slice(0, 8);
      }
    }
  } catch {
    // Network fallback: return local database matches
  }

  return localMatches.slice(0, 6);
}
