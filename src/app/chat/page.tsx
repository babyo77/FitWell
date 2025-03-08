"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendIcon, ImagePlus } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import ReactMarkdown from 'react-markdown'

export default function ChatPage() {
  // Static example messages
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your FitWell AI assistant. How can I help you with your fitness journey today?",
    },
    {
      role: "user",
      content: "I want to lose weight. Can you suggest a workout plan?",
    },
    {
      role: "assistant",
      content:
        "Of course! Based on your goal of weight loss, I'd recommend a combination of cardio and strength training. Here's a simple 3-day plan to get started:\n\n1. Day 1: 30 min cardio (walking, jogging, or cycling) + 15 min core exercises\n2. Day 2: Full body strength training with 3 sets of 12 reps for major muscle groups\n3. Day 3: 20 min HIIT workout + 10 min stretching\n\nWould you like more details on any of these workouts?",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // This is just for UI demonstration - no actual functionality
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { role: "user", content: newMessage }])
      setNewMessage("")

      // Simulate AI response after a short delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I'm a demo AI assistant. This is a placeholder response to demonstrate the UI.",
          },
        ])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4.1rem)]">
      {/* Chat header */}
      <div className="border-b p-4 bg-white">
        <h1 className="font-semibold text-lg">FitWell Assistant</h1>
        <p className="text-xs text-gray-500">Ask me anything about fitness, nutrition, or health</p>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 break-words ${
                message.role === "user"
                  ? "bg-black text-white rounded-tr-none"
                  : "bg-gray-100 text-black rounded-tl-none"
              }`}
            >
              <ReactMarkdown className="whitespace-pre-wrap break-words prose prose-invert dark:prose-invert max-w-none">
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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
                  e.preventDefault()
                  handleSendMessage()
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
  )
}
