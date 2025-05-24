"use client";

import { useChat } from "@/hooks/useChat";
import React from "react";
import { ChatMessage } from "./chat-message";
import { ChatPanel } from "./chat-panel";


export function Chat() {
  const {
    message,
    setMessage,
    messages,
    isLoading,
    suggestedQuestions,
    animateIn,
    messagesEndRef,
    inputRef,
    handleSendMessage,
    handleSuggestedQuestion,
    isChatDisabled, // Get isChatDisabled from useChat
  } = useChat();

  return (
    // Replaced h-[600px] with h-full to make it flexible.
    // Added w-full to ensure it takes the full width of its parent.
    // Removed max-w-3xl and mx-auto as it's now meant to fill its container in page.tsx
    // Removed border, rounded-lg, shadow-md as these are better handled by the parent container in page.tsx if needed
    <div className="flex flex-col h-full w-full bg-white">
      <ChatMessage
        messages={messages}
        isLoading={isLoading}
        suggestedQuestions={suggestedQuestions}
        animateIn={animateIn}
        messagesEndRef={messagesEndRef}
        onSuggestedQuestionClick={handleSuggestedQuestion}
      />
      <ChatPanel
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        inputRef={inputRef}
        isChatDisabled={isChatDisabled} // Pass isChatDisabled to ChatPanel
      />
    </div>
  );
}
