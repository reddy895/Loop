/**
 * @file app/api/themes/route.ts
 * @description REST API Route handler for retrieving and creating workspace theme topics with tenant isolation.
 */

import { NextRequest, NextResponse } from "next/server";
import { themeService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, resolveAuthContext } from "@/middleware";
import { createThemeSchema, validateData } from "@/validators";
import { HTTP_STATUS_CODES } from "@/constants";

/**
 * GET /api/themes
 * Fetch workspace themes with feedback count and trend metrics.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = await resolveAuthContext(req);
    const search = req.nextUrl.searchParams.get("search") || undefined;

    const themes = await themeService.getThemesByWorkspace(authContext.workspaceId, search);

    return createSuccessResponse(themes, "Themes retrieved successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/themes
 * Create new feedback cluster theme topic. Requires ADMIN, ANALYST, or OWNER role.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = await resolveAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);
    const body = await req.json().catch(() => ({}));
    const validatedBody = validateData(createThemeSchema, body);

    const theme = await themeService.createTheme(authContext.workspaceId, validatedBody);

    return createSuccessResponse(theme, "Theme created successfully.", HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}
