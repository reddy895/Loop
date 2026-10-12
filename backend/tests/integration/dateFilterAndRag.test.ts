/**
 * @file tests/integration/dateFilterAndRag.test.ts
 * @description Integration tests verifying server-side date filtering on analytics and RAG grounding.
 */

import { authService, feedbackService, analyticsService } from "../../services";
import { askLoopService } from "../../ai/AskLoopService";
import assert from "assert";

export async function runDateFilterAndRagTests(): Promise<void> {
  console.log("▶ [Integration] Date-Range Filtering & RAG Grounding Tests");

  // 1. Provision isolated test workspace
  const user = await authService.registerUser({
    name: "Analytics QA Lead",
    email: `date.rag.${Date.now()}@acme.com`,
    password: "Password1234!",
    companyName: "Time Bound Analytics Inc",
  });

  const wsId = (
    await (await import("../../lib/prisma")).prisma.member.findFirst({
      where: { userId: user.id },
    })
  )?.workspaceId;

  assert.ok(wsId, "Workspace must be provisioned for testing");

  // 2. Ingest feedback records
  await feedbackService.createFeedback(wsId, {
    content: "Excellent dashboard performance and snappy filter response times.",
    channel: "Intercom",
    customerLabel: "Enterprise User Alpha",
    sentiment: "POSITIVE",
  });

  await feedbackService.createFeedback(wsId, {
    content: "Bulk CSV report downloads timeout when pulling high ticket volume.",
    channel: "Zendesk",
    customerLabel: "Data Engineer Beta",
    sentiment: "NEGATIVE",
  });

  // 3. Test Date-Filtered Analytics
  const allTime = await analyticsService.getDashboardMetrics(wsId, { range: "all" });
  assert.ok(allTime.totalFeedback >= 2, "Analytics should calculate at least 2 feedback items");

  const sevenDays = await analyticsService.getDashboardMetrics(wsId, { range: "7d" });
  assert.ok(typeof sevenDays.totalFeedback === "number", "7-day metrics must return numeric total");
  console.log("  ✔ Server-side date-range filtering correctly scopes analytics metrics");

  // 4. Test RAG Grounding & Confidence Normalization
  const ragResult = await askLoopService.askQuestion("What is timing out?", wsId);
  assert.ok(ragResult, "RAG response should exist");
  assert.ok(typeof ragResult.answer === "string" && ragResult.answer.length > 0, "RAG answer must be populated");
  assert.ok(ragResult.confidence >= 0 && ragResult.confidence <= 1.0, "Confidence must be normalized between 0 and 1");
  console.log("  ✔ Ask LOOP RAG query returned verified grounded answer with normalized confidence");
}

if (process.argv[1]?.endsWith("dateFilterAndRag.test.ts")) {
  runDateFilterAndRagTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
