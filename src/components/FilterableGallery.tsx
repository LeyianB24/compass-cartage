// src/components/FilterableGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { IMAGES, type ImageAsset } from "@/lib/images";

type GalleryCategory = "All" | "Local Crew" | "Packing & Prep" | "Trucks & Transport" | "Specialty Items";
type GalleryImage = ImageAsset & { category: GalleryCategory };

export default function FilterableGallery() {
  const [activeTab, setActiveTab] = useState<GalleryCategory>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Map gallery images to category tags for filtering
  const categorizedImages: Array<ImageAsset & { category: GalleryCategory }> = [
    { ...IMAGES.heroMovers, category: "Local Crew" },
    { ...IMAGES.couplePacking, category: "Packing & Prep" },
    { ...IMAGES.truckSunnyDay, category: "Trucks & Transport" },
    { ...IMAGES.fridgeAppliance, category: "Specialty Items" },
    { ...IMAGES.moversNeededToday, category: "Trucks & Transport" },
    { ...IMAGES.packersAndMovers, category: "Packing & Prep" },
    { ...IMAGES.moversWorking, category: "Local Crew" },
    { ...IMAGES.moversWorkingAlt, category: "Local Crew" },
    { ...IMAGES.storageWarehouse, category: "Trucks & Transport" },
    { ...IMAGES.smilingMover, category: "Local Crew" },
    { ...IMAGES.officeMove, category: "Specialty Items" },
    { ...IMAGES.packingScene, category: "Packing & Prep" },
  ];

  const filtered = categorizedImages.filter(
    (img) => activeTab === "All" || img.category === activeTab
  );

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {(["All", "Local Crew", "Packing & Prep", "Trucks & Transport", "Specialty Items"] as GalleryCategory[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xs px-5 py-2.5 text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-gold text-navy-deep font-bold shadow-xs"
                  : "border border-hairline bg-paper-muted text-slate hover:border-gold hover:text-navy-deep dark:border-white/10 dark:bg-[#0f172a] dark:text-gray-300 dark:hover:text-white dark:hover:border-gold"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Image Grid */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filtered.map((img, idx) => (
            <motion.div
              layout
              key={img.src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              onClick={() => setSelectedImage(img)}
              className="group relative isolate aspect-[4/3] cursor-pointer overflow-hidden rounded-card border border-hairline bg-paper-muted shadow-2xs dark:border-white/10 dark:bg-[#0f172a]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Legibility wash & zoom icon reveal on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-6">
                <div className="self-end rounded-full bg-white/20 p-2 text-white backdrop-blur">
                  <ZoomIn size={18} />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">{img.category}</span>
                  <p className="mt-1 text-xs font-medium text-white line-clamp-2">{img.alt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-card border border-white/20 bg-navy-deep shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="relative aspect-[16/10] w-full min-w-[320px] sm:min-w-[600px] md:min-w-[800px]">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  sizes="(max-width: 1024px) 95vw, 1000px"
                  className="object-contain"
                />
              </div>

              <div className="border-t border-white/10 bg-navy-deep/95 p-4 text-white">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold">{selectedImage.category}</span>
                <p className="mt-1 text-sm font-semibold">{selectedImage.alt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
