"use client"

import { useEffect, useState } from "react"

export function BotpressChat() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return

    // Define a function to initialize Botpress
    const initBotpress = () => {
      try {
        if (window.botpressWebChat) {
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
            themeColor: "#9333ea", // Updated to match our purple theme
          })
          console.log("Botpress WebChat initialized")
          setIsLoaded(true)
        } else {
          console.error("Botpress WebChat not available")
          setError("Botpress WebChat not available")
        }
      } catch (err) {
        console.error("Error initializing Botpress:", err)
        setError("Failed to initialize chat")
      }
    }

    // Load the Botpress script
    const loadBotpress = () => {
      try {
        // Check if script is already added to DOM
        if (document.querySelector('script[src="https://cdn.botpress.cloud/webchat/v2.4/inject.js"]')) {
          console.log("Botpress script already loaded")
          // Wait for Botpress to be available
          if (window.botpressWebChat) {
            initBotpress()
          } else {
            // If already loaded but not initialized, try again after a delay
            const checkInterval = setInterval(() => {
              if (window.botpressWebChat) {
                clearInterval(checkInterval)
                initBotpress()
              }
            }, 500)

            // Clear interval after 10 seconds to prevent infinite checks
            setTimeout(() => clearInterval(checkInterval), 10000)
          }
          return
        }

        // Create and load the script
        const script = document.createElement("script")
        script.src = "https://cdn.botpress.cloud/webchat/v2.4/inject.js"
        script.async = true
        script.onload = () => {
          console.log("Botpress script loaded")

          // Wait a moment to ensure everything is initialized
          setTimeout(initBotpress, 1000)
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

    // Add a delay to ensure the page is fully loaded
    const timer = setTimeout(loadBotpress, 2000)

    // Cleanup function
    return () => {
      clearTimeout(timer)
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
