"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm your Job Application Assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sample responses for demo purposes
  const sampleResponses = [
    "I recommend tailoring your CV to highlight skills that match the job description.",
    "When writing your cover letter, focus on specific achievements that demonstrate your qualifications.",
    "For this type of role, emphasize your experience with similar projects or technologies.",
    "Based on the job description, you might want to highlight your leadership experience.",
    "Remember to quantify your achievements with specific metrics when possible.",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Get random response for demo
      const responseIndex = Math.floor(Math.random() * sampleResponses.length)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: sampleResponses[responseIndex],
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="w-80 shadow-lg">
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bot className="h-4 w-4 mr-2 text-green-500" />
              Job Application Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          {!isMinimized && (
            <>
              <CardContent className="p-0 flex-grow">
                <ScrollArea className="h-[380px] p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                            msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            {msg.role === "assistant" && <Bot className="h-3 w-3" />}
                            {msg.role === "user" && <User className="h-3 w-3" />}
                            <span className="font-medium">{msg.role === "user" ? "You" : "Assistant"}</span>
                          </div>
                          <p className="mt-1">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-3 w-3" />
                            <span className="font-medium">Assistant</span>
                          </div>
                          <div className="mt-1 flex items-center space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      )}

      {!isOpen && (
        <Button onClick={toggleChat} className="rounded-full h-12 w-12 shadow-lg bg-green-600 hover:bg-green-700">
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      )}
    </div>
  )
}
