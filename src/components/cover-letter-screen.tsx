"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Download, ArrowLeft, Copy } from "lucide-react"
import { useState } from "react"

type CoverLetterScreenProps = {
  isLoading: boolean
  onBack: () => void
  onReset: () => void
}

export default function CoverLetterScreen({ isLoading, onBack, onReset }: CoverLetterScreenProps) {
  const [copied, setCopied] = useState(false)

  const sampleCoverLetter = `Dear Hiring Manager,

I am writing to express my interest in the Backend Engineer position at your company. After reviewing the job description, I believe my technical skills and experience make me a strong candidate for this role.

With over 3 years of experience in backend development, I have developed expertise in microservices architecture, CI/CD pipelines, and cloud infrastructure using AWS. While my primary experience has been with Node.js, NestJS, and Python, I am confident in my ability to quickly adapt to Java/Kotlin and Spring Boot frameworks given my strong foundation in object-oriented programming principles and microservices architecture.

In my current role at XYZ Company, I successfully implemented a scalable messaging system using Kafka that improved system reliability by 40%. I also have extensive experience with Docker containerization and monitoring tools like Prometheus and Grafana, which align perfectly with your technical environment.

I am particularly drawn to your company's innovative approach to solving complex problems and your commitment to building scalable, resilient systems. I am excited about the opportunity to contribute to your team and help drive the development of your backend infrastructure.

Thank you for considering my application. I look forward to the possibility of discussing how my background, technical skills, and experiences would be an asset to your team.

Sincerely,
[Your Name]`

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleCoverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Your Tailored Cover Letter</CardTitle>
          <CardDescription>Use this cover letter to strengthen your application</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
              <h3 className="text-lg font-medium">Generating your cover letter...</h3>
              <p className="text-sm text-gray-500">This may take a moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to clipboard
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-white border rounded-lg p-6 whitespace-pre-line font-serif">{sampleCoverLetter}</div>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Pro Tips:</h4>
                <ul className="list-disc list-inside text-green-700 space-y-2">
                  <li>Personalize this letter with specific details about the company</li>
                  <li>Add your personal achievements that directly relate to the job requirements</li>
                  <li>Proofread carefully before sending</li>
                  <li>Consider having someone else review it for feedback</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
          <Button onClick={onReset}>Start Over</Button>
          {!isLoading && (
            <Button variant="default" className="bg-green-600 hover:bg-green-700">
              <Download className="mr-2 h-4 w-4" />
              Download as PDF
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}
