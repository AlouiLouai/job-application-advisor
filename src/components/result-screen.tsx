"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, AlertTriangle, FileText, RefreshCw, ArrowRight } from "lucide-react"

type ResultProps = {
  result: {
    match_percentage: number
    recommendation: string
    explanation: string
  }
  onGenerateCoverLetter: () => void
  onFixCv: () => void
  onReset: () => void
}

export default function ResultScreen({ result, onGenerateCoverLetter, onFixCv, onReset }: ResultProps) {
  const { match_percentage, recommendation, explanation } = result

  // Determine color scheme based on match percentage
  const getColorScheme = () => {
    if (match_percentage >= 80) return "text-green-600"
    if (match_percentage >= 65) return "text-amber-600"
    return "text-red-600"
  }

  const getIcon = () => {
    if (match_percentage >= 80) return <CheckCircle className="h-12 w-12 text-green-600" />
    if (match_percentage >= 65) return <AlertTriangle className="h-12 w-12 text-amber-600" />
    return <AlertCircle className="h-12 w-12 text-red-600" />
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Application Analysis Results</CardTitle>
          <CardDescription>Here's our assessment of your job application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            {getIcon()}
            <div className="text-center">
              <h3 className={`text-3xl font-bold ${getColorScheme()}`}>{match_percentage}% Match</h3>
              <p className={`text-xl font-medium ${getColorScheme()}`}>Recommendation: {recommendation}</p>
            </div>
          </div>

          <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-full ${
                match_percentage >= 80 ? "bg-green-500" : match_percentage >= 65 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${match_percentage}%` }}
            ></div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Detailed Explanation:</h4>
            <p className="text-gray-700 whitespace-pre-line">{explanation}</p>
          </div>

          {match_percentage >= 65 ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Good news!</h4>
              <p className="text-green-700">
                Your profile matches well with this job. Would you like to generate a tailored cover letter to
                strengthen your application?
              </p>
              <Button
                className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={onGenerateCoverLetter}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Cover Letter
              </Button>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Needs improvement</h4>
              <p className="text-red-700">
                Your profile doesn't match well with this job. Would you like suggestions on how to improve your CV for
                this position?
              </p>
              <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white w-full" onClick={onFixCv}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Get CV Improvement Tips
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onReset}>
            Start Over
          </Button>
          <Button variant="secondary" onClick={onReset}>
            Try Another Job
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
