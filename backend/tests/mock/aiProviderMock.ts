/**
 * @file tests/mock/aiProviderMock.ts
 * @description Reusable mock implementation of IAiProvider for testing AI features without external API calls.
 */

import {
  IAiProvider,
  IAiAnalysisResult,
  IClassificationResult,
  IThemeClusterResult,
  IVoiceOfCustomerReport,
  IAskLoopResponse,
} from "@/types";

export class MockAiProvider implements IAiProvider {
  public readonly providerName = "Mock Test AI Provider";

  public async generateText(prompt: string): Promise<string> {
    return `Mock AI text response for prompt of length ${prompt.length}`;
  }

  public async classifyFeedback(content: string): Promise<IClassificationResult> {
    return {
      sentiment: content.toLowerCase().includes("bad") ? "NEGATIVE" : "POSITIVE",
      sentimentScore: 0.85,
      themes: ["Usability", "Performance"],
      featureArea: "UI Layout",
      summary: "Mock single sentence summary of customer feedback.",
    };
  }

  public async clusterThemes(
    feedbackItems: Array<{ id: string; content: string }>,
    existingThemes: Array<{ id: string; name: string }>
  ): Promise<IThemeClusterResult> {
    return {
      clusters: [
        {
          themeId: existingThemes[0]?.id || "thm_mock_1",
          themeName: existingThemes[0]?.name || "Mock Theme",
          feedbackIds: feedbackItems.map((f) => f.id),
          confidenceScore: 0.9,
          trend: "UP",
        },
      ],
    };
  }

  public async generateReport(data: unknown): Promise<IVoiceOfCustomerReport> {
    return {
      reportId: "rep_mock_123",
      workspaceId: "ws_default",
      generatedAt: new Date().toISOString(),
      sections: {
        executiveSummary: "Mock executive summary of customer signals.",
        topThemes: [{ name: "UIUsability", count: 10, sentimentScore: 0.8 }],
        sentimentOverview: { positivePercentage: 70, neutralPercentage: 20, negativePercentage: 10 },
        customerQuotes: [{ quote: "Great app!", channel: "Website", customerLabel: "VIP" }],
        recommendedActions: ["Optimize query speed"],
        riskAreas: ["Mobile crash rate"],
        opportunities: ["Expand AI intelligence"],
        summary: "Mock report summary completed.",
      },
    };
  }

  public async askQuestion(question: string, context: string[]): Promise<IAskLoopResponse> {
    return {
      answer: "Mock AI RAG answer based on retrieved context.",
      evidence: [{ feedbackId: "fb_mock_1", quote: "Sample evidence quote", channel: "Website" }],
      feedbackIds: ["fb_mock_1"],
      confidence: 0.92,
    };
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    const vector = new Array(64).fill(0);
    for (let i = 0; i < text.length; i++) {
      vector[i % 64] += text.charCodeAt(i);
    }
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vector.map((val) => Number((val / norm).toFixed(4)));
  }

  public async summarize(text: string): Promise<string> {
    return `Mock summary for text (${text.length} chars)`;
  }

  public async analyzeSentiment(feedbackText: string): Promise<"POSITIVE" | "NEUTRAL" | "NEGATIVE"> {
    return "POSITIVE";
  }

  public async extractThemes(feedbackText: string): Promise<string[]> {
    return ["Mock Theme 1", "Mock Theme 2"];
  }

  public async analyzeFeedback(feedbackText: string): Promise<IAiAnalysisResult> {
    return {
      sentiment: "POSITIVE",
      sentimentScore: 0.9,
      extractedThemes: ["Usability"],
      summary: "Mock summary",
      actionableInsights: ["Action item 1"],
    };
  }
}
