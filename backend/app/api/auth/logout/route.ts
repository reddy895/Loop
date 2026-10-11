/**
 * @file app/api/auth/logout/route.ts
 * @description Secure logout endpoint invalidating the current session token and clearing cookies.
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware } from "@/middleware";
import { HTTP_STATUS_CODES } from "@/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("loop_session")?.value;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const token = bearerToken || cookieToken;

    if (token) {
      await authService.invalidateSessionToken(token);
    }

    const response = createSuccessResponse(
      null,
      "Session successfully invalidated.",
      HTTP_STATUS_CODES.OK
    );

    // Invalidate cookie
    response.cookies.set("loop_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
