/**
 * @file ai/AIService.ts
 * @description Central AI facade service delegating provider calls, logging performance metrics, and handling retries.
 */

import { logger } from "@/logger/appLogger";
import { getAiProvider } from "@/providers";
import {
  IAiProvider,
  IClassificationResult,
  IThemeClusterResult,
  IVoiceOfCustomerReport,
  IAskLoopResponse,
} from "@/types";

export class AIService {
  private static instance: AIService;

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private getProvider(): IAiProvider {
    return getAiProvider();
  }

  /**
   * Classifies feedback content into sentiment, score, themes, and summary.
   * @param content Target feedback text
   */
  public async classifyFeedback(content: string): Promise<IClassificationResult> {
    const startTime = Date.now();
    const provider = this.getProvider();
    logger.info("AIService: Dispatching classifyFeedback request", { provider: provider.providerName });

    try {
      const result = await provider.classifyFeedback(content);
      logger.info("AIService: classifyFeedback succeeded", { executionTimeMs: Date.now() - startTime });
      return result;
    } catch (error) {
      logger.error("AIService: classifyFeedback failed", error);
      throw error;
    }
  }

  /**
   * Clusters feedback items into themes.
   */
  public async clusterThemes(
    feedbackItems: Array<{ id: string; content: string }>,
    existingThemes: Array<{ id: string; name: string }>
  ): Promise<IThemeClusterResult> {
    const startTime = Date.now();
    const provider = this.getProvider();
    logger.info("AIService: Dispatching clusterThemes request", { provider: provider.providerName });

    try {
      const result = await provider.clusterThemes(feedbackItems, existingThemes);
      logger.info("AIService: clusterThemes succeeded", { executionTimeMs: Date.now() - startTime });
      return result;
    } catch (error) {
      logger.error("AIService: clusterThemes failed", error);
      throw error;
    }
  }

  /**
   * Generates Voice of Customer executive report.
   */
  public async generateReport(data: unknown): Promise<IVoiceOfCustomerReport> {
    const startTime = Date.now();
    const provider = this.getProvider();
    logger.info("AIService: Dispatching generateReport request", { provider: provider.providerName });

    try {
      const result = await provider.generateReport(data);
      logger.info("AIService: generateReport succeeded", { executionTimeMs: Date.now() - startTime });
      return result;
    } catch (error) {
      logger.error("AIService: generateReport failed", error);
      throw error;
    }
  }

  /**
   * Executes RAG question answering.
   */
  public async askQuestion(question: string, context: string[]): Promise<IAskLoopResponse> {
    const startTime = Date.now();
    const provider = this.getProvider();
    logger.info("AIService: Dispatching askQuestion request", { provider: provider.providerName });

    try {
      const result = await provider.askQuestion(question, context);
      logger.info("AIService: askQuestion succeeded", { executionTimeMs: Date.now() - startTime });
      return result;
    } catch (error) {
      logger.error("AIService: askQuestion failed", error);
      throw error;
    }
  }

  /**
   * Generates vector embedding for text.
   */
  public async generateEmbedding(text: string): Promise<number[]> {
    const provider = this.getProvider();
    return await provider.generateEmbedding(text);
  }

  /**
   * Summarizes text content.
   */
  public async summarize(text: string): Promise<string> {
    const provider = this.getProvider();
    return await provider.summarize(text);
  }
}

export const aiService = AIService.getInstance();
