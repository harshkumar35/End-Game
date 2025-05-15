import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"
import type { Database } from "@/lib/types/database.types"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Error exchanging code for session:", error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, "https://v0-legalsathi.vercel.app"),
      )
    }

    // Check if this is a new user (from social login)
    if (data?.user && data.session) {
      // Get user metadata
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (userError && userError.code !== "PGRST116") {
        // PGRST116 is "no rows returned" error
        console.error("Error fetching user data:", userError)
      }

      // If user doesn't exist in our users table, create a new record
      if (!userData) {
        // Get user details from auth metadata
        const fullName =
          data.user.user_metadata.full_name ||
          data.user.user_metadata.name ||
          `${data.user.user_metadata.given_name || ""} ${data.user.user_metadata.family_name || ""}`.trim() ||
          data.user.email?.split("@")[0] ||
          "User"

        const role = data.user.user_metadata.role || "client"

        // Insert the user into our users table
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          role: role,
          avatar_url: data.user.user_metadata.avatar_url || data.user.user_metadata.picture || null,
        })

        if (insertError) {
          console.error("Error creating user profile:", insertError)
        } else {
          // If user is a lawyer, create a lawyer profile
          if (role === "lawyer") {
            const { error: lawyerProfileError } = await supabase.from("lawyer_profiles").insert({
              user_id: data.user.id,
              specialization: "",
              experience: 0,
              hourly_rate: 0,
              bio: `I am a lawyer specializing in various legal matters.`,
              is_available: true,
            })

            if (lawyerProfileError) {
              console.error("Error creating lawyer profile:", lawyerProfileError)
            }
          }
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, "https://v0-legalsathi.vercel.app"))
}
