import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/types/database.types"
import { getSiteUrl } from "@/lib/utils/get-site-url"

// This function is used in App Router (Server Components)
export function createServerSupabaseClient() {
  // Dynamically import cookies only when this function is called
  // This prevents webpack from including it at build time
  try {
    // Only import cookies when needed (at runtime)
    const { cookies } = require("next/headers")

    return createServerComponentClient<Database>({
      cookies,
      options: {
        auth: {
          site: getSiteUrl(),
        },
      },
    })
  } catch (error) {
    // If we're in an environment where next/headers is not available (pages directory)
    console.error("Error creating server Supabase client:", error)
    throw new Error(
      "This function can only be used in a Server Component within the app directory. " +
        "For pages directory, use createServerSideSupabaseClient instead.",
    )
  }
}

// This version works in pages directory (getServerSideProps)
export function createServerSideSupabaseClient(context: { req: any; res: any }) {
  const { createServerComponentClient } = require("@supabase/auth-helpers-nextjs")

  return createServerComponentClient<Database>({
    cookies: () => {
      const cookies = context.req.cookies || {}
      return {
        getAll: () =>
          Object.entries(cookies).map(([name, value]) => ({
            name,
            value: value as string,
          })),
        get: (name: string) => ({
          name,
          value: cookies[name] as string,
        }),
      }
    },
    options: {
      auth: {
        site: getSiteUrl(),
      },
    },
  })
}
