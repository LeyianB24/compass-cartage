// src/components/BrandMark.tsx
import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  size?: number;
};

/**
 * Official Compass Cartage Brand Logo Mark
 * Renders the official logo from /public/logos/compass-cartage logo.jpeg
 */
export default function BrandMark({ className = "h-9 w-9", size = 36 }: BrandMarkProps) {
  return (
    <div className={`relative overflow-hidden rounded-sm border border-gold/30 shrink-0 ${className}`}>
      <Image
        src="/logos/compass-cartage logo.jpeg"
        alt="Compass Cartage Logo"
        width={size}
        height={size}
        className="h-full w-full object-cover"
        priority
      />
    </div>
  );
}
