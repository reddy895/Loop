/**
 * @file app/api/auth/forgot-password/route.ts
 * @description Secure password reset request endpoint with rate limiting and anti-enumeration protections.
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, applyRateLimit } from "@/middleware";
import { forgotPasswordSchema, validateData } from "@/validators";
import { HTTP_STATUS_CODES } from "@/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  // Apply rate limiting (3 requests / 60 seconds per IP)
  const rateLimitResponse = applyRateLimit(req, "AUTH_RESET");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json().catch(() => ({}));
    const validatedData = validateData(forgotPasswordSchema, body);

    const result = await authService.createPasswordResetToken(validatedData.email);

    return createSuccessResponse(
      {
        resetToken: result.resetToken,
      },
      "If an account with that email exists, password reset instructions have been generated.",
      HTTP_STATUS_CODES.OK
    );
  } catch (error) {
    return handleApiError(error);
  }
}
