"use client";

import React from "react";
import { Loader2, Send } from "lucide-react";

type PanelChatProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onSendMessage: (e?: React.FormEvent) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isChatDisabled?: boolean; // Add isChatDisabled prop
};

export function ChatPanel({
  message,
  setMessage,
  onSendMessage,
  isLoading,
  inputRef,
  isChatDisabled, // Use the prop
}: PanelChatProps) {
  return (
    <form
      onSubmit={onSendMessage}
      className="border-t p-4 flex items-center gap-2"
    >
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>} // Ensure correct type for ref
        type="text"
        placeholder={isChatDisabled ? "Please sign in to chat" : "Ask me anything..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading || isChatDisabled} // Disable if chat is disabled
        className="flex-grow rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <button
        type="submit"
        disabled={isLoading || message.trim() === "" || isChatDisabled} // Disable if chat is disabled
        className="inline-flex items-center justify-center rounded-full bg-green-600 p-2 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} 
      </button>
    </form>
  );
}
