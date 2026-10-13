/**
 * @file tests/runner.ts
 * @description Master unified test runner for LOOP backend test suites.
 * Executes all cryptographic, security, validation, RBAC, tenant isolation,
 * CSV ingestion, and AI fallback test suites with summary reporting.
 */

import { runPasswordHashingTests } from "./unit/passwordHashing.test";
import { runValidationSchemaTests } from "./unit/validationSchemas.test";
import { runRateLimiterTests } from "./unit/rateLimiter.test";
import { runCsvSanitizerTests } from "./unit/csvFormulaSanitizer.test";
import { runPromptInjectionTests } from "./unit/promptInjection.test";
import { runDeploymentConfigTests } from "./unit/deploymentConfig.test";

import { runAuthFlowIntegrationTests } from "./integration/authFlow.test";
import { runPasswordResetFlowTests } from "./integration/passwordResetFlow.test";
import { runTenantIsolationTests } from "./integration/tenantIsolation.test";
import { runRbacBoundariesTests } from "./integration/rbacBoundaries.test";
import { runFeedbackCrudTests } from "./integration/feedbackCrud.test";
import { runCsvImportTests } from "./integration/csvImport.test";
import { runAiGracefulFallbackTests } from "./integration/aiGracefulFallback.test";
import { runDateFilterAndRagTests } from "./integration/dateFilterAndRag.test";

interface ISuiteResult {
  name: string;
  category: "UNIT" | "INTEGRATION";
  durationMs: number;
  status: "PASSED" | "FAILED";
  error?: unknown;
}

async function runAllSuites(): Promise<void> {
  const startTime = Date.now();
  console.log("===============================================================");
  console.log("        LOOP INTELLIGENCE PLATFORM — TEST SUITE RUNNER         ");
  console.log("===============================================================\n");

  const suites: Array<{ name: string; category: "UNIT" | "INTEGRATION"; fn: () => Promise<void> }> = [
    // Unit Suites
    { name: "Cryptographic Password & Token Salting", category: "UNIT", fn: runPasswordHashingTests },
    { name: "Authentication & Validation Schemas", category: "UNIT", fn: runValidationSchemaTests },
    { name: "Sliding-Window Rate Limiting & Brute-Force", category: "UNIT", fn: runRateLimiterTests },
    { name: "Spreadsheet Formula Injection Neutralization", category: "UNIT", fn: runCsvSanitizerTests },
    { name: "Prompt Injection Neutralization & Fencing", category: "UNIT", fn: runPromptInjectionTests },
    { name: "Deployment Configuration & Production Invariants", category: "UNIT", fn: runDeploymentConfigTests },

    // Integration Suites
    { name: "Authentication Lifecycle & Sessions", category: "INTEGRATION", fn: runAuthFlowIntegrationTests },
    { name: "Password Reset Lifecycle & Replay Prevention", category: "INTEGRATION", fn: runPasswordResetFlowTests },
    { name: "Multi-Tenant Isolation & Privilege Spoofing", category: "INTEGRATION", fn: runTenantIsolationTests },
    { name: "Server-Side RBAC Boundaries & Hierarchy", category: "INTEGRATION", fn: runRbacBoundariesTests },
    { name: "Feedback CRUD Lifecycle & IDOR Defense", category: "INTEGRATION", fn: runFeedbackCrudTests },
    { name: "CSV Ingestion & Multi-Tenant Batch Ingestion", category: "INTEGRATION", fn: runCsvImportTests },
    { name: "AI Fallback & Offline RAG Architecture", category: "INTEGRATION", fn: runAiGracefulFallbackTests },
    { name: "Server-Side Date Filtering & RAG Grounding", category: "INTEGRATION", fn: runDateFilterAndRagTests },
  ];

  const results: ISuiteResult[] = [];

  for (const suite of suites) {
    const suiteStart = Date.now();
    try {
      await suite.fn();
      results.push({
        name: suite.name,
        category: suite.category,
        durationMs: Date.now() - suiteStart,
        status: "PASSED",
      });
      console.log(`[PASS] ${suite.name} (${Date.now() - suiteStart}ms)\n`);
    } catch (error) {
      results.push({
        name: suite.name,
        category: suite.category,
        durationMs: Date.now() - suiteStart,
        status: "FAILED",
        error,
      });
      console.error(`[FAIL] ${suite.name} (${Date.now() - suiteStart}ms):`, error);
      console.log("\n");
    }
  }

  const totalDuration = Date.now() - startTime;
  const passedCount = results.filter((r) => r.status === "PASSED").length;
  const failedCount = results.filter((r) => r.status === "FAILED").length;

  console.log("===============================================================");
  console.log("                     TEST RUNNER SUMMARY                       ");
  console.log("===============================================================");
  console.log(`Total Suites:     ${suites.length}`);
  console.log(`Passed:           ${passedCount}`);
  console.log(`Failed:           ${failedCount}`);
  console.log(`Total Duration:   ${(totalDuration / 1000).toFixed(2)}s`);
  console.log("---------------------------------------------------------------");

  for (const r of results) {
    const tag = r.status === "PASSED" ? "✓" : "✗";
    console.log(` ${tag} [${r.category}] ${r.name.padEnd(46)} ${r.durationMs}ms`);
  }
  console.log("===============================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAllSuites().catch((err) => {
  console.error("Fatal test runner crash:", err);
  process.exit(1);
});
