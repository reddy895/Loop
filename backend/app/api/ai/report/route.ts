/**
 * @file app/api/ai/report/route.ts
 * @description REST API route handler for Voice of Customer (VoC) report generation with tenant isolation.
 */

import { NextRequest, NextResponse } from "next/server";
import { aiReportService } from "@/ai";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, resolveAuthContext, applyRateLimit } from "@/middleware";
import { z } from "zod";

const reportSchema = z.object({
  forceRefresh: z.boolean().optional().default(false),
});

/**
 * POST /api/ai/report
 * Generate structured Voice of Customer executive report for authorized workspace.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  const rateLimitResponse = applyRateLimit(req, "REPORT");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const authContext = await resolveAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);
    const body = await req.json().catch(() => ({}));
    const validated = reportSchema.parse(body);

    const report = await aiReportService.generateVoiceOfCustomerReport(authContext.workspaceId, validated.forceRefresh);

    return createSuccessResponse(report, "Voice of Customer report generated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
