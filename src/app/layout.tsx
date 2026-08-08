// src/app/layout.tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title: "Compass Cartage | Moving Services You Can Trust",
  description:
    "Fast, reliable, and affordable moving services. Local moves, long-distance relocations, packing, and storage — get your free quote today.",
  keywords: [
    "moving company",
    "movers",
    "local moves",
    "long distance moving",
    "packing services",
    "Compass Cartage",
  ],
  openGraph: {
    title: "Compass Cartage | Moving Services You Can Trust",
    description:
      "Fast, reliable, and affordable moving services. Get your free quote today.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper font-body text-navy-deep">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}