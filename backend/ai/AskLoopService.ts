/**
 * @file ai/AskLoopService.ts
 * @description Ask LOOP RAG Assistant service handling question embedding, semantic search, context building, and QA generation.
 */

import { logger } from "@/logger/appLogger";
import { IAskLoopResponse } from "@/types";
import { getAiProvider } from "@/providers";
import { embeddingService } from "./EmbeddingService";
import { feedbackService } from "@/services";

export class AskLoopService {
  private static instance: AskLoopService;

  public static getInstance(): AskLoopService {
    if (!AskLoopService.instance) {
      AskLoopService.instance = new AskLoopService();
    }
    return AskLoopService.instance;
  }

  /**
   * Executes full RAG (Retrieval-Augmented Generation) query over workspace customer feedback.
   * Steps: Question -> Question Embedding -> Cosine Similarity Search -> Context Build -> AI Answer Generation -> Return Answer & Evidence.
   * @param question Natural language user query
   * @param workspaceId Target workspace ID
   */
  public async askQuestion(question: string, workspaceId: string): Promise<IAskLoopResponse> {
    logger.info("AskLoopService: Initiating RAG query execution", { question, workspaceId });

    if (!question || !question.trim()) {
      return {
        answer: "Please provide a valid question to search workspace feedback.",
        evidence: [],
        feedbackIds: [],
        confidence: 0.0,
      };
    }

    // 1. Fetch Workspace Feedback Items
    const feedbackData = await feedbackService.listFeedback(workspaceId, { page: 1, limit: 100 });
    const items = feedbackData.items;

    if (items.length === 0) {
      return {
        answer: "I couldn't find enough evidence in the available feedback.",
        evidence: [],
        feedbackIds: [],
        confidence: 0.0,
      };
    }

    // 2. Generate Question Vector Embedding
    const questionEmbedding = await embeddingService.generateEmbedding(question);

    // 3. Cosine Similarity Search over Workspace Feedback
    const topMatches = await embeddingService.searchSimilarFeedback(
      questionEmbedding,
      items.map((f) => ({
        id: f.id,
        content: f.content,
        channel: f.channel,
        customerLabel: f.customerLabel,
      })),
      5
    );

    // 4. Filter relevant context matches (similarity > 0.05)
    const relevantMatches = topMatches.filter((m) => m.similarityScore > 0.05);

    if (relevantMatches.length === 0) {
      return {
        answer: "I couldn't find enough evidence in the available feedback.",
        evidence: [],
        feedbackIds: [],
        confidence: 0.0,
      };
    }

    // 5. Build RAG Context String
    const contextList = relevantMatches.map(
      (m, idx) => `[Feedback #${idx + 1} | ID: ${m.id} | Channel: ${m.channel} | Customer: ${m.customerLabel || "User"}]\nContent: "${m.content}"`
    );

    // 6. Send Context + Question to AI Provider
    const provider = getAiProvider();
    const result = await provider.askQuestion(question.trim(), contextList);

    // Map evidence feedback IDs
    result.feedbackIds = relevantMatches.map((m) => m.id);
    result.evidence = relevantMatches.map((m) => ({
      feedbackId: m.id,
      quote: m.content,
      channel: m.channel,
    }));

    return result;
  }
}

export const askLoopService = AskLoopService.getInstance();
