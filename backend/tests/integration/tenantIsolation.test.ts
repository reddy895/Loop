/**
 * @file tests/integration/tenantIsolation.test.ts
 * @description Integration tests for multi-tenant isolation, negative cross-tenant authorization tests,
 * and header spoofing defense.
 */

import { resolveAuthContext } from "../../middleware";
import { authService, feedbackService } from "../../services";
import { UnauthorizedError, ForbiddenError } from "../../utils";
import { NextRequest } from "next/server";
import assert from "assert";

export async function runTenantIsolationTests(): Promise<void> {
  console.log("▶ [Integration] Multi-Tenant Isolation & Cross-Tenant Boundary Tests");

  // 1. Create two separate enterprise users in distinct workspaces
  const userA = await authService.registerUser({
    name: "Tenant Alpha Admin",
    email: `tenant.a.${Date.now()}@alpha.com`,
    password: "PasswordAlpha2026!",
    companyName: "Alpha Corp",
  });
  const tokenA = await authService.generateSessionToken(userA.id);

  const userB = await authService.registerUser({
    name: "Tenant Beta Admin",
    email: `tenant.b.${Date.now()}@beta.com`,
    password: "PasswordBeta2026!",
    companyName: "Beta Corp",
  });
  const tokenB = await authService.generateSessionToken(userB.id);

  // Get User A's workspace context
  const reqA = new NextRequest("http://localhost:3000/api/feedback", {
    headers: { authorization: `Bearer ${tokenA}` },
  });
  const ctxA = await resolveAuthContext(reqA);
  const workspaceA = ctxA.workspaceId;

  // Get User B's workspace context
  const reqB = new NextRequest("http://localhost:3000/api/feedback", {
    headers: { authorization: `Bearer ${tokenB}` },
  });
  const ctxB = await resolveAuthContext(reqB);
  const workspaceB = ctxB.workspaceId;

  assert.notStrictEqual(workspaceA, workspaceB, "Workspaces must be distinct tenants");
  console.log("  ✔ Verified two isolated tenant workspaces provisioned");

  // Test 2: Unauthenticated request is rejected (401 Unauthorized)
  const unauthReq = new NextRequest("http://localhost:3000/api/feedback");
  await assert.rejects(
    async () => {
      await resolveAuthContext(unauthReq);
    },
    (err: unknown) => err instanceof UnauthorizedError,
    "Unauthenticated request must be rejected with 401 Unauthorized"
  );
  console.log("  ✔ Unauthenticated private API request rejected (401 Unauthorized)");

  // Test 3: Cross-tenant access attempt (User A attempts to access Workspace B)
  const crossTenantReq = new NextRequest(`http://localhost:3000/api/feedback?workspaceId=${workspaceB}`, {
    headers: {
      authorization: `Bearer ${tokenA}`,
      "x-workspace-id": workspaceB,
    },
  });

  await assert.rejects(
    async () => {
      await resolveAuthContext(crossTenantReq);
    },
    (err: unknown) => err instanceof ForbiddenError,
    "User from tenant A must be rejected from tenant B with 403 Forbidden"
  );
  console.log("  ✔ Cross-tenant read access attempt blocked (403 Forbidden)");

  // Test 4: Header spoofing defense (Client sends x-user-role: OWNER attempting privilege escalation)
  // Let's create a viewer in Workspace A
  const { prisma } = await import("../../lib/prisma");
  const viewerEmail = `viewer.${Date.now()}@alpha.com`;
  const viewerUser = await authService.registerUser({
    name: "Viewer User",
    email: viewerEmail,
    password: "ViewerPassword2026!",
  });
  const viewerToken = await authService.generateSessionToken(viewerUser.id);

  // Add viewer to Workspace A as VIEWER
  await (prisma as any).member.create({
    data: {
      workspaceId: workspaceA,
      userId: viewerUser.id,
      email: viewerEmail,
      name: "Viewer User",
      role: "VIEWER",
      status: "ACTIVE",
    },
  });

  // Viewer sends request with forged 'x-user-role: OWNER' header
  const spoofReq = new NextRequest(`http://localhost:3000/api/feedback`, {
    headers: {
      authorization: `Bearer ${viewerToken}`,
      "x-workspace-id": workspaceA,
      "x-user-role": "OWNER", // Malicious header spoof
    },
  });

  const resolvedSpoofCtx = await resolveAuthContext(spoofReq);
  assert.strictEqual(
    resolvedSpoofCtx.userRole,
    "VIEWER",
    "Server must resolve role from database membership, ignoring spoofed x-user-role"
  );
  console.log("  ✔ Privilege escalation via header spoofing successfully prevented");

  // Test 5: VIEWER cannot execute write operations
  const writeReq = new NextRequest(`http://localhost:3000/api/feedback`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${viewerToken}`,
      "x-workspace-id": workspaceA,
    },
  });

  await assert.rejects(
    async () => {
      await resolveAuthContext(writeReq);
    },
    (err: unknown) => err instanceof ForbiddenError,
    "VIEWER role must be prohibited from mutating write operations"
  );
  console.log("  ✔ VIEWER write operations rejected on server (403 Forbidden)");
}

if (process.argv[1]?.endsWith("tenantIsolation.test.ts")) {
  runTenantIsolationTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
