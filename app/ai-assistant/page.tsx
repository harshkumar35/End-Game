"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Bot, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AIAssistantPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("query") || ""

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState(initialQuery)
  const [isLoading, setIsLoading] = useState(false)

  // Add initial message from the system
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm your LegalSathi AI assistant. How can I help you with your legal questions today?",
      },
    ])

    // If there's an initial query, process it
    if (initialQuery) {
      handleInitialQuery(initialQuery)
    }
  }, [initialQuery])

  const handleInitialQuery = async (query: string) => {
    setMessages((prev) => [...prev, { role: "user", content: query }])

    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'll help you with your question about "${query}". Please note that I'm a demo assistant and my responses are simulated. In a real implementation, this would connect to an AI service.`,
        },
      ])
      setIsLoading(false)
    }, 1500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])

    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Thank you for your question. This is a simulated response to "${input}". In a production environment, this would connect to an AI service to provide accurate legal information.`,
        },
      ])
      setIsLoading(false)
      setInput("")
    }, 1500)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card className="border-primary/20 bg-black/50 backdrop-blur-md border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bot className="h-6 w-6 text-blue-400" />
            LegalSathi AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto p-2">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.role === "assistant"
                      ? "bg-blue-950/50 border border-blue-800/50 p-3 rounded-lg rounded-tl-none"
                      : "bg-blue-600 p-3 rounded-lg rounded-tr-none"
                  }`}
                >
                  {message.role === "assistant" && <Bot className="h-5 w-5 mt-1 flex-shrink-0 text-blue-400" />}
                  <div className="break-words text-white">{message.content}</div>
                  {message.role === "user" && <User className="h-5 w-5 mt-1 flex-shrink-0 text-white" />}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-blue-950/50 border border-blue-800/50 p-3 rounded-lg rounded-tl-none flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-400" />
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your legal question..."
              className="flex-1 bg-blue-950/30 border-blue-800/50 text-white placeholder:text-white/50"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
