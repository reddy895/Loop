/**
 * @file prisma.ts
 * @description Production-resilient Prisma Client singleton instantiation module.
 * Optimized for serverless deployments (Vercel / AWS Lambda) to prevent connection pool exhaustion.
 */

import { PrismaClient } from "@prisma/client";
import { config } from "@/config/envConfig";
import { logger } from "@/logger/appLogger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Creates Prisma Client instance safely with production logging and connection pool awareness.
 */
const createPrismaClient = (): PrismaClient => {
  try {
    const client = new PrismaClient({
      log: config.isDevelopment
        ? ["query", "error", "warn"]
        : ["error", "warn"],
      datasources: process.env.DATABASE_URL
        ? {
            db: {
              url: process.env.DATABASE_URL,
            },
          }
        : undefined,
    });
    return client;
  } catch (err) {
    logger.error("Failed to initialize PrismaClient singleton", err);
    return new PrismaClient();
  }
};

/**
 * Global singleton instance of Prisma Client to prevent connection leaks during HMR
 * and across warm invocations in serverless runtime environments.
 */
export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

// Preserve singleton across hot reloads in development and warm containers in serverless environments
globalForPrisma.prisma = prisma;

export default prisma;
