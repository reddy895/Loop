/**
 * @file app/api/themes/[id]/route.ts
 * @description REST API Route handler for single theme detailed stats and associated feedback.
 */

import { NextRequest, NextResponse } from "next/server";
import { themeService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { paginationQuerySchema, validateData } from "@/validators";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/themes/:id
 * Retrieve theme details, associated feedback list with pagination, counts, and sentiment stats.
 */
export async function GET(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req);
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const queryOptions = validateData(paginationQuerySchema, searchParams);

    const themeDetail = await themeService.getThemeById(params.id, authContext.workspaceId, queryOptions);

    return createSuccessResponse(themeDetail, "Theme details retrieved successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
