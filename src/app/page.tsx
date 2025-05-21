"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Upload, FileText, CheckCircle, ChevronRight, Sparkles } from "lucide-react"
import { analyzeApplication } from "@/lib/api"
import ResultScreen from "@/components/result-screen"
import CoverLetterScreen from "@/components/cover-letter-screen"
import FixCvScreen from "@/components/fix-cv-screen"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import ChatPanel from "@/components/chat-panel"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<"input" | "result" | "coverLetter" | "fixCv">("input")
  const [result, setResult] = useState<{
    match_percentage: number
    recommendation: string
    explanation: string
  } | null>(null)
  const [secondaryLoading, setSecondaryLoading] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateIn(true)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !jobDescription) return

    setIsLoading(true)
    try {
      const result = await analyzeApplication(file, jobDescription)
      setResult(result)
      setCurrentScreen("result")
    } catch (error) {
      console.error("Error analyzing application:", error)
      alert("An error occurred while analyzing your application. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateCoverLetter = () => {
    setSecondaryLoading(true)
    setCurrentScreen("coverLetter")
  }

  const handleFixCv = () => {
    setSecondaryLoading(true)
    setCurrentScreen("fixCv")
  }

  const resetToInput = () => {
    setCurrentScreen("input")
    setFile(null)
    setJobDescription("")
    setResult(null)
  }

  // Render the appropriate screen based on the current state
  const renderMainContent = () => {
    if (currentScreen === "result" && result) {
      return (
        <ResultScreen
          result={result}
          onGenerateCoverLetter={handleGenerateCoverLetter}
          onFixCv={handleFixCv}
          onReset={resetToInput}
        />
      )
    }

    if (currentScreen === "coverLetter") {
      return (
        <CoverLetterScreen
          cv={file}
          jobDescription={jobDescription}
          isLoading={secondaryLoading}
          setIsLoading={setSecondaryLoading}
          onBack={() => setCurrentScreen("result")}
          onReset={resetToInput}
        />
      )
    }

    if (currentScreen === "fixCv") {
      return (
        <FixCvScreen
          cv={file}
          jobDescription={jobDescription}
          isLoading={secondaryLoading}
          setIsLoading={setSecondaryLoading}
          onBack={() => setCurrentScreen("result")}
          onReset={resetToInput}
        />
      )
    }

    // Default input screen
    return (
      <div className="flex flex-col h-full">
        {/* Analytics Dashboard at the top */}
        <div className="mb-4">
          <AnalyticsDashboard />
        </div>

        {/* Main form - takes up remaining height */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col shadow-sm border border-gray-200 bg-white">
            <CardHeader className="text-center py-4 border-b">
              <div className="flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-green-500 mr-2" />
                <CardTitle className="text-xl font-bold text-gray-800">Job Application Advisor</CardTitle>
              </div>
              <CardDescription className="text-sm mt-1">
                Upload your CV and the job description to see if you should apply
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4">
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
                      Step 1
                    </span>
                    Upload your CV (PDF)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all ${
                      file ? "border-green-500 bg-green-50" : "border-gray-300"
                    }`}
                    onClick={() => document.getElementById("cv-upload")?.click()}
                  >
                    {file ? (
                      <div className="flex flex-col items-center text-green-600 py-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-500 py-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          <Upload className="h-5 w-5" />
                        </div>
                        <p className="font-medium text-sm">Click to upload your CV</p>
                        <p className="text-xs mt-0.5">PDF format only</p>
                      </div>
                    )}
                    <input id="cv-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <label htmlFor="job-description" className="text-sm font-medium flex items-center mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
                      Step 2
                    </span>
                    Job Description
                  </label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description here..."
                    className="flex-1 min-h-0 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button
                type="submit"
                className="w-full py-4 text-base rounded-lg bg-green-600 hover:bg-green-700 transition-all shadow-sm"
                disabled={!file || !jobDescription || isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing your application...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze My Application
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Progress indicator */}
          {isLoading && (
            <div className="mt-4">
              <div className="text-center mb-2">
                <h3 className="text-base font-medium">Analyzing your application...</h3>
                <p className="text-xs text-gray-500">This may take a moment</p>
              </div>
              <Progress value={65} className="h-2 rounded-full" />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex h-full overflow-hidden transition-opacity duration-500 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Main content - 2/3 width */}
      <div className="w-2/3 h-full overflow-auto p-4">{renderMainContent()}</div>

      {/* Chat panel - 1/3 width */}
      <div className="w-1/3 h-full border-l border-gray-200">
        <div className="h-full">
          <ChatPanel />
        </div>
      </div>
    </div>
  )
}
