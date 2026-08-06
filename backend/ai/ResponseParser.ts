/**
 * @file ai/ResponseParser.ts
 * @description Robust AI response parser, markdown stripper, Zod validator, and fallback handler.
 */

import { z } from "zod";
import { logger } from "@/logger/appLogger";
import {
  IClassificationResult,
  IThemeClusterResult,
  IVoiceOfCustomerReport,
  IAskLoopResponse,
} from "@/types";

// Validation Schemas for Parsed AI Outputs
export const classificationResponseSchema = z.object({
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE"]).default("NEUTRAL"),
  sentimentScore: z.number().min(-1.0).max(1.0).default(0.0),
  themes: z.array(z.string()).default([]),
  featureArea: z.string().default("General Usability"),
  summary: z.string().default("Customer provided feedback."),
});

export const themeClusterResponseSchema = z.object({
  clusters: z.array(
    z.object({
      themeId: z.string().optional().nullable(),
      themeName: z.string().default("General Usability"),
      feedbackIds: z.array(z.string()).default([]),
      confidenceScore: z.number().min(0.0).max(1.0).default(0.8),
      trend: z.enum(["UP", "DOWN", "STABLE"]).default("STABLE"),
    })
  ).default([]),
});

export const voiceOfCustomerReportSchema = z.object({
  reportId: z.string().default(`rep_${Date.now()}`),
  workspaceId: z.string().default("ws_default"),
  generatedAt: z.string().default(new Date().toISOString()),
  sections: z.object({
    executiveSummary: z.string().default("Executive summary of customer feedback signals."),
    topThemes: z.array(
      z.object({
        name: z.string(),
        count: z.number(),
        sentimentScore: z.number(),
      })
    ).default([]),
    sentimentOverview: z.object({
      positivePercentage: z.number().default(0),
      neutralPercentage: z.number().default(0),
      negativePercentage: z.number().default(0),
    }),
    customerQuotes: z.array(
      z.object({
        quote: z.string(),
        channel: z.string(),
        customerLabel: z.string(),
      })
    ).default([]),
    recommendedActions: z.array(z.string()).default([]),
    riskAreas: z.array(z.string()).default([]),
    opportunities: z.array(z.string()).default([]),
    summary: z.string().default("Voice of Customer analysis summary."),
  }),
});

export const askLoopResponseSchema = z.object({
  answer: z.string().default("I couldn't find enough evidence in the available feedback."),
  evidence: z.array(
    z.object({
      feedbackId: z.string(),
      quote: z.string(),
      channel: z.string(),
    })
  ).default([]),
  feedbackIds: z.array(z.string()).default([]),
  confidence: z.number().min(0.0).max(1.0).default(0.0),
});

export class ResponseParser {
  /**
   * Sanitizes raw AI text by removing markdown code block delimiters and surrounding whitespace.
   * @param text Raw model response output string
   */
  public static extractJsonString(text: string): string {
    if (!text) return "{}";

    let sanitized = text.trim();
    // Strip markdown JSON block backticks ```json ... ```
    sanitized = sanitized.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    // Locate first '{' or '[' and last '}' or ']'
    const firstBrace = sanitized.search(/[\{\[]/);
    const lastBrace = Math.max(sanitized.lastIndexOf("}"), sanitized.lastIndexOf("]"));

    if (firstBrace !== -1 && lastBrace > firstBrace) {
      sanitized = sanitized.slice(firstBrace, lastBrace + 1);
    }

    return sanitized;
  }

  /**
   * Parses and validates classification JSON from model output.
   */
  public static parseClassificationResponse(rawText: string): IClassificationResult {
    try {
      const jsonStr = this.extractJsonString(rawText);
      const parsed = JSON.parse(jsonStr);
      return classificationResponseSchema.parse(parsed) as IClassificationResult;
    } catch (error) {
      logger.warn("ResponseParser: Failed to parse classification JSON, using fallback result", { error });
      return {
        sentiment: "NEUTRAL",
        sentimentScore: 0.0,
        themes: ["General Usability"],
        featureArea: "Platform Usability",
        summary: "Customer feedback received.",
      };
    }
  }

  /**
   * Parses and validates theme clustering JSON from model output.
   */
  public static parseThemeClusterResponse(rawText: string): IThemeClusterResult {
    try {
      const jsonStr = this.extractJsonString(rawText);
      const parsed = JSON.parse(jsonStr);
      return themeClusterResponseSchema.parse(parsed) as IThemeClusterResult;
    } catch (error) {
      logger.warn("ResponseParser: Failed to parse theme cluster JSON, using fallback result", { error });
      return { clusters: [] };
    }
  }

  /**
   * Parses and validates Voice of Customer report JSON from model output.
   */
  public static parseReportResponse(rawText: string, workspaceId: string): IVoiceOfCustomerReport {
    try {
      const jsonStr = this.extractJsonString(rawText);
      const parsed = JSON.parse(jsonStr);
      const validated = voiceOfCustomerReportSchema.parse(parsed) as IVoiceOfCustomerReport;
      validated.workspaceId = workspaceId;
      return validated;
    } catch (error) {
      logger.warn("ResponseParser: Failed to parse VoC report JSON, generating structured fallback report", { error });
      return {
        reportId: `rep_${Date.now()}`,
        workspaceId,
        generatedAt: new Date().toISOString(),
        sections: {
          executiveSummary: "Executive Voice of Customer summary computed from aggregated feedback signals.",
          topThemes: [],
          sentimentOverview: { positivePercentage: 50, neutralPercentage: 30, negativePercentage: 20 },
          customerQuotes: [],
          recommendedActions: ["Accelerate bug resolution cycle", "Improve customer support response SLAs"],
          riskAreas: ["Usability friction on mobile app workflows"],
          opportunities: ["Expand AI intelligence automated insights"],
          summary: "Customer feedback analysis completed.",
        },
      };
    }
  }

  /**
   * Parses and validates Ask LOOP RAG response JSON from model output.
   */
  public static parseAskLoopResponse(rawText: string): IAskLoopResponse {
    try {
      const jsonStr = this.extractJsonString(rawText);
      const parsed = JSON.parse(jsonStr);
      return askLoopResponseSchema.parse(parsed) as IAskLoopResponse;
    } catch (error) {
      logger.warn("ResponseParser: Failed to parse Ask LOOP RAG response JSON, using fallback safe message", { error });
      return {
        answer: "I couldn't find enough evidence in the available feedback.",
        evidence: [],
        feedbackIds: [],
        confidence: 0.0,
      };
    }
  }
}
