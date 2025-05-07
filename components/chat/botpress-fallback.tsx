"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X } from "lucide-react"

export function BotpressFallback() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // In a real implementation, this would send the message to a fallback service
      alert(
        "Our chat service is currently unavailable. Please try again later or contact us directly at harshku612810@gmail.com",
      )
      setMessage("")
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary/90 shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 shadow-lg border border-border/50 bg-background/95 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <CardTitle className="text-base font-medium">LegalSathi Assistant</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-80 overflow-y-auto space-y-4 mb-4">
          <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
            <p className="text-sm">Hello! I'm your LegalSathi assistant. How can I help you today?</p>
          </div>
          <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
            <p className="text-sm">
              Our chat service is currently experiencing technical difficulties. Please try again later or contact us
              directly at harshku612810@gmail.com
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" className="h-10 w-10">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
