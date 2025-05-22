"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

type SuggestedQuestion = {
  id: string;
  text: string;
};

type ChatPanelProps = {
  context?: {
    screen?: string;
    matchPercentage?: number;
    hasFile?: boolean;
    hasJobDescription?: boolean;
  };
};

export default function ChatPanel({ context }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<
    SuggestedQuestion[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [animateIn, setAnimateIn] = useState(false);

  const sessionRef = useRef<string>("user-123");

  useEffect(() => {
    const welcomeMessage =
      "Hi there! I'm your Job Application Assistant. How can I help you today?";
    const questions: SuggestedQuestion[] = [
      { id: "q1", text: "How do I improve my CV?" },
      { id: "q2", text: "What makes a good cover letter?" },
      { id: "q3", text: "How do I prepare for an interview?" },
    ];

    setMessages([
      {
        id: "welcome",
        content: welcomeMessage,
        role: "assistant",
        timestamp: new Date(),
      },
    ]);

    setSuggestedQuestions(questions);

    // Trigger animation after component mounts
    setTimeout(() => {
      setAnimateIn(true);
    }, 100);
  }, [context]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSendMessage = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!message.trim()) return;

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        role: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessage("");
      setIsLoading(true);

      try {
        // Send POST request to n8n webhook
        const response = await fetch(
          "https://n8n.connectorzzz.com/webhook/chatbot",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: userMessage.content,
              //sessionId: "static-user-123"
              sessionId: sessionRef.current,
              // context, // Uncomment and include context if needed by the webhook
            }),
          }
        ).catch((fetchError) => {
          console.error("Fetch error details:", fetchError);
          if (fetchError.message.includes("Failed to fetch")) {
            throw new Error(
              "CORS error: The server is not allowing requests from this application. Please try again later or contact support."
            );
          }
          throw new Error(`Failed to fetch: ${fetchError.message}`);
        });

        // Check if response is OK
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "Webhook endpoint not found. Please check the server configuration."
            );
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Read response as text first to check for empty or invalid content
        const text = await response.text();

        let data = null;
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (jsonError) {
            console.error("Failed to parse JSON:", text, jsonError);
            throw new Error("Invalid JSON response from webhook");
          }
        }

        // Create assistant message, checking multiple possible fields
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            data?.output || // Check direct 'output' field
            (Array.isArray(data) && data[0]?.output) ||
            data?.response ||
            data?.message ||
            data?.text ||
            "The server responded, but no reply was provided. Please try again or rephrase your question.",
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update suggested questions if provided by the webhook, otherwise use defaults
        const newSuggestedQuestions = (Array.isArray(data) &&
        data[0]?.suggestedQuestions?.length
          ? data[0].suggestedQuestions
          : data?.suggestedQuestions?.length
          ? data.suggestedQuestions
          : []
        ).map((q: string, index: number) => ({
          id: `sq-${Date.now()}-${index}`,
          text: q,
        })) || [
          { id: `sq-${Date.now()}-1`, text: "Can you elaborate on that?" },
          { id: `sq-${Date.now()}-2`, text: "How do I implement this advice?" },
          { id: `sq-${Date.now()}-3`, text: "What's the next step?" },
        ];

        setSuggestedQuestions(newSuggestedQuestions);
      } catch (error: unknown) {
        console.error("Error communicating with n8n webhook:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `An error occurred while processing your request: ${
            error instanceof Error ? error.message : String(error)
          }.`,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);

        // Retain default suggested questions on error
        setSuggestedQuestions([
          { id: `sq-${Date.now()}-1`, text: "Can you elaborate on that?" },
          { id: `sq-${Date.now()}-2`, text: "How do I implement this advice?" },
          { id: `sq-${Date.now()}-3`, text: "What's the next step?" },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [message]
  );

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question);
    handleSendMessage();
  };

  return (
    <div
      className={`flex flex-col h-full transition-opacity duration-500 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="p-4 border-b bg-gradient-to-r from-green-50 to-green-100">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">
              Job Application Assistant
            </h3>
            <p className="text-xs text-gray-500">Powered by AI</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  msg.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                )}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {msg.role === "assistant" && (
                    <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center">
                      <User className="h-3 w-3 text-green-600" />
                    </div>
                  )}
                  <span className="font-medium text-sm">
                    {msg.role === "user" ? "You" : "Assistant"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{msg.content}</p>

                {msg.role === "assistant" && (
                  <div className="flex items-center justify-end mt-2 space-x-2">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-gray-100 text-gray-800 border border-gray-200">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center">
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium text-sm">Assistant</span>
                </div>
                <div className="flex items-center space-x-2 py-2">
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

          {suggestedQuestions.length > 0 && !isLoading && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => handleSuggestedQuestion(question.text)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full transition-colors border border-gray-200"
                  >
                    {question.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-full border-gray-300 focus:border-green-500 focus:ring-green-500 py-6 pl-4 pr-10"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !message.trim()}
            className="rounded-full h-10 w-10 bg-green-600 hover:bg-green-700 flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
