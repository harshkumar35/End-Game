"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type BotpressContextType = {
  isLoaded: boolean
  openChat: () => void
  closeChat: () => void
}

const BotpressContext = createContext<BotpressContextType>({
  isLoaded: false,
  openChat: () => {},
  closeChat: () => {},
})

export const useBotpress = () => useContext(BotpressContext)

export function BotpressProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if Botpress is loaded
    const checkBotpressLoaded = () => {
      if (typeof window !== "undefined" && window.botpressWebChat) {
        setIsLoaded(true)
        return true
      }
      return false
    }

    // Check immediately
    if (checkBotpressLoaded()) return

    // Set up an interval to check if Botpress is loaded
    const interval = setInterval(() => {
      if (checkBotpressLoaded()) {
        clearInterval(interval)
      }
    }, 500)

    // Clean up
    return () => clearInterval(interval)
  }, [])

  const openChat = () => {
    try {
      if (typeof window !== "undefined" && window.botpressWebChat) {
        window.botpressWebChat.sendEvent({ type: "show" })
      }
    } catch (error) {
      console.error("Error opening Botpress chat:", error)
    }
  }

  const closeChat = () => {
    try {
      if (typeof window !== "undefined" && window.botpressWebChat) {
        window.botpressWebChat.sendEvent({ type: "hide" })
      }
    } catch (error) {
      console.error("Error closing Botpress chat:", error)
    }
  }

  return <BotpressContext.Provider value={{ isLoaded, openChat, closeChat }}>{children}</BotpressContext.Provider>
}
