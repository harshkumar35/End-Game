"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { BotpressFallback } from "./botpress-fallback"

declare global {
  interface Window {
    botpressWebChat: {
      init: (config: any) => void
      onEvent: (event: string, handler: (event: any) => void) => void
      sendEvent: (payload: any) => void
    }
  }
}

export function BotpressChat() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if Botpress is loaded
    const checkBotpressLoaded = () => {
      if (window.botpressWebChat) {
        setIsLoaded(true)
        return true
      }
      return false
    }

    // Try to initialize Botpress
    const initializeBotpress = () => {
      if (checkBotpressLoaded()) {
        try {
          // Listen for the ready event
          window.botpressWebChat.onEvent("webchatReady", () => {
            console.log("Botpress webchat is ready")
            setIsVisible(true)
          })

          // Listen for errors
          window.botpressWebChat.onEvent("webchatError", (error) => {
            console.error("Botpress webchat error:", error)
            setIsError(true)
          })

          return true
        } catch (error) {
          console.error("Error initializing Botpress:", error)
          setIsError(true)
          return false
        }
      }
      return false
    }

    // Try to initialize immediately
    if (!initializeBotpress()) {
      // If not loaded yet, try again after a delay
      const interval = setInterval(() => {
        if (initializeBotpress()) {
          clearInterval(interval)
        }
      }, 500)

      // Set a timeout to stop trying after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(interval)
        if (!isLoaded) {
          console.error("Botpress failed to load after timeout")
          setIsError(true)
        }
      }, 10000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [])

  // Show loading state while Botpress is initializing
  if (!isLoaded && !isError) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-background/80 backdrop-blur-sm p-4 rounded-full shadow-lg">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  // Show fallback if there was an error
  if (isError) {
    return <BotpressFallback />
  }

  // Botpress is loaded and initialized
  return null // Botpress injects its own UI
}
