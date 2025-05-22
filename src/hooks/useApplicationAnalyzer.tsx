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

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const [animateIn, setAnimateIn] = useState(false);

  const handleFileChange = (file: File) => setFile(file);
  const handleJobDescriptionChange = (desc: string) => setJobDescription(desc);

  const handleSubmit = async () => {
    if (!file || !jobDescription) return;
    setIsLoading(true);
    try {
      const result = await analyzeApplication(file, jobDescription);
      setResult(result);
      setCurrentScreen("result");
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
