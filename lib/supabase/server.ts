import { cookies } from "next/headers"
import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/database.types"

/* -------------------------------------------------------------------------- */
/*  ENV CHECKS                                                                */
/* -------------------------------------------------------------------------- */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
}
if (!SUPABASE_SERVICE_KEY) {
  console.warn("[Supabase] SUPABASE_SERVICE_ROLE_KEY is missing – service-role helpers will throw if used.")
}

/* -------------------------------------------------------------------------- */
/*  1.  SERVER COMPONENT / SERVER ACTION CLIENT                               */
/* -------------------------------------------------------------------------- */

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })
}

/* -------------------------------------------------------------------------- */
/*  2.  ROUTE HANDLER CLIENT (API / app/api/*)                                */
/* -------------------------------------------------------------------------- */

export function createRouteHandlerSupabaseClient() {
  const cookieStore = cookies()

  return createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  })
}

/* -------------------------------------------------------------------------- */
/*  3.  SERVICE-ROLE CLIENT (⚠️ POWERFUL; NO RLS)                               */
/* -------------------------------------------------------------------------- */

export function createServiceSupabaseClient() {
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY env var is required")
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
