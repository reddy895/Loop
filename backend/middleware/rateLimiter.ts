/**
 * @file middleware/rateLimiter.ts
 * @description Centralized, sliding-window rate limiting middleware supporting route-specific threshold limits,
 * brute-force defense, anti-scraping, and standard rate limit headers.
 */

import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/logger/appLogger";
import { createErrorResponse } from "@/utils";
import { HTTP_STATUS_CODES, ERROR_MESSAGES } from "@/constants";

export interface IRateLimitRule {
  windowMs: number;
  maxRequests: number;
}

export const RATE_LIMIT_CONFIGS: Record<string, IRateLimitRule> = {
  AUTH_REGISTER: { windowMs: 60 * 1000, maxRequests: 5 },
  AUTH_LOGIN: { windowMs: 60 * 1000, maxRequests: 5 },
  AUTH_RESET: { windowMs: 60 * 1000, maxRequests: 3 },
  AUTH: { windowMs: 60 * 1000, maxRequests: 10 },
  AI: { windowMs: 60 * 1000, maxRequests: 30 },
  CSV_UPLOAD: { windowMs: 60 * 1000, maxRequests: 5 },
  REPORT: { windowMs: 60 * 1000, maxRequests: 10 },
  DEFAULT: { windowMs: 60 * 1000, maxRequests: 100 },
};

interface IClientRequestRecord {
  timestamps: number[];
}

export class SlidingWindowRateLimiter {
  private static store: Map<string, IClientRequestRecord> = new Map();
  private static lastPrune: number = Date.now();

  /**
   * Periodically prunes dead keys from the memory store every 5 minutes.
   */
  private static pruneStaleEntries(now: number): void {
    if (now - this.lastPrune < 5 * 60 * 1000) return;
    this.lastPrune = now;

    const maxWindow = 60 * 1000;
    for (const [key, record] of this.store.entries()) {
      const valid = record.timestamps.filter((ts) => now - ts < maxWindow);
      if (valid.length === 0) {
        this.store.delete(key);
      } else {
        record.timestamps = valid;
      }
    }
  }

  /**
   * Cleans up expired request timestamps older than window boundary.
   */
  private static cleanup(key: string, now: number, windowMs: number): number[] {
    const record = this.store.get(key);
    if (!record) return [];

    const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    record.timestamps = validTimestamps;
    return validTimestamps;
  }

  /**
   * Applies rate limiting check for a given client key and rule.
   * Returns null if allowed, or NextResponse (429 Too Many Requests) if limit exceeded.
   */
  public static checkRateLimit(
    req: NextRequest,
    category: keyof typeof RATE_LIMIT_CONFIGS = "DEFAULT"
  ): NextResponse | null {
    const rawForwarded = req.headers.get("x-forwarded-for");
    const clientIp =
      (rawForwarded ? rawForwarded.split(",")[0].trim() : null) ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rule = RATE_LIMIT_CONFIGS[category] || RATE_LIMIT_CONFIGS.DEFAULT;
    const storeKey = `${category}:${clientIp}`;
    const now = Date.now();

    this.pruneStaleEntries(now);
    const activeTimestamps = this.cleanup(storeKey, now, rule.windowMs);

    if (activeTimestamps.length >= rule.maxRequests) {
      const oldest = activeTimestamps[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((oldest + rule.windowMs - now) / 1000));

      logger.warn(`Rate limit exceeded for category '${category}'`, {
        clientIp,
        category,
        maxRequests: rule.maxRequests,
        retryAfterSeconds,
      });

      const response = createErrorResponse(
        ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
        [`Rate limit exceeded for ${category}. Please try again in ${retryAfterSeconds} seconds.`],
        HTTP_STATUS_CODES.TOO_MANY_REQUESTS
      );

      response.headers.set("Retry-After", String(retryAfterSeconds));
      response.headers.set("X-RateLimit-Limit", String(rule.maxRequests));
      response.headers.set("X-RateLimit-Remaining", "0");
      response.headers.set("X-RateLimit-Reset", String(Math.floor((oldest + rule.windowMs) / 1000)));

      return response;
    }

    activeTimestamps.push(now);
    this.store.set(storeKey, { timestamps: activeTimestamps });

    return null;
  }

  /**
   * Resets rate limit store (useful for automated testing suites).
   */
  public static resetStore(): void {
    this.store.clear();
  }
}

export const applyRateLimit = (
  req: NextRequest,
  category: keyof typeof RATE_LIMIT_CONFIGS = "DEFAULT"
): NextResponse | null => SlidingWindowRateLimiter.checkRateLimit(req, category);
