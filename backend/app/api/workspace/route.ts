/**
 * @file app/api/workspace/route.ts
 * @description REST API Route handler for retrieving and updating workspace details.
 */

import { NextRequest, NextResponse } from "next/server";
import { workspaceService } from "@/services";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { updateWorkspaceSchema, validateData } from "@/validators";

/**
 * GET /api/workspace
 * Retrieve active workspace details, member counts, feedback counts, and report counts.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req);

    const workspace = await workspaceService.getWorkspaceById(authContext.workspaceId);

    return createSuccessResponse(workspace, "Workspace details retrieved successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/workspace
 * Update workspace name and settings. Requires ADMIN or OWNER role.
 */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req, ["ADMIN", "OWNER"]);
    const body = await req.json().catch(() => ({}));
    const validatedBody = validateData(updateWorkspaceSchema, body);

    const updatedWorkspace = await workspaceService.updateWorkspace(authContext.workspaceId, validatedBody);

    return createSuccessResponse(updatedWorkspace, "Workspace configuration updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
