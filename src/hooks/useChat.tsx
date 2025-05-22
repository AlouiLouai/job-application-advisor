import { useState, useRef, useEffect, useCallback } from "react";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export type SuggestedQuestion = {
  id: string;
  text: string;
};

export function useChat() {
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

  // Init welcome + suggested questions + animation
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

    setTimeout(() => {
      setAnimateIn(true);
    }, 100);
  }, []);

  // Scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!message.trim()) return;

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
        const response = await fetch(
          "https://n8n.connectorzzz.com/webhook/chatbot",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: userMessage.content,
              sessionId: sessionRef.current,
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

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "Webhook endpoint not found. Please check the server configuration."
            );
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

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

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            data?.output ||
            (Array.isArray(data) && data[0]?.output) ||
            data?.response ||
            data?.message ||
            data?.text ||
            "The server responded, but no reply was provided. Please try again or rephrase your question.",
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

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

  return {
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
  };
}
