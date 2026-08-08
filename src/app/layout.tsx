// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-paper font-body text-navy-deep">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}