/**
 * @file app/api/feedback/[id]/route.ts
 * @description REST API Route handler for updating and deleting single feedback records.
 */

import { NextRequest, NextResponse } from "next/server";
import { feedbackService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { updateFeedbackSchema, validateData } from "@/validators";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * PATCH /api/feedback/:id
 * Update an existing feedback record.
 */
export async function PATCH(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);
    const body = await req.json().catch(() => ({}));
    const validatedBody = validateData(updateFeedbackSchema, body);

    const updatedFeedback = await feedbackService.updateFeedback(params.id, authContext.workspaceId, validatedBody);

    return createSuccessResponse(updatedFeedback, "Feedback record updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/feedback/:id
 * Soft delete a feedback record.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);

    const result = await feedbackService.deleteFeedback(params.id, authContext.workspaceId);

    return createSuccessResponse(result, "Feedback record deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
