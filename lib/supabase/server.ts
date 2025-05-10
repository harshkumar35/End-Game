import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/types/database.types"

// This function is used in App Router (Server Components)
export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({
    cookies,
    options: {
      auth: {
        // Hardcode the site URL to ensure it's always used
        site: "https://v0-legalsathi.vercel.app",
      },
    },
  })
}
