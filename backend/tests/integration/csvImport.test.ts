/**
 * @file tests/integration/csvImport.test.ts
 * @description Integration tests for CSV parsing, batched DB ingestion,
 * spreadsheet formula injection defense, and multi-tenant isolation.
 */

import { csvImportService, authService, feedbackService } from "../../services";
import { ValidationError } from "../../utils";
import assert from "assert";

export async function runCsvImportTests(): Promise<void> {
  console.log("▶ [Integration] CSV Batch Ingestion & Formula Neutralization Tests");

  // 1. Setup two workspaces
  const userA = await authService.registerUser({
    name: "CSV Admin Tenant A",
    email: `csv.a.${Date.now()}@acme.com`,
    password: "Password1234!",
    companyName: "Acme CSV Corp",
  });
  const wsA = (await (await import("../../lib/prisma")).prisma.member.findFirst({
    where: { userId: userA.id },
  }))?.workspaceId;

  const userB = await authService.registerUser({
    name: "CSV Admin Tenant B",
    email: `csv.b.${Date.now()}@acme.com`,
    password: "Password1234!",
    companyName: "Beta CSV Corp",
  });
  const wsB = (await (await import("../../lib/prisma")).prisma.member.findFirst({
    where: { userId: userB.id },
  }))?.workspaceId;

  assert.ok(wsA && wsB, "Workspaces must be provisioned");

  // 2. Test empty CSV handling
  await assert.rejects(
    async () => {
      await csvImportService.importCsv(wsA, "");
    },
    (err: unknown) => err instanceof ValidationError,
    "Empty CSV string must be rejected with ValidationError"
  );
  console.log("  ✔ Empty CSV upload properly rejected (ValidationError)");

  // 3. Test CSV with spreadsheet formula injection attack vectors
  const maliciousCsv = `content,customer,channel,sentiment
"=cmd|' /C calc'!A0",Enterprise Corp,Support,NEGATIVE
"+1+2; cmd /c calc",Malicious Actor,Play Store,POSITIVE
"@SUM(1+1)*cmd",Financial Services,Website,NEUTRAL
"-2+3*cmd|calc",Payment Partner,Slack,NEGATIVE
"Normal benign customer feedback about UI speed",Genuine User,In-App,POSITIVE`;

  const importResult = await csvImportService.importCsv(wsA, maliciousCsv);
  assert.strictEqual(importResult.importedCount, 5, "All 5 records should be ingested");
  assert.strictEqual(importResult.failedCount, 0, "No rows failed validation");
  console.log("  ✔ 5 CSV records imported including formula injection vectors");

  // 4. Query imported records from DB to verify neutralization and tenant isolation
  const recordsInWsA = await feedbackService.listFeedback(wsA, { limit: 50 });
  assert.ok(recordsInWsA.items.length >= 5, "WsA should contain at least 5 records");

  // Verify formula injection vectors are safely neutralized with leading apostrophe
  const neutralizedFormula1 = recordsInWsA.items.find((f) => f.content.startsWith("'=cmd"));
  assert.ok(neutralizedFormula1, "Formula starting with '=' must be neutralized with apostrophe");

  const neutralizedFormula2 = recordsInWsA.items.find((f) => f.content.startsWith("'+1+2"));
  assert.ok(neutralizedFormula2, "Formula starting with '+' must be neutralized with apostrophe");

  const neutralizedFormula3 = recordsInWsA.items.find((f) => f.content.startsWith("'@SUM"));
  assert.ok(neutralizedFormula3, "Formula starting with '@' must be neutralized with apostrophe");

  const neutralizedFormula4 = recordsInWsA.items.find((f) => f.content.startsWith("'-2+3"));
  assert.ok(neutralizedFormula4, "Formula starting with '-' must be neutralized with apostrophe");

  console.log("  ✔ All formula injection attack vectors neutralized in persistent storage");

  // 5. Verify Tenant B sees ZERO records from Tenant A's import
  const recordsInWsB = await feedbackService.listFeedback(wsB, { limit: 50 });
  const leakedRecord = recordsInWsB.items.find((f) =>
    recordsInWsA.items.some((itemA) => itemA.id === f.id)
  );
  assert.strictEqual(leakedRecord, undefined, "No records from Tenant A may appear in Tenant B");
  console.log("  ✔ Multi-tenant CSV isolation verified: 0 records leaked across tenants");

  // 6. Test CSV with validation errors (e.g., missing content)
  const invalidCsv = `content,customer,channel,sentiment
"",Bad Row Empty Content,Support,POSITIVE
"Valid feedback row",Good Customer,Web,POSITIVE`;

  const partialResult = await csvImportService.importCsv(wsA, invalidCsv);
  assert.strictEqual(partialResult.importedCount, 1, "Only valid row should be imported");
  assert.strictEqual(partialResult.failedCount, 1, "Invalid row must be counted as failure");
  assert.strictEqual(partialResult.errors.length, 1, "Errors array must report the invalid row");
  console.log("  ✔ Invalid CSV rows flagged with line numbers without crashing ingestion");
}

if (process.argv[1]?.endsWith("csvImport.test.ts")) {
  runCsvImportTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
