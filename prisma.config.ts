// prisma.config.ts
import { config } from "dotenv";

// Load standard .env first, then override with .env.local if present
config({ path: ".env" });
config({ path: ".env.local", override: true });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // CLI commands (migrate, studio) use the DIRECT (non-pooled) connection
    url: env("DIRECT_URL") || env("DATABASE_URL"),
  },
});