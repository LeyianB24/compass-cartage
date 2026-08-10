// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { IMAGES } from "@/lib/images";

// Optimize fonts using standard Next.js configuration
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Configure responsive viewport behavior
export const viewport: Viewport = {
  themeColor: "#0A192F", // Adjust to match your primary brand color (e.g., navy-deep)
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

// Comprehensive Base Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://www.compasscartage.com"), // Replace with your production domain
  title: {
    default: "Compass Cartage | Moving Services You Can Trust",
    template: "%s | Compass Cartage",
  },
  description:
    "Fast, reliable, and affordable moving services. Local moves, long-distance relocations, packing, and storage — get your free quote today.",
  keywords: [
    "moving company",
    "movers",
    "local moves",
    "long distance moving",
    "packing services",
    "Compass Cartage",
    "residential relocation",
    "commercial movers",
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
    title: "Compass Cartage | Moving Services You Can Trust",
    description:
      "Fast, reliable, and affordable moving services. Get your free quote today.",
    url: "https://www.compasscartage.com",
    siteName: "Compass Cartage",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: IMAGES.heroMovers.src, // 1200x630+ recommended; using the hero movers photo
        width: 1200,
        height: 630,
        alt: IMAGES.heroMovers.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compass Cartage | Moving Services You Can Trust",
    description:
      "Fast, reliable, and affordable moving services. Get your free quote today.",
    images: [IMAGES.heroMovers.src],
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="flex min-h-screen flex-col bg-paper font-body text-navy-deep antialiased selection:bg-gold selection:text-navy-deep">
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
      </body>
    </html>
  );
}