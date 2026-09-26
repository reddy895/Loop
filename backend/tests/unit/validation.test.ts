/**
 * @file tests/unit/validation.test.ts
 * @description Unit tests for Zod validation schemas across feedback, workspace, and member payloads.
 */

import {
  createFeedbackSchema,
  updateFeedbackSchema,
  updateWorkspaceSchema,
  inviteMemberSchema,
  validateData,
} from "@/validators";

function runValidationUnitTests() {
  console.log("--- Running Unit Tests: Zod Validation Schemas ---");

  // Test 1: Valid create feedback payload
  const validFbPayload = {
    content: "Excellent dashboard performance and speed.",
    channel: "Website",
    customerLabel: "Enterprise VIP",
    source: "Web Application",
  };
  const parsedFb = validateData(createFeedbackSchema, validFbPayload);
  console.log("✓ Valid Create Feedback schema parsed successfully:", parsedFb.channel === "Website");

  // Test 2: Valid update workspace payload
  const validWsPayload = {
    name: "New Workspace Name",
    details: "Updated details string",
  };
  const parsedWs = validateData(updateWorkspaceSchema, validWsPayload);
  console.log("✓ Valid Update Workspace schema parsed successfully:", parsedWs.name === "New Workspace Name");

  // Test 3: Valid invite member payload
  const validInvitePayload = {
    email: "analyst@enterprise.com",
    role: "ANALYST",
    name: "Jane Doe",
  };
  const parsedInvite = validateData(inviteMemberSchema, validInvitePayload);
  console.log("✓ Valid Invite Member schema parsed successfully:", parsedInvite.email === "analyst@enterprise.com");

  console.log("--- All Unit Validation Tests Passed ---");
}

runValidationUnitTests();
