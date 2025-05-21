"use client"

import { createContext, useContext } from "react"

export type ChatContextType = {
  cv: File | null
  jobDescription: string
  matchPercentage?: number
  recommendation?: string
}

export const ChatContext = createContext<{
  chatContext: ChatContextType
  updateChatContext: (context: Partial<ChatContextType>) => void
}>({
  chatContext: {
    cv: null,
    jobDescription: "",
  },
  updateChatContext: () => {},
})

export const useChatContext = () => useContext(ChatContext)
