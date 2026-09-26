/**
 * @file app/api/feedback/route.ts
 * @description REST API Route handler for listing and creating feedback records.
 */

import { NextRequest, NextResponse } from "next/server";
import { feedbackService } from "@/services";
import { createSuccessResponse, createPaginatedResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { feedbackQuerySchema, createFeedbackSchema, validateData } from "@/validators";
import { HTTP_STATUS_CODES } from "@/constants";

/**
 * GET /api/feedback
 * List feedback records with pagination, search, sorting, and filters.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req);
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const validatedQuery = validateData(feedbackQuerySchema, searchParams);

    const result = await feedbackService.listFeedback(authContext.workspaceId, validatedQuery);

    return createPaginatedResponse(result.items, result.pagination, "Feedback records retrieved successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/feedback
 * Ingest new feedback record into workspace.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);
    const body = await req.json().catch(() => ({}));
    const validatedBody = validateData(createFeedbackSchema, body);

    const newFeedback = await feedbackService.createFeedback(authContext.workspaceId, validatedBody);

    return createSuccessResponse(newFeedback, "Feedback record created successfully.", HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}
