/**
 * @file app/api/feedback/simulate/route.ts
 * @description REST API Route handler for generating simulated demo feedback records.
 */

import { NextRequest, NextResponse } from "next/server";
import { feedbackService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { simulateFeedbackSchema, validateData } from "@/validators";
import { HTTP_STATUS_CODES } from "@/constants";

/**
 * POST /api/feedback/simulate
 * Generate realistic simulated customer feedback across channels.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);
    const body = await req.json().catch(() => ({}));
    const validatedBody = validateData(simulateFeedbackSchema, body);

    const generatedFeedback = await feedbackService.simulateFeedback(authContext.workspaceId, validatedBody);

    return createSuccessResponse(
      generatedFeedback,
      `Successfully generated ${generatedFeedback.length} simulated channel feedback records.`,
      HTTP_STATUS_CODES.CREATED
    );
  } catch (error) {
    return handleApiError(error);
  }
}
