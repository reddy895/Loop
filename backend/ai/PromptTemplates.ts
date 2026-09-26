/**
 * @file ai/PromptTemplates.ts
 * @description Centralized, versioned prompt templates for Project LOOP AI operations.
 */

export const PROMPT_VERSION = "v1.2.0";

export const CLASSIFICATION_PROMPT_TEMPLATE = `
You are an expert customer feedback intelligence analyst.
Analyze the following customer feedback text carefully and extract structured JSON classification metrics.

Customer Feedback Text:
"""
{{content}}
"""

Output JSON strictly matching this schema:
{
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  "sentimentScore": number between -1.0 and 1.0,
  "themes": string[],
  "featureArea": string,
  "summary": string (one concise sentence)
}
Return raw valid JSON only. Do not include markdown headers or explanatory text.
`;

export const THEME_CLUSTERING_PROMPT_TEMPLATE = `
You are an AI data clustering expert. Group the provided customer feedback items into thematic clusters.
Reuse existing themes where appropriate. Propose new themes only if feedback does not fit any existing theme.

Existing Workspace Themes:
{{existingThemesJson}}

Feedback Items to Cluster:
{{feedbackItemsJson}}

Output JSON strictly matching this schema:
{
  "clusters": [
    {
      "themeId": string or null (provide existing themeId if matched),
      "themeName": string (existing or newly proposed name),
      "feedbackIds": string[],
      "confidenceScore": number between 0.0 and 1.0,
      "trend": "UP" | "DOWN" | "STABLE"
    }
  ]
}
Return raw valid JSON only.
`;

export const REPORT_PROMPT_TEMPLATE = `
You are a Lead Product Strategy Analyst. Generate an executive Voice of Customer (VoC) report based on the provided workspace statistics and feedback quotes.

Workspace Feedback Data Context:
{{contextJson}}

Output JSON strictly matching this schema:
{
  "reportId": "{{reportId}}",
  "workspaceId": "{{workspaceId}}",
  "generatedAt": "{{generatedAt}}",
  "sections": {
    "executiveSummary": string (high-level synthesis of customer sentiment and main findings),
    "topThemes": [
      { "name": string, "count": number, "sentimentScore": number }
    ],
    "sentimentOverview": {
      "positivePercentage": number,
      "neutralPercentage": number,
      "negativePercentage": number
    },
    "customerQuotes": [
      { "quote": string, "channel": string, "customerLabel": string }
    ],
    "recommendedActions": string[] (3 to 5 clear actionable recommendations),
    "riskAreas": string[] (2 to 4 potential business risks),
    "opportunities": string[] (2 to 4 growth opportunities),
    "summary": string (closing outlook statement)
  }
}
Return raw valid JSON only.
`;

export const ASK_LOOP_PROMPT_TEMPLATE = `
You are Ask LOOP, an AI Customer Intelligence Assistant for SaaS enterprise teams.
Answer the user's question STRICTLY based on the provided customer feedback evidence context below.

Retrieved Customer Feedback Context:
"""
{{contextText}}
"""

User Question:
"{{question}}"

Strict Guidelines:
1. Rely ONLY on the provided context evidence.
2. If the answer cannot be determined from the provided context, respond with:
   "I couldn't find enough evidence in the available feedback."
3. Never hallucinate facts, metrics, or feedback items outside the provided context.

Output JSON strictly matching this schema:
{
  "answer": string,
  "evidence": [
    { "feedbackId": string, "quote": string, "channel": string }
  ],
  "feedbackIds": string[],
  "confidence": number between 0.0 and 1.0
}
Return raw valid JSON only.
`;

export const SUMMARY_PROMPT_TEMPLATE = `
Summarize the following customer feedback payload into a single, high-impact executive sentence:

Text:
"""
{{text}}
"""

Return JSON:
{
  "summary": string
}
`;
