/**
 * @file constants/index.ts
 * @description Consolidated application constants module.
 */

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS_CODES)[keyof typeof HTTP_STATUS_CODES];

export const ERROR_MESSAGES = {
  VALIDATION_ERROR: "Validation failed for the provided input data.",
  UNAUTHORIZED: "Authentication credentials were missing or invalid.",
  FORBIDDEN: "You do not have permission to access this resource.",
  NOT_FOUND: "The requested resource could not be found.",
  CONFLICT: "A resource with the provided details already exists.",
  INTERNAL_SERVER_ERROR: "An unexpected internal server error occurred. Please try again later.",
  DATABASE_CONNECTION_FAILED: "Failed to connect to the database infrastructure.",
  RATE_LIMIT_EXCEEDED: "Too many requests. Please slow down and try again later.",
  INVALID_ENVIRONMENT: "Critical environment variable configuration missing or invalid.",
  AI_PROVIDER_UNAVAILABLE: "The configured AI Provider is currently unreachable.",
  WORKSPACE_ACCESS_DENIED: "User does not have active access to the specified workspace.",
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

export const SYSTEM_CONSTANTS = {
  APP_NAME: "Project LOOP",
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_NUMBER: 1,
  DEFAULT_SORT_ORDER: "desc" as const,
  REQUEST_ID_HEADER: "x-request-id",
  WORKSPACE_ID_HEADER: "x-workspace-id",
  AI_PROVIDERS: {
    GEMINI: "gemini",
    OLLAMA: "ollama",
  } as const,
  USER_ROLES: {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
    VIEWER: "VIEWER",
  } as const,
  FEEDBACK_STATUS: {
    NEW: "NEW",
    UNDER_REVIEW: "UNDER_REVIEW",
    IN_PROGRESS: "IN_PROGRESS",
    RESOLVED: "RESOLVED",
    ARCHIVED: "ARCHIVED",
  } as const,
  SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 15,
  },
} as const;
