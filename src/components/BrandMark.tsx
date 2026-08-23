// src/components/BrandMark.tsx
import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  size?: number;
};

/**
 * Official Compass Cartage Brand Logo Mark
 * Renders the official high-resolution logo from /public/logos/logo Compass Cartage.png
 */
export default function BrandMark({ className = "h-10 w-10", size = 44 }: BrandMarkProps) {
  return (
    <div className={`relative overflow-hidden rounded-sm shrink-0 transition-transform hover:scale-105 ${className}`}>
      <Image
        src="/logos/logo Compass Cartage.png"
        alt="Compass Cartage Logo"
        width={size}
        height={size}
        className="h-full w-full object-contain"
        priority
      />
    </div>
  );
}

