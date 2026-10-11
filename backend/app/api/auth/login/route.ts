/**
 * @file app/api/auth/login/route.ts
 * @description Secure API endpoint for user authentication with rate limiting and brute-force protection.
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, applyRateLimit } from "@/middleware";
import { loginSchema, validateData } from "@/validators";
import { HTTP_STATUS_CODES } from "@/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  // Apply rate limiting (5 attempts / 60 seconds per IP)
  const rateLimitResponse = applyRateLimit(req, "AUTH_LOGIN");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json().catch(() => ({}));
    const validatedData = validateData(loginSchema, body);

    const user = await authService.validateUserCredentials(
      validatedData.email,
      validatedData.password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password credentials." },
        { status: HTTP_STATUS_CODES.UNAUTHORIZED }
      );
    }

    const token = await authService.generateSessionToken((user as any).id);

    const response = createSuccessResponse(
      { user, token },
      "Authentication successful.",
      HTTP_STATUS_CODES.OK
    );

    // Set secure HttpOnly session cookie
    response.cookies.set("loop_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
