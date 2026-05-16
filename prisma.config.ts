// prisma.config.ts
// Configuração central do Prisma 7+.
// A DATABASE_URL saiu do schema.prisma e veio para cá.
// Docs: https://pris.ly/d/config-datasource

import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const connectionString = process.env.DATABASE_URL;

      if (!connectionString) {
        throw new Error(
          "DATABASE_URL não definida. Configure no arquivo .env.local"
        );
      }

      return new PrismaPg({ connectionString });
    },
  },
});
