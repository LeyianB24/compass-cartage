// src/components/ServiceCard.tsx
"use client";

import { motion } from "framer-motion";

type ServiceCardProps = {
  title: string;
  description: string;
  index: number;
};

export default function ServiceCard({ title, description, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative border border-hairline bg-white p-7 transition-colors duration-300 hover:border-navy-deep"
    >
      <span className="font-display text-sm text-gold">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-3 font-display text-xl font-semibold text-navy-deep">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate">{description}</p>

      {/* Subtle underline that grows in on hover — echoes the route-line motif */}
      <span className="mt-5 block h-px w-8 bg-gold transition-all duration-300 group-hover:w-16" />
    </motion.div>
  );
}