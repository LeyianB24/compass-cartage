// src/components/ServiceCard.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, LucideIcon } from "lucide-react";

export type ServiceCardProps = {
  title: string;
  description: string;
  index: number;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
};

export default function ServiceCard({
  title,
  description,
  index,
  icon: Icon,
  href,
  onClick,
}: ServiceCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const formattedIndex = String(index + 1).padStart(2, "0");

  const cardContent = (
    <>
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-medium text-gold">
          {formattedIndex}
        </span>
        {Icon && (
          <Icon
            size={20}
            className="text-navy-deep/60 transition-colors duration-300 group-hover:text-gold"
            aria-hidden="true"
          />
        )}
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold text-navy-deep transition-colors duration-300 group-hover:text-navy">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-slate">{description}</p>

      <div className="mt-6 flex items-center justify-between">
        {/* Underline accent that expands on hover */}
        <span
          className="block h-px w-8 bg-gold transition-all duration-300 group-hover:w-16"
          aria-hidden="true"
        />

        {href && (
          <span className="flex items-center gap-1 text-xs font-semibold text-navy-deep opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span>Learn more</span>
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        )}
      </div>
    </>
  );

  const motionProps = {
    initial: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: {
      delay: shouldReduceMotion ? 0 : (index % 3) * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
    whileHover: shouldReduceMotion ? undefined : { y: -4 },
  };

  const sharedClasses =
    "group relative block border border-hairline bg-white p-7 shadow-xs transition-all duration-300 hover:border-navy-deep hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep focus-visible:ring-offset-2 rounded-xs";

  if (href) {
    return (
      <motion.div {...motionProps}>
        <Link href={href} className={sharedClasses} onClick={onClick}>
          {cardContent}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div className={sharedClasses} {...motionProps} onClick={onClick}>
      {cardContent}
    </motion.div>
  );
}