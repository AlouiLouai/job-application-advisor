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
  } = useChat();

  return (
    <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto border rounded-lg shadow-md bg-white">
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
      />
    </div>
  );
}
