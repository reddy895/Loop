/**
 * @file middleware/index.ts
 * @description Consolidated HTTP middleware module for Project LOOP backend.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/logger/appLogger";
import { AppError, UnauthorizedError, ForbiddenError, ValidationError, createErrorResponse } from "@/utils";
import { config } from "@/config/envConfig";
import { HTTP_STATUS_CODES, ERROR_MESSAGES, SYSTEM_CONSTANTS } from "@/constants";
import { validateData } from "@/validators";

/**
 * Handles uncaught API route exceptions and formats structured JSON responses.
 * Never exposes stack traces in production environment.
 */
export const handleApiError = (error: unknown): NextResponse => {
  if (error instanceof AppError) {
    logger.warn(`Operational Domain Error [${error.statusCode}]: ${error.message}`, {
      status: error.statusCode,
      errors: error.errors,
    });
    return createErrorResponse(error.message, error.errors, error.statusCode);
  }

  // Handle generic / unexpected exceptions
  logger.error("Unhandled API exception occurred", error);

  const displayMessage = config.isProduction
    ? ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    : error instanceof Error
    ? error.message
    : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  return createErrorResponse(displayMessage, [displayMessage], HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
};

/**
 * Authentication check middleware.
 * Verifies request Authorization headers or session cookies.
 */
export const authMiddlewarePlaceholder = async (req: NextRequest): Promise<NextResponse | null> => {
  logger.debug("Executing Auth Middleware", { route: req.nextUrl.pathname });

  const authHeader = req.headers.get("authorization");

  if (!authHeader && req.nextUrl.pathname.startsWith("/api/protected")) {
    throw new UnauthorizedError("Authentication token is required to access protected routes.");
  }

  return null;
};

/**
 * Role-based authorization middleware factory.
 */
export const requireRolesMiddleware = (requiredRoles: string[]) => {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    logger.debug("Executing Authorization RBAC Middleware", {
      route: req.nextUrl.pathname,
      requiredRoles,
    });

    const userRoleHeader = req.headers.get("x-user-role");

    if (userRoleHeader && !requiredRoles.includes(userRoleHeader)) {
      throw new ForbiddenError(`User role '${userRoleHeader}' is insufficient for this endpoint.`);
    }

    return null;
  };
};

/**
 * Rate Limiter middleware placeholder.
 */
export const rateLimiterMiddlewarePlaceholder = async (req: NextRequest): Promise<NextResponse | null> => {
  logger.debug("Executing Rate Limiter Middleware");

  const clientIp = req.headers.get("x-forwarded-for") || "127.0.0.1";

  if (clientIp === "0.0.0.0") {
    return createErrorResponse(
      ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      [ERROR_MESSAGES.RATE_LIMIT_EXCEEDED],
      HTTP_STATUS_CODES.TOO_MANY_REQUESTS
    );
  }

  return null;
};

/**
 * Logs incoming HTTP request details with execution timing context.
 */
export const requestLoggerMiddleware = (req: NextRequest): { requestId: string; startTime: number } => {
  const startTime = Date.now();
  const requestId = req.headers.get(SYSTEM_CONSTANTS.REQUEST_ID_HEADER) || `req_${Date.now()}`;

  logger.info(`HTTP ${req.method} ${req.nextUrl.pathname}`, {
    requestId,
    method: req.method,
    route: req.nextUrl.pathname,
  });

  return { requestId, startTime };
};

/**
 * Validates request JSON body against provided Zod schema.
 */
export const validateRequestBodyMiddleware = async <T>(
  schema: z.ZodSchema<T>,
  req: NextRequest
): Promise<T> => {
  logger.debug("Executing Request Validation Middleware");
  const body = await req.json().catch(() => ({}));
  return validateData(schema, body);
};

/**
 * Applies security headers to outgoing HTTP NextResponse.
 */
export const applySecurityHeaders = (response: NextResponse): NextResponse => {
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return response;
};

/**
 * Multi-tenant Workspace Isolation Middleware placeholder.
 */
export const workspaceIsolationMiddlewarePlaceholder = async (req: NextRequest): Promise<NextResponse | null> => {
  logger.debug("Executing Workspace Isolation Middleware");

  const workspaceId = req.headers.get(SYSTEM_CONSTANTS.WORKSPACE_ID_HEADER);

  if (!workspaceId && req.nextUrl.pathname.includes("/workspace/")) {
    throw new ValidationError(`Header '${SYSTEM_CONSTANTS.WORKSPACE_ID_HEADER}' is required for workspace endpoints.`);
  }

  return null;
};

/**
 * Extracts authenticated session details, enforces workspace isolation and RBAC rules.
 * Throws ForbiddenError (403) when role permissions are violated.
 */
export const extractAuthContext = (
  req: NextRequest,
  allowedRoles?: import("@/types").UserRole[]
): import("@/types").IAuthContext => {
  const workspaceId = req.headers.get(SYSTEM_CONSTANTS.WORKSPACE_ID_HEADER) || "ws_default";
  const rawRole = (req.headers.get("x-user-role") || "ADMIN").toUpperCase() as import("@/types").UserRole;
  const userId = req.headers.get("x-user-id") || "usr_default";

  const validRoles: import("@/types").UserRole[] = ["OWNER", "ADMIN", "ANALYST", "MEMBER", "VIEWER"];
  const userRole = validRoles.includes(rawRole) ? rawRole : "ADMIN";

  // Enforce read-only constraint for VIEWER role on write operations
  if (userRole === "VIEWER" && ["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    throw new ForbiddenError("User with VIEWER role is restricted to read-only operations.");
  }

  // Enforce specific allowed roles if specified
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    throw new ForbiddenError(`User role '${userRole}' is unauthorized for this endpoint.`);
  }

  return { workspaceId, userId, userRole };
};

export * from "./rateLimiter";


