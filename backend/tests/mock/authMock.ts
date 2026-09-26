/**
 * @file tests/mock/authMock.ts
 * @description Mock helper utilities for constructing test authenticated sessions and workspace contexts.
 */

import { IAuthContext, UserRole } from "@/types";

export const createMockAuthContext = (
  role: UserRole = "ADMIN",
  workspaceId: string = "ws_default",
  userId: string = "usr_mock_123"
): IAuthContext => ({
  workspaceId,
  userId,
  userRole: role,
});
