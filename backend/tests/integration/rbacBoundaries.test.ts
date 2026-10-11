/**
 * @file tests/integration/rbacBoundaries.test.ts
 * @description Integration tests for role-based access control (RBAC) boundaries,
 * verifying OWNER, ADMIN, ANALYST, and VIEWER permission enforcement.
 */

import { resolveAuthContext } from "../../middleware";
import { authService } from "../../services";
import { ForbiddenError } from "../../utils";
import { NextRequest } from "next/server";
import { prisma } from "../../lib/prisma";
import assert from "assert";

export async function runRbacBoundariesTests(): Promise<void> {
  console.log("▶ [Integration] RBAC Hierarchy & Boundary Enforcement Tests");

  // 1. Setup workspace with OWNER
  const ownerUser = await authService.registerUser({
    name: "Enterprise Owner",
    email: `rbac.owner.${Date.now()}@acme.com`,
    password: "OwnerPassword2026!",
    companyName: "RBAC Corp",
  });
  const ownerToken = await authService.generateSessionToken(ownerUser.id);

  // Resolve owner's workspace
  const ownerReq = new NextRequest("http://localhost:3000/api/workspace", {
    headers: { authorization: `Bearer ${ownerToken}` },
  });
  const ownerCtx = await resolveAuthContext(ownerReq);
  const workspaceId = ownerCtx.workspaceId;

  // 2. Setup ADMIN, ANALYST, and VIEWER users in the same workspace
  const adminUser = await authService.registerUser({
    name: "Enterprise Admin",
    email: `rbac.admin.${Date.now()}@acme.com`,
    password: "AdminPassword2026!",
  });
  const adminToken = await authService.generateSessionToken(adminUser.id);
  await (prisma as any).member.create({
    data: {
      workspaceId,
      userId: adminUser.id,
      email: adminUser.email,
      name: "Enterprise Admin",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const analystUser = await authService.registerUser({
    name: "Enterprise Analyst",
    email: `rbac.analyst.${Date.now()}@acme.com`,
    password: "AnalystPassword2026!",
  });
  const analystToken = await authService.generateSessionToken(analystUser.id);
  await (prisma as any).member.create({
    data: {
      workspaceId,
      userId: analystUser.id,
      email: analystUser.email,
      name: "Enterprise Analyst",
      role: "ANALYST",
      status: "ACTIVE",
    },
  });

  const viewerUser = await authService.registerUser({
    name: "Enterprise Viewer",
    email: `rbac.viewer.${Date.now()}@acme.com`,
    password: "ViewerPassword2026!",
  });
  const viewerToken = await authService.generateSessionToken(viewerUser.id);
  await (prisma as any).member.create({
    data: {
      workspaceId,
      userId: viewerUser.id,
      email: viewerUser.email,
      name: "Enterprise Viewer",
      role: "VIEWER",
      status: "ACTIVE",
    },
  });

  // Verify OWNER permissions on member management endpoint (allowedRoles: ["OWNER", "ADMIN"])
  const ownerMemberReq = new NextRequest("http://localhost:3000/api/members", {
    headers: {
      authorization: `Bearer ${ownerToken}`,
      "x-workspace-id": workspaceId,
    },
  });
  const resolvedOwner = await resolveAuthContext(ownerMemberReq, ["OWNER", "ADMIN"]);
  assert.strictEqual(resolvedOwner.userRole, "OWNER");
  console.log("  ✔ OWNER granted access to administrative resources");

  // Verify ADMIN permissions on member management endpoint
  const adminMemberReq = new NextRequest("http://localhost:3000/api/members", {
    headers: {
      authorization: `Bearer ${adminToken}`,
      "x-workspace-id": workspaceId,
    },
  });
  const resolvedAdmin = await resolveAuthContext(adminMemberReq, ["OWNER", "ADMIN"]);
  assert.strictEqual(resolvedAdmin.userRole, "ADMIN");
  console.log("  ✔ ADMIN granted access to administrative resources");

  // Verify ANALYST is blocked from member management endpoint (403 Forbidden)
  const analystMemberReq = new NextRequest("http://localhost:3000/api/members", {
    headers: {
      authorization: `Bearer ${analystToken}`,
      "x-workspace-id": workspaceId,
    },
  });
  await assert.rejects(
    async () => {
      await resolveAuthContext(analystMemberReq, ["OWNER", "ADMIN"]);
    },
    (err: unknown) => err instanceof ForbiddenError,
    "ANALYST must be denied access to admin-only member management"
  );
  console.log("  ✔ ANALYST denied access to administrative resources (403 Forbidden)");

  // Verify ANALYST can access analytics and feedback read/write
  const analystFeedbackReq = new NextRequest("http://localhost:3000/api/feedback", {
    method: "POST",
    headers: {
      authorization: `Bearer ${analystToken}`,
      "x-workspace-id": workspaceId,
    },
  });
  const resolvedAnalystFeedback = await resolveAuthContext(analystFeedbackReq, ["OWNER", "ADMIN", "ANALYST"]);
  assert.strictEqual(resolvedAnalystFeedback.userRole, "ANALYST");
  console.log("  ✔ ANALYST permitted for feedback and analytics mutations");

  // Verify VIEWER cannot mutate feedback (POST /api/feedback blocked for VIEWER)
  const viewerWriteReq = new NextRequest("http://localhost:3000/api/feedback", {
    method: "POST",
    headers: {
      authorization: `Bearer ${viewerToken}`,
      "x-workspace-id": workspaceId,
    },
  });
  await assert.rejects(
    async () => {
      await resolveAuthContext(viewerWriteReq, ["OWNER", "ADMIN", "ANALYST", "VIEWER"]);
    },
    (err: unknown) => err instanceof ForbiddenError,
    "VIEWER must be prevented from mutating resources even if in allowedRoles"
  );
  console.log("  ✔ VIEWER write attempt rejected with 403 Forbidden");

  // Verify VIEWER can read feedback
  const viewerReadReq = new NextRequest("http://localhost:3000/api/feedback", {
    method: "GET",
    headers: {
      authorization: `Bearer ${viewerToken}`,
      "x-workspace-id": workspaceId,
    },
  });
  const resolvedViewerRead = await resolveAuthContext(viewerReadReq, ["OWNER", "ADMIN", "ANALYST", "VIEWER"]);
  assert.strictEqual(resolvedViewerRead.userRole, "VIEWER");
  console.log("  ✔ VIEWER permitted for read-only feedback queries");
}

if (process.argv[1]?.endsWith("rbacBoundaries.test.ts")) {
  runRbacBoundariesTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
