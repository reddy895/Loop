/**
 * @file app/api/analytics/route.ts
 * @description REST API Route handler for detailed analytics breakdowns and trend reports with tenant isolation.
 */

import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, resolveAuthContext } from "@/middleware";

/**
 * GET /api/analytics
 * Retrieve volume over time, theme distributions, sentiment distributions, and trends.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = await resolveAuthContext(req);
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    const analyticsBreakdown = await analyticsService.getAnalyticsBreakdown(authContext.workspaceId, {
      range,
      startDate,
      endDate,
    });

    return createSuccessResponse(analyticsBreakdown, "Detailed analytics metrics retrieved successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
