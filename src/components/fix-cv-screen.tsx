"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { improveCV } from "@/lib/api"

type FixCvScreenProps = {
  cv: File | null
  jobDescription: string
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  onBack: () => void
  onReset: () => void
}

type Improvement = {
  title: string
  description: string
}

export default function FixCvScreen({
  cv,
  jobDescription,
  isLoading,
  setIsLoading,
  onBack,
  onReset,
}: FixCvScreenProps) {
  const [improvements, setImprovements] = useState<Improvement[]>([])
  const [error, setError] = useState<string | null>(null)
  const [gapAnalysis, setGapAnalysis] = useState<string>("")
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    async function fetchCVImprovements() {
      if (!cv || !jobDescription) {
        setError("Missing CV or job description")
        setIsLoading(false)
        return
      }

      try {
        console.log("Fetching CV improvements, attempt:", retryCount + 1)
        const response = await improveCV(cv, jobDescription)
        console.log("Received response:", response)

        if (response.improvements) {
          setImprovements(response.improvements)
        }

        if (response.gap_analysis) {
          setGapAnalysis(response.gap_analysis)
        }

        // If we didn't get any improvements, show an error
        if (!response.improvements || response.improvements.length === 0) {
          setError("No improvement suggestions were returned. Please try again.")
        }
      } catch (err) {
        console.error("Error in component:", err)
        setError(`Failed to get CV improvement tips: ${err instanceof Error ? err.message : "Unknown error"}`)
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoading) {
      fetchCVImprovements()
    }
  }, [cv, jobDescription, isLoading, setIsLoading, retryCount])

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setRetryCount((prev) => prev + 1)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">CV Improvement Suggestions</CardTitle>
          <CardDescription>Here&apos;s how you can improve your CV for this specific job</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-medium">Analyzing your CV...</h3>
              <p className="text-sm text-gray-500">Finding improvement opportunities</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
              <h4 className="font-medium text-red-800 mb-2 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Error
              </h4>
              <p className="text-red-700">{error}</p>
              <Button variant="outline" className="mt-4" onClick={handleRetry}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {gapAnalysis && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Key Gap Analysis:</h4>
                  <p className="text-amber-700">{gapAnalysis}</p>
                </div>
              )}

              <div className="space-y-4">
                {improvements.map((item, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4 flex">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-800">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {improvements.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
                  <p className="text-blue-700">
                    Consider updating your CV with these suggestions and applying for positions that better match your
                    current skill set. Alternatively, you could invest time in learning the required skills to qualify
                    for similar positions in the future.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
          <Button onClick={onReset}>Start Over</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
