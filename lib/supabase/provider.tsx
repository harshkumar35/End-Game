"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientSupabaseClient } from "./client"
import type { SupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database.types"

type SupabaseContext = {
  supabase: SupabaseClient<Database>
  user: User | null
  isLoading: boolean
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClientSupabaseClient())
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setIsLoading(false)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  return <Context.Provider value={{ supabase, user, isLoading }}>{children}</Context.Provider>
}

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
