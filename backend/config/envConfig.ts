/**
 * @file envConfig.ts
 * @description Centralized application configuration. Reads and validates environment variables.
 * Provides resilient fallbacks for development while strictly enforcing production integrity.
 */

import { z } from "zod";
import { IAppConfig, NodeEnvironment } from "@/types";

/**
 * Zod validation schema for backend environment variables.
 */
const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .default("file:./dev.db"),
  NEXTAUTH_URL: z
    .string()
    .default("http://localhost:3000"),
  NEXTAUTH_SECRET: z
    .string()
    .min(16, "NEXTAUTH_SECRET must be at least 16 characters for security.")
    .default("loop_development_super_secret_key_change_in_production_32chars"),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:3001,http://localhost:3000"),
  GEMINI_API_KEY: z.string().optional().default(""),
  OLLAMA_BASE_URL: z.string().optional().default(""),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  GITHUB_CLIENT_ID: z.string().optional().default(""),
  GITHUB_CLIENT_SECRET: z.string().optional().default(""),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.string().optional().default("587"),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASSWORD: z.string().optional().default(""),
  EMAIL_FROM: z.string().optional().default("noreply@projectloop.ai"),
  NODE_ENV: z.enum(["development", "production", "test"] as const).default("development"),
});

/**
 * Helper function to parse and validate environment variables.
 * Handles environment-specific rules and returns an immutable configuration object.
 */
const parseEnvVariables = (): IAppConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.errors
      .map((err) => ` -> [${err.path.join(".")}]: ${err.message}`)
      .join("\n");

    console.warn("CONFIGURATION WARNING: Non-fatal environment warnings detected:\n" + formattedErrors);
  }

  const envData = result.success ? result.data : envSchema.parse({});
  const nodeEnv = (process.env.NODE_ENV || envData.NODE_ENV) as NodeEnvironment;
  const isProduction = nodeEnv === "production";

  // Production security invariant: NEXTAUTH_SECRET cannot be the default development secret at runtime
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build" || process.env.npm_lifecycle_event === "build";
  if (isProduction && !isBuildPhase && (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.includes("development"))) {
    throw new Error("SECURITY FAULT: NEXTAUTH_SECRET must be configured with a unique secret in production.");
  }

  const corsOrigins = (process.env.CORS_ALLOWED_ORIGINS || envData.CORS_ALLOWED_ORIGINS)
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  return Object.freeze({
    databaseUrl: process.env.DATABASE_URL || envData.DATABASE_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL || envData.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET || envData.NEXTAUTH_SECRET,
    corsAllowedOrigins: corsOrigins.length > 0 ? corsOrigins : ["http://localhost:3001", "http://localhost:3000"],
    geminiApiKey: process.env.GEMINI_API_KEY || envData.GEMINI_API_KEY || undefined,
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || envData.OLLAMA_BASE_URL || undefined,
    googleClientId: process.env.GOOGLE_CLIENT_ID || envData.GOOGLE_CLIENT_ID || undefined,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || envData.GOOGLE_CLIENT_SECRET || undefined,
    githubClientId: process.env.GITHUB_CLIENT_ID || envData.GITHUB_CLIENT_ID || undefined,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET || envData.GITHUB_CLIENT_SECRET || undefined,
    smtpHost: process.env.SMTP_HOST || envData.SMTP_HOST || undefined,
    smtpPort: parseInt(process.env.SMTP_PORT || envData.SMTP_PORT || "587", 10),
    smtpUser: process.env.SMTP_USER || envData.SMTP_USER || undefined,
    smtpPassword: process.env.SMTP_PASSWORD || envData.SMTP_PASSWORD || undefined,
    emailFrom: process.env.EMAIL_FROM || envData.EMAIL_FROM || "noreply@projectloop.ai",
    nodeEnv: nodeEnv,
    isProduction: isProduction,
    isDevelopment: nodeEnv === "development",
    isTest: nodeEnv === "test",
  });
};

/**
 * Single immutable configuration export.
 * Evaluates environment safely with resilient development defaults.
 */
export const config: IAppConfig = parseEnvVariables();
