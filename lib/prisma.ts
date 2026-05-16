// lib/prisma.ts
// Singleton do PrismaClient.
// Em desenvolvimento, o hot reload do Next.js recriaria a conexão a cada save.
// Este padrão garante que só exista UMA instância ativa.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
