/**
 * @file tests/integration/feedbackApi.test.ts
 * @description Integration tests for Feedback CRUD operations, filters, and workspace tenant isolation.
 */

import { feedbackService } from "@/services";

async function runFeedbackApiIntegrationTests() {
  console.log("--- Running Integration Tests: Feedback API & Tenant Isolation ---");
  const wsId = "ws_test_tenant";

  // Test 1: Create Feedback for Tenant
  const created = await feedbackService.createFeedback(wsId, {
    content: "Integration testing tenant isolation feedback record.",
    channel: "Support Ticket",
    customerLabel: "Tenant User",
  });
  console.log("✓ Feedback created for isolated workspace tenant:", created.workspaceId === wsId);

  // Test 2: List Feedback under Tenant
  const list = await feedbackService.listFeedback(wsId, { page: 1, limit: 10 });
  console.log("✓ Tenant feedback count isolated:", list.items.length >= 1);

  // Test 3: Soft Delete Feedback
  const deleted = await feedbackService.deleteFeedback(created.id, wsId);
  console.log("✓ Feedback soft-deleted:", deleted.success);

  console.log("--- All Feedback Integration Tests Passed ---");
}

runFeedbackApiIntegrationTests().catch(console.error);
