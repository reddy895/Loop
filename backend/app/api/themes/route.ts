/**
 * @file app/api/themes/route.ts
 * @description REST API Route handler for retrieving workspace theme topics.
 */

import { NextRequest, NextResponse } from "next/server";
import { themeService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";

/**
 * GET /api/themes
 * Fetch workspace themes with feedback count and trend metrics.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req);
    const search = req.nextUrl.searchParams.get("search") || undefined;

    const themes = await themeService.getThemesByWorkspace(authContext.workspaceId, search);

    return createSuccessResponse(themes, "Themes retrieved successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
