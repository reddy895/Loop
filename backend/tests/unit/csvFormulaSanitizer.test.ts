/**
 * @file tests/unit/csvFormulaSanitizer.test.ts
 * @description Unit tests verifying spreadsheet formula injection (CSV injection) defenses and CSV parsing integrity.
 */

import {
  sanitizeFormulaInjection,
  convertObjectsToCsv,
  parseCsvString,
  validateCsvRow,
} from "../../utils/csvUtils";
import assert from "assert";

export async function runCsvSanitizerTests(): Promise<void> {
  console.log("▶ [Unit] CSV Formula Injection & Parser Sanitization Tests");

  // Test 1: Formula characters are neutralized with leading apostrophe
  assert.strictEqual(sanitizeFormulaInjection("=1+1"), "'=1+1", "Formula starting with '=' must be escaped");
  assert.strictEqual(sanitizeFormulaInjection("+cmd|'/c calc'!A0"), "'+cmd|'/c calc'!A0", "Formula starting with '+' must be escaped");
  assert.strictEqual(sanitizeFormulaInjection("-2+5"), "'-2+5", "Formula starting with '-' must be escaped");
  assert.strictEqual(sanitizeFormulaInjection("@SUM(A1:A10)"), "'@SUM(A1:A10)", "Formula starting with '@' must be escaped");
  assert.strictEqual(sanitizeFormulaInjection("\tcmd"), "'\tcmd", "Formula starting with tab must be escaped");
  console.log("  ✔ Formula prefix characters correctly neutralized");

  // Test 2: Standard non-formula text is left unaltered
  assert.strictEqual(sanitizeFormulaInjection("The dashboard is fast"), "The dashboard is fast");
  assert.strictEqual(sanitizeFormulaInjection("Normal feedback record"), "Normal feedback record");
  console.log("  ✔ Normal benign feedback text left untouched");

  // Test 3: CSV conversion applies sanitization across all columns
  const testData = [
    { id: "FB-1", content: "=cmd|'/c calc'!A0", author: "@malicious_user" },
    { id: "FB-2", content: "Great product!", author: "Alice" },
  ];
  const exportedCsv = convertObjectsToCsv(testData);
  assert.ok(exportedCsv.includes("\"'=cmd|'/c calc'!A0\""), "Exported CSV must contain escaped formula");
  assert.ok(exportedCsv.includes("\"'@malicious_user\""), "Exported CSV must contain escaped '@' prefix");
  console.log("  ✔ convertObjectsToCsv sanitizes all exported data cells");

  // Test 4: CSV parser handles quotes, commas, and BOM cleanly
  const rawCsv = '\uFEFFcontent,channel,customerLabel\n"Love the app, it is fast!",Website,"VIP Client"\n"Slow response",Support,"Free Tier"';
  const parsed = parseCsvString(rawCsv);
  assert.strictEqual(parsed.length, 2, "Should parse exactly 2 records");
  assert.strictEqual(parsed[0].content, "Love the app, it is fast!");
  assert.strictEqual(parsed[0].channel, "Website");
  console.log("  ✔ parseCsvString handles BOM and quoted commas correctly");

  // Test 5: Row validation catches missing content
  const validRow = validateCsvRow(parsed[0], 2);
  assert.strictEqual(validRow.valid, true);

  const invalidRow = validateCsvRow({ content: "", channel: "Web" }, 3);
  assert.strictEqual(invalidRow.valid, false);
  console.log("  ✔ validateCsvRow validates required feedback content");
}

if (process.argv[1]?.endsWith("csvFormulaSanitizer.test.ts")) {
  runCsvSanitizerTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
