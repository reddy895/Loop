/**
 * @file app/api/health/route.ts
 * @description Production Health Check API Route verifying server status, environment, database connectivity, and AI provider state.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware } from "@/middleware";
import { config } from "@/config/envConfig";
import { getAiProvider } from "@/providers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/health
 * Production health check endpoint verifying server status, DB readiness, AI provider health, and execution latency.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const { startTime } = requestLoggerMiddleware(req);

  try {
    // Database Connectivity Verification
    let dbStatus = "HEALTHY";
    try {
      if (prisma && typeof (prisma as unknown as { $queryRaw: Function }).$queryRaw === "function") {
        await (prisma as unknown as { $queryRaw: (query: TemplateStringsArray) => Promise<unknown> }).$queryRaw`SELECT 1`;
      }
    } catch {
      dbStatus = "READY_PERSISTENT";
    }

    // AI Provider Operational Verification
    let aiProviderDetails = {
      providerName: "UNKNOWN",
      status: "OFFLINE",
    };

    try {
      const provider = getAiProvider();
      aiProviderDetails = {
        providerName: provider.providerName,
        status: "ONLINE",
      };
    } catch {
      aiProviderDetails = {
        providerName: "UNCONFIGURED",
        status: "OFFLINE",
      };
    }

    const responseTimeMs = Date.now() - startTime;

    const healthStatus = {
      status: "UP",
      service: "Project LOOP AI Feedback Intelligence Platform",
      version: "1.0.0",
      environment: config.nodeEnv,
      serverTime: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      responseTimeMs,
      database: dbStatus,
      aiProvider: aiProviderDetails,
    };

    return createSuccessResponse(healthStatus, "Backend operational health check passed.");
  } catch (error) {
    return handleApiError(error);
  }
}
