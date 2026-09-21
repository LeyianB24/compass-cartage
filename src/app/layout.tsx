// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileNav from "@/components/StickyMobileNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import { IMAGES } from "@/lib/images";

// Optimize fonts for structural stability and high-end editorial clarity
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Configure responsive viewport behavior
export const viewport: Viewport = {
  themeColor: "#0A131F", // Matches obsidian navy bedrock
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://compasscartage.ca";
const ogImageUrl = `${siteUrl}/images/lorry1.jpeg`;

// Comprehensive Base Metadata
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Edmonton Movers — One Dedicated Crew, Upfront Pricing | Compass Cartage",
    template: "%s | Compass Cartage",
  },
  description:
    "Edmonton's trusted moving company for residential, commercial, and long-distance relocations across Alberta. One dedicated crew from start to finish with upfront pricing and zero surprise fees.",
  keywords: [
    "Edmonton movers",
    "moving company Edmonton",
    "Alberta long distance moving",
    "residential relocation Edmonton",
    "commercial office movers",
    "Compass Cartage",
    "furniture delivery Edmonton",
    "one dedicated crew",
  ],
  authors: [{ name: "Compass Cartage" }],
  creator: "Compass Cartage",
  publisher: "Compass Cartage",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Edmonton Movers — One Dedicated Crew, Upfront Pricing | Compass Cartage",
    description:
      "Reliable residential, commercial, and provincial moving services across Edmonton and Alberta. Upfront pricing, single dedicated crew, and 100% insured transit.",
    url: siteUrl,
    siteName: "Compass Cartage",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Compass Cartage 26ft commercial moving truck in Edmonton, Alberta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edmonton Movers — One Dedicated Crew, Upfront Pricing | Compass Cartage",
    description:
      "Reliable residential, commercial, and provincial moving services across Edmonton and Alberta. Upfront pricing, single dedicated crew, and 100% insured transit.",
    images: [ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/icon.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": ["MovingCompany", "LocalBusiness"],
  "@id": `${siteUrl}/#movingcompany`,
  name: "Compass Cartage",
  url: siteUrl,
  logo: `${siteUrl}/icon.png`,
  image: ogImageUrl,
  description:
    "Edmonton moving company providing residential, commercial, and provincial long-distance relocations with one dedicated crew and upfront transparent pricing.",
  telephone: "+1-587-501-7519",
  email: "info@compasscartage.ca",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Edmonton",
    addressRegion: "AB",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 53.5461,
    longitude: -113.4938,
  },
  areaServed: [
    { "@type": "City", name: "Edmonton" },
    { "@type": "City", name: "St. Albert" },
    { "@type": "City", name: "Sherwood Park" },
    { "@type": "City", name: "Spruce Grove" },
    { "@type": "City", name: "Leduc" },
    { "@type": "City", name: "Beaumont" },
    { "@type": "City", name: "Red Deer" },
    { "@type": "City", name: "Calgary" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "07:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plusJakarta.variable} ${spaceMono.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-paper font-body text-navy-deep antialiased overflow-x-clip selection:bg-gold-soft selection:text-navy-deep">
        <ThemeProvider>
          {/* Accessibility Skip Link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-navy-deep focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold"
          >
            Skip to main content
          </a>

          {/* Top Header / Navigation */}
          <Navbar />

          {/* Dynamic Page Content */}
          <div id="main-content" className="flex flex-1 flex-col">
            {children}
          </div>

          {/* Global Footer */}
          <Footer />

          {/* Mobile Bottom Sticky Navigation Dock */}
          <StickyMobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}