"use client"

import { useEffect, useState, useRef } from "react"

export function BotpressChat() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initAttempts = useRef(0)
  const maxAttempts = 5
  const scriptLoaded = useRef(false)

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
          console.log("Botpress WebChat initialized successfully")
          setIsLoaded(true)
          return true
        } else {
          console.log("Botpress WebChat not available yet, waiting...")
          return false
        }
      } catch (err) {
        console.error("Error initializing Botpress:", err)
        setError(`Failed to initialize chat: ${err instanceof Error ? err.message : String(err)}`)
        return false
      }
    }

    // Function to attempt initialization with retries
    const attemptInitialization = () => {
      if (initAttempts.current >= maxAttempts) {
        console.error(`Failed to initialize Botpress after ${maxAttempts} attempts`)
        setError(`Failed to initialize chat after ${maxAttempts} attempts`)
        return
      }

      initAttempts.current += 1
      console.log(`Attempt ${initAttempts.current} to initialize Botpress`)

      if (initBotpress()) {
        // Successfully initialized
        console.log("Botpress initialization successful")
      } else {
        // Schedule another attempt
        setTimeout(attemptInitialization, 1000)
      }
    }

    // Load the Botpress script
    const loadBotpress = () => {
      try {
        // Check if script is already added to DOM
        if (document.querySelector('script[src="https://cdn.botpress.cloud/webchat/v2.4/inject.js"]')) {
          console.log("Botpress script already in DOM")
          scriptLoaded.current = true

          // Wait a bit before attempting initialization
          setTimeout(attemptInitialization, 1500)
          return
        }

        // Create and load the script
        const script = document.createElement("script")
        script.src = "https://cdn.botpress.cloud/webchat/v2.4/inject.js"
        script.async = true

        script.onload = () => {
          console.log("Botpress script loaded successfully")
          scriptLoaded.current = true

          // Wait a bit before attempting initialization
          setTimeout(attemptInitialization, 1500)
        }

        script.onerror = (e) => {
          console.error("Error loading Botpress script:", e)
          setError("Failed to load chat script")
        }

        document.body.appendChild(script)
      } catch (err) {
        console.error("Error setting up Botpress:", err)
        setError(`Failed to set up chat: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    // Add a delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      console.log("Starting Botpress loading sequence")
      loadBotpress()
    }, 2500)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      // Reset attempts if component unmounts
      initAttempts.current = 0
    }
  }, [])

  // The component doesn't render anything visible
  // It just handles the script loading and initialization
  return (
    <>
      {error && (
        <div className="hidden">
          {/* Hidden error message for debugging */}
          Error loading Botpress: {error}
        </div>
      )}
    </>
  )
}

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    botpressWebChat?: {
      init: (config: any) => void
    }
  }
}
