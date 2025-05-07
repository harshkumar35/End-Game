"use client"

import { useEffect, useState, useRef } from "react"
import Script from "next/script"

export function BotpressChat() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scriptLoaded = useRef(false)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return

    // Add a delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      console.log("Botpress scripts should be loaded via Script components")
    }, 1000)

    // Cleanup function
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {/* Load the Botpress scripts */}
      <Script
        src="https://cdn.botpress.cloud/webchat/v2.4/inject.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Botpress inject script loaded")
          scriptLoaded.current = true
        }}
        onError={(e) => {
          console.error("Error loading Botpress inject script:", e)
          setError("Failed to load chat script")
        }}
      />

      <Script
        src="https://files.bpcontent.cloud/2025/05/04/06/20250504065744-37MIVWKZ.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Botpress content script loaded")
          setIsLoaded(true)
        }}
        onError={(e) => {
          console.error("Error loading Botpress content script:", e)
          setError("Failed to load chat content")
        }}
      />

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
