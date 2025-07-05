import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/types/database.types"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    })

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_error`)
      }

      if (data.user) {
        // Ensure user profile exists
        const { data: existingUser } = await supabase.from("users").select("id").eq("id", data.user.id).single()

        if (!existingUser) {
          // Create user profile
          const { error: profileError } = await supabase.from("users").insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || data.user.email!.split("@")[0],
            role: data.user.user_metadata?.role || "client",
          })

          if (profileError) {
            console.error("Error creating user profile:", profileError)
          }

          // If user is a lawyer, create lawyer profile
          if (data.user.user_metadata?.role === "lawyer") {
            const { error: lawyerProfileError } = await supabase.from("lawyer_profiles").insert({
              user_id: data.user.id,
              specialization: "General Practice",
              experience_years: 0,
              hourly_rate: 0,
              bio: "I am a lawyer specializing in various legal matters.",
              is_available: true,
            })

            if (lawyerProfileError) {
              console.error("Error creating lawyer profile:", lawyerProfileError)
            }
          }
        }
      }

      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    } catch (error) {
      console.error("Unexpected error in auth callback:", error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=callback_error`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code_provided`)
}
