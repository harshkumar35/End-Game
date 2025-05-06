"use client"

import { useRef } from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSupabase } from "@/lib/supabase/provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Menu, User, ChevronDown, X } from "lucide-react"
import { gsap } from "gsap"

export function Navbar() {
  const pathname = usePathname()
  const { supabase, user, isLoading } = useSupabase()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    if (isSigningOut) return

    try {
      setIsSigningOut(true)
      await supabase.auth.signOut()
      // Use a more reliable way to navigate
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
    }
  }

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Mobile menu animation with GSAP
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMenuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        )
      }
    }
  }, [isMenuOpen])

  // Add error boundary for the component
  useEffect(() => {
    const originalError = console.error
    console.error = (...args) => {
      // Check if this is an auth-related error or Botpress error
      const errorString = args.join(" ")
      if (
        errorString.includes("auth") ||
        errorString.includes("supabase") ||
        errorString.includes("Botpress") ||
        errorString.includes("botpress")
      ) {
        // Log but don't crash the component
        originalError("Error caught by Navbar error boundary:", ...args)
      } else {
        originalError(...args)
      }
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? "backdrop-blur-md border-b border-white/5" : ""
      }`}
    >
      <div className="halo-container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-foreground">LegalSathi</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/services" className={`halo-nav-link ${pathname === "/services" ? "halo-nav-link-active" : ""}`}>
            services
          </Link>
          <Link href="/lawyers" className={`halo-nav-link ${pathname === "/lawyers" ? "halo-nav-link-active" : ""}`}>
            lawyers
          </Link>
          <Link
            href="/legal-news"
            className={`halo-nav-link ${pathname === "/legal-news" ? "halo-nav-link-active" : ""}`}
          >
            news
          </Link>
          <Link href="/posts" className={`halo-nav-link ${pathname === "/posts" ? "halo-nav-link-active" : ""}`}>
            community
          </Link>
          <Link href="/contact" className={`halo-nav-link ${pathname === "/contact" ? "halo-nav-link-active" : ""}`}>
            contact
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {isLoading ? (
            <div className="w-20 h-9 bg-muted rounded-md animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2 border-white/10">
                  <User size={16} />
                  <span>Account</span>
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border border-white/10">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="halo-button">Get started</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-muted/30"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden fixed inset-0 z-50 bg-background pt-16">
          <div className="halo-container py-8">
            <nav className="flex flex-col space-y-6">
              <Link href="/services" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Services
              </Link>
              <Link href="/lawyers" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Lawyers
              </Link>
              <Link href="/legal-news" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                News
              </Link>
              <Link href="/posts" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Community
              </Link>
              <Link href="/contact" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>

              <div className="pt-6 border-t border-white/10">
                {!isLoading && (
                  <>
                    {user ? (
                      <div className="space-y-4">
                        <Link
                          href="/dashboard"
                          className="block text-lg font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="block text-lg font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          className="block text-lg font-medium text-red-500"
                          disabled={isSigningOut}
                          onClick={() => {
                            handleSignOut()
                            setIsMenuOpen(false)
                          }}
                        >
                          {isSigningOut ? "Signing out..." : "Sign Out"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Link href="/login" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-center">
                            Sign In
                          </Button>
                        </Link>
                        <Link href="/register" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                          <Button className="w-full justify-center">Sign Up</Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
