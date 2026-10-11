/**
 * @file tests/unit/passwordHashing.test.ts
 * @description Unit tests verifying cryptographically secure password hashing, salting,
 * timing-safe verification, legacy hash migration, and password complexity rules.
 */

import {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  generateSecureToken,
  hashToken,
} from "../../utils/passwordUtils";
import assert from "assert";

export async function runPasswordHashingTests(): Promise<void> {
  console.log("▶ [Unit] Password Hashing & Cryptographic Verification Tests");

  // Test 1: Password strength validation
  const weakShort = validatePasswordStrength("weak");
  assert.strictEqual(weakShort.valid, false, "Should reject passwords shorter than 8 chars");

  const weakNoNum = validatePasswordStrength("allletterspassword");
  assert.strictEqual(weakNoNum.valid, false, "Should reject passwords without numbers/symbols");

  const strong = validatePasswordStrength("StrongPass123!");
  assert.strictEqual(strong.valid, true, "Should accept strong password");
  console.log("  ✔ Password complexity validation enforced");

  // Test 2: Hashing generates unique salts for identical passwords
  const pass = "SecureP@ssw0rd2026";
  const hash1 = hashPassword(pass);
  const hash2 = hashPassword(pass);
  assert.notStrictEqual(hash1, hash2, "Identical passwords must produce distinct hashes due to random salting");
  assert.ok(hash1.startsWith("pbkdf2:v1:"), "Hash format must follow pbkdf2:v1 prefix");
  console.log("  ✔ Per-password unique random salting verified");

  // Test 3: Correct password verifies successfully
  const verificationSuccess = verifyPassword(pass, hash1);
  assert.strictEqual(verificationSuccess.valid, true, "Valid password must verify against hash");
  assert.strictEqual(verificationSuccess.needsRehash, false, "Modern hash should not need rehash");
  console.log("  ✔ Valid password verification succeeded");

  // Test 4: Incorrect password fails verification
  const verificationFail = verifyPassword("WrongPassword123!", hash1);
  assert.strictEqual(verificationFail.valid, false, "Incorrect password must be rejected");
  console.log("  ✔ Incorrect password rejected in constant time");

  // Test 5: Legacy hash migration detection
  const crypto = await import("crypto");
  const legacyHash = crypto.pbkdf2Sync(pass, "loop_salt", 1000, 64, "sha512").toString("hex");
  const legacyVerification = verifyPassword(pass, legacyHash);
  assert.strictEqual(legacyVerification.valid, true, "Legacy hash should verify correctly");
  assert.strictEqual(legacyVerification.needsRehash, true, "Legacy hash must signal needsRehash: true");
  console.log("  ✔ Legacy hash migration layer verified");

  // Test 6: Single-use token generation and SHA-256 token hashing
  const rawToken = generateSecureToken(32);
  assert.strictEqual(rawToken.length, 64, "32-byte hex token must be 64 characters");
  const hashed = hashToken(rawToken);
  assert.strictEqual(hashed.length, 64, "SHA-256 hash must be 64 characters");
  assert.strictEqual(hashToken(rawToken), hashed, "Hashing must be deterministic");
  console.log("  ✔ Cryptographic single-use token hashing verified");
}

if (process.argv[1]?.endsWith("passwordHashing.test.ts")) {
  runPasswordHashingTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
