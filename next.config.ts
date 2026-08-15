import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Prisma 7 + the Neon driver adapter to work correctly
  // under Next.js 16's Turbopack bundler.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-neon"],
};

export default nextConfig;