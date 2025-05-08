"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"
import type React from "react"

import { useBotpress } from "@/components/chat/botpress-provider"

export function AiSearchBar() {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()
  const searchBarRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const botpress = useBotpress()

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      // Redirect to AI assistant page with query
      router.push(`/ai-assistant?query=${encodeURIComponent(query.trim())}`)
    } else {
      // If empty query, just open the chat
      botpress.openChat()
    }
  }

  // Add animation effects
  useEffect(() => {
    if (!searchBarRef.current) return

    // Initial animation
    gsap.fromTo(
      searchBarRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out" },
    )

    // Glow animation
    const glowAnimation = gsap.to(searchBarRef.current, {
      boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    return () => {
      glowAnimation.kill()
    }
  }, [])

  // Focus animation
  useEffect(() => {
    if (!searchBarRef.current) return

    if (isFocused) {
      gsap.to(searchBarRef.current, {
        boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(searchBarRef.current, {
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [isFocused])

  return (
    <div className="w-full max-w-2xl mx-auto mt-10" ref={searchBarRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative overflow-hidden rounded-full backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask any legal question..."
            className="w-full h-16 pl-16 pr-16 bg-transparent text-white placeholder-white/50 text-lg focus:outline-none"
          />
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
            <Search className="h-6 w-6 text-blue-400" />
          </div>
          <button
            type="submit"
            disabled={!query.trim()}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full transition-all duration-300 ${
              query.trim() ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-white/10 text-white/50"
            }`}
            aria-label="Search"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>
      <p className="text-center text-white/70 text-sm mt-3">
        Try "What is a non-disclosure agreement?" or "How to file for divorce?"
      </p>
    </div>
  )
}
