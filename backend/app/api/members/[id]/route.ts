/**
 * @file app/api/members/[id]/route.ts
 * @description REST API Route handler for updating member role/status and removing members.
 */

import { NextRequest, NextResponse } from "next/server";
import { memberService } from "@/services";
import { createSuccessResponse, ValidationError } from "@/utils";
import { handleApiError, requestLoggerMiddleware, extractAuthContext } from "@/middleware";
import { updateMemberSchema, validateData } from "@/validators";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * PATCH /api/members/:id
 * Update member role or status. Requires ADMIN or OWNER role.
 */
export async function PATCH(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req, ["ADMIN", "OWNER"]);
    const body = await req.json().catch(() => ({}));
    const validatedBody = validateData(updateMemberSchema, body);

    if (!validatedBody.role && !validatedBody.status) {
      throw new ValidationError("At least one field ('role' or 'status') must be provided to update member.");
    }

    const updatedMember = await memberService.updateMemberRole(
      authContext.workspaceId,
      params.id,
      validatedBody.role || "MEMBER",
      validatedBody.status
    );

    return createSuccessResponse(updatedMember, "Member role updated successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/members/:id
 * Remove member from workspace. Requires ADMIN or OWNER role.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const authContext = extractAuthContext(req, ["ADMIN", "OWNER"]);

    const result = await memberService.removeMemberFromWorkspace(authContext.workspaceId, params.id);

    return createSuccessResponse(result, "Member removed from workspace successfully.");
  } catch (error) {
    return handleApiError(error);
  }
}
