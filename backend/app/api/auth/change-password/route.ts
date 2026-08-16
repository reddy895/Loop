/**
 * @file app/api/auth/change-password/route.ts
 * @description API endpoint for updating user password.
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { HTTP_STATUS_CODES } from "@/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req);
    const body = await req.json().catch(() => ({}));
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required." },
        { status: HTTP_STATUS_CODES.BAD_REQUEST }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 8 characters long." },
        { status: HTTP_STATUS_CODES.BAD_REQUEST }
      );
    }

    await authService.changeUserPassword(authContext.userId, currentPassword, newPassword);

    return createSuccessResponse(
      { success: true },
      "Password updated successfully.",
      HTTP_STATUS_CODES.OK
    );
  } catch (error) {
    return handleApiError(error);
  }
}
