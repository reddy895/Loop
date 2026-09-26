/**
 * @file app/api/feedback/retrieve/route.ts
 * @description REST API Route handler for retrieving CSV customer feedback dataset and metrics.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSuccessResponse } from "@/utils";
import { handleApiError, requestLoggerMiddleware } from "@/middleware";

const mockCsvRecords = [
  {
    id: "FB-9021",
    customerName: "Sarah Jenkins",
    customerEmail: "s.jenkins@stripe.com",
    channel: "Zendesk",
    feedback: "The bulk export feature constantly times out when trying to download more than 5,000 feedback records at once. Needs stream response support.",
    sentiment: "Negative",
    sentimentScore: 24,
    theme: "UX Performance",
    status: "New",
    date: "2026-08-04"
  },
  {
    id: "FB-9022",
    customerName: "David Chen",
    customerEmail: "d.chen@linear.app",
    channel: "Intercom",
    feedback: "Asking Ask LOOP about quarterly theme drift saves our product team at least 10 hours of manual data tagging every week. Super crisp insights!",
    sentiment: "Positive",
    sentimentScore: 94,
    theme: "Feature Request",
    status: "Processed",
    date: "2026-08-04"
  },
  {
    id: "FB-9023",
    customerName: "Marcus Vance",
    customerEmail: "marcus@datadog.com",
    channel: "App Store",
    feedback: "Mobile app crashes on iOS 18 when attempting to filter theme cards by negative sentiment. Unusable on iPad.",
    sentiment: "Negative",
    sentimentScore: 12,
    theme: "Mobile Responsiveness",
    status: "Under Review",
    date: "2026-08-03"
  }
];

/**
 * GET /api/feedback/retrieve
 * Retrieve CSV feedback dataset and dashboard generation metrics.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const url = new URL(req.url);
    const dataset = url.searchParams.get("dataset") || "enterprise";

    return createSuccessResponse(
      {
        dataset,
        totalRecords: 1482,
        records: mockCsvRecords,
        generatedAt: new Date().toISOString(),
        status: "SUCCESS"
      },
      "CSV feedback dataset retrieved successfully for dashboard generation."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/feedback/retrieve
 * Trigger CSV data retrieval and dynamic dashboard calculation.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  requestLoggerMiddleware(req);

  try {
    const body = await req.json().catch(() => ({}));
    const dataset = body.dataset || "enterprise";

    return createSuccessResponse(
      {
        dataset,
        totalRecords: 1482,
        records: mockCsvRecords,
        metrics: {
          positivePercentage: "61.8%",
          negativePercentage: "24.2%",
          totalFeedback: 1482,
          newThisWeek: 342
        },
        generatedAt: new Date().toISOString()
      },
      "CSV feedback dataset retrieved and dashboards generated."
    );
  } catch (error) {
    return handleApiError(error);
  }
}
