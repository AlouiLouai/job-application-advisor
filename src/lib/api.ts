export async function analyzeApplication(cv: File, jobDescription: string) {
  // Create form data
  const formData = new FormData();
  formData.append("cv", cv);
  formData.append("job_description", jobDescription);

  try {
    // Send the POST request to the specified endpoint
    const response = await fetch(
      "https://n8n.connectorzzz.com/webhook/getdata",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    // Track the event in Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "analyze_application", {
        event_category: "user_action",
        event_label: "Application Analyzed",
        match_percentage: result.match_percentage,
        recommendation: result.recommendation
      });
    }

    return result;
  } catch (error) {
    console.error("Error analyzing application:", error);
    throw new Error("Failed to analyze application");
  }
}

export async function generateCoverLetter(cv: File, jobDescription: string) {
  // Create form data
  const formData = new FormData();
  formData.append("cv", cv);
  formData.append("job_description", jobDescription);

  try {
    // Send the POST request to the specified endpoint
    const response = await fetch(
      "https://n8n.connectorzzz.com/webhook/cover_letter",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Track the event in Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "generate_cover_letter", {
        event_category: "user_action",
        event_label: "Cover Letter Generated",
        content_length: data.cover_letter?.length || 0
      });
    }
    
    return data.cover_letter || ""; // Assuming the API returns an object with a cover_letter field
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter");
  }
}

export async function improveCV(cv: File, jobDescription: string) {
  const formData = new FormData()
  formData.append("cv", cv)
  formData.append("job_description", jobDescription)

  try {
    const response = await fetch("https://n8n.connectorzzz.com/webhook/improve_cv", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const json = await response.json()
    const data = Array.isArray(json) ? json[0] : json

    if (!data || typeof data !== "object") {
      throw new Error("Invalid API response structure")
    }
    
    // Track the event in Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "improve_cv", {
        event_category: "user_action",
        event_label: "CV Improvement Suggested",
        improvements_count: Array.isArray(data.improvements) ? data.improvements.length : 0
      });
    }

    return {
      gap_analysis: data.gap_analysis?.trim() || "",
      improvements: Array.isArray(data.improvements) ? data.improvements : [],
    }
  } catch (error) {
    console.error("❌ CV API error:", error)
    throw new Error("Failed to get CV improvement tips")
  }
}