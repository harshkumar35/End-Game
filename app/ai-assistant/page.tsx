"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Bot } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AIAssistantPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("query") || ""
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for iframe
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card className="border-primary/20 bg-black/50 backdrop-blur-md border border-white/10 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bot className="h-6 w-6 text-blue-400" />
            LegalSathi AI Assistant
            {initialQuery && (
              <span className="text-sm font-normal text-blue-300/70 ml-2">- Initial query: {initialQuery}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-[500px] bg-blue-950/30">
              <div className="flex flex-col items-center">
                <div className="flex space-x-2 mb-3">
                  <div
                    className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <p className="text-blue-300">Loading AI Assistant...</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-[500px] overflow-hidden">
              <iframe
                src="https://www.yeschat.ai/i/gpts-2OToO8ZwBs-Lawyer-GPT"
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="Legal AI Assistant"
                allow="microphone"
              ></iframe>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
