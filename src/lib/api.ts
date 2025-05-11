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

    return await response.json();

    // If you need to test without making actual API calls, you can use this mock:
    /*
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock response
    return {
      match_percentage: 70,
      recommendation: "Maybe",
      explanation:
        "The candidate has strong backend engineering experience with 3+ years including relevant skills in microservices, CI/CD, AWS, Kafka, Docker, and monitoring tools like Prometheus and Grafana, which align well with the job's technical environment. However, the candidate primarily uses Node.js, NestJS, and Python rather than the requested Java or Kotlin and Spring Boot frameworks, which are core to the job description. The CV demonstrates impactful achievements and experience in agile teams, collaboration, and scalable system design, matching the role's expectations in responsibility and teamwork. While lacking direct experience in Java/Kotlin and specific Spring Boot frameworks reduces the fit, familiarity with AWS, Kafka, and CI/CD tools partially mitigates this gap.",
    }
    */
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

    return {
      gap_analysis: data.gap_analysis?.trim() || "",
      improvements: Array.isArray(data.improvements) ? data.improvements : [],
    }
  } catch (error) {
    console.error("❌ CV API error:", error)
    throw new Error("Failed to get CV improvement tips")
  }
}

