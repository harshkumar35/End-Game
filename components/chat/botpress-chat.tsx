"use client"

import { useEffect, useState } from "react"
import { MessageSquare } from "lucide-react"
import { useBotpress } from "./botpress-provider"

export function BotpressChat() {
  const { isLoaded, openChat } = useBotpress()
  const [showButton, setShowButton] = useState(false)

  // Only show the button after a delay to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!showButton) return null

  return (
    <button
      onClick={openChat}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label="Chat with AI Assistant"
      disabled={!isLoaded}
    >
      <MessageSquare className="h-6 w-6" />
    </button>
  )
}
