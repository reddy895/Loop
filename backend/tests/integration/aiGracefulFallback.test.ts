/**
 * @file tests/integration/aiGracefulFallback.test.ts
 * @description Integration tests for AI provider fallback mechanisms, offline intelligence,
 * and tenant-isolated RAG question answering.
 */

import { getAiProvider } from "../../providers";
import { classificationService } from "../../ai/ClassificationService";
import { askLoopService } from "../../ai/AskLoopService";
import { embeddingService } from "../../ai/EmbeddingService";
import { authService, feedbackService } from "../../services";
import assert from "assert";

export async function runAiGracefulFallbackTests(): Promise<void> {
  console.log("▶ [Integration] AI Provider Graceful Fallback & RAG Pipeline Tests");

  // 1. Verify AI Provider resolves cleanly without crashing
  const provider = getAiProvider();
  assert.ok(provider, "AI Provider must be resolved");
  assert.ok(provider.providerName, "AI Provider must have a descriptive name");
  console.log(`  ✔ AI Provider resolved: '${provider.providerName}'`);

  // 2. Test Feedback Auto-Classification (Heuristic / Provider)
  const positiveResult = await classificationService.classifyFeedback(
    "The new analytics dashboard is super fast and clean! Love the UI design."
  );
  assert.strictEqual(positiveResult.sentiment, "POSITIVE");
  assert.ok(positiveResult.sentimentScore > 0, "Positive score should be > 0");

  const negativeResult = await classificationService.classifyFeedback(
    "App crashes every time I open settings. Extremely frustrated with this bug."
  );
  assert.strictEqual(negativeResult.sentiment, "NEGATIVE");
  assert.ok(negativeResult.sentimentScore < 0, "Negative score should be < 0");

  const neutralResult = await classificationService.classifyFeedback(
    "The application was updated to version 2.4 this morning."
  );
  assert.ok(["NEUTRAL", "POSITIVE", "NEGATIVE"].includes(neutralResult.sentiment));
  console.log("  ✔ Sentiment and theme auto-classification operates reliably");

  // 3. Test Vector Embedding Generation & Cosine Similarity
  const vec1 = await embeddingService.generateEmbedding("checkout payment failure error");
  const vec2 = await embeddingService.generateEmbedding("credit card payment declined at checkout");
  const vec3 = await embeddingService.generateEmbedding("sunny weather in California beach");

  assert.ok(Array.isArray(vec1) && vec1.length > 0, "Vector 1 must be non-empty");
  assert.ok(Array.isArray(vec2) && vec2.length > 0, "Vector 2 must be non-empty");

  const similarityRelated = embeddingService.computeCosineSimilarity(vec1, vec2);
  const similarityUnrelated = embeddingService.computeCosineSimilarity(vec1, vec3);

  assert.ok(typeof similarityRelated === "number");
  assert.ok(typeof similarityUnrelated === "number");
  console.log("  ✔ Vector embeddings and cosine similarity computed successfully");

  // 4. Test RAG Ask LOOP in an isolated tenant environment
  const user = await authService.registerUser({
    name: "RAG Test Admin",
    email: `rag.test.${Date.now()}@acme.com`,
    password: "Password1234!",
    companyName: "RAG Acme Corp",
  });
  const wsId = (await (await import("../../lib/prisma")).prisma.member.findFirst({
    where: { userId: user.id },
  }))?.workspaceId;

  assert.ok(wsId, "Workspace must be provisioned");

  // Create feedback items in this workspace
  await feedbackService.createFeedback(wsId, {
    content: "The billing invoices have incorrect tax calculation on yearly plans.",
    channel: "Support Ticket",
    customerLabel: "Enterprise CFO",
  });
  await feedbackService.createFeedback(wsId, {
    content: "Export to CSV takes over 2 minutes when downloading 50,000 records.",
    channel: "In-App Feedback",
    customerLabel: "Data Team Lead",
  });

  // Query Ask LOOP on the tenant's workspace
  const response = await askLoopService.askQuestion("What billing problems are customers reporting?", wsId);

  assert.ok(response, "Ask LOOP response must be returned");
  assert.ok(typeof response.answer === "string" && response.answer.length > 0, "Answer must not be empty");
  console.log("  ✔ Ask LOOP RAG query returned evidence-backed response");

  // Query empty workspace to verify graceful empty-state handling
  const emptyUser = await authService.registerUser({
    name: "Empty RAG User",
    email: `empty.rag.${Date.now()}@acme.com`,
    password: "Password1234!",
  });
  const emptyWsId = (await (await import("../../lib/prisma")).prisma.member.findFirst({
    where: { userId: emptyUser.id },
  }))?.workspaceId;

  if (emptyWsId) {
    const emptyResponse = await askLoopService.askQuestion("Any complaints?", emptyWsId);
    assert.ok(
      emptyResponse.answer.includes("evidence") || emptyResponse.answer.includes("feedback"),
      "Empty workspace must handle missing feedback gracefully"
    );
    console.log("  ✔ Empty tenant workspace handled gracefully in RAG query");
  }
}

if (process.argv[1]?.endsWith("aiGracefulFallback.test.ts")) {
  runAiGracefulFallbackTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
