"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database.types"

type SupabaseContextType = {
  supabase: ReturnType<typeof createClientComponentClient<Database>>
  session: Session | null
  user: User | null
  isLoading: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClientComponentClient<Database>())
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session: activeSession },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setSession(null)
          setUser(null)
          return
        }

        setSession(activeSession)
        setUser(activeSession?.user || null)
      } catch (error) {
        console.error("Unexpected error during getSession:", error)
        setSession(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state changed:", event, newSession?.user?.email)

      setSession(newSession)
      setUser(newSession?.user || null)

      if (event === "SIGNED_IN" && newSession?.user) {
        // Ensure user profile exists
        try {
          const { data: existingUser } = await supabase.from("users").select("id").eq("id", newSession.user.id).single()

          if (!existingUser) {
            // Create user profile if it doesn't exist
            const { error: profileError } = await supabase.from("users").insert({
              id: newSession.user.id,
              email: newSession.user.email!,
              full_name: newSession.user.user_metadata?.full_name || newSession.user.email!.split("@")[0],
              role: newSession.user.user_metadata?.role || "client",
            })

            if (profileError) {
              console.error("Error creating user profile:", profileError)
            }
          }
        } catch (error) {
          console.error("Error checking/creating user profile:", error)
        }
      }

      if (event === "SIGNED_OUT") {
        router.push("/")
      }

      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return <SupabaseContext.Provider value={{ supabase, session, user, isLoading }}>{children}</SupabaseContext.Provider>
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}
