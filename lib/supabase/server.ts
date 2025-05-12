import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/types/database.types"
import { getSiteUrl } from "@/lib/utils/get-site-url"

// This function is used in App Router (Server Components)
export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({
    cookies,
    options: {
      auth: {
        // Always use the production URL for auth redirects
        site: getSiteUrl(),
      },
    },
  })
}
