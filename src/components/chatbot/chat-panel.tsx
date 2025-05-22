"use client";

import React from "react";
import { Loader2, Send } from "lucide-react";

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
  return (
    <form
      onSubmit={onSendMessage}
      className="border-t p-4 flex items-center gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Ask me anything..."
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
