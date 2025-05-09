export async function analyzeApplication(cv: File, jobDescription: string) {
  // Create form data
  const formData = new FormData()
  formData.append("cv", cv)
  formData.append("jobDescription", jobDescription)

  try {
    // In a real implementation, you would send the formData to the API
    // For demo purposes, we'll simulate the API response

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // This is a mock response - in a real app, you would get this from the API
    return {
      match_percentage: 70,
      recommendation: "Maybe",
      explanation:
        "The candidate has strong backend engineering experience with 3+ years including relevant skills in microservices, CI/CD, AWS, Kafka, Docker, and monitoring tools like Prometheus and Grafana, which align well with the job's technical environment. However, the candidate primarily uses Node.js, NestJS, and Python rather than the requested Java or Kotlin and Spring Boot frameworks, which are core to the job description. The CV demonstrates impactful achievements and experience in agile teams, collaboration, and scalable system design, matching the role's expectations in responsibility and teamwork. While lacking direct experience in Java/Kotlin and specific Spring Boot frameworks reduces the fit, familiarity with AWS, Kafka, and CI/CD tools partially mitigates this gap.",
    }

    // In a real implementation, you would do something like:
    // const response = await fetch('https://n8n.connectorzzz.com/webhook-test/getData', {
    //   method: 'POST',
    //   body: formData,
    // });
    // return await response.json();
  } catch (error) {
    console.error("Error analyzing application:", error)
    throw new Error("Failed to analyze application")
  }
}