"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/lib/supabase/provider"
import { Loader2 } from "lucide-react"

export default function AIAssistantPage() {
  const { user } = useSupabase()
  const [hasUsedFreeSession, setHasUsedFreeSession] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    // Check if user has used their free session
    const checkFreeSession = () => {
      const freeSessionUsed = localStorage.getItem("freeAISessionUsed")
      setHasUsedFreeSession(freeSessionUsed === "true")
      setIsLoading(false)
    }

    checkFreeSession()
  }, [user])

  const handleStartFreeSession = () => {
    localStorage.setItem("freeAISessionUsed", "true")
    setHasUsedFreeSession(true)
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">AI Legal Assistant</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : user || !hasUsedFreeSession ? (
        <div className="space-y-8">
          {!user && !showLoginPrompt && (
            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-600 dark:text-amber-400"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-amber-800 dark:text-amber-300">Free Trial Session</p>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      You're using your one-time free session. To continue using the AI Legal Assistant after this
                      session, please sign up or log in.
                    </p>
                    <Button
                      variant="link"
                      className="text-amber-800 dark:text-amber-300 p-0 h-auto font-medium"
                      onClick={() => setShowLoginPrompt(true)}
                    >
                      Sign up now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {showLoginPrompt ? (
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle>Continue with LegalSathi</CardTitle>
                <CardDescription>
                  Sign up or log in to continue using the AI Legal Assistant and access all features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="flex-1">
                    <a href="/register">Sign Up</a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href="/login">Log In</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {!user && !hasUsedFreeSession && (
                <div className="flex justify-center mb-6">
                  <Button
                    onClick={handleStartFreeSession}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                  >
                    Start Your Free Session
                  </Button>
                </div>
              )}

              {(user || hasUsedFreeSession) && (
                <div className="w-full h-[700px] rounded-lg overflow-hidden border shadow-lg bg-background">
                  <iframe
                    src="https://www.yeschat.ai/i/gpts-2OToSki9P3--AI-Lawyer"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    title="AI Legal Assistant"
                  />
                </div>
              )}
            </>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Legal Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get professional legal guidance on various matters from contracts to disputes.</p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Document Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Have your legal documents reviewed and get suggestions for improvements.</p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Legal Research</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Access comprehensive legal research on laws, regulations, and precedents.</p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">24/7 Assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get legal help anytime, anywhere with our AI-powered assistant.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle>Continue with LegalSathi</CardTitle>
            <CardDescription>
              You've used your free session. Sign up or log in to continue using the AI Legal Assistant.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <a href="/register">Sign Up</a>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <a href="/login">Log In</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
