// src/components/ServiceCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { IMAGES, SERVICE_IMAGES, type ServiceImageKey } from "@/lib/images";

type ServiceCardProps = {
  title: string;
  description: string;
  index: number;
  imageKey: ServiceImageKey;
};

const TITLE_TO_SLUG: Record<string, string> = {
  "Local Moves": "residential",
  "Long-Distance Moves": "long-distance",
  "Packing & Unpacking": "residential",
  "Storage Solutions": "storage",
  "Commercial & Office Moves": "commercial",
  "Appliance & Heavy Items": "residential",
  "Short-Notice Moves": "residential",
};

export default function ServiceCard({
  title,
  description,
  index,
  imageKey,
}: ServiceCardProps) {
  const img = IMAGES[SERVICE_IMAGES[title as keyof typeof SERVICE_IMAGES] ?? imageKey];
  const slug = TITLE_TO_SLUG[title] || "residential";

  return (
    <Link href={`/services/${slug}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: (index % 3) * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        className="group relative isolate h-full overflow-hidden rounded-card border border-hairline bg-paper-muted p-7 shadow-xs transition-all duration-300 hover:border-navy hover:shadow-xl dark:border-white/10 dark:bg-[#1e1e1e] dark:hover:border-[#00a3e0]"
      >
        {/* Hover-reveal photograph */}
        <div className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071f36]/90 via-[#071f36]/75 to-[#071f36]/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-[#121212]/95 dark:via-[#121212]/80" />
        </div>

        <div className="relative flex h-full flex-col justify-between transition-colors duration-300 group-hover:text-white">
          <div>
            <span className="font-display text-sm font-bold text-navy group-hover:text-gold-soft dark:text-[#00a3e0]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-display text-xl font-semibold text-navy-deep transition-colors duration-300 group-hover:text-white dark:text-white">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate transition-colors duration-300 group-hover:text-white/85 dark:text-slate">
              {description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-hairline/60 pt-4 dark:border-white/10 group-hover:border-white/20">
            <span className="text-xs font-semibold text-navy group-hover:text-gold-soft dark:text-[#38bdf8]">
              View Details & Rates
            </span>
            <ArrowRight size={14} className="text-navy transition-transform group-hover:translate-x-1 group-hover:text-gold-soft dark:text-[#38bdf8]" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
