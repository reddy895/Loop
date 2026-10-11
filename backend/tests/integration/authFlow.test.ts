/**
 * @file tests/integration/authFlow.test.ts
 * @description Integration tests for user signup, duplicate prevention, login, session tokens, and logout.
 */

import { authService } from "../../services";
import { ConflictError, ValidationError } from "../../utils";
import assert from "assert";

export async function runAuthFlowIntegrationTests(): Promise<void> {
  console.log("▶ [Integration] Authentication Lifecycle: Signup, Login, Session, and Invalidation");

  const testEmail = `test.user.${Date.now()}@acmeintelligence.com`;
  const testPassword = "EnterprisePassword2026!";

  // Test 1: Successful user registration
  const registeredUser = await authService.registerUser({
    name: "Enterprise Admin",
    email: testEmail,
    password: testPassword,
    companyName: "Acme SaaS Corporation",
  });
  assert.ok(registeredUser.id, "Registered user must have an ID");
  assert.strictEqual(registeredUser.email, testEmail.toLowerCase());
  console.log("  ✔ New user successfully registered with workspace provisioning");

  // Test 2: Duplicate email registration is blocked
  await assert.rejects(
    async () => {
      await authService.registerUser({
        name: "Duplicate User",
        email: testEmail,
        password: testPassword,
      });
    },
    (err: unknown) => err instanceof ConflictError,
    "Must reject duplicate registration with ConflictError"
  );
  console.log("  ✔ Duplicate email registration properly rejected (409 Conflict)");

  // Test 3: Successful login with valid credentials
  const loginUser = await authService.validateUserCredentials(testEmail, testPassword);
  assert.ok(loginUser !== null, "Valid credentials must return user record");
  assert.strictEqual(loginUser?.id, registeredUser.id);
  console.log("  ✔ Login succeeded with valid credentials");

  // Test 4: Failed login with invalid credentials
  const failedLogin = await authService.validateUserCredentials(testEmail, "WrongPassword123!");
  assert.strictEqual(failedLogin, null, "Invalid credentials must return null");
  console.log("  ✔ Login rejected with invalid credentials");

  // Test 5: Session generation and validation
  const sessionToken = await authService.generateSessionToken(registeredUser.id);
  assert.ok(sessionToken.startsWith("loop_sess_"), "Session token must be securely prefixed");

  const sessionUser = await authService.validateSessionToken(sessionToken);
  assert.ok(sessionUser !== null, "Session token must resolve to valid user");
  assert.strictEqual(sessionUser?.id, registeredUser.id);
  console.log("  ✔ Session token creation and verification succeeded");

  // Test 6: Invalidate session on logout
  const logoutResult = await authService.invalidateSessionToken(sessionToken);
  assert.strictEqual(logoutResult.success, true);

  const expiredSessionUser = await authService.validateSessionToken(sessionToken);
  assert.strictEqual(expiredSessionUser, null, "Invalidated session must return null");
  console.log("  ✔ Session token invalidation on logout verified");

  // Test 7: Password change
  const newPassword = "UpdatedPassword2026!";
  const passChangeResult = await authService.changeUserPassword(registeredUser.id, testPassword, newPassword);
  assert.strictEqual(passChangeResult, true);

  const reLoginWithNew = await authService.validateUserCredentials(testEmail, newPassword);
  assert.ok(reLoginWithNew !== null, "Must be able to login with new password");

  const reLoginWithOld = await authService.validateUserCredentials(testEmail, testPassword);
  assert.strictEqual(reLoginWithOld, null, "Old password must be invalidated");
  console.log("  ✔ Password update successfully verified with old password invalidation");
}

if (process.argv[1]?.endsWith("authFlow.test.ts")) {
  runAuthFlowIntegrationTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
