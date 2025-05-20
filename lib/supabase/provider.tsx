"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { createClientSupabaseClient } from "./client"
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database.types"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
  user: User | null
  isLoading: boolean
}

// Create a singleton instance of the Supabase client
const supabaseClient = createClientSupabaseClient()

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshingRef = useRef(false)
  const refreshAttempts = useRef(0)
  const maxRefreshAttempts = 3

  // Use the singleton instance instead of creating a new one
  const supabase = supabaseClient

  useEffect(() => {
    let isMounted = true
    let authListener: { subscription: { unsubscribe: () => void } } | null = null

    // Use a single auth session check instead of multiple calls
    const checkSession = async () => {
      if (refreshingRef.current) return

      try {
        refreshingRef.current = true
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting auth session:", error)

          // Handle refresh token error specifically
          if (
            error.message?.includes("refresh_token_already_used") ||
            (error as any)?.code === "refresh_token_already_used"
          ) {
            refreshAttempts.current += 1

            if (refreshAttempts.current <= maxRefreshAttempts) {
              console.log(
                `Refresh token error, clearing session. Attempt ${refreshAttempts.current}/${maxRefreshAttempts}`,
              )

              // Clear the session and cookies to force a fresh login
              await supabase.auth.signOut({ scope: "local" })

              if (isMounted) {
                setUser(null)
                setIsLoading(false)
              }

              // If we're on the client, redirect to login after a short delay
              if (typeof window !== "undefined") {
                setTimeout(() => {
                  window.location.href = "/login?error=session_expired"
                }, 500)
              }
            }
          } else {
            if (isMounted) {
              setUser(null)
              setIsLoading(false)
            }
          }

          refreshingRef.current = false
          return
        }

        if (isMounted) {
          setUser(data.session?.user || null)
          setIsLoading(false)
        }

        refreshAttempts.current = 0
        refreshingRef.current = false
      } catch (error) {
        console.error("Exception checking auth session:", error)
        if (isMounted) {
          setUser(null)
          setIsLoading(false)
        }
        refreshingRef.current = false
      }
    }

    // Add a small delay to prevent rate limiting
    const timer = setTimeout(() => {
      checkSession()
    }, 100)

    // Set up the auth state change listener with error handling
    try {
      const { data, error } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (error) {
          console.error("Auth state change error:", error)
          return
        }

        // Handle token refresh events specifically
        if (event === "TOKEN_REFRESHED") {
          console.log("Token was refreshed successfully")
        }

        if (isMounted) {
          setUser(session?.user || null)
          setIsLoading(false)
        }
      })

      if (error) {
        console.error("Error setting up auth listener:", error)
      } else {
        authListener = data
      }
    } catch (error) {
      console.error("Exception setting up auth listener:", error)
    }

    return () => {
      isMounted = false
      clearTimeout(timer)
      if (authListener?.subscription) {
        try {
          authListener.subscription.unsubscribe()
        } catch (error) {
          console.error("Error unsubscribing from auth listener:", error)
        }
      }
    }
  }, [supabase.auth])

  return <Context.Provider value={{ supabase, user, isLoading }}>{children}</Context.Provider>
}

// Use a memoized context to prevent unnecessary re-renders
export function useSupabase() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}

// Add the missing exports
export function useSupabaseClient() {
  const { supabase } = useSupabase()
  return supabase
}

export function useUser() {
  const { user } = useSupabase()
  return user
}
