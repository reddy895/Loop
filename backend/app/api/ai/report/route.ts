/**
 * @file app/api/ai/report/route.ts
 * @description REST API route handler for Voice of Customer (VoC) report generation.
 */

import { NextRequest, NextResponse } from "next/server";
import { aiReportService } from "@/ai";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { z } from "zod";

const reportSchema = z.object({
  forceRefresh: z.boolean().optional().default(false),
});

/**
 * POST /api/ai/report
 * Generate structured Voice of Customer executive report.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);
    const body = await req.json().catch(() => ({}));
    const validated = reportSchema.parse(body);

    const report = await aiReportService.generateVoiceOfCustomerReport(authContext.workspaceId, validated.forceRefresh);

    return createSuccessResponse(report, "Voice of Customer report generated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
