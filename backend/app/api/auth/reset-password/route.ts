/**
 * @file app/api/auth/reset-password/route.ts
 * @description Secure endpoint to complete password reset using a cryptographic single-use token.
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, applyRateLimit } from "@/middleware";
import { resetPasswordSchema, validateData } from "@/validators";
import { HTTP_STATUS_CODES } from "@/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  const rateLimitResponse = applyRateLimit(req, "AUTH_RESET");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json().catch(() => ({}));
    const validatedData = validateData(resetPasswordSchema, body);

    await authService.resetPasswordWithToken(
      validatedData.token,
      validatedData.newPassword
    );

    return createSuccessResponse(
      null,
      "Password has been successfully updated. Please log in with your new password.",
      HTTP_STATUS_CODES.OK
    );
  } catch (error) {
    return handleApiError(error);
  }
}
