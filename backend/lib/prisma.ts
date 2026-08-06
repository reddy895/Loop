/**
 * @file prisma.ts
 * @description Existing Prisma Client singleton instantiation module.
 * Assumes Prisma Client has been generated in the project.
 */

import { PrismaClient } from "@prisma/client";
import { config } from "@/config/envConfig";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Creates Prisma Client instance safely.
 */
const createPrismaClient = (): PrismaClient | undefined => {
  try {
    return new PrismaClient({
      log: config.isDevelopment ? ["query", "error", "warn"] : ["error"],
    });
  } catch {
    return undefined;
  }
};

/**
 * Global singleton instance of Prisma Client to prevent connection leaks during HMR.
 */
export const prisma: PrismaClient = globalForPrisma.prisma ?? (createPrismaClient() as unknown as PrismaClient);

if (!config.isProduction && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;

