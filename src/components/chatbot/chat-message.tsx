"use client";

import React from "react";
import { Bot, User, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message, SuggestedQuestion } from "@/hooks/useChat";

type MessageChatProps = {
  messages: Message[];
  isLoading: boolean;
  suggestedQuestions: SuggestedQuestion[];
  animateIn: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onSuggestedQuestionClick: (text: string) => void;
};

export function ChatMessage({
  messages,
  isLoading,
  suggestedQuestions,
  animateIn,
  messagesEndRef,
  onSuggestedQuestionClick,
}: MessageChatProps) {
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

      <div className="flex-1 p-4 overflow-y-auto"> {/* Changed overflow-auto to overflow-y-auto */}
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex animate-fade-in-up animate-duration-300", // Added animation for new messages
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
                    onClick={() => onSuggestedQuestionClick(question.text)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full transition-colors border border-gray-200 animate-fade-in animate-duration-300 animate-delay-200" // Added animation for suggested questions
                  >
                    {question.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
