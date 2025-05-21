// app/api/stats/route.ts
import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Initialize the Analytics Data API client with your credentials
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

// Utility to fetch custom event count
async function fetchEventCount(propertyId: string, eventName: string): Promise<number> {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: {
            value: eventName,
            matchType: "EXACT",
          },
        },
      },
    });
    return Number(response.rows?.[0]?.metricValues?.[0]?.value || 0);
  } catch (error) {
    console.error(`Error fetching ${eventName} events:`, error);
    return 0;
  }
}

export async function GET() {
  try {

    if (!process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL || !process.env.GOOGLE_ANALYTICS_PRIVATE_KEY) {
      throw new Error("Google Analytics credentials are missing");
    }

    // Get active users for last 7 days
    const [activeUsersResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "7daysAgo",
          endDate: "today",
        },
      ],
      metrics: [
        {
          name: "activeUsers",
        },
      ],
    });

    const activeUsers = activeUsersResponse.rows?.[0]?.metricValues?.[0]?.value || "0";

    // Fetch custom event counts
    const coverLettersGenerated = await fetchEventCount(propertyId!, "generate_cover_letter");
    const cvImprovementsSuggested = await fetchEventCount(propertyId!, "improve_cv");

    return NextResponse.json({
      activeUsers,
      coverLettersGenerated,
      cvImprovementsSuggested,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch analytics data",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
