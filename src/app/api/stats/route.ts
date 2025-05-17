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

export async function GET() {
  try {
    console.log("Fetching analytics data...");
    
    // Get active users for today
    const [activeUsersResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "today",  // Changed from "30minAgo" to "today"
          endDate: "today",
        },
      ],
      metrics: [
        {
          name: "activeUsers",
        },
      ],
    });

    // Get total cover letters generated (custom event)
    const [coverLettersResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      metrics: [
        {
          name: "eventCount",
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: {
            value: "generate_cover_letter",
          },
        },
      },
    });

    // Get total CV improvements (custom event)
    const [cvImprovementsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      metrics: [
        {
          name: "eventCount",
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "eventName",
          stringFilter: {
            value: "improve_cv",
          },
        },
      },
    });

    // Extract the values from the responses
    const activeUsers = activeUsersResponse.rows?.[0]?.metricValues?.[0]?.value || "0";
    const coverLettersGenerated = coverLettersResponse.rows?.[0]?.metricValues?.[0]?.value || "0";
    const cvImprovementsSuggested = cvImprovementsResponse.rows?.[0]?.metricValues?.[0]?.value || "0";

    console.log("Analytics data fetched successfully:", {
      activeUsers,
      coverLettersGenerated,
      cvImprovementsSuggested,
    });

    return NextResponse.json({
      activeUsers,
      coverLettersGenerated,
      cvImprovementsSuggested,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch analytics data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}