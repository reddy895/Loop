/**
 * @file ai/ThemeService.ts
 * @description AI theme clustering service for detecting feedback patterns and mapping thematic clusters.
 */

import { logger } from "@/logger/appLogger";
import { IThemeClusterResult } from "@/types";
import { getAiProvider } from "@/providers";
import { feedbackService, themeService } from "@/services";

export class AiThemeService {
  private static instance: AiThemeService;

  public static getInstance(): AiThemeService {
    if (!AiThemeService.instance) {
      AiThemeService.instance = new AiThemeService();
    }
    return AiThemeService.instance;
  }

  /**
   * Clusters unassigned or active workspace feedback into thematic groups using AI.
   * Maps feedback items to existing themes or proposes new themes with confidence scores.
   * @param workspaceId Target workspace ID
   */
  public async clusterFeedbackThemes(workspaceId: string): Promise<IThemeClusterResult> {
    logger.info("AiThemeService: Initiating AI theme clustering analysis", { workspaceId });

    const feedbackList = await feedbackService.listFeedback(workspaceId, { page: 1, limit: 100 });
    const existingThemes = await themeService.getThemesByWorkspace(workspaceId);

    const feedbackItems = feedbackList.items.map((f) => ({
      id: f.id,
      content: f.content,
    }));

    const themesMap = existingThemes.map((t) => ({
      id: t.id,
      name: t.name,
    }));

    if (feedbackItems.length === 0) {
      return { clusters: [] };
    }

    const provider = getAiProvider();
    const clusterResult = await provider.clusterThemes(feedbackItems, themesMap);

    logger.info("AiThemeService: Theme clustering completed", { clusterCount: clusterResult.clusters.length });
    return clusterResult;
  }
}

export const aiThemeService = AiThemeService.getInstance();
