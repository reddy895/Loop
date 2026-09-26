/**
 * @file ai/ClassificationService.ts
 * @description AI feedback classification service managing sentiment analysis, theme extraction, and reclassification.
 */

import { logger } from "@/logger/appLogger";
import { IClassificationResult, IFeedback } from "@/types";
import { getAiProvider } from "@/providers";
import { feedbackService } from "@/services";

export class ClassificationService {
  private static instance: ClassificationService;
  private cache: Map<string, IClassificationResult> = new Map();

  public static getInstance(): ClassificationService {
    if (!ClassificationService.instance) {
      ClassificationService.instance = new ClassificationService();
    }
    return ClassificationService.instance;
  }

  /**
   * Classifies a customer feedback content string into sentiment, theme tags, feature area, and a single-sentence summary.
   * @param content Target customer feedback text
   */
  public async classifyFeedback(content: string): Promise<IClassificationResult> {
    if (!content || !content.trim()) {
      return {
        sentiment: "NEUTRAL",
        sentimentScore: 0.0,
        themes: ["General"],
        featureArea: "Usability",
        summary: "No content provided.",
      };
    }

    const cleanContent = content.trim();
    if (this.cache.has(cleanContent)) {
      logger.info("ClassificationService: Cache hit for feedback classification");
      return this.cache.get(cleanContent)!;
    }

    logger.info("ClassificationService: Executing AI classification", { textLength: cleanContent.length });
    const provider = getAiProvider();
    const result = await provider.classifyFeedback(cleanContent);

    this.cache.set(cleanContent, result);
    return result;
  }

  /**
   * Reclassifies an existing feedback record in the database/store by ID.
   * Updates sentiment, sentimentScore, and theme tags.
   * @param feedbackId ID of feedback to reclassify
   * @param workspaceId Target workspace ID
   */
  public async reclassifyFeedback(feedbackId: string, workspaceId: string): Promise<IFeedback> {
    logger.info("ClassificationService: Manual reclassification triggered", { feedbackId, workspaceId });
    const feedback = await feedbackService.getFeedbackById(feedbackId, workspaceId);

    const classification = await this.classifyFeedback(feedback.content);

    const updated = await feedbackService.updateFeedback(feedbackId, workspaceId, {
      sentiment: classification.sentiment,
      content: feedback.content,
    });

    return updated;
  }
}

export const classificationService = ClassificationService.getInstance();
