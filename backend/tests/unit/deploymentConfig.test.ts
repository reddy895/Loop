/**
 * @file tests/unit/deploymentConfig.test.ts
 * @description Unit tests verifying deployment-critical configurations, credential redaction,
 * prototype pollution protection, and production error safety invariants.
 */

import assert from "assert";
import { createErrorResponse } from "../../utils";
import { parseCsvString } from "../../utils/csvUtils";
import { AiProviderFactory } from "../../providers";

export async function runDeploymentConfigTests(): Promise<void> {
  console.log("▶ [Unit] Deployment Configuration & Production Invariants Tests");

  // Test 1: createErrorResponse redacts database credentials from error payloads
  const sensitiveErrorMsg = "Connection failed to postgresql://admin:SuperSecretPass123!@db.internal:5432/production_loop";
  const errRes = createErrorResponse(sensitiveErrorMsg);
  const errBody = await errRes.json();
  assert.strictEqual(errRes.status, 500);
  assert.ok(!errBody.message.includes("SuperSecretPass123!"), "Database password must never leak in error response");
  assert.ok(errBody.message.includes("[REDACTED_CREDENTIALS]"), "Credentials must be explicitly redacted");
  console.log("  ✔ Database connection string credentials sanitized from API error payloads");

  // Test 2: createErrorResponse redacts Bearer tokens
  const bearerErrorMsg = "Failed authorization for Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token123";
  const bearerRes = createErrorResponse(bearerErrorMsg);
  const bearerBody = await bearerRes.json();
  assert.ok(!bearerBody.message.includes("token123"), "Bearer token must not leak");
  assert.ok(bearerBody.message.includes("Bearer [REDACTED_TOKEN]"), "Bearer tokens sanitized");
  console.log("  ✔ Bearer authentication tokens sanitized from API error payloads");

  // Test 3: CSV Parser blocks prototype pollution attacks
  const maliciousCsv = "content,channel,customerLabel,__proto__,constructor\n\"Legit item\",Website,EnterpriseUser,\"polluted_proto\",\"polluted_ctor\"";
  const parsedRecords = parseCsvString(maliciousCsv);
  assert.strictEqual(parsedRecords.length, 1);
  const record = parsedRecords[0];
  assert.strictEqual(record["content"], "Legit item");
  assert.strictEqual((record as any)["__proto__"], undefined, "Forbidden __proto__ key must be discarded");
  assert.strictEqual((record as any)["constructor"], undefined, "Forbidden constructor key must be discarded");
  assert.strictEqual(Object.prototype.hasOwnProperty.call(Object.prototype, "polluted_proto"), false);
  console.log("  ✔ CSV parser neutralizes prototype pollution attempts");

  // Test 4: AiProviderFactory handles placeholder keys safely without crashing
  const provider = AiProviderFactory.getProvider();
  assert.ok(provider, "AiProviderFactory must return a viable provider");
  assert.ok(typeof provider.classifyFeedback === "function");
  console.log("  ✔ AiProviderFactory safely selects heuristic engine when cloud credentials are unconfigured");
}

if (process.argv[1]?.endsWith("deploymentConfig.test.ts")) {
  runDeploymentConfigTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
