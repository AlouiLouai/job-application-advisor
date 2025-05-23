"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { UploadCloud, ClipboardPaste, BarChart2, MessageCircle, CheckCircle } from "lucide-react";

const ONBOARDING_STEPS = [
  {
    title: "Welcome to JobAdvisor!",
    icon: <UploadCloud className="h-12 w-12 text-green-500 mb-4" />,
    text: "Get started by uploading your CV in PDF format. We'll analyze it to give you tailored advice.",
  },
  {
    title: "Tell Us About the Job",
    icon: <ClipboardPaste className="h-12 w-12 text-green-500 mb-4" />,
    text: "Next, paste the job description you're interested in. This helps us understand what the employer is looking for.",
  },
  {
    title: "Get Actionable Insights",
    icon: <BarChart2 className="h-12 w-12 text-green-500 mb-4" />,
    text: "We'll show you a match score, a recommendation, and a detailed explanation to help you decide if you should apply.",
  },
  {
    title: "Need Help? Just Ask!",
    icon: <MessageCircle className="h-12 w-12 text-green-500 mb-4" />,
    text: "Our AI assistant is here to answer your questions, help generate cover letters, or suggest CV improvements.",
  },
  {
    title: "You're All Set!",
    icon: <CheckCircle className="h-12 w-12 text-green-500 mb-4" />,
    text: "You're ready to start using JobAdvisor. Good luck with your job applications!",
  },
];

const LOCAL_STORAGE_KEY = "hasCompletedOnboarding";

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (hasCompleted !== "true") {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    setIsOpen(false);
  };
  
  const handleSkip = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip} // Allow closing modal by clicking backdrop (acts as skip)
      title={step.title}
      showCloseButton={true} // Explicitly show X button, also acts as skip
      className="max-w-md" // Slightly smaller for onboarding
    >
      <div className="flex flex-col items-center text-center">
        {step.icon}
        <p className="text-muted-foreground">{step.text}</p>
      </div>
      <div className="mt-6 flex justify-between items-center pt-4 border-t">
        {/* Progress Dots */}
        <div className="flex space-x-2">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep ? "bg-green-500 scale-125" : "bg-gray-300"
              } transition-all duration-300`}
            />
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="space-x-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          <Button onClick={handleNext}>
            {currentStep === ONBOARDING_STEPS.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OnboardingFlow;
