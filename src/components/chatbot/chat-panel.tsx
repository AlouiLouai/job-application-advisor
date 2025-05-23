"use client";

import React from "react";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

type PanelChatProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage: (e?: React.FormEvent) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export function ChatPanel({
  message,
  setMessage,
  onSendMessage,
  isLoading,
  inputRef,
}: PanelChatProps) {
  const { user } = useAuth(); // Get user from AuthContext

  let placeholderText = "Ask me anything...";
  if (user && user.displayName) {
    const firstName = user.displayName.split(" ")[0];
    if (firstName) {
      placeholderText = `Ask anything, ${firstName}...`;
    }
  }

  return (
    <form
      onSubmit={onSendMessage}
      className="border-t p-4 flex items-center gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholderText} // Use dynamic placeholder
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
        className="flex-grow rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <button
        type="submit"
        disabled={isLoading || message.trim() === ""}
        className="inline-flex items-center justify-center rounded-full bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send />}
      </button>
    </form>
  );
}
