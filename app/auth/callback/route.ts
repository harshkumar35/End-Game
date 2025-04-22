import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the current origin for proper redirection
    const origin = requestUrl.origin

    // Redirect to login with a success message
    return NextResponse.redirect(`${origin}/login?message=confirmed`)
  }

  // If no code, redirect to the home page
  return NextResponse.redirect(new URL("/", request.url))
}
