// src/app/admin/layout.tsx
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-paper text-navy-deep dark:bg-[#070c14] dark:text-white">
      {/* Admin Fleet Dispatch Photographic Backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Image
          src="/images/lorry3.jpeg"
          alt="Compass Cartage Fleet Dispatch"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter saturate-[0.85] brightness-[0.7] opacity-20 dark:opacity-25"
        />
        {/* Soft atmospheric gradient wash ensuring complete legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-paper/92 via-paper/96 to-paper dark:from-[#070c14]/90 dark:via-[#070c14]/94 dark:to-[#070c14]/98"
        />
        {/* Industrial Drafting Grid Ambient Background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem]"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}