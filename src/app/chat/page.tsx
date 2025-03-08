"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { SendIcon, Mic, ImagePlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  // Static example messages
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your FitWell AI assistant. How can I help you with your fitness journey today?",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  // Add ref for messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add useEffect to scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // This is just for UI demonstration - no actual functionality
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setMessages([...messages, { role: "user", content: newMessage }]);
      setNewMessage("");

      try {
        const response = await fetch(
          "https://fitwell-backend.onrender.com/chatbot/ask/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: newMessage,
              additional_info: {
                ...user,
              },
            }),
          }
        );

        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
          },
        ]);
      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat header */}
      <div className="border-b p-4 bg-white">
        <h1 className="font-semibold text-lg">FitWell Assistant</h1>
        <p className="text-xs text-gray-500">
          Ask me anything about fitness, nutrition, or health
        </p>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 break-words ${
                message.role === "user"
                  ? "bg-black text-white rounded-tr-none"
                  : "bg-gray-100 text-black rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Add scroll anchor */}
      </div>

      {/* Input area */}
      <div className="border-t p-3 bg-white">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ImagePlus className="h-5 w-5 text-gray-500" />
          </Button>

          <div className="flex-1 flex items-center gap-2 border rounded-full px-4 py-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            variant="ghost"
            size="icon"
            className="rounded-full bg-black text-white hover:bg-gray-800"
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
