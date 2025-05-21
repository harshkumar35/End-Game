"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/lib/supabase/provider"
import type { UserData } from "@/lib/utils/auth-utils"

export function useUser() {
  const { supabase, user: authUser } = useSupabase()
  const [user, setUser] = useState<UserData>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadUser() {
      if (!authUser) {
        setUser(null)
        setIsLoading(false)
        return
      }

      try {
        // Get user profile data
        const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        if (error) throw error

        setUser({
          id: authUser.id,
          email: authUser.email || "",
          role: data?.role || "client",
          name: data?.full_name || authUser.user_metadata?.full_name,
          avatar_url: data?.avatar_url || authUser.user_metadata?.avatar_url,
        })
      } catch (err) {
        console.error("Error loading user:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [authUser, supabase])

  return { user, isLoading, error }
}
