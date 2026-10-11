/**
 * @file app/api/ai/classify/route.ts
 * @description REST API route handler for manual feedback classification and reclassification with tenant isolation.
 */

import { NextRequest, NextResponse } from "next/server";
import { classificationService } from "@/ai";
import { createSuccessResponse, ValidationError } from "@/utils";
import { handleApiError, requestLoggerMiddleware, resolveAuthContext, applyRateLimit } from "@/middleware";
import { z } from "zod";
import { validateData } from "@/validators";

const classifySchema = z.object({
  feedbackId: z.string().optional(),
  content: z.string().optional(),
});

/**
 * POST /api/ai/classify
 * Reclassify existing feedback record by ID or classify raw content text.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  const rateLimitResponse = applyRateLimit(req, "AI");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const authContext = await resolveAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);
    const body = await req.json().catch(() => ({}));
    const validated = validateData(classifySchema, body);

    if (validated.feedbackId) {
      const updated = await classificationService.reclassifyFeedback(validated.feedbackId, authContext.workspaceId);
      return createSuccessResponse(updated, "Feedback reclassified successfully.");
    }

    if (validated.content) {
      const result = await classificationService.classifyFeedback(validated.content);
      return createSuccessResponse(result, "Feedback content classified successfully.");
    }

    throw new ValidationError("Either 'feedbackId' or 'content' string must be provided for classification.");
  } catch (error) {
    return handleApiError(error);
  }
}
