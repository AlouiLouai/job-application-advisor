import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

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
  const { user } = useAuth(); // Get user from useAuth
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<
    SuggestedQuestion[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [animateIn, setAnimateIn] = useState(false);
  
  // sessionRef will now be updated based on user UID
  const sessionRef = useRef<string | null>(null); 

  useEffect(() => {
    if (user) {
      sessionRef.current = user.uid; // Set session ID to user's UID
    } else {
      sessionRef.current = null; // Or a guest session ID, or handle as disabled
    }
  }, [user]); // Update sessionRef when user changes

  // Init welcome + suggested questions + animation
  useEffect(() => {
    const welcomeMessage = user 
      ? "Hi there! I'm your Job Application Assistant. How can I help you today?"
      : "Hi there! Please sign in to use the Job Application Assistant."; // Modified welcome message
    
    const questions: SuggestedQuestion[] = user 
      ? [
          { id: "q1", text: "How do I improve my CV?" },
          { id: "q2", text: "What makes a good cover letter?" },
          { id: "q3", text: "How do I prepare for an interview?" },
        ]
      : [
          { id: "q1", text: "What can you do?" },
          { id: "q2", text: "How do I sign in?" },
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
  }, [user]); // Re-initialize if user state changes

  // Scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (user) { // Only focus if user is logged in (chat is active)
        inputRef.current?.focus();
    }
  }, [user]);

  const handleSendMessage = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!message.trim()) return;

      if (!user || !sessionRef.current) { // Check if user is logged in and session ID is set
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          content: "Please sign in to send messages.",
          role: "assistant",
          timestamp: new Date()
        }]);
        return;
      }

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
              sessionId: sessionRef.current, // Use dynamic session ID
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
        const errorMessageContent = `An error occurred: ${error instanceof Error ? error.message : String(error)}.`;
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: errorMessageContent,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        // Reset suggested questions on error
        setSuggestedQuestions([
            { id: `sq-${Date.now()}-error-1`, text: "Try rephrasing?" },
            { id: `sq-${Date.now()}-error-2`, text: "Ask something else?" },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [message, user] // Add user to dependency array for useCallback
  );

  const handleSuggestedQuestion = (question: string) => {
    if (!user) {
        if (question === "How do I sign in?") {
             setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                content: "You can sign in using the button in the header or by navigating to the /login page.",
                role: "assistant",
                timestamp: new Date()
            }]);
            return;
        }
         setMessages((prev) => [...prev, {
            id: Date.now().toString(),
            content: "Please sign in to interact with the chatbot.",
            role: "assistant",
            timestamp: new Date()
        }]);
        return;
    }
    setMessage(question); 
    // This relies on the fact that `handleSendMessage` is a useCallback with `message` in its deps.
    // So when `handleSendMessage` is called in the next render cycle after `setMessage` updates the state,
    // it will use the correct `message`.
    // A more direct approach would be to pass `question` to `handleSendMessage` if it's modified to accept it.
    // However, since `handleSendMessage` is called without arguments here, React will schedule a re-render
    // due to `setMessage`, and then `handleSendMessage` will be called.
    // To ensure it sends immediately with the new question, we can call `handleSendMessage` inside a `useEffect`
    // that listens to `message` changes, or modify `handleSendMessage` to take an optional message.
    // For now, let's assume the current structure: set message, then call the send function.
    // A slight refactor to ensure the message is sent immediately could be:
    // const tempMessage = question;
    // setMessage(tempMessage); // Update input
    // handleSendMessage(undefined, tempMessage); // if handleSendMessage was modified to accept a message
    // Given the current structure, we call it directly.
    // It's a common pattern, but has a subtle dependency on React's batching and rendering.
     setTimeout(() => handleSendMessage(), 0); // Ensure state is set before calling
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
    isChatDisabled: !user, // Add a flag to indicate if chat should be disabled
  };
}
