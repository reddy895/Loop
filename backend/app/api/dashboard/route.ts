/**
 * @file app/api/dashboard/route.ts
 * @description REST API Route handler for retrieving dashboard analytics overview with tenant isolation.
 */

import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, resolveAuthContext } from "@/middleware";

/**
 * GET /api/dashboard
 * Retrieve aggregated feedback statistics, top themes, recent feedback, and chart data.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = await resolveAuthContext(req);
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const dashboardMetrics = await analyticsService.getDashboardMetrics(authContext.workspaceId, {
      range,
      startDate,
      endDate,
    });

    return createSuccessResponse(dashboardMetrics, "Dashboard metrics retrieved successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
