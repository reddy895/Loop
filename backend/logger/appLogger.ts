/**
 * @file appLogger.ts
 * @description Centralized enterprise logger supporting info, warn, error, debug log levels with structured context.
 */

import { ILogger, ILogContext } from "@/types";

/**
 * Log levels enum
 */
export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

/**
 * Enterprise Application Logger implementing single responsibility logging.
 */
export class AppLogger implements ILogger {
  private static instance: AppLogger;

  private constructor() {}

  /**
   * Returns Singleton Logger Instance
   */
  public static getInstance(): AppLogger {
    if (!AppLogger.instance) {
      AppLogger.instance = new AppLogger();
    }
    return AppLogger.instance;
  }

  /**
   * Formats log message with structured payload
   */
  private formatLog(level: LogLevel, message: string, context?: ILogContext, errorPayload?: unknown): string {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      message,
      requestId: context?.requestId || "N/A",
      route: context?.route || "N/A",
      method: context?.method || "N/A",
      status: context?.status || "N/A",
      executionTimeMs: context?.executionTime !== undefined ? `${context.executionTime}ms` : "N/A",
      ...(context || {}),
      ...(errorPayload ? { error: errorPayload instanceof Error ? errorPayload.stack || errorPayload.message : errorPayload } : {}),
    };

    return JSON.stringify(payload);
  }

  /**
   * Logs info level message
   */
  public info(message: string, context?: ILogContext): void {
    console.log(this.formatLog(LogLevel.INFO, message, context));
  }

  /**
   * Logs warning level message
   */
  public warn(message: string, context?: ILogContext): void {
    console.warn(this.formatLog(LogLevel.WARN, message, context));
  }

  /**
   * Logs error level message
   */
  public error(message: string, error?: Error | unknown, context?: ILogContext): void {
    console.error(this.formatLog(LogLevel.ERROR, message, context, error));
  }

  /**
   * Logs debug level message
   */
  public debug(message: string, context?: ILogContext): void {
    if (process.env.NODE_ENV !== "production") {
      console.debug(this.formatLog(LogLevel.DEBUG, message, context));
    }
  }
}

export const logger = AppLogger.getInstance();
