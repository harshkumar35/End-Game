"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useBotpress } from "@/components/chat/botpress-provider"

export function AiSearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { openChat } = useBotpress()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/ai-assistant?query=${encodeURIComponent(query.trim())}`)
    } else {
      // If empty query, just open the chat
      openChat()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a legal question or search for information..."
            className="w-full h-14 px-5 pr-16 rounded-full bg-background/20 backdrop-blur-md border border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 text-foreground placeholder:text-foreground/50 shadow-lg"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
      </form>
      <p className="text-center text-sm mt-2 text-foreground/70">
        Try "What is a non-disclosure agreement?" or{" "}
        <button onClick={openChat} className="text-primary hover:underline focus:outline-none">
          chat with our AI assistant
        </button>
      </p>
    </div>
  )
}
