import { NextResponse } from "next/server"
import { createServiceSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, fullName, role } = body

    // Validate input
    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const supabase = createServiceSupabaseClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
      },
    })

    if (authError) {
      console.error("Auth creation error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create user profile
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role,
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Don't fail the request if profile creation fails
    }

    // If user is a lawyer, create lawyer profile
    if (role === "lawyer") {
      const { error: lawyerProfileError } = await supabase.from("lawyer_profiles").insert({
        user_id: authData.user.id,
        specialization: "General Practice",
        experience_years: 0,
        hourly_rate: 0,
        bio: "I am a lawyer specializing in various legal matters.",
        is_available: true,
      })

      if (lawyerProfileError) {
        console.error("Lawyer profile creation error:", lawyerProfileError)
        // Don't fail the request if lawyer profile creation fails
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName,
        role,
      },
    })
  } catch (error: any) {
    console.error("Registration API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
