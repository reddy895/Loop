/**
 * @file app/api/ai/ask/route.ts
 * @description REST API route handler for Ask LOOP RAG question answering with prompt injection protection and tenant isolation.
 */

import { NextRequest, NextResponse } from "next/server";
import { askLoopService } from "@/ai";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, resolveAuthContext, applyRateLimit } from "@/middleware";
import { z } from "zod";
import { validateData } from "@/validators";
import { sanitizePromptInput } from "@/utils/promptSanitizer";

const askQuerySchema = z.object({
  question: z
    .string({ required_error: "Question string is required." })
    .trim()
    .min(1, "Question cannot be empty.")
    .max(1000, "Question cannot exceed 1000 characters."),
});

/**
 * POST /api/ai/ask
 * Execute Ask LOOP RAG workflow over authorized tenant feedback evidence.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  // Rate limit expensive AI model invocations (30/min per IP)
  const rateLimitResponse = applyRateLimit(req, "AI");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const authContext = await resolveAuthContext(req);
    const body = await req.json().catch(() => ({}));
    const validated = validateData(askQuerySchema, body);

    // Sanitize question against prompt injection attempts
    const sanitizedQuestion = sanitizePromptInput(validated.question);

    const ragResponse = await askLoopService.askQuestion(sanitizedQuestion, authContext.workspaceId);

    return createSuccessResponse(ragResponse, "Ask LOOP query executed successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
