/**
 * @file envConfig.ts
 * @description Centralized application configuration. Reads and validates environment variables exactly once during startup.
 */

import { z } from "zod";
import { IAppConfig, NodeEnvironment } from "@/types";

/**
 * Zod validation schema for backend environment variables.
 */
const envSchema = z
  .object({
    DATABASE_URL: z
      .string({ required_error: "DATABASE_URL environment variable is required." })
      .url("DATABASE_URL must be a valid connection string URL."),
    NEXTAUTH_URL: z
      .string({ required_error: "NEXTAUTH_URL environment variable is required." })
      .url("NEXTAUTH_URL must be a valid URL."),
    NEXTAUTH_SECRET: z
      .string({ required_error: "NEXTAUTH_SECRET environment variable is required." })
      .min(16, "NEXTAUTH_SECRET must be at least 16 characters for security."),
    GEMINI_API_KEY: z.string().optional(),
    OLLAMA_BASE_URL: z.string().url().optional(),
    NODE_ENV: z.enum(["development", "production", "test"] as const).default("development"),
  })
  .refine(
    (data) => Boolean(data.GEMINI_API_KEY || data.OLLAMA_BASE_URL),
    {
      message: "At least one AI Provider credential must be set: GEMINI_API_KEY or OLLAMA_BASE_URL.",
      path: ["GEMINI_API_KEY"],
    }
  );

/**
 * Helper function to parse and validate environment variables.
 * Stops application startup immediately if invalid.
 */
const parseEnvVariables = (): IAppConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.errors
      .map((err) => ` -> [${err.path.join(".")}]: ${err.message}`)
      .join("\n");

    console.error("FATAL CONFIGURATION ERROR: Invalid or missing environment variables:\n" + formattedErrors);
    if (typeof process !== "undefined" && process.exit) {
      process.exit(1);
    }
    throw new Error("Invalid or missing environment variables");
  }

  const envData = result.data;
  const nodeEnv = envData.NODE_ENV as NodeEnvironment;

  return Object.freeze({
    databaseUrl: envData.DATABASE_URL,
    nextAuthUrl: envData.NEXTAUTH_URL,
    nextAuthSecret: envData.NEXTAUTH_SECRET,
    geminiApiKey: envData.GEMINI_API_KEY,
    ollamaBaseUrl: envData.OLLAMA_BASE_URL,
    nodeEnv: nodeEnv,
    isProduction: nodeEnv === "production",
    isDevelopment: nodeEnv === "development",
    isTest: nodeEnv === "test",
  });
};

/**
 * Single immutable configuration export.
 * Read environment variables ONCE during module evaluation.
 */
export const config: IAppConfig = parseEnvVariables();

