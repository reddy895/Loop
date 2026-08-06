/**
 * @file app/api/members/route.ts
 * @description REST API Route handler for workspace member listing and member invitations.
 */

import { NextRequest, NextResponse } from "next/server";
import { memberService } from "@/services";
import { createSuccessResponse, createPaginatedResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { memberQuerySchema, inviteMemberSchema, validateData } from "@/validators";
import { HTTP_STATUS_CODES } from "@/constants";

/**
 * GET /api/members
 * List workspace members with role filtering, search, and pagination.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req);
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
    const validatedQuery = validateData(memberQuerySchema, searchParams);

    const result = await memberService.getMembers(authContext.workspaceId, validatedQuery);

    return createPaginatedResponse(result.items, result.pagination, "Workspace members retrieved successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/members
 * Invite a new member to the workspace. Requires ADMIN or OWNER role.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req, ["ADMIN", "OWNER"]);
    const body = await req.json().catch(() => ({}));
    const validatedBody = validateData(inviteMemberSchema, body);

    const newMember = await memberService.addMemberToWorkspace(authContext.workspaceId, validatedBody);

    return createSuccessResponse(newMember, "Workspace member invited successfully.", HTTP_STATUS_CODES.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}
