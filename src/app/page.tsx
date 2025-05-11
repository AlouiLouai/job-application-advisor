"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Upload, FileText, CheckCircle } from "lucide-react"
import { analyzeApplication } from "@/lib/api"
import ResultScreen from "@/components/result-screen"
import CoverLetterScreen from "@/components/cover-letter-screen"
import FixCvScreen from "@/components/fix-cv-screen"

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Job Application Advisor</CardTitle>
          <CardDescription>Upload your CV and the job description to see if you should apply</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload your CV (PDF)</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${file ? "border-green-500 bg-green-50" : "border-gray-300"}`}
                onClick={() => document.getElementById("cv-upload")?.click()}
              >
                {file ? (
                  <div className="flex flex-col items-center text-green-600">
                    <CheckCircle className="h-8 w-8 mb-2" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">Click to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <Upload className="h-8 w-8 mb-2" />
                    <p className="font-medium">Click to upload your CV</p>
                    <p className="text-sm">PDF format only</p>
                  </div>
                )}
                <input id="cv-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="job-description" className="text-sm font-medium">
                Job Description
              </label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                className="min-h-[200px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
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
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {isLoading && (
        <div className="mt-8 w-full max-w-3xl">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Analyzing your application...</h3>
            <p className="text-sm text-gray-500">This may take a moment</p>
          </div>
          <Progress value={65} className="h-2" />
        </div>
      )}
    </main>
  )
}
