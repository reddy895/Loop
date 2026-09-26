/**
 * @file ai/ReportService.ts
 * @description Voice of Customer (VoC) executive report generation service powered by AI.
 */

import { logger } from "@/logger/appLogger";
import { IVoiceOfCustomerReport } from "@/types";
import { getAiProvider } from "@/providers";
import { analyticsService, feedbackService, themeService } from "@/services";

export class AiReportService {
  private static instance: AiReportService;
  private reportCache: Map<string, IVoiceOfCustomerReport> = new Map();

  public static getInstance(): AiReportService {
    if (!AiReportService.instance) {
      AiReportService.instance = new AiReportService();
    }
    return AiReportService.instance;
  }

  /**
   * Generates a structured Voice of Customer (VoC) executive report for a workspace.
   * Caches results to prevent redundant AI provider calls.
   * @param workspaceId Target workspace ID
   * @param forceRefresh Optional flag to bypass cache
   */
  public async generateVoiceOfCustomerReport(
    workspaceId: string,
    forceRefresh: boolean = false
  ): Promise<IVoiceOfCustomerReport> {
    if (!forceRefresh && this.reportCache.has(workspaceId)) {
      logger.info("AiReportService: Returning cached Voice of Customer report", { workspaceId });
      return this.reportCache.get(workspaceId)!;
    }

    logger.info("AiReportService: Generating Voice of Customer report", { workspaceId });

    // Collect Workspace Data Context
    const dashboard = await analyticsService.getDashboardMetrics(workspaceId);
    const feedbackList = await feedbackService.listFeedback(workspaceId, { page: 1, limit: 50 });
    const themes = await themeService.getThemesByWorkspace(workspaceId);

    const contextData = {
      totalFeedback: dashboard.totalFeedback,
      sentiment: {
        positive: dashboard.positiveCount,
        neutral: dashboard.neutralCount,
        negative: dashboard.negativeCount,
      },
      topThemes: themes.map((t) => ({ name: t.name, count: t.feedbackCount })),
      quotes: feedbackList.items.slice(0, 10).map((f) => ({
        quote: f.content,
        channel: f.channel,
        customerLabel: f.customerLabel,
      })),
    };

    const provider = getAiProvider();
    const report = await provider.generateReport(contextData);
    report.workspaceId = workspaceId;

    this.reportCache.set(workspaceId, report);
    return report;
  }
}

export const aiReportService = AiReportService.getInstance();
