/**
 * @file tests/unit/rateLimiter.test.ts
 * @description Unit tests for sliding-window rate limiting middleware and brute-force defenses.
 */

import { SlidingWindowRateLimiter, applyRateLimit } from "../../middleware/rateLimiter";
import { NextRequest } from "next/server";
import assert from "assert";

export async function runRateLimiterTests(): Promise<void> {
  console.log("▶ [Unit] Sliding-Window Rate Limiter & Brute-Force Defense Tests");

  SlidingWindowRateLimiter.resetStore();

  const mockIp = "192.168.1.100";
  const createMockReq = () =>
    new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "x-forwarded-for": mockIp },
    });

  // Test 1: First 5 login attempts must be permitted (rule: maxRequests = 5)
  for (let i = 1; i <= 5; i++) {
    const res = applyRateLimit(createMockReq(), "AUTH_LOGIN");
    assert.strictEqual(res, null, `Attempt #${i} within threshold must be allowed`);
  }
  console.log("  ✔ Requests within threshold permitted");

  // Test 2: 6th request from same IP must be blocked with HTTP 429
  const blockedRes = applyRateLimit(createMockReq(), "AUTH_LOGIN");
  assert.ok(blockedRes !== null, "6th attempt must be blocked");
  assert.strictEqual(blockedRes.status, 429, "Rate-limited response must return HTTP 429 Too Many Requests");
  assert.ok(blockedRes.headers.get("Retry-After") !== null, "Must include Retry-After header");
  assert.strictEqual(blockedRes.headers.get("X-RateLimit-Limit"), "5");
  assert.strictEqual(blockedRes.headers.get("X-RateLimit-Remaining"), "0");
  console.log("  ✔ Excessive requests blocked with HTTP 429 and Retry-After headers");

  // Test 3: Independent IP address should not be affected by first IP's rate limit
  const otherIpReq = new NextRequest("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "x-forwarded-for": "10.0.0.1" },
  });
  const otherRes = applyRateLimit(otherIpReq, "AUTH_LOGIN");
  assert.strictEqual(otherRes, null, "Independent client IP must not be throttled by other client's limit");
  console.log("  ✔ Per-client IP isolation in rate limiter verified");

  // Test 4: Reset store restores capacity
  SlidingWindowRateLimiter.resetStore();
  const resetAttempt = applyRateLimit(createMockReq(), "AUTH_LOGIN");
  assert.strictEqual(resetAttempt, null, "Store reset must restore capacity");
  console.log("  ✔ Rate limit store reset mechanics verified");
}

if (process.argv[1]?.endsWith("rateLimiter.test.ts")) {
  runRateLimiterTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
