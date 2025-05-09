import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/types/database.types"

// This function is used in App Router (Server Components)
export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({
    cookies,
    options: {
      auth: {
        // Set the site URL to your production domain
        site: process.env.NEXT_PUBLIC_SITE_URL || "https://legalsathi.com",
      },
    },
  })
}
