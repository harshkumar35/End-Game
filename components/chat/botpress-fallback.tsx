"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { MessageSquare } from "lucide-react"

export function BotpressFallback() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full p-3 shadow-lg elemental-water"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 glass backdrop-blur-md rounded-lg shadow-lg border border-white/10 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-primary/20">
        <h3 className="font-medium">LegalSathi Assistant</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          ×
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-primary/10 p-3 rounded-lg mb-4 max-w-[80%]">
          Hello! I'm your legal assistant. Unfortunately, our chat service is currently unavailable. Please try again
          later or contact us through the contact page.
        </div>
      </div>

      <div className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Message unavailable..."
            className="flex-1 p-2 rounded bg-background/50 border border-white/10"
            disabled
          />
          <Button size="sm" disabled>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
