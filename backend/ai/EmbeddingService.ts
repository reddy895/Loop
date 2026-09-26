/**
 * @file ai/EmbeddingService.ts
 * @description Vector embedding generation, cosine similarity calculation, and semantic search service.
 */

import { logger } from "@/logger/appLogger";
import { getAiProvider } from "@/providers";

export interface IFeedbackEmbeddingRecord {
  id: string;
  content: string;
  channel: string;
  customerLabel?: string;
  embedding?: number[];
}

export interface ISimilaritySearchResult {
  id: string;
  content: string;
  channel: string;
  customerLabel?: string;
  similarityScore: number;
}

export class EmbeddingService {
  private static instance: EmbeddingService;
  private cache: Map<string, number[]> = new Map();

  /**
   * Singleton instance accessor.
   */
  public static getInstance(): EmbeddingService {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService();
    }
    return EmbeddingService.instance;
  }

  /**
   * Generates a normalized floating point vector embedding for text content.
   * Utilizes in-memory caching to avoid redundant provider calls.
   * @param text Target text string
   */
  public async generateEmbedding(text: string): Promise<number[]> {
    if (!text || !text.trim()) {
      return new Array(64).fill(0);
    }

    const cleanText = text.trim();
    if (this.cache.has(cleanText)) {
      return this.cache.get(cleanText)!;
    }

    try {
      const provider = getAiProvider();
      const vector = await provider.generateEmbedding(cleanText);

      this.cache.set(cleanText, vector);
      return vector;
    } catch (error) {
      logger.warn("EmbeddingService: AI Provider embedding failed, falling back to local deterministic vector generator", { error });
      const fallbackVector = this.generateFallbackVector(cleanText);
      this.cache.set(cleanText, fallbackVector);
      return fallbackVector;
    }
  }

  /**
   * Computes the Cosine Similarity metric between two numeric vectors.
   * Range: -1.0 to 1.0 (Higher represents stronger semantic similarity).
   * @param vecA First numeric vector
   * @param vecB Second numeric vector
   */
  public computeCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;

    const minLength = Math.min(vecA.length, vecB.length);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < minLength; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) return 0;

    return Number((dotProduct / magnitude).toFixed(4));
  }

  /**
   * Ranks stored feedback records by cosine similarity against a target query vector.
   * @param queryVector Query embedding vector
   * @param items Array of feedback records with or without precalculated embeddings
   * @param topK Maximum number of top matches to return
   */
  public async searchSimilarFeedback(
    queryVector: number[],
    items: IFeedbackEmbeddingRecord[],
    topK: number = 5
  ): Promise<ISimilaritySearchResult[]> {
    logger.info("EmbeddingService: Performing similarity search across feedback collection", { itemCount: items.length, topK });

    const results: ISimilaritySearchResult[] = [];

    for (const item of items) {
      const itemVector = item.embedding || (await this.generateEmbedding(item.content));
      const similarityScore = this.computeCosineSimilarity(queryVector, itemVector);

      results.push({
        id: item.id,
        content: item.content,
        channel: item.channel,
        customerLabel: item.customerLabel,
        similarityScore,
      });
    }

    // Sort by similarity score descending
    results.sort((a, b) => b.similarityScore - a.similarityScore);

    return results.slice(0, topK);
  }

  /**
   * Local deterministic 64-dimensional pseudo-embedding vector generator.
   */
  private generateFallbackVector(text: string): number[] {
    const dim = 64;
    const vector = new Array(dim).fill(0);
    const words = text.toLowerCase().split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const index = (charCode + j * 7 + i * 13) % dim;
        vector[index] += Math.sin(charCode + i);
      }
    }

    // Normalize vector length to 1.0
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return vector;

    return vector.map((val) => Number((val / norm).toFixed(4)));
  }
}

export const embeddingService = EmbeddingService.getInstance();
