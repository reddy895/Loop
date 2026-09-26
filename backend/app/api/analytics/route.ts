/**
 * @file app/api/analytics/route.ts
 * @description REST API Route handler for detailed analytics breakdowns and trend reports.
 */

import { NextRequest, NextResponse } from "next/server";
import { analyticsService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";

/**
 * GET /api/analytics
 * Retrieve volume over time, theme distributions, sentiment distributions, and trends.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req);

    const analyticsBreakdown = await analyticsService.getAnalyticsBreakdown(authContext.workspaceId);

    return createSuccessResponse(analyticsBreakdown, "Detailed analytics metrics retrieved successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
