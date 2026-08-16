/**
 * @file app/api/auth/login/route.ts
 * @description API endpoint for authenticating user credentials.
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware } from "@/middleware";
import { HTTP_STATUS_CODES } from "@/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: HTTP_STATUS_CODES.BAD_REQUEST }
      );
    }

    const user = await authService.validateUserCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password credentials." },
        { status: HTTP_STATUS_CODES.UNAUTHORIZED }
      );
    }

    const token = await authService.generateSessionToken(user.id);

    return createSuccessResponse(
      { user, token },
      "Authentication successful.",
      HTTP_STATUS_CODES.OK
    );
  } catch (error) {
    return handleApiError(error);
  }
}
