"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient, User } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database.types"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
  user: User | null
  isLoading: boolean
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)

      if (event === "SIGNED_IN") {
        router.refresh()
      }

      if (event === "SIGNED_OUT") {
        router.refresh()
      }
    })

    // Initial session check
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setIsLoading(false)
    }

    initializeAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return <Context.Provider value={{ supabase, user, isLoading }}>{children}</Context.Provider>
}

export function useSupabase() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
