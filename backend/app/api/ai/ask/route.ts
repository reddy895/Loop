/**
 * @file app/api/ai/ask/route.ts
 * @description REST API route handler for Ask LOOP RAG question answering.
 */

import { NextRequest, NextResponse } from "next/server";
import { askLoopService } from "@/ai";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { z } from "zod";
import { validateData } from "@/validators";

const askQuerySchema = z.object({
  question: z.string({ required_error: "Question string is required." }).min(1, "Question cannot be empty."),
});

/**
 * POST /api/ai/ask
 * Execute Ask LOOP RAG workflow to answer queries over customer feedback evidence.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req);
    const body = await req.json().catch(() => ({}));
    const validated = validateData(askQuerySchema, body);

    const ragResponse = await askLoopService.askQuestion(validated.question, authContext.workspaceId);

    return createSuccessResponse(ragResponse, "Ask LOOP query executed successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
