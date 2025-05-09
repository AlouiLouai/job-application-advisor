"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react"

type FixCvScreenProps = {
  isLoading: boolean
  onBack: () => void
  onReset: () => void
}

export default function FixCvScreen({ isLoading, onBack, onReset }: FixCvScreenProps) {
  const improvements = [
    {
      title: "Add Java/Kotlin Experience",
      description:
        "The job requires Java or Kotlin with Spring Boot. Highlight any experience or projects you've done with these technologies, even if they were academic or personal projects.",
    },
    {
      title: "Emphasize Transferable Skills",
      description:
        "While you may not have direct Java experience, emphasize how your Node.js and Python skills can transfer to Java development. Highlight your understanding of object-oriented programming concepts.",
    },
    {
      title: "Showcase Spring Boot Alternatives",
      description:
        "If you've worked with frameworks similar to Spring Boot in other languages (like NestJS for Node.js), highlight these experiences and draw parallels to Spring Boot's dependency injection, MVC architecture, etc.",
    },
    {
      title: "Highlight Relevant AWS Experience",
      description:
        "The job mentions AWS experience, which you have. Make this more prominent in your CV and specify which AWS services you've worked with.",
    },
    {
      title: "Add Learning Initiative",
      description:
        "Include a section about your current learning initiatives, especially if you're taking courses or building projects with Java/Kotlin and Spring Boot.",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">CV Improvement Suggestions</CardTitle>
          <CardDescription>Here's how you can improve your CV for this specific job</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-medium">Analyzing your CV...</h3>
              <p className="text-sm text-gray-500">Finding improvement opportunities</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">Key Gap Analysis:</h4>
                <p className="text-amber-700">
                  The main gap in your application is the lack of Java/Kotlin and Spring Boot experience, which are core
                  requirements for this position. Below are specific suggestions to address this gap and improve your
                  chances.
                </p>
              </div>

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

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
                <p className="text-blue-700">
                  Consider updating your CV with these suggestions and applying for positions that better match your
                  current skill set. Alternatively, you could invest time in learning Java/Kotlin and Spring Boot to
                  qualify for similar positions in the future.
                </p>
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
        </CardFooter>
      </Card>
    </main>
  )
}
