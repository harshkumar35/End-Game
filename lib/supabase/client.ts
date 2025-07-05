"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database.types"

/**
 * Client-side Supabase clients for different use cases:
 * 1. Component client for React components
 * 2. Browser client for direct usage
 * 3. Service client for admin operations
 */

/* -------------------------------------------------------------------------- */
/*  1. Component Client (for React Components)                                */
/* -------------------------------------------------------------------------- */

let componentClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function getSupabaseClient() {
  if (!componentClient) {
    componentClient = createClientComponentClient<Database>()
  }
  return componentClient
}

/* -------------------------------------------------------------------------- */
/*  2. Direct Browser Client                                                  */
/* -------------------------------------------------------------------------- */

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
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
  })
}

/* -------------------------------------------------------------------------- */
/*  3. Service Client (Admin Operations)                                      */
/* -------------------------------------------------------------------------- */

export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase service role environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/* -------------------------------------------------------------------------- */
/*  4. Legacy Support                                                         */
/* -------------------------------------------------------------------------- */

// For backward compatibility
export const createClientSupabaseClient = getSupabaseClient
export const createSupabaseClient = createBrowserClient
