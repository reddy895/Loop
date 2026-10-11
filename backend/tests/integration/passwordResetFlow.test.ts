/**
 * @file tests/integration/passwordResetFlow.test.ts
 * @description Integration tests for password reset token lifecycle, single-use consumption, replay prevention, and session revocation.
 */

import { authService } from "../../services";
import { ValidationError } from "../../utils";
import assert from "assert";

export async function runPasswordResetFlowTests(): Promise<void> {
  console.log("▶ [Integration] Password Reset Token Lifecycle & Replay Prevention Tests");

  const testEmail = `reset.test.${Date.now()}@acmeintelligence.com`;
  const initialPassword = "InitialPassword2026!";

  // 1. Register test user
  const user = await authService.registerUser({
    name: "Reset Flow User",
    email: testEmail,
    password: initialPassword,
  });

  // 2. Generate active session
  const sessionToken = await authService.generateSessionToken(user.id);
  const activeSession = await authService.validateSessionToken(sessionToken);
  assert.ok(activeSession !== null, "Initial session must be active");

  // 3. Request password reset token
  const resetRequest = await authService.createPasswordResetToken(testEmail);
  assert.strictEqual(resetRequest.success, true);
  assert.ok(resetRequest.resetToken, "Dev mode should return raw single-use token");
  const rawToken = resetRequest.resetToken;
  console.log("  ✔ Cryptographic single-use token generated");

  // 4. Reset password using token
  const newPassword = "ResetSuccessPassword2026!";
  const resetSuccess = await authService.resetPasswordWithToken(rawToken, newPassword);
  assert.strictEqual(resetSuccess.success, true);
  console.log("  ✔ Password successfully updated with valid single-use token");

  // 5. Verify token replay is rejected (single-use enforcement)
  await assert.rejects(
    async () => {
      await authService.resetPasswordWithToken(rawToken, "AnotherPassword2026!");
    },
    (err: unknown) => err instanceof ValidationError,
    "Replay of already consumed reset token must be blocked"
  );
  console.log("  ✔ Token replay attack blocked (atomic consumption enforced)");

  // 6. Verify fake / invalid token is rejected
  await assert.rejects(
    async () => {
      await authService.resetPasswordWithToken("fake_invalid_token_12345", "AnotherPassword2026!");
    },
    (err: unknown) => err instanceof ValidationError,
    "Invalid token must be rejected"
  );
  console.log("  ✔ Invalid reset token rejected");

  // 7. Verify previous sessions are revoked
  const revokedSession = await authService.validateSessionToken(sessionToken);
  assert.strictEqual(revokedSession, null, "Active sessions must be revoked upon password reset");
  console.log("  ✔ Existing sessions revoked following password reset");

  // 8. Verify login works with new password and fails with old
  const loginNew = await authService.validateUserCredentials(testEmail, newPassword);
  assert.ok(loginNew !== null, "Must be able to login with newly reset password");

  const loginOld = await authService.validateUserCredentials(testEmail, initialPassword);
  assert.strictEqual(loginOld, null, "Must fail login with pre-reset password");
  console.log("  ✔ Login verified with newly reset credentials");
}

if (process.argv[1]?.endsWith("passwordResetFlow.test.ts")) {
  runPasswordResetFlowTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
