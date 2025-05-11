"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Download, ArrowLeft, Copy } from "lucide-react"
import { useState, useEffect } from "react"
import { generateCoverLetter } from "@/lib/api"
import { generateCoverLetterPDF } from "@/lib/pdf-utils"

type CoverLetterScreenProps = {
  cv: File | null
  jobDescription: string
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  onBack: () => void
  onReset: () => void
}

export default function CoverLetterScreen({
  cv,
  jobDescription,
  isLoading,
  setIsLoading,
  onBack,
  onReset,
}: CoverLetterScreenProps) {
  const [copied, setCopied] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)

  useEffect(() => {
    async function fetchCoverLetter() {
      if (!cv || !jobDescription) {
        setError("Missing CV or job description")
        setIsLoading(false)
        return
      }

      try {
        const generatedCoverLetter = await generateCoverLetter(cv, jobDescription)
        setCoverLetter(generatedCoverLetter)
      } catch (err) {
        console.error("Error generating cover letter:", err)
        setError("Failed to generate cover letter. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoading) {
      fetchCoverLetter()
    }
  }, [cv, jobDescription, isLoading, setIsLoading])

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = async () => {
    try {
      setIsPdfGenerating(true)

      // Dynamically import jsPDF to ensure it only loads on the client
      await import("jspdf-autotable")

      // Generate and download the PDF
      generateCoverLetterPDF(coverLetter)
    } catch (err) {
      console.error("Error generating PDF:", err)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsPdfGenerating(false)
    }
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
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
              <h4 className="font-medium text-red-800 mb-2">Error</h4>
              <p className="text-red-700">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setError(null)
                  setIsLoading(true)
                }}
              >
                Try Again
              </Button>
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
              <div className="bg-white border rounded-lg p-6 whitespace-pre-line font-serif">{coverLetter}</div>
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
          {!isLoading && !error && coverLetter && (
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleDownloadPDF}
              disabled={isPdfGenerating}
            >
              {isPdfGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download as PDF
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}
