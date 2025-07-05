import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "@/lib/types/database.types"

// For server components
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
    options: {
      auth: {
        site: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      },
    },
  })
}

// For route handlers
export function createRouteHandlerSupabaseClient() {
  const cookieStore = cookies()

  return createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
    options: {
      auth: {
        site: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      },
    },
  })
}

// Service role client for admin operations
export function createServiceSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
