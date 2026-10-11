/**
 * @file app/api/auth/register/route.ts
 * @description Secure API endpoint for new user registration with rate limiting and strict Zod validation.
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, applyRateLimit } from "@/middleware";
import { registerSchema, validateData } from "@/validators";
import { HTTP_STATUS_CODES } from "@/constants";

export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  // Apply rate limiting (5 attempts / 60 seconds per IP)
  const rateLimitResponse = applyRateLimit(req, "AUTH_REGISTER");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await req.json().catch(() => ({}));
    const validatedData = validateData(registerSchema, body);

    const user = await authService.registerUser({
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      jobTitle: validatedData.jobTitle || "Product Lead",
      companyName: validatedData.companyName,
    });

    const token = await authService.generateSessionToken((user as any).id);

    const response = createSuccessResponse(
      { user, token },
      "Account registered successfully. Welcome to Project LOOP.",
      HTTP_STATUS_CODES.CREATED
    );

    // Set secure session cookie
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
