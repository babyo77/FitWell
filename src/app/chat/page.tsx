"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { SendIcon, ImagePlus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your FitWell AI assistant. How can I help you with your fitness journey today?",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setMessages([...messages, { role: "user", content: newMessage }]);
      setNewMessage("");
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://fitwell-backend.onrender.com/chatbot/ask/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prev_question: messages?.[messages?.length - 1]?.content,
              prev_answer: messages?.[messages?.length - 2]?.content,
              question: newMessage,
              additional_info: {
                displayName: user?.displayName,

                goal: user?.goal,
                age: user?.age,
                gender: user?.gender,
                weight: user?.weight,
                height: user?.height,
                preferences: user?.preferences,

                healthIssues: user?.healthIssues,
                nationality: user?.nationality,
              },
            }),
          }
        );

        const data = await response.json();
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
          },
        ]);
      } catch (error) {
        setIsLoading(false);
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
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-black text-white rounded-tr-none"
                  : "bg-gray-100 text-black rounded-tl-none"
              }`}
            >
              {message.role === "user" ? (
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              ) : (
                <div className="markdown-content prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-headings:mt-4 prose-h3:text-base prose-h3:font-semibold prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          {...props}
                          className="text-lg font-bold mt-2 mb-2"
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          {...props}
                          className="text-base font-bold mt-3 mb-2"
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          {...props}
                          className="text-sm font-semibold mt-2 mb-1"
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p {...props} className="mb-2 text-sm" />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          {...props}
                          className="list-disc pl-4 mb-2 text-sm"
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          {...props}
                          className="list-decimal pl-4 mb-2 text-sm"
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li {...props} className="mb-1" />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong {...props} className="font-semibold" />
                      ),
                      em: ({ node, ...props }) => (
                        <em {...props} className="italic" />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          {...props}
                          className="border-l-2 border-gray-300 pl-4 my-2 italic"
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-black rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-black rounded-full animate-bounce"></div>
                <span className="text-sm ml-2">FitWell AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-3 bg-white">
        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon" className="rounded-full">
            <ImagePlus className="h-5 w-5 text-gray-500" />
          </Button> */}

          <div className="flex-1 flex items-center gap-2 border rounded-full px-4 py-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
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
