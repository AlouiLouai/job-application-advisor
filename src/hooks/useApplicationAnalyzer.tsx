import { useState, useEffect } from "react";
import { analyzeApplication } from "@/lib/api";

export function useApplicationAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<
    "input" | "result" | "coverLetter" | "fixCv"
  >("input");
  const [result, setResult] = useState<{
    match_percentage: number;
    recommendation: string;
    explanation: string;
  } | null>(null);
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0); // New state for progress

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const [animateIn, setAnimateIn] = useState(false);

  const handleFileChange = (file: File) => setFile(file);
  const handleJobDescriptionChange = (desc: string) => setJobDescription(desc);

  const handleSubmit = async () => {
    if (!file || !jobDescription) return;
    setIsLoading(true);
    setAnalysisProgress(0); // Reset progress

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(progressInterval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 200);

    try {
      const resultData = await analyzeApplication(file, jobDescription);
      clearInterval(progressInterval); // Stop simulation
      setAnalysisProgress(100); // Set to 100% on completion
      setResult(resultData);
      setCurrentScreen("result");
    } catch (err) {
      console.error("Error:", err);
      clearInterval(progressInterval); // Stop simulation on error
      setAnalysisProgress(0); // Reset progress on error
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      // No need to set progress to 0 here if we want it to stay at 100% or show error state
    }
  };

  const handleGenerateCoverLetter = () => {
    setSecondaryLoading(true);
    setCurrentScreen("coverLetter");
  };

  const handleFixCv = () => {
    setSecondaryLoading(true);
    setCurrentScreen("fixCv");
  };

  const reset = () => {
    setCurrentScreen("input");
    setFile(null);
    setJobDescription("");
    setResult(null);
  };

  return {
    file,
    jobDescription,
    setJobDescription,
    isLoading,
    currentScreen,
    result,
    secondaryLoading,
    animateIn,
    analysisProgress, // Expose progress
    handleFileChange,
    handleJobDescriptionChange,
    handleSubmit,
    handleGenerateCoverLetter,
    handleFixCv,
    reset,
    setCurrentScreen,
    setSecondaryLoading,
  };
}
