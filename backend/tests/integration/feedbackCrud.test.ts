/**
 * @file tests/integration/feedbackCrud.test.ts
 * @description Integration tests for feedback CRUD operations, tenant boundaries,
 * and IDOR / BOLA vulnerability protections.
 */

import { feedbackService, authService } from "../../services";
import { NotFoundError } from "../../utils";
import assert from "assert";

export async function runFeedbackCrudTests(): Promise<void> {
  console.log("▶ [Integration] Feedback CRUD Lifecycle & IDOR Protection Tests");

  // 1. Setup two distinct tenants
  const tenant1 = await authService.registerUser({
    name: "Feedback Admin One",
    email: `fb.tenant1.${Date.now()}@acme.com`,
    password: "Password1234!",
    companyName: "Acme First",
  });
  const ws1 = (await authService.validateSessionToken(
    await authService.generateSessionToken(tenant1.id)
  )) ? (await import("../../lib/prisma")).prisma.member.findFirst({
    where: { userId: tenant1.id },
  }).then((m: any) => m?.workspaceId) : null;

  const tenant2 = await authService.registerUser({
    name: "Feedback Admin Two",
    email: `fb.tenant2.${Date.now()}@acme.com`,
    password: "Password1234!",
    companyName: "Acme Second",
  });
  const ws2 = (await import("../../lib/prisma")).prisma.member.findFirst({
    where: { userId: tenant2.id },
  }).then((m: any) => m?.workspaceId);

  const [workspace1Id, workspace2Id] = await Promise.all([ws1, ws2]);
  assert.ok(workspace1Id && workspace2Id, "Workspaces must be created");
  assert.notStrictEqual(workspace1Id, workspace2Id, "Workspaces must be isolated");

  // 2. Create feedback in Workspace 1
  const created = await feedbackService.createFeedback(workspace1Id, {
    content: "The dashboard loading speed is incredibly fast, really loving the experience!",
    channel: "In-App Feedback",
    customerLabel: "Enterprise VIP Customer",
    sentiment: "POSITIVE",
  });

  assert.ok(created.id, "Created feedback must have an ID");
  assert.strictEqual(created.workspaceId, workspace1Id);
  assert.strictEqual(created.sentiment, "POSITIVE");
  assert.strictEqual(created.status, "NEW");
  console.log("  ✔ Feedback successfully created with automated metadata assignment");

  // 3. Retrieve feedback by ID in Workspace 1
  const fetched = await feedbackService.getFeedbackById(created.id, workspace1Id);
  assert.strictEqual(fetched.id, created.id);
  assert.strictEqual(fetched.content, created.content);
  console.log("  ✔ Feedback retrieved successfully by ID within tenant boundary");

  // 4. IDOR Defense: Attempting to fetch Workspace 1 feedback using Workspace 2 context
  await assert.rejects(
    async () => {
      await feedbackService.getFeedbackById(created.id, workspace2Id);
    },
    (err: unknown) => err instanceof NotFoundError,
    "Cross-tenant IDOR access attempt must be rejected with NotFoundError"
  );
  console.log("  ✔ IDOR defense: Cross-tenant feedback lookup rejected (NotFoundError)");

  // 5. Update feedback status and sentiment
  const updated = await feedbackService.updateFeedback(created.id, workspace1Id, {
    status: "PROCESSED",
    customerLabel: "Updated Enterprise VIP",
  });
  assert.strictEqual(updated.status, "PROCESSED");
  assert.strictEqual(updated.customerLabel, "Updated Enterprise VIP");
  console.log("  ✔ Feedback status and attributes updated successfully");

  // 6. Cross-tenant update attempt (BOLA defense)
  await assert.rejects(
    async () => {
      await feedbackService.updateFeedback(created.id, workspace2Id, {
        status: "CLOSED",
      });
    },
    (err: unknown) => err instanceof NotFoundError,
    "Cross-tenant BOLA update attempt must be rejected"
  );
  console.log("  ✔ BOLA defense: Cross-tenant update blocked");

  // 7. List feedback with filtering & pagination
  const listResult = await feedbackService.listFeedback(workspace1Id, {
    status: "PROCESSED",
    page: 1,
    limit: 10,
  });
  assert.ok(listResult.items.some((item) => item.id === created.id));
  assert.strictEqual(listResult.pagination.page, 1);
  console.log("  ✔ Feedback listing and filtering operates accurately within tenant");

  // 8. Soft delete feedback
  const deleteResult = await feedbackService.deleteFeedback(created.id, workspace1Id);
  assert.strictEqual(deleteResult.success, true);

  // Verify deleted feedback is excluded from active listing
  const afterDeleteList = await feedbackService.listFeedback(workspace1Id, {
    page: 1,
    limit: 10,
  });
  assert.ok(!afterDeleteList.items.some((item) => item.id === created.id));
  console.log("  ✔ Soft delete verified: deleted record excluded from active queries");
}

if (process.argv[1]?.endsWith("feedbackCrud.test.ts")) {
  runFeedbackCrudTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
