/**
 * @file app/api/auth/register/route.ts
 * @description API endpoint for new user registration.
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
    const { email, name, password, jobTitle, companyName } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: HTTP_STATUS_CODES.BAD_REQUEST }
      );
    }

    const user = await authService.registerUser({
      name,
      email,
      password,
      jobTitle: jobTitle || "Product Manager",
      companyName,
    });

    const token = await authService.generateSessionToken(user.id);

    return createSuccessResponse(
      { user, token },
      "User registered successfully.",
      HTTP_STATUS_CODES.CREATED
    );
  } catch (error) {
    return handleApiError(error);
  }
}
