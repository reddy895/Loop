/**
 * @file utils/index.ts
 * @description Consolidated application utilities and custom error definitions module.
 */

import { NextResponse } from "next/server";
import { HTTP_STATUS_CODES, HttpStatusCode } from "@/constants";
import { ERROR_MESSAGES } from "@/constants";
import { IApiSuccessResponse, IApiErrorResponse, IPaginatedData, IPaginationMeta } from "@/types";
import { SYSTEM_CONSTANTS } from "@/constants";
import { config } from "@/config/envConfig";

// Custom Error Classes
export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly errors: string[];
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: HttpStatusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, errors: string[] = []) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.errors = errors.length > 0 ? errors : [message];
    this.isOperational = true;

    const errorObj = Error as unknown as { captureStackTrace?: (targetObject: object, constructorOpt?: Function) => void };
    if (typeof errorObj.captureStackTrace === "function") {
      errorObj.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.VALIDATION_ERROR, errors: string[] = []) {
    super(message, HTTP_STATUS_CODES.BAD_REQUEST, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(message, HTTP_STATUS_CODES.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message, HTTP_STATUS_CODES.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = ERROR_MESSAGES.CONFLICT) {
    super(message, HTTP_STATUS_CODES.CONFLICT);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR) {
    super(message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

// Environment Utils
export const isProductionEnvironment = (): boolean => config.isProduction;
export const isDevelopmentEnvironment = (): boolean => config.isDevelopment;
export const isTestEnvironment = (): boolean => config.isTest;

// Pagination Utils
export interface IPaginationCalculationInput {
  page?: number;
  limit?: number;
  totalItems: number;
}

export interface ICalculatedPagination {
  skip: number;
  take: number;
  meta: IPaginationMeta;
}

export const calculatePagination = (input: IPaginationCalculationInput): ICalculatedPagination => {
  const page = Math.max(SYSTEM_CONSTANTS.DEFAULT_PAGE_NUMBER, input.page || SYSTEM_CONSTANTS.DEFAULT_PAGE_NUMBER);
  const requestedLimit = input.limit || SYSTEM_CONSTANTS.DEFAULT_PAGE_SIZE;
  const limit = Math.min(SYSTEM_CONSTANTS.MAX_PAGE_SIZE, Math.max(1, requestedLimit));

  const skip = (page - 1) * limit;
  const take = limit;
  const totalPages = Math.ceil(input.totalItems / limit) || 1;

  const meta: IPaginationMeta = {
    page,
    limit,
    totalItems: input.totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return { skip, take, meta };
};

// Response Utils
export const createSuccessResponse = <T>(
  data: T,
  message: string = "Request completed successfully",
  statusCode: HttpStatusCode = HTTP_STATUS_CODES.OK
): NextResponse<IApiSuccessResponse<T>> => {
  const payload: IApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  const res = NextResponse.json(payload, { status: statusCode });
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
};

const sanitizeErrorMessage = (msg: string): string => {
  if (!msg || typeof msg !== "string") return "";
  return msg
    .replace(/(?:postgres|postgresql|mysql|mongodb|redis):\/\/[^\s@]+@[^\s/]+/gi, "[REDACTED_CREDENTIALS]")
    .replace(/(?:Bearer\s+)[a-zA-Z0-9_\-\.]+/gi, "Bearer [REDACTED_TOKEN]");
};

export const createErrorResponse = (
  message: string = "An error occurred",
  errors: string[] = [],
  statusCode: HttpStatusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
): NextResponse<IApiErrorResponse> => {
  const cleanMessage = sanitizeErrorMessage(message);
  const rawErrors = errors.length > 0 ? errors : [message];
  const cleanErrors = rawErrors.map((err) => sanitizeErrorMessage(err));

  const payload: IApiErrorResponse = {
    success: false,
    message: cleanMessage,
    errors: cleanErrors,
  };

  const res = NextResponse.json(payload, { status: statusCode });
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
};

export const createPaginatedResponse = <T>(
  items: T[],
  pagination: IPaginationMeta,
  message: string = "Paginated data retrieved successfully"
): NextResponse<IApiSuccessResponse<IPaginatedData<T>>> => {
  const paginatedPayload: IPaginatedData<T> = {
    items,
    pagination,
  };

  return createSuccessResponse(paginatedPayload, message, HTTP_STATUS_CODES.OK);
};

export * from "./passwordUtils";
export * from "./promptSanitizer";
