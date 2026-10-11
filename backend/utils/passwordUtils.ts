/**
 * @file utils/passwordUtils.ts
 * @description Production-grade cryptographic password hashing, verification, and token helpers.
 * Implements salted PBKDF2 with SHA-512 (310,000 iterations per OWASP guidelines),
 * constant-time verification to prevent timing attacks, and legacy hash migration.
 */

import crypto from "crypto";

const PBKDF2_ITERATIONS = 310000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = "sha512";
const PREFIX = "pbkdf2:v1";

/**
 * Validates password complexity against enterprise security standards.
 * Minimum 8 characters, maximum 128 characters, with letters and numbers/symbols.
 */
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (!password || typeof password !== "string") {
    return { valid: false, message: "Password is required." };
  }
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  if (password.length > 128) {
    return { valid: false, message: "Password must not exceed 128 characters." };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  if (!hasLetter || !hasNumberOrSpecial) {
    return {
      valid: false,
      message: "Password must contain both letters and at least one number or special symbol.",
    };
  }

  return { valid: true };
}

/**
 * Hashes a plaintext password using a cryptographically random 16-byte salt
 * and PBKDF2-SHA512 with 310,000 iterations.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEYLEN,
    PBKDF2_DIGEST
  );
  return `${PREFIX}:${PBKDF2_ITERATIONS}:${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Legacy hash calculation for seamless migration from older database snapshots.
 */
function legacyHashHelper(password: string): string {
  return crypto.pbkdf2Sync(password, "loop_salt", 1000, 64, "sha512").toString("hex");
}

/**
 * Verifies a plaintext password against a stored hash string using constant-time comparison.
 * Detects whether the hash was created using legacy PBKDF2 or modern PBKDF2, signaling
 * needsRehash: true when migration to modern parameters is required.
 */
export function verifyPassword(
  password: string,
  storedHash: string
): { valid: boolean; needsRehash: boolean } {
  if (!password || !storedHash) {
    return { valid: false, needsRehash: false };
  }

  // Modern format: pbkdf2:v1:<iterations>:<salt>:<hash>
  if (storedHash.startsWith(`${PREFIX}:`)) {
    const parts = storedHash.split(":");
    if (parts.length !== 5) {
      return { valid: false, needsRehash: false };
    }
    const iterations = parseInt(parts[2], 10);
    const salt = parts[3];
    const originalHashHex = parts[4];

    const testKey = crypto.pbkdf2Sync(password, salt, iterations, PBKDF2_KEYLEN, PBKDF2_DIGEST);
    const originalBuffer = Buffer.from(originalHashHex, "hex");

    if (testKey.length !== originalBuffer.length) {
      return { valid: false, needsRehash: false };
    }

    const match = crypto.timingSafeEqual(testKey, originalBuffer);
    const needsRehash = iterations < PBKDF2_ITERATIONS;
    return { valid: match, needsRehash };
  }

  // Legacy format check (1000 iterations with loop_salt)
  const legacyCandidate = legacyHashHelper(password);
  const candidateBuf = Buffer.from(legacyCandidate);
  const storedBuf = Buffer.from(storedHash);

  if (candidateBuf.length === storedBuf.length && crypto.timingSafeEqual(candidateBuf, storedBuf)) {
    return { valid: true, needsRehash: true };
  }

  return { valid: false, needsRehash: false };
}

/**
 * Generates a cryptographically secure random token (e.g. for sessions or email links).
 */
export function generateSecureToken(byteLength: number = 32): string {
  return crypto.randomBytes(byteLength).toString("hex");
}

/**
 * Calculates a SHA-256 hash of a single-use token before database persistence.
 * Prevents plain token leakage if the database is read or exported.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
