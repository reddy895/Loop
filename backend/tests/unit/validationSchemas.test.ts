/**
 * @file tests/unit/validationSchemas.test.ts
 * @description Unit tests for authentication, account security, and feedback Zod validation schemas.
 */

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createFeedbackSchema,
  inviteMemberSchema,
  createThemeSchema,
  validateData,
} from "../../validators";
import { ValidationError } from "../../utils";
import assert from "assert";

export async function runValidationSchemaTests(): Promise<void> {
  console.log("▶ [Unit] Zod Validation Schemas & Input Boundary Tests");

  // Test 1: Register schema validation success
  const validRegister = {
    name: "Alex Rivera",
    email: "Alex.Rivera@Enterprise.com",
    password: "StrongPassword123!",
    confirmPassword: "StrongPassword123!",
    companyName: "Acme SaaS",
  };
  const parsedRegister = validateData(registerSchema, validRegister);
  assert.strictEqual(parsedRegister.email, "alex.rivera@enterprise.com", "Email must be normalized to lowercase");
  console.log("  ✔ Registration schema parses and normalizes valid payload");

  // Test 2: Register schema rejects password confirmation mismatch
  assert.throws(
    () => {
      validateData(registerSchema, {
        ...validRegister,
        confirmPassword: "MismatchPassword123!",
      });
    },
    (err: unknown) => err instanceof ValidationError,
    "Should reject mismatched password confirmation"
  );
  console.log("  ✔ Registration rejects mismatched confirmation password");

  // Test 3: Login schema validation
  const validLogin = { email: "USER@COMPANY.COM", password: "SecretPassword123" };
  const parsedLogin = validateData(loginSchema, validLogin);
  assert.strictEqual(parsedLogin.email, "user@company.com");

  assert.throws(
    () => validateData(loginSchema, { email: "invalid-email", password: "" }),
    (err: unknown) => err instanceof ValidationError
  );
  console.log("  ✔ Login schema enforces email format and non-empty password");

  // Test 4: Forgot password schema
  const parsedForgot = validateData(forgotPasswordSchema, { email: "TEST@EXAMPLE.COM" });
  assert.strictEqual(parsedForgot.email, "test@example.com");
  console.log("  ✔ Forgot password schema normalizes email");

  // Test 5: Reset password schema
  const validReset = {
    token: "valid_cryptographic_token",
    newPassword: "NewStrongPassword123!",
    confirmPassword: "NewStrongPassword123!",
  };
  const parsedReset = validateData(resetPasswordSchema, validReset);
  assert.strictEqual(parsedReset.token, "valid_cryptographic_token");
  console.log("  ✔ Reset password schema validates token and password");

  // Test 6: Create theme schema
  const validTheme = { name: "Billing & Pricing", color: "#F59E0B", description: "Invoices" };
  const parsedTheme = validateData(createThemeSchema, validTheme);
  assert.strictEqual(parsedTheme.color, "#F59E0B");

  assert.throws(
    () => validateData(createThemeSchema, { name: "A", color: "invalid-color" }),
    (err: unknown) => err instanceof ValidationError
  );
  console.log("  ✔ Theme schema validates hex code and name length");
}

if (process.argv[1]?.endsWith("validationSchemas.test.ts")) {
  runValidationSchemaTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
