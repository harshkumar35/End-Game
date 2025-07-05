import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/types/database.types"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_error`)
      }

      if (data.user) {
        // Check if user profile exists
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("id, role")
          .eq("id", data.user.id)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetching user profile:", fetchError)
        }

        // Create user profile if it doesn't exist
        if (!existingUser) {
          const { error: insertError } = await supabase.from("users").insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || data.user.email!.split("@")[0],
            role: data.user.user_metadata?.role || "client",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error creating user profile:", insertError)
          }

          // If user is a lawyer, create lawyer profile
          if (data.user.user_metadata?.role === "lawyer") {
            const { error: lawyerError } = await supabase.from("lawyer_profiles").insert({
              user_id: data.user.id,
              specialization: data.user.user_metadata?.specialization || [],
              experience_years: 0,
              location: "",
              is_verified: false,
              is_available: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

            if (lawyerError) {
              console.error("Error creating lawyer profile:", lawyerError)
            }
          }
        }

        // Redirect based on user role
        const userRole = existingUser?.role || data.user.user_metadata?.role || "client"
        const redirectUrl = userRole === "lawyer" ? "/dashboard" : next

        return NextResponse.redirect(`${requestUrl.origin}${redirectUrl}`)
      }
    } catch (error) {
      console.error("Unexpected error in auth callback:", error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=server_error`)
    }
  }

  // If no code, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}
