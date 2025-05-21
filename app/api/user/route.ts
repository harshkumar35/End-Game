import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(null)
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
      return NextResponse.json(null)
    }

    return NextResponse.json({
      id: session.user.id,
      email: session.user.email,
      role: userData?.role || "client",
      name: userData?.full_name || session.user.user_metadata?.full_name,
      avatar_url: userData?.avatar_url || session.user.user_metadata?.avatar_url,
    })
  } catch (error) {
    console.error("Error in user API route:", error)
    return NextResponse.json(null, { status: 500 })
  }
}
