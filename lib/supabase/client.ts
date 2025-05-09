import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/types/database.types"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function createClientSupabaseClient() {
  if (!supabaseClient) {
    try {
      supabaseClient = createClientComponentClient<Database>({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        options: {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            site: "https://v0-legalsathi.vercel.app",
          },
        },
      })
    } catch (error) {
      console.error("Error creating Supabase client:", error)
      // Create a fallback client with minimal functionality
      supabaseClient = createClientComponentClient<Database>()
    }
  }
  return supabaseClient
}
