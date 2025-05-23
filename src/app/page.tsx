"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import ResultScreen from "@/components/result-screen";
import CoverLetterScreen from "@/components/cover-letter-screen";
import FixCvScreen from "@/components/fix-cv-screen";
import AnalyticsDashboard from "@/components/analytics/analytics-dashboard";
import { Chat } from "@/components/chatbot/chat";
import { useApplicationAnalyzer } from "@/hooks/useApplicationAnalyzer";
import OnboardingFlow from "@/components/onboarding/onboarding-flow"; // Import OnboardingFlow

export default function Home() {
  const {
    currentScreen,
    result,
    handleGenerateCoverLetter,
    handleFixCv,
    reset,
    file,
    jobDescription,
    setJobDescription,
    isLoading,
    secondaryLoading,
    setSecondaryLoading,
    setCurrentScreen,
    handleSubmit,
    handleFileChange,
    animateIn,
    analysisProgress, // Assuming this is provided by the hook
  } = useApplicationAnalyzer();

  // Render the appropriate screen based on the current state
  const renderMainContent = () => {
    if (currentScreen === "result" && result) {
      return (
        <ResultScreen
          result={result}
          onGenerateCoverLetter={handleGenerateCoverLetter}
          onFixCv={handleFixCv}
          onReset={reset}
        />
      );
    }

    if (currentScreen === "coverLetter") {
      return (
        <CoverLetterScreen
          cv={file}
          jobDescription={jobDescription}
          isLoading={secondaryLoading}
          setIsLoading={setSecondaryLoading}
          onBack={() => setCurrentScreen("result")}
          onReset={reset}
        />
      );
    }

    if (currentScreen === "fixCv") {
      return (
        <FixCvScreen
          cv={file}
          jobDescription={jobDescription}
          isLoading={secondaryLoading}
          setIsLoading={setSecondaryLoading}
          onBack={() => setCurrentScreen("result")}
          onReset={reset}
        />
      );
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
                <CardTitle className="text-xl font-bold text-gray-800">
                  Job Application Advisor
                </CardTitle>
              </div>
              <CardDescription className="text-sm mt-1">
                Upload your CV and the job description to see if you should
                apply
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4">
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col space-y-4"
              >
                <div>
                  <label className="text-sm font-medium flex items-center mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full mr-2">
                      Step 1
                    </span>
                    Upload your CV (PDF)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:shadow-md hover:border-green-400 ${
                      file ? "border-green-500 bg-green-50" : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      document.getElementById("cv-upload")?.click()
                    }
                  >
                    {file ? (
                      <div className="flex flex-col items-center text-green-600 py-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-500 py-4">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          <Upload className="h-5 w-5" />
                        </div>
                        <p className="font-medium text-sm">
                          Click to upload your CV
                        </p>
                        <p className="text-xs mt-0.5">PDF format only</p>
                      </div>
                    )}
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) handleFileChange(selectedFile);
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <label
                    htmlFor="job-description"
                    className="text-sm font-medium flex items-center mb-2"
                  >
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
                <h3 className="text-base font-medium">
                  Analyzing your application...
                </h3>
                <p className="text-xs text-gray-500">This may take a moment</p>
              </div>
              {/* Use the dynamic progress value from the hook */}
              <Progress value={analysisProgress} className="h-2 rounded-full" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <> {/* Use a fragment to allow OnboardingFlow to be a sibling */}
      <OnboardingFlow /> {/* Add OnboardingFlow here */}
      <div
        className={`flex flex-col md:flex-row h-full overflow-hidden ${
          animateIn ? "animate-fade-in-up animate-duration-500" : "opacity-0"
        }`}
      >
        {/* Main content - full width on small screens, 2/3 on medium and up */}
        <div className="w-full md:w-2/3 h-full overflow-auto p-4">
          {renderMainContent()}
        </div>

        {/* Chat panel - full width on small screens, 1/3 on medium and up */}
        {/* Added a subtle slide-in from right for the chat panel for visual appeal */}
        <div className={`relative w-full md:w-1/3 h-full border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50 group ${
          animateIn ? "animate-slide-in-right animate-duration-500 animate-delay-200" : "opacity-0"
        }`}>
          {/* Chat panel always visible and interactive */}
          <div className="h-full w-full">
            <Chat />
          </div>
        </div>
      </div>
    </>
  );
}
