// src/components/ServiceCard.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IMAGES, SERVICE_IMAGES, type ServiceImageKey } from "@/lib/images";

type ServiceCardProps = {
  title: string;
  description: string;
  index: number;
  imageKey: ServiceImageKey;
};

export default function ServiceCard({
  title,
  description,
  index,
  imageKey,
}: ServiceCardProps) {
  const img = IMAGES[SERVICE_IMAGES[title as keyof typeof SERVICE_IMAGES] ?? imageKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative isolate overflow-hidden border border-hairline bg-paper-muted p-7 transition-colors duration-300 hover:border-navy-deep"
    >
      {/* Hover-reveal photograph — sits behind the content, fades + zooms
          in on hover. A navy wash keeps the text legible on top. */}
      <div className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/70 to-navy-deep/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="relative transition-colors duration-300 group-hover:text-paper">
        <span className="font-display text-sm text-gold">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-3 font-display text-xl font-semibold text-navy-deep transition-colors duration-300 group-hover:text-paper">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate transition-colors duration-300 group-hover:text-paper/80">
          {description}
        </p>

        {/* Subtle underline that grows in on hover — echoes the route-line motif */}
        <span className="mt-5 block h-px w-8 bg-gold transition-all duration-300 group-hover:w-16" />
      </div>
    </motion.div>
  );
}
