"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Info } from "lucide-react"
import Link from "next/link"
import { useSupabaseClient, useUser } from "@/lib/supabase/provider"
// Import the BotpressFallback component
import { BotpressFallback } from "@/components/chat/botpress-fallback"

export default function AIAssistantPage() {
  const [freeSessionUsed, setFreeSessionUsed] = useState(false)
  const [showIframe, setShowIframe] = useState(false)
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [botpressLoaded, setBotpressLoaded] = useState(false)
  const [botpressError, setBotpressError] = useState(false)

  // Add an effect to check if Botpress loads
  useEffect(() => {
    // Check if Botpress is loaded after a timeout
    const timer = setTimeout(() => {
      if (window.botpressWebChat) {
        setBotpressLoaded(true)
      } else {
        setBotpressError(true)
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Check if the user has used their free session
    const checkFreeSession = () => {
      const usedFreeSession = localStorage.getItem("freeSessionUsed")
      if (usedFreeSession === "true") {
        setFreeSessionUsed(true)
      }
    }

    checkFreeSession()

    // Always show iframe for logged-in users
    if (user) {
      setShowIframe(true)
    } else {
      // For non-logged in users, show iframe if they haven't used their free session
      setShowIframe(!freeSessionUsed)
    }
  }, [user, freeSessionUsed])

  const handleStartFreeSession = () => {
    localStorage.setItem("freeSessionUsed", "true")
    setFreeSessionUsed(true)
    setShowIframe(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Legal Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          Get instant answers to your legal questions, understand legal concepts, and receive guidance on common legal
          issues.
        </p>
      </div>

      {!user && !showIframe && !freeSessionUsed ? (
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-blue-500" />
                Try Our AI Legal Assistant
              </CardTitle>
              <CardDescription>You can try our AI Legal Assistant once without creating an account.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Our AI Legal Assistant can help you with:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li>Understanding legal terms and concepts</li>
                <li>Getting information about legal procedures</li>
                <li>Learning about your rights in various situations</li>
                <li>Drafting simple legal documents</li>
                <li>Finding relevant legal resources</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartFreeSession} className="w-full">
                Start Free Session
              </Button>
            </CardFooter>
          </Card>

          <div className="text-center">
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Want unlimited access to our AI Legal Assistant?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : !user && freeSessionUsed && !showIframe ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
              Free Session Used
            </CardTitle>
            <CardDescription>You've already used your free session.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Create an account or log in to continue using our AI Legal Assistant.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/register">Create Account</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              {botpressError && <BotpressFallback />}
              <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 h-[600px]">
                <iframe
                  src="https://www.yeschat.ai/i/gpts-2OToSki9P3--AI-Lawyer"
                  width="100%"
                  height="100%"
                  className="w-full h-full"
                  title="AI Legal Assistant"
                />
              </div>

              {!user && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">Using a free session</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        This is a limited free session. For unlimited access, please
                        <Link href="/register" className="text-blue-600 dark:text-blue-400 font-medium mx-1">
                          create an account
                        </Link>
                        or
                        <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium mx-1">
                          log in
                        </Link>
                        if you already have one.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About the AI Legal Assistant</CardTitle>
                  <CardDescription>How our AI can help with your legal questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-6">
                    <div className="flex items-start space-x-4">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Legal Information</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get information about laws, regulations, and legal procedures in simple language.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Document Assistance</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get help drafting simple legal documents like contracts, agreements, and letters.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Legal Research</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Find relevant legal resources, cases, and statutes related to your issue.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Rights Explanation</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Learn about your rights in various legal situations and contexts.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mt-6">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm">Important Disclaimer</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          The AI Legal Assistant provides general information and guidance only. It is not a substitute
                          for professional legal advice. For specific legal issues, please consult with a qualified
                          lawyer.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
