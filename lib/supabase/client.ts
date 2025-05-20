import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/types/database.types"
import { getSiteUrl } from "@/lib/utils/get-site-url"

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
            // Always use the production URL for auth redirects
            site: getSiteUrl(),
            // Add a small amount of random jitter to refresh times to prevent multiple simultaneous refreshes
            flowType: "pkce",
          },
          global: {
            headers: {
              "x-client-info": `legalsathi/${process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}`,
            },
          },
          realtime: {
            reconnectMaxRetries: 3,
          },
        },
      })

      // Add a custom error handler for auth errors
      const originalAuthRequest = supabaseClient.auth.api?.request
      if (originalAuthRequest) {
        supabaseClient.auth.api.request = async (method, url, options) => {
          try {
            return await originalAuthRequest(method, url, options)
          } catch (error) {
            console.error("Auth API request error:", error)

            // If it's a refresh token error, clear the session
            if (error.message?.includes("refresh_token_already_used") || error.code === "refresh_token_already_used") {
              console.log("Refresh token already used, clearing session")
              await supabaseClient.auth.signOut({ scope: "local" })

              // If we're on the client, redirect to login
              if (typeof window !== "undefined") {
                window.location.href = "/login?error=session_expired"
              }
            }

            throw error
          }
        }
      }
    } catch (error) {
      console.error("Error creating Supabase client:", error)
      // Create a fallback client with minimal functionality
      supabaseClient = createClientComponentClient<Database>()
    }
  }
  return supabaseClient
}
