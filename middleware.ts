import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    // Handle auth errors gracefully
    if (error) {
      console.error("Auth error in middleware:", error)

      // If it's a refresh token error, redirect to login
      if (
        error.message?.includes("refresh_token_already_used") ||
        (error as any)?.code === "refresh_token_already_used"
      ) {
        // Clear cookies by setting them to expire in the past
        res.cookies.set("sb-access-token", "", {
          expires: new Date(0),
          path: "/",
        })
        res.cookies.set("sb-refresh-token", "", {
          expires: new Date(0),
          path: "/",
        })

        // Redirect to login with error message
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent("Your session has expired. Please log in again.")}`, req.url),
        )
      }
    }

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
  } catch (error) {
    console.error("Exception in middleware:", error)
    // For critical errors, redirect to login
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("An error occurred. Please log in again.")}`, req.url),
    )
  }

  return res
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
}
