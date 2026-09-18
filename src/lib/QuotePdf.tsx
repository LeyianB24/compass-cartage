// src/lib/QuotePdf.tsx
// Server-only PDF document — renders a branded quote request summary
// using @react-pdf/renderer. Rendered to a buffer in the API route and
// attached to both the customer confirmation and the internal Howard email.

import fs from "fs";
import path from "path";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { BUSINESS } from "./constants";

// Master Design Tokens — "Obsidian & Brushed Brass" Brand Identity
const NAVY = "#0a131f";        // Obsidian Navy
const NAVY_DEEP = "#070c14";   // Deep Obsidian Bedrock
const GOLD = "#c5a880";        // Brushed Brass
const SLATE = "#334155";       // Graphite Steel body text
const SLATE_MUTED = "#64748b"; // Titanium secondary text
const HAIRLINE = "#e2e8f0";    // 1px Architectural drafting borders
const PAPER = "#f8f9fa";       // Chalk Paper surface
const WHITE = "#ffffff";

// Cache base64 logo in-memory to prevent redundant disk I/O
let cachedLogoBase64: string | null = null;

function getSiteLogoBase64(): string | null {
  if (cachedLogoBase64) return cachedLogoBase64;
  try {
    const logoPath = path.join(process.cwd(), "public", "logos", "logo Compass Cartage.png");
    if (fs.existsSync(logoPath)) {
      cachedLogoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
      return cachedLogoBase64;
    }
  } catch (err) {
    console.warn("Could not load official logo image for QuotePdf:", err);
  }
  return null;
}

const styles = StyleSheet.create({
  page: {
    padding: 34,
    paddingBottom: 44,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: NAVY_DEEP,
    backgroundColor: WHITE,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
    borderBottomStyle: "solid",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 90,
    height: 48,
    objectFit: "contain",
  },
  brandBlock: {
    marginLeft: 10,
  },
  brandName: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 0.3,
  },
  brandTagline: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  brandAuthority: {
    fontSize: 7,
    color: SLATE_MUTED,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  docTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 0.5,
    textAlign: "right",
  },
  refBadge: {
    marginTop: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: PAPER,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderStyle: "solid",
    borderRadius: 3,
  },
  refText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 0.4,
  },
  issueDate: {
    fontSize: 7,
    color: SLATE_MUTED,
    marginTop: 3,
    textAlign: "right",
  },

  // Obsidian Hero Ribbon
  banner: {
    backgroundColor: NAVY,
    borderLeftWidth: 4,
    borderLeftColor: GOLD,
    borderLeftStyle: "solid",
    borderRadius: 4,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  bannerCol: {
    flex: 1,
    paddingHorizontal: 4,
  },
  bannerLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  bannerValue: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
  },

  // Main 2-column details grid
  gridRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: PAPER,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderStyle: "solid",
    borderRadius: 4,
    padding: 10,
  },
  cardTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
    borderBottomStyle: "solid",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  rowLabel: {
    width: 80,
    fontSize: 7.5,
    color: SLATE_MUTED,
  },
  rowValue: {
    flex: 1,
    fontSize: 8,
    color: NAVY_DEEP,
    fontFamily: "Helvetica-Bold",
  },

  // Pricing Box
  pricingCard: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: GOLD,
    borderStyle: "solid",
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  pricingHeader: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: HAIRLINE,
    borderBottomStyle: "solid",
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pricingMetric: {
    flex: 1,
    paddingHorizontal: 4,
  },
  pricingMetricLabel: {
    fontSize: 6.8,
    color: SLATE_MUTED,
    marginBottom: 2,
  },
  pricingMetricValue: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY_DEEP,
  },
  estimateBadge: {
    flex: 1.3,
    backgroundColor: NAVY,
    borderRadius: 3,
    padding: 6,
    alignItems: "center",
  },
  estimateBadgeLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 0.5,
  },
  estimateBadgeValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginTop: 2,
  },

  // Notes Box
  notesCard: {
    backgroundColor: PAPER,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderStyle: "solid",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  notesTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notesContent: {
    fontSize: 7.5,
    color: SLATE,
    lineHeight: 1.4,
  },

  // Terms & Guarantee
  termsBox: {
    padding: 7,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderStyle: "solid",
    borderRadius: 3,
    marginBottom: 12,
  },
  termsText: {
    fontSize: 6.5,
    color: SLATE_MUTED,
    lineHeight: 1.35,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 18,
    left: 34,
    right: 34,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: HAIRLINE,
    borderTopStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerBrand: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
  footerContact: {
    fontSize: 6.5,
    color: SLATE_MUTED,
  },
  footerPage: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
  },
});

export type QuotePdfData = {
  quoteId?: string;
  quoteNumber?: string;
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  dropoffAddress: string;
  moveDate?: string;
  moveSize?: string;
  distanceKm?: number;
  distanceFee?: number;
  pricingTier?: string;
  estimatedPrice?: number;
  notes?: string;
  submittedAt: string;
  logoSrc?: string;
};

