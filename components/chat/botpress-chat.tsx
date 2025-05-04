"use client"

import { useEffect, useState } from "react"

export function BotpressChat() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return

    // Load the Botpress script
    const loadBotpress = async () => {
      try {
        // Check if Botpress is already loaded
        if (window.botpressWebChat) {
          setIsLoaded(true)
          return
        }

        // Create and load the script
        const script = document.createElement("script")
        script.src = "https://cdn.botpress.cloud/webchat/v2.4/inject.js"
        script.async = true
        script.onload = () => {
          console.log("Botpress script loaded")

          // Wait a moment to ensure everything is initialized
          setTimeout(() => {
            if (window.botpressWebChat) {
              try {
                window.botpressWebChat.init({
                  composerPlaceholder: "Chat with LegalSathi",
                  botConversationDescription: "Legal Assistant Bot",
                  botId: "37MIVWKZ",
                  hostUrl: "https://cdn.botpress.cloud/webchat/v2.4",
                  messagingUrl: "https://messaging.botpress.cloud",
                  clientId: "37MIVWKZ",
                  webhookId: "37MIVWKZ",
                  lazySocket: true,
                  themeName: "prism",
                  frontendVersion: "v2.4",
                  showPoweredBy: false,
                  theme: "light",
                  themeColor: "#2563EB",
                })
                setIsLoaded(true)
                console.log("Botpress WebChat initialized")
              } catch (err) {
                console.error("Error initializing Botpress:", err)
                setError("Failed to initialize chat")
              }
            } else {
              setError("Botpress WebChat not available")
            }
          }, 1000)
        }

        script.onerror = () => {
          console.error("Error loading Botpress script")
          setError("Failed to load chat")
        }

        document.body.appendChild(script)
      } catch (err) {
        console.error("Error setting up Botpress:", err)
        setError("Failed to set up chat")
      }
    }

    loadBotpress()

    // Cleanup function
    return () => {
      // Clean up any listeners or resources if needed
    }
  }, [])

  // The component doesn't render anything visible
  // It just handles the script loading and initialization
  return null
}

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    botpressWebChat?: {
      init: (config: any) => void
    }
  }
}
