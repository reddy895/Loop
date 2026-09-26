/**
 * @file middleware/rateLimiter.ts
 * @description Centralized, sliding-window rate limiting middleware supporting route-specific threshold limits.
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
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "127.0.0.1";
    const rule = RATE_LIMIT_CONFIGS[category] || RATE_LIMIT_CONFIGS.DEFAULT;
    const storeKey = `${category}:${clientIp}`;
    const now = Date.now();

    const activeTimestamps = this.cleanup(storeKey, now, rule.windowMs);

    if (activeTimestamps.length >= rule.maxRequests) {
      logger.warn(`Rate limit exceeded for category '${category}'`, { clientIp, category, maxRequests: rule.maxRequests });
      return createErrorResponse(
        ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
        [`Rate limit exceeded for ${category} operations. Please try again in 60 seconds.`],
        HTTP_STATUS_CODES.TOO_MANY_REQUESTS
      );
    }

    activeTimestamps.push(now);
    this.store.set(storeKey, { timestamps: activeTimestamps });

    return null;
  }
}

export const applyRateLimit = (
  req: NextRequest,
  category: keyof typeof RATE_LIMIT_CONFIGS = "DEFAULT"
): NextResponse | null => SlidingWindowRateLimiter.checkRateLimit(req, category);
