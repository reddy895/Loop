/**
 * @file app/api/auth/me/route.ts
 * @description API endpoint to get and update current authenticated user profile & preferences.
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { HTTP_STATUS_CODES } from "@/constants";

export async function GET(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req);
    const user = await authService.getUserById(authContext.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User profile not found." },
        { status: HTTP_STATUS_CODES.NOT_FOUND }
      );
    }

    return createSuccessResponse(user, "User profile retrieved successfully.", HTTP_STATUS_CODES.OK);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req);
    const body = await req.json().catch(() => ({}));

    const updatedUser = await authService.updateUserProfile(authContext.userId, body);

    return createSuccessResponse(updatedUser, "User profile updated successfully.", HTTP_STATUS_CODES.OK);
  } catch (error) {
    return handleApiError(error);
  }
}
