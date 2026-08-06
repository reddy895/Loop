/**
 * @file app/api/feedback/upload/route.ts
 * @description REST API Route handler for CSV feedback batch upload.
 */

import { NextRequest, NextResponse } from "next/server";
import { csvImportService } from "@/services";
import { createSuccessResponse, ValidationError } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";

/**
 * POST /api/feedback/upload
 * Bulk import feedback records from CSV content.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);

    let csvContent = "";
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") || formData.get("csv");

      if (!file || typeof file === "string") {
        throw new ValidationError("Multipart form upload must include a 'file' field with CSV content.");
      }

      csvContent = await (file as File).text();
    } else {
      const body = await req.json().catch(() => ({}));
      csvContent = body.csvContent || body.content || body.csv || "";
    }

    if (!csvContent || !csvContent.trim()) {
      throw new ValidationError("CSV payload is missing or empty.");
    }

    const result = await csvImportService.importCsv(authContext.workspaceId, csvContent);

    return createSuccessResponse(result, "CSV feedback batch import completed.");
  } catch (error) {
    return handleApiError(error);
  }
}
