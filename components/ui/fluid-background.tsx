"use client"

import { useEffect, useRef } from "react"

export function FluidBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return

    // Check if GSAP is available
    if (typeof window.gsap === "undefined") {
      console.warn("GSAP not found, fluid background animation disabled")
      return
    }

    try {
      const { gsap } = window
      const container = containerRef.current
      if (!container) return

      // Create blobs
      const blobs = Array.from({ length: 3 }).map((_, i) => {
        const blob = document.createElement("div")
        blob.className = `absolute rounded-full blur-3xl opacity-20 ${
          i === 0 ? "bg-blue-500" : i === 1 ? "bg-indigo-500" : "bg-purple-500"
        }`
        container.appendChild(blob)
        return blob
      })

      // Set initial positions and sizes
      blobs.forEach((blob, i) => {
        const size = 300 + Math.random() * 300
        gsap.set(blob, {
          width: size,
          height: size,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        })
      })

      // Animate blobs
      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          x: `random(0, ${window.innerWidth})`,
          y: `random(0, ${window.innerHeight})`,
          duration: 20 + i * 5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      })

      // Cleanup
      return () => {
        blobs.forEach((blob) => {
          if (blob.parentNode) {
            blob.parentNode.removeChild(blob)
          }
        })
      }
    } catch (error) {
      console.error("Error in fluid background:", error)
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true" />
}

// Add TypeScript interface for the global window object
declare global {
  interface Window {
    gsap?: any
  }
}
