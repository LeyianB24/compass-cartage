// src/lib/QuotePdf.tsx
// Server-only PDF document — renders a branded quote request summary
// using @react-pdf/renderer. Rendered to a buffer in the API route and
// attached to both the customer confirmation and the internal Howard email.

import { Document, Page, Text, View, Svg, Path, StyleSheet } from "@react-pdf/renderer";
import { BUSINESS } from "./constants";

const NAVY = "#0b1f3a";
const NAVY_DEEP = "#071426";
const GOLD = "#c9a227";
const SLATE = "#4a5568";
const HAIRLINE = "#e3e1da";
const PAPER = "#f7f6f2";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: NAVY_DEEP,
    backgroundColor: "#ffffff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 18,
    borderBottom: `1px solid ${HAIRLINE}`,
  },
  brandName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: NAVY_DEEP,
    marginLeft: 10,
  },
  brandTagline: {
    fontSize: 8,
    color: GOLD,
    marginLeft: 10,
    marginTop: 2,
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: NAVY_DEEP,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: SLATE,
    marginBottom: 24,
  },
  sectionRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  section: {
    flex: 1,
    padding: 14,
    backgroundColor: PAPER,
    border: `1px solid ${HAIRLINE}`,
  },
  sectionLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 1,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  rowLabel: {
    width: 90,
    color: SLATE,
  },
  rowValue: {
    flex: 1,
    color: NAVY_DEEP,
    fontFamily: "Helvetica-Bold",
  },
  notesBox: {
    padding: 14,
    backgroundColor: PAPER,
    border: `1px solid ${HAIRLINE}`,
    marginBottom: 24,
  },
  notesText: {
    color: NAVY_DEEP,
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 40,
    right: 40,
    paddingTop: 14,
    borderTop: `1px solid ${HAIRLINE}`,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: SLATE,
  },
  footerBrand: {
    fontSize: 8,
    color: NAVY_DEEP,
    fontFamily: "Helvetica-Bold",
  },
});

// Compass logomark, redrawn with react-pdf's SVG primitives
// (same shape used across the business card, website, and rate card).
function LogoMark() {
  return (
    <Svg width={34} height={34} viewBox="0 0 48 48">
      <Path
        d="M4 13 A9 9 0 0 1 13 4 H35 A9 9 0 0 1 44 13 V35 A9 9 0 0 1 35 44 H13 A9 9 0 0 1 4 35 Z"
        stroke={NAVY}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M15 30 L24 14 L33 30"
        stroke={GOLD}
        strokeWidth={2.4}
        fill="none"
      />
      <Path d="M19.5 24 L28.5 24" stroke={NAVY} strokeWidth={2.4} />
    </Svg>
  );
}

export type QuotePdfData = {
  name: string;
  phone: string;
  email: string;
  pickupAddress: string;
  dropoffAddress: string;
  moveDate?: string;
  moveSize?: string;
  notes?: string;
  submittedAt: string;
};

export default function QuotePdf({ data }: { data: QuotePdfData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <LogoMark />
          <View>
            <Text style={styles.brandName}>{BUSINESS.name}</Text>
            <Text style={styles.brandTagline}>{BUSINESS.tagline.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.title}>Quote Request Summary</Text>
        <Text style={styles.subtitle}>Submitted {data.submittedAt}</Text>

        <View style={styles.sectionRow}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CONTACT DETAILS</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Name</Text>
              <Text style={styles.rowValue}>{data.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Phone</Text>
              <Text style={styles.rowValue}>{data.phone}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Email</Text>
              <Text style={styles.rowValue}>{data.email}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>MOVE DETAILS</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Moving From</Text>
              <Text style={styles.rowValue}>{data.pickupAddress}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Moving To</Text>
              <Text style={styles.rowValue}>{data.dropoffAddress}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Preferred Date</Text>
              <Text style={styles.rowValue}>{data.moveDate || "Not specified"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Move Size</Text>
              <Text style={styles.rowValue}>{data.moveSize || "Not specified"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.notesBox}>
          <Text style={styles.sectionLabel}>ADDITIONAL NOTES</Text>
          <Text style={styles.notesText}>{data.notes || "None provided."}</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerBrand}>{BUSINESS.name}</Text>
          <Text style={styles.footerText}>
            {BUSINESS.phone}   |   {BUSINESS.email}   |   {BUSINESS.serviceAreaShort}
          </Text>
        </View>
      </Page>
    </Document>
  );
}