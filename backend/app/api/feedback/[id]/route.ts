/**
 * @file app/api/feedback/[id]/route.ts
 * @description REST API Route handler for updating and deleting single feedback records with tenant isolation.
 */

import { NextRequest, NextResponse } from "next/server";
import { feedbackService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, resolveAuthContext } from "@/middleware";
import { updateFeedbackSchema, validateData } from "@/validators";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/feedback/:id
 * Retrieve a single feedback record within authorized workspace.
 */
export async function GET(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = await resolveAuthContext(req);
    const feedback = await feedbackService.getFeedbackById(params.id, authContext.workspaceId);

    return createSuccessResponse(feedback, "Feedback record retrieved successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/feedback/:id
 * Update an existing feedback record within authorized workspace.
 */
export async function PATCH(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = await resolveAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);
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
 * Soft delete a feedback record within authorized workspace.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = await resolveAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);

    const result = await feedbackService.deleteFeedback(params.id, authContext.workspaceId);

    return createSuccessResponse(result, "Feedback record deleted successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
