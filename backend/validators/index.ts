/**
 * @file validators/index.ts
 * @description Consolidated validation schemas, helpers, and Zod configuration.
 */

import { z } from "zod";
import { ValidationError } from "@/utils";
import { SYSTEM_CONSTANTS } from "@/constants";

// Global Zod Error Map Configuration
export const configureZodDefaults = (): void => {
  const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_type) {
      if (issue.received === "undefined") {
        return { message: `Field '${issue.path.join(".")}' is required.` };
      }
      return { message: `Expected ${issue.expected} for field '${issue.path.join(".")}', received ${issue.received}.` };
    }
    return { message: ctx.defaultError };
  };

  z.setErrorMap(customErrorMap);
};

// Auto-run Zod configuration setup
configureZodDefaults();

// Common Validation Schemas
export const emailSchema = z
  .string({ required_error: "Email address is required." })
  .email("Must be a valid email format.")
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string({ required_error: "Password is required." })
  .min(8, "Password must be at least 8 characters long.")
  .max(100, "Password cannot exceed 100 characters.");

export const uuidSchema = z
  .string({ required_error: "Resource Identifier (UUID) is required." })
  .uuid("Must be a valid UUID format.");

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(SYSTEM_CONSTANTS.DEFAULT_PAGE_NUMBER),
  limit: z.coerce.number().int().positive().max(SYSTEM_CONSTANTS.MAX_PAGE_SIZE).default(SYSTEM_CONSTANTS.DEFAULT_PAGE_SIZE),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default(SYSTEM_CONSTANTS.DEFAULT_SORT_ORDER),
});

// Validation Utilities
export interface IValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const messages = result.error.errors.map((err) => {
      const fieldPath = err.path.length > 0 ? `[${err.path.join(".")}] ` : "";
      return `${fieldPath}${err.message}`;
    });

    throw new ValidationError("Input validation failed", messages);
  }

  return result.data;
};

export const safeValidateData = <T>(schema: z.ZodSchema<T>, data: unknown): IValidationResult<T> => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
  return { success: false, errors };
};

// Domain Validation Schemas
export const createFeedbackSchema = z.object({
  content: z.string({ required_error: "Feedback content is required." }).min(1, "Feedback content cannot be empty."),
  channel: z.string({ required_error: "Channel is required." }).min(1, "Channel cannot be empty."),
  customerLabel: z.string({ required_error: "Customer label is required." }).min(1, "Customer label cannot be empty."),
  source: z.string().optional(),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]).optional(),
  themeId: z.string().optional(),
});

export const updateFeedbackSchema = z.object({
  content: z.string().min(1, "Feedback content cannot be empty.").optional(),
  status: z.enum(["NEW", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]).optional(),
  channel: z.string().min(1, "Channel cannot be empty.").optional(),
  customerLabel: z.string().min(1, "Customer label cannot be empty.").optional(),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]).optional(),
  themeId: z.string().optional(),
});

export const feedbackQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  channel: z.string().optional(),
  status: z.enum(["NEW", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED", "ARCHIVED"]).optional(),
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]).optional(),
  themeId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  customer: z.string().optional(),
});

export const csvUploadSchema = z.object({
  csvContent: z.string({ required_error: "CSV content string is required." }).min(1, "CSV content cannot be empty."),
});

export const simulateFeedbackSchema = z.object({
  count: z.coerce.number().int().positive().max(100).default(5),
  channels: z.array(z.string()).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name cannot be empty.").max(100).optional(),
  details: z.string().optional(),
  settings: z.record(z.unknown()).optional(),
});

export const inviteMemberSchema = z.object({
  email: emailSchema,
  role: z.enum(["ADMIN", "ANALYST", "MEMBER", "VIEWER"]).default("MEMBER"),
  name: z.string().optional(),
});

export const updateMemberSchema = z.object({
  role: z.enum(["ADMIN", "ANALYST", "MEMBER", "VIEWER"]).optional(),
  status: z.enum(["ACTIVE", "PENDING", "INACTIVE"]).optional(),
});

export const memberQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  role: z.enum(["OWNER", "ADMIN", "ANALYST", "MEMBER", "VIEWER"]).optional(),
});

