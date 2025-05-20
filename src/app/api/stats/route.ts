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
    console.log("Fetching analytics data with property ID:", propertyId);
    
    // Verify credentials are loaded properly
    if (!process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL || !process.env.GOOGLE_ANALYTICS_PRIVATE_KEY) {
      throw new Error("Google Analytics credentials are missing");
    }

    // Get active users for today
    console.log("Fetching active users...");
    const [activeUsersResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "7daysAgo",  // Changed to last 7 days for more meaningful data
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
    console.log("Fetching cover letter events...");
    let coverLettersResponse;
    try {
      [coverLettersResponse] = await analyticsDataClient.runReport({
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
              matchType: "EXACT",
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching cover letter events:", error);
      coverLettersResponse = { rows: [] };
    }

    // Get total CV improvements (custom event)
    let cvImprovementsResponse;
    try {
      [cvImprovementsResponse] = await analyticsDataClient.runReport({
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
              matchType: "EXACT",
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching CV improvement events:", error);
      cvImprovementsResponse = { rows: [] };
    }

    // Extract the values from the responses
    const activeUsers = activeUsersResponse.rows?.[0]?.metricValues?.[0]?.value || "0";
    const coverLettersGenerated = coverLettersResponse.rows?.[0]?.metricValues?.[0]?.value || "0";
    const cvImprovementsSuggested = cvImprovementsResponse.rows?.[0]?.metricValues?.[0]?.value || "0";

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