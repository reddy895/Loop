/**
 * @file app/api/feedback/upload/route.ts
 * @description REST API Route handler for CSV feedback batch upload with rate limiting, size guards, and tenant isolation.
 */

import { NextRequest, NextResponse } from "next/server";
import { csvImportService } from "@/services";
import { createSuccessResponse, ValidationError } from "@/utils";
import { handleApiError, requestLoggerMiddleware, resolveAuthContext, applyRateLimit } from "@/middleware";

const MAX_PAYLOAD_BYTES = 50 * 1024 * 1024; // 50MB limit

/**
 * POST /api/feedback/upload
 * Bulk import feedback records from CSV content within authorized workspace tenant.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  // Rate limiting (5 uploads / 60 seconds per IP)
  const rateLimitResponse = applyRateLimit(req, "CSV_UPLOAD");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const authContext = await resolveAuthContext(req, ["ADMIN", "ANALYST", "OWNER"]);

    let csvContent = "";
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") || formData.get("csv");

      if (!file || typeof file === "string") {
        throw new ValidationError("Multipart form upload must include a 'file' field with CSV content.");
      }

      const fileObj = file as File;
      if (fileObj.size > MAX_PAYLOAD_BYTES) {
        throw new ValidationError("Uploaded CSV file exceeds the 50MB maximum allowable file size.");
      }

      csvContent = await fileObj.text();
    } else {
      const body = await req.json().catch(() => ({}));
      csvContent = body.csvContent || body.content || body.csv || "";
    }

    if (!csvContent || !csvContent.trim()) {
      throw new ValidationError("CSV payload is missing or empty.");
    }

    if (Buffer.byteLength(csvContent, "utf8") > MAX_PAYLOAD_BYTES) {
      throw new ValidationError("CSV payload exceeds the 50MB maximum limit.");
    }

    const result = await csvImportService.importCsv(authContext.workspaceId, csvContent);

    return createSuccessResponse(result, "CSV feedback batch import completed.");
  } catch (error) {
    return handleApiError(error);
  }
}