export default function QuotePdf({ data }: { data: QuotePdfData }) {
  const logoBase64 = data.logoSrc || getSiteLogoBase64();
  const quoteRef = data.quoteNumber
    ? `REF: ${data.quoteNumber}`
    : data.quoteId
    ? `REF: CC-Q-${data.quoteId.slice(-6).toUpperCase()}`
    : "REF: CC-STANDARD";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Site Logo & Document Title */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {logoBase64 ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={logoBase64} style={styles.logoImage} />
            ) : null}
            <View style={styles.brandBlock}>
              <Text style={styles.brandName}>{BUSINESS.name}</Text>
              <Text style={styles.brandTagline}>{BUSINESS.tagline.toUpperCase()}</Text>
              <Text style={styles.brandAuthority}>Licensed & Insured Moving Carrier &bull; Alberta</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docTitle}>RELOCATION ESTIMATE</Text>
            <View style={styles.refBadge}>
              <Text style={styles.refText}>{quoteRef}</Text>
            </View>
            <Text style={styles.issueDate}>Date: {data.submittedAt}</Text>
          </View>
        </View>

        {/* Obsidian Hero Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerCol}>
            <Text style={styles.bannerLabel}>ORIGIN</Text>
            <Text style={styles.bannerValue}>
              {data.pickupAddress.split(",")[0] || data.pickupAddress}
            </Text>
          </View>
          <View style={styles.bannerCol}>
            <Text style={styles.bannerLabel}>DESTINATION</Text>
            <Text style={styles.bannerValue}>
              {data.dropoffAddress.split(",")[0] || data.dropoffAddress}
            </Text>
          </View>
          <View style={styles.bannerCol}>
            <Text style={styles.bannerLabel}>TARGET DATE</Text>
            <Text style={styles.bannerValue}>
              {data.moveDate || "Flexible / TBD"}
            </Text>
          </View>
          <View style={styles.bannerCol}>
            <Text style={styles.bannerLabel}>ESTIMATED SCOPE</Text>
            <Text style={styles.bannerValue}>
              {data.moveSize || "Standard Move"}
            </Text>
          </View>
        </View>

        {/* 2-Column Grid: Contact Profile & Route Logistics */}
        <View style={styles.gridRow}>
          {/* Card 1: Client Profile */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>CLIENT & CONTACT PROFILE</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Client Name:</Text>
              <Text style={styles.rowValue}>{data.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Direct Phone:</Text>
              <Text style={styles.rowValue}>{data.phone}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Email Address:</Text>
              <Text style={styles.rowValue}>{data.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Service Region:</Text>
              <Text style={styles.rowValue}>{BUSINESS.serviceAreaShort}</Text>
            </View>
          </View>

          {/* Card 2: Relocation Logistics */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>RELOCATION & ROUTE LOGISTICS</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Pickup Point:</Text>
              <Text style={styles.rowValue}>{data.pickupAddress}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Delivery Point:</Text>
              <Text style={styles.rowValue}>{data.dropoffAddress}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Move Size:</Text>
              <Text style={styles.rowValue}>{data.moveSize || "Standard Home"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Dispatch Route:</Text>
              <Text style={styles.rowValue}>
                {data.distanceKm ? `${data.distanceKm} km transit` : "Local Metro Dispatch"}
              </Text>
            </View>
          </View>
        </View>

        {/* Itemized Logistics & Pricing Card */}
        <View style={styles.pricingCard}>
          <Text style={styles.pricingHeader}>ITEMIZED LOGISTICS & RATE ESTIMATE</Text>
          <View style={styles.pricingRow}>
            <View style={styles.pricingMetric}>
              <Text style={styles.pricingMetricLabel}>SERVICE TIER</Text>
              <Text style={styles.pricingMetricValue}>
                {data.pricingTier ? data.pricingTier.toUpperCase() : "STANDARD CREW & TRANSPORT"}
              </Text>
            </View>
            <View style={styles.pricingMetric}>
              <Text style={styles.pricingMetricLabel}>CALCULATED DISTANCE</Text>
              <Text style={styles.pricingMetricValue}>
                {data.distanceKm ? `~${data.distanceKm} km` : "Local Metro Area"}
              </Text>
            </View>
            <View style={styles.pricingMetric}>
              <Text style={styles.pricingMetricLabel}>TRAVEL SURCHARGE</Text>
              <Text style={[styles.pricingMetricValue, { color: GOLD }]}>
                {data.distanceFee && data.distanceFee > 0 ? `$${data.distanceFee.toFixed(2)}` : "$0.00 (Included)"}
              </Text>
            </View>
            <View style={styles.estimateBadge}>
              <Text style={styles.estimateBadgeLabel}>BINDING ESTIMATE</Text>
              <Text style={styles.estimateBadgeValue}>
                {data.estimatedPrice ? `$${Math.round(data.estimatedPrice)} CAD` : "Pending Site Review"}
              </Text>
            </View>
          </View>
        </View>

        {/* Notes & Special Instructions */}
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>SPECIAL INSTRUCTIONS & ACCESS NOTES</Text>
          <Text style={styles.notesContent}>
            {data.notes || "No additional stairs, heavy item, or elevator constraints indicated."}
          </Text>
        </View>

        {/* Policy Terms & Operational Guarantee */}
        <View style={styles.termsBox}>
          <Text style={styles.termsText}>
            TERMS & GUARANTEE: This relocation estimate is calculated based on customer-submitted inventory, route distance, and property access specifications. Final billing reflects agreed hourly crew rates or binding written scope. Compass Cartage is a fully licensed and commercial cargo-insured carrier operating across Alberta. Valid for 30 calendar days from date of issuance.
          </Text>
        </View>

        {/* Fixed Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerBrand}>
            {BUSINESS.name} &bull; {BUSINESS.tagline}
          </Text>
          <Text style={styles.footerContact}>
            Phone: {BUSINESS.phone} &bull; Email: {BUSINESS.email} &bull; Web: compass-cartage.vercel.app
          </Text>
          <Text style={styles.footerPage}>
            Page 1 of 1
          </Text>
        </View>
      </Page>
    </Document>
  );
}