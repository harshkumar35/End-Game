import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile"]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url)
    // Add the original URL as a query parameter to redirect back after login
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing login/register pages with a session, redirect to dashboard
  if ((req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
}
